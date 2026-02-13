'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FileDown, RotateCcw, Eye, EyeOff, Zap, FileSpreadsheet, Save, FolderOpen, LogOut, Sun, Moon, AlertTriangle, ChevronRight, List } from 'lucide-react';
import { useProposal } from '@/context/ProposalContext';
import {
  CustomerInfoForm,
  EVSEForm,
  InstallationScopeForm,
  FinancialForm,
  SiteMapForm,
} from '@/components/forms';
import { TemplateSelector } from '@/components/forms/TemplateSelector';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatsCard } from '@/components/ui/Card';
import {
  formatCurrency,
  calculateGrossProjectCost,
  calculateNetProjectCost,
  hasEnabledPaymentOption,
  getEffectivePaymentOptionEnabled,
} from '@/lib/calculations';
import { COMPANY_INFO, PROJECT_TYPES, getPaymentOptions } from '@/lib/constants';
import { prepareNationalGridExport, prepareNYSEGRGEExport } from '@/lib/excelExport';
import { supabase } from '@/lib/supabase';
import { createProject, updateProject, getProject, getFolders, Folder } from '@/lib/projectStorage';
import type { Proposal } from '@/lib/types';

// Utilities that support Excel export
const EXCEL_EXPORT_UTILITIES = {
  'national-grid': 'National Grid',
  'national-grid-ma': 'National Grid',
  'nyseg': 'NYSEG',
  'rge': 'RG&E',
};

// Check if a folder has a descendant matching the target id
function hasFolderDescendant(folderId: string, targetId: string | null, allFolders: Folder[]): boolean {
  if (!targetId) return false;
  const children = allFolders.filter(f => f.parentId === folderId);
  for (const child of children) {
    if (child.id === targetId || hasFolderDescendant(child.id, targetId, allFolders)) return true;
  }
  return false;
}

// Expandable folder tree node for save/duplicate dialogs — auto-expands when selected folder is within
function SaveFolderNode({ folder, folders, selectedFolderId, onSelect, depth }: {
  folder: Folder;
  folders: Folder[];
  selectedFolderId: string | null;
  onSelect: (id: string) => void;
  depth: number;
}) {
  const children = folders.filter(f => f.parentId === folder.id);
  const hasChildren = children.length > 0;
  const isSelected = selectedFolderId === folder.id;
  const containsSelected = hasFolderDescendant(folder.id, selectedFolderId, folders);
  const shouldExpand = isSelected || containsSelected;
  const [expanded, setExpanded] = useState(shouldExpand);

  // Auto-expand when selected folder is this or a descendant
  useEffect(() => {
    if (shouldExpand) setExpanded(true);
  }, [shouldExpand]);

  return (
    <div>
      <div className="flex items-center">
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="p-0.5 text-csev-text-muted hover:text-csev-text-primary shrink-0"
            style={{ marginLeft: `${depth * 16}px` }}
          >
            <ChevronRight size={12} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </button>
        ) : (
          <span style={{ marginLeft: `${depth * 16 + 16}px` }} />
        )}
        <button
          type="button"
          onClick={() => onSelect(folder.id)}
          className={`flex-1 text-left px-2 py-1.5 rounded-lg transition-colors flex items-center gap-2 text-sm ${
            isSelected
              ? 'bg-csev-green/20 text-csev-green'
              : 'text-csev-text-secondary hover:bg-csev-slate-700'
          }`}
        >
          <FolderOpen size={14} /> {folder.name}
        </button>
      </div>
      {expanded && children.map(child => (
        <SaveFolderNode
          key={child.id}
          folder={child}
          folders={folders}
          selectedFolderId={selectedFolderId}
          onSelect={onSelect}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}

// PDF Download component — generates on click, not on every render
function PDFDownloadButton({ proposal, fileName }: { proposal: Proposal; fileName: string }) {
  const [generating, setGenerating] = useState(false);
  const isDistribution = proposal.projectType === 'distribution';

  const handleDownload = async () => {
    setGenerating(true);
    try {
      const [{ pdf }, { ProposalDocument }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('@/components/pdf/ProposalDocument'),
      ]);
      const blob = await pdf(<ProposalDocument proposal={proposal} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Error generating PDF:', e);
    }
    setGenerating(false);
  };

  if (isDistribution) {
    return (
      <Button variant="primary" size="lg" className="w-full opacity-50 cursor-not-allowed" disabled>
        <FileDown size={20} className="mr-2" />
        Download Proposal
      </Button>
    );
  }

  return (
    <Button variant="primary" size="lg" className="w-full" disabled={generating} onClick={handleDownload}>
      {generating ? (
        <span className="animate-pulse">Generating PDF...</span>
      ) : (
        <>
          <FileDown size={20} className="mr-2" />
          Download Proposal
        </>
      )}
    </Button>
  );
}

// Excel Export Button component
function ExcelExportButton({ proposal }: { proposal: Proposal }) {
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const utilityId = proposal.utilityId;
  const utilityName = utilityId ? EXCEL_EXPORT_UTILITIES[utilityId as keyof typeof EXCEL_EXPORT_UTILITIES] : null;

  // Don't render if utility doesn't support Excel export
  if (!utilityName) {
    return null;
  }

  const handleExport = async () => {
    setExporting(true);
    setMessage(null);

    try {
      // Prepare export data based on utility type
      let exportData;
      if (utilityId === 'national-grid' || utilityId === 'national-grid-ma') {
        exportData = prepareNationalGridExport(proposal);
      } else if (utilityId === 'nyseg' || utilityId === 'rge') {
        exportData = prepareNYSEGRGEExport(proposal);
        exportData.utilityLabel = utilityId === 'rge' ? 'RG&E' : 'NYSEG';
      } else {
        throw new Error('Unsupported utility');
      }

      const response = await fetch('/api/export-excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exportData }),
      });

      if (response.ok) {
        // Get the blob and trigger download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        // Get filename from header or use default
        const contentDisposition = response.headers.get('Content-Disposition');
        const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
        const filename = filenameMatch ? filenameMatch[1] : buildDocFileName(`${utilityName} Breakdown`, 'xlsx');
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setMessage({ type: 'success', text: `Downloaded ${utilityName} Excel file` });
      } else {
        const result = await response.json();
        setMessage({ type: 'error', text: result.error || 'Export failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to export Excel file' });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <Button
        variant="outline"
        size="lg"
        className="w-full"
        onClick={handleExport}
        disabled={exporting}
      >
        {exporting ? (
          <span className="animate-pulse">Exporting...</span>
        ) : (
          <>
            <FileSpreadsheet size={20} className="mr-2" />
            Export to {utilityName} Excel
          </>
        )}
      </Button>
      {message && (
        <p className={`text-xs mt-2 ${message.type === 'success' ? 'text-csev-green' : 'text-red-400'}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}

// Estimate PDF Download component — generates on click
function EstimateDownloadButton({ proposal, fileName }: { proposal: Proposal; fileName: string }) {
  const [generating, setGenerating] = useState(false);

  const handleDownload = async () => {
    setGenerating(true);
    try {
      const [{ pdf }, { EstimateDocument }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('@/components/pdf/EstimateDocument'),
      ]);
      const blob = await pdf(<EstimateDocument proposal={proposal} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Error generating PDF:', e);
    }
    setGenerating(false);
  };

  return (
    <Button variant="secondary" size="lg" className="w-full" disabled={generating} onClick={handleDownload}>
      {generating ? (
        <span className="animate-pulse">Generating...</span>
      ) : (
        <>
          <FileDown size={20} className="mr-2" />
          Download Estimate
        </>
      )}
    </Button>
  );
}

// Budget PDF Download component — generates on click
function BudgetDownloadButton({ proposal, fileName }: { proposal: Proposal; fileName: string }) {
  const [generating, setGenerating] = useState(false);

  const handleDownload = async () => {
    setGenerating(true);
    try {
      const [{ pdf }, { BudgetDocument }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('@/components/pdf/BudgetDocument'),
      ]);
      const blob = await pdf(<BudgetDocument proposal={proposal} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Error generating PDF:', e);
    }
    setGenerating(false);
  };

  return (
    <Button variant="secondary" size="lg" className="w-full" disabled={generating} onClick={handleDownload}>
      {generating ? (
        <span className="animate-pulse">Generating...</span>
      ) : (
        <>
          <FileDown size={20} className="mr-2" />
          Download Budget (Internal)
        </>
      )}
    </Button>
  );
}

// Field Recap — checks each section for completeness
function FieldRecap({ proposal }: { proposal: Proposal }) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Customer Information fields
  const customerFields = [
    { label: 'Customer Name', filled: !!proposal.customerName },
    { label: 'Address', filled: !!proposal.customerAddress },
    { label: 'City', filled: !!proposal.customerCity },
    { label: 'State', filled: !!proposal.customerState },
    { label: 'Zip', filled: !!proposal.customerZip },
    { label: 'Location Type', filled: !!proposal.locationType },
  ];
  const customerIncomplete = customerFields.filter(f => !f.filled).length;

  // Project Template fields
  const templateFields = [
    { label: 'State', filled: !!proposal.projectStateId },
    { label: 'Utility', filled: !!proposal.utilityId },
    { label: 'Scope Template', filled: !!proposal.scopeTemplateId },
  ];
  const templateIncomplete = templateFields.filter(f => !f.filled).length;

  // EVSE Equipment
  const evseCount = proposal.evseItems.length;

  // Installation Scope
  const installCount = proposal.installationItems.length;

  // Financial — top 4 pricing settings (0 = incomplete)
  const pricingFields = [
    proposal.evseMarginPercent !== 0,
    proposal.salesTaxRate !== 0,
    proposal.csmrCostBasisPercent !== 0,
    proposal.csmrMarginPercent !== 0,
  ];
  const pricingIncomplete = pricingFields.filter(f => !f).length;
  const pricingComplete = pricingIncomplete === 0;

  // Incentives — check both fields
  const hasMakeReady = proposal.makeReadyIncentive > 0;
  const hasSecondary = proposal.nyseradaIncentive > 0;
  const incentiveIncomplete = (!hasMakeReady ? 1 : 0) + (!hasSecondary ? 1 : 0);

  // Payment options — count enabled
  const configEntries = getPaymentOptions(proposal.projectType);
  const enabledFlags = getEffectivePaymentOptionEnabled(proposal);
  const enabledCount = enabledFlags.filter(Boolean).length;

  // Site map
  const hasSiteMap = !!proposal.siteMapImage;

  // Payment options color: 1=red, 2=amber, 3=green
  const paymentColor = enabledCount >= 3 ? 'text-csev-green' : enabledCount === 2 ? 'text-amber-400' : 'text-red-400';

  const rows: { label: string; sectionId: string; status: React.ReactNode }[] = [
    {
      label: 'Customer Information',
      sectionId: 'section-customer',
      status: customerIncomplete === 0
        ? <span className="text-csev-green">ALL COMPLETED</span>
        : (
          <span className="inline-flex items-center gap-1 text-red-400">
            <AlertTriangle size={10} className="shrink-0" />
            {customerIncomplete} FIELD{customerIncomplete > 1 ? 'S' : ''} INCOMPLETE
          </span>
        ),
    },
    {
      label: 'Project Template',
      sectionId: 'section-template',
      status: templateIncomplete === 0
        ? <span className="text-csev-green">ALL COMPLETED</span>
        : (
          <span className="inline-flex items-center gap-1 text-red-400">
            <AlertTriangle size={10} className="shrink-0" />
            {templateIncomplete} FIELD{templateIncomplete > 1 ? 'S' : ''} INCOMPLETE
          </span>
        ),
    },
    {
      label: 'EVSE Equipment',
      sectionId: 'section-evse',
      status: evseCount > 0
        ? <span className="text-csev-green">{evseCount} ITEM{evseCount > 1 ? 'S' : ''} ADDED</span>
        : (
          <span className="inline-flex items-center gap-1 text-red-400">
            <AlertTriangle size={10} className="shrink-0" />
            NO ITEMS ADDED
          </span>
        ),
    },
    {
      label: 'Installation Scope',
      sectionId: 'section-installation',
      status: installCount > 0
        ? <span className="text-csev-green">{installCount} LINE{installCount > 1 ? 'S' : ''} ADDED</span>
        : (
          <span className="inline-flex items-center gap-1 text-red-400">
            <AlertTriangle size={10} className="shrink-0" />
            NO LINES ADDED
          </span>
        ),
    },
    {
      label: 'Financial Summary',
      sectionId: 'section-financial',
      status: pricingComplete
        ? <span className="text-csev-green">ALL COMPLETED</span>
        : (
          <span className="inline-flex items-center gap-1 text-red-400">
            <AlertTriangle size={10} className="shrink-0" />
            {pricingIncomplete} FIELD{pricingIncomplete > 1 ? 'S' : ''} INCOMPLETE
          </span>
        ),
    },
    {
      label: 'Incentives & Rebates',
      sectionId: 'section-financial',
      status: incentiveIncomplete === 0
        ? <span className="text-csev-green">BOTH COMPLETED</span>
        : (
          <span className={`inline-flex items-center gap-1 ${incentiveIncomplete === 2 ? 'text-red-400' : 'text-amber-400'}`}>
            <AlertTriangle size={10} className="shrink-0" />
            {incentiveIncomplete} FIELD{incentiveIncomplete > 1 ? 'S' : ''} INCOMPLETE
          </span>
        ),
    },
    {
      label: 'Payment Options',
      sectionId: 'section-payment-overrides',
      status: enabledCount >= 3
        ? <span className="text-csev-green">{enabledCount} OPTIONS ENABLED</span>
        : (
          <span className={`inline-flex items-center gap-1 ${paymentColor}`}>
            <AlertTriangle size={10} className="shrink-0" />
            {enabledCount} OPTION{enabledCount !== 1 ? 'S' : ''} ENABLED
          </span>
        ),
    },
    {
      label: 'Site Map',
      sectionId: 'section-sitemap',
      status: hasSiteMap
        ? <span className="text-csev-green">UPLOADED</span>
        : (
          <span className="inline-flex items-center gap-1 text-amber-400">
            <AlertTriangle size={10} className="shrink-0" />
            NO IMAGE UPLOADED
          </span>
        ),
    },
  ];

  return (
    <div className="bg-csev-slate-800 rounded-lg p-4 border border-csev-border">
      <div className="flex items-baseline gap-2 mb-3">
        <h3 className="section-header">Field Recap</h3>
        <span className="text-[10px] text-csev-text-muted">— Click name to jump to section</span>
      </div>
      <div className="space-y-1.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center text-xs">
            <button
              onClick={() => scrollTo(row.sectionId)}
              className="text-csev-text-secondary hover:text-csev-green transition-colors text-left shrink-0 w-[140px] mr-3"
            >
              {row.label}
            </button>
            <div className="text-left font-medium">{row.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { proposal, dispatch } = useProposal();
  const [showPreview, setShowPreview] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [loadingProject, setLoadingProject] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [initialProposalRef, setInitialProposalRef] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || null);
      } else {
        // Allow access without login for local development
        setUserEmail('local@dev.local');
      }
    } catch {
      // Allow access without login for local development
      setUserEmail('local@dev.local');
    }
  }, []);

  const loadProject = useCallback(async (projectId: string) => {
    setLoadingProject(true);
    try {
      const project = await getProject(projectId);
      if (project) {
        setCurrentProjectId(project.id);
        setProjectName(project.name);
        dispatch({ type: 'LOAD_PROPOSAL', payload: project.projectData });
      }
    } catch (error) {
      console.error('Error loading project:', error);
      setSaveMessage({ type: 'error', text: 'Failed to load project' });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setLoadingProject(false);
    }
  }, [dispatch]);

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!mounted) return;
    const projectId = searchParams.get('project');
    const isNew = searchParams.get('new');
    if (isNew) {
      // Coming from "New Proposal" button — reset to blank
      dispatch({ type: 'RESET_PROPOSAL' });
      setCurrentProjectId(null);
      setProjectName('');
      setAutoSaveStatus('idle');
      setIsDirty(false);
        // Clear ref so next mount effect snapshots the fresh default
      setInitialProposalRef(null);
      window.history.replaceState({}, '', '/');
    } else if (projectId) {
      loadProject(projectId);
    }
  }, [searchParams, mounted, loadProject, dispatch]);

  // Track dirty state — snapshot proposal after load, compare on change
  useEffect(() => {
    if (!mounted) return;
    // Snapshot on initial mount (no project loaded yet)
    if (!initialProposalRef) {
      setInitialProposalRef(JSON.stringify({ ...proposal, preparedDate: '' }));
    }
  }, [mounted]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update dirty flag whenever proposal changes
  useEffect(() => {
    if (!initialProposalRef) return;
    const current = JSON.stringify({ ...proposal, preparedDate: '' });
    setIsDirty(current !== initialProposalRef);
  }, [proposal, initialProposalRef]);

  // Snapshot after project load completes
  useEffect(() => {
    if (!loadingProject && currentProjectId && mounted) {
      setInitialProposalRef(JSON.stringify({ ...proposal, preparedDate: '' }));
      setIsDirty(false);
    }
  }, [loadingProject]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save every 30 seconds — only for projects that have been saved at least once
  useEffect(() => {
    if (!currentProjectId || !mounted) return;

    const timer = setInterval(async () => {
      try {
        setAutoSaveStatus('saving');
        await updateProject(currentProjectId, proposal, projectName || undefined);
        setLastAutoSave(new Date());
        setAutoSaveStatus('saved');
      } catch (error) {
        console.error('Auto-save failed:', error);
        setAutoSaveStatus('error');
      }
    }, 30000);

    return () => clearInterval(timer);
  }, [currentProjectId, mounted, proposal, projectName]);

  // Save to localStorage on every change as crash backup (even before first save)
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('proposal-draft-backup', JSON.stringify({
        projectId: currentProjectId,
        projectName,
        proposal: { ...proposal, preparedDate: proposal.preparedDate.toISOString() },
        savedAt: new Date().toISOString(),
      }));
    } catch {}
  }, [proposal, currentProjectId, projectName, mounted]);

  const handleSave = async () => {
    const nameToSave = projectName.trim() || (proposal.customerName ? `${proposal.customerName} - ${new Date().toLocaleDateString()}` : '');

    if (!nameToSave) {
      setSaveMessage({ type: 'error', text: 'Please enter a project name' });
      return;
    }

    setSaving(true);
    setSaveMessage(null);

    try {
      if (currentProjectId) {
        await updateProject(currentProjectId, proposal, nameToSave);
        setProjectName(nameToSave);
        setSaveMessage({ type: 'success', text: 'Project saved!' });
      } else {
        const newId = await createProject(nameToSave, proposal, selectedFolderId);
        setCurrentProjectId(newId);
        setProjectName(nameToSave);
        setSaveMessage({ type: 'success', text: 'Project created!' });
        // Update URL without full navigation
        window.history.replaceState({}, '', `/?project=${newId}`);
      }
      setShowSaveDialog(false);
      setInitialProposalRef(JSON.stringify({ ...proposal, preparedDate: '' }));
      setIsDirty(false);
    } catch (error) {
      console.error('Error saving project:', error);
      setSaveMessage({ type: 'error', text: 'Failed to save project' });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const grossCost = calculateGrossProjectCost(proposal);
  const netCost = calculateNetProjectCost(proposal);

  const handleReset = () => {
    setShowResetDialog(true);
  };

  const confirmReset = () => {
    dispatch({ type: 'RESET_PROPOSAL' });
    setCurrentProjectId(null);
    setProjectName('');
    setShowResetDialog(false);
    setAutoSaveStatus('idle');
    setIsDirty(false);
    setInitialProposalRef(null);
    window.history.replaceState({}, '', '/');
  };

  const buildDocFileName = (docType: string, ext = 'pdf') => {
    const name = proposal.customerName || 'Customer';
    const city = proposal.customerCity || '';
    const state = proposal.customerState || '';
    const cityState = [city, state].filter(Boolean).join(' ');
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const yyyy = now.getFullYear();
    const date = `${mm}.${dd}.${yyyy}`;
    const parts = [name, cityState, docType, date].filter(Boolean);
    // Remove filesystem-unsafe chars but keep spaces, &, etc.
    return parts.join('-').replace(/[/\\:*?"<>|]/g, '') + `.${ext}`;
  };

  const generateFileName = () => buildDocFileName('Proposal');
  const generateEstimateFileName = () => buildDocFileName('Estimate');
  const generateBudgetFileName = () => buildDocFileName('Budget (INTERNAL ONLY)');

  return (
    <div className="min-h-screen bg-csev-slate-900">
      {/* Header */}
      <header className="bg-csev-slate-800 border-b border-csev-border shadow-lg relative overflow-hidden sticky top-0 z-40">

        <div className="max-w-7xl mx-auto px-4 py-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-csev-green/20 rounded-lg">
                <Zap size={28} className="text-csev-green" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-csev-text-primary">
                  <span className="text-csev-green">Charge</span>Smart EV
                </h1>
                <p className="text-sm text-csev-text-secondary">
                  Proposal Generator
                  {currentProjectId && projectName && (
                    <span className="ml-2 text-csev-green">- {projectName}</span>
                  )}
                  {!currentProjectId && isDirty && (
                    <span className="ml-2 text-red-400 text-xs font-medium">Unsaved draft</span>
                  )}
                  {currentProjectId && autoSaveStatus === 'saving' && (
                    <span className="ml-2 text-csev-text-muted text-xs animate-pulse">Saving...</span>
                  )}
                  {currentProjectId && autoSaveStatus === 'saved' && (
                    <span className="ml-2 text-csev-text-muted text-xs">Auto-saved</span>
                  )}
                  {currentProjectId && autoSaveStatus === 'error' && (
                    <span className="ml-2 text-red-400 text-xs">Save failed</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {userEmail && (
                <span className="text-sm text-csev-text-muted hidden sm:inline">{userEmail}</span>
              )}
              <Button
                variant="ghost"
                onClick={() => {
                  if (isDirty && !currentProjectId) {
                    // Unsaved new proposal — warn user
                    setShowLeaveDialog(true);
                  } else if (isDirty && currentProjectId) {
                    // Existing project with unsaved edits — auto-save then navigate
                    updateProject(currentProjectId, proposal, projectName || undefined)
                      .then(() => router.push('/projects'))
                      .catch(() => setShowLeaveDialog(true));
                  } else {
                    router.push('/projects');
                  }
                }}
              >
                <FolderOpen size={18} className="mr-2" />
                Projects
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  if (currentProjectId) {
                    // Quick save — no dialog needed
                    setSaving(true);
                    setSaveMessage(null);
                    try {
                      const nameToSave = projectName.trim() || (proposal.customerName ? `${proposal.customerName} - ${new Date().toLocaleDateString()}` : 'Untitled Project');
                      await updateProject(currentProjectId, proposal, nameToSave);
                      setProjectName(nameToSave);
                      setInitialProposalRef(JSON.stringify({ ...proposal, preparedDate: '' }));
                      setIsDirty(false);
                      setSaveMessage({ type: 'success', text: 'Saved!' });
                    } catch (error) {
                      console.error('Error saving project:', error);
                      setSaveMessage({ type: 'error', text: 'Failed to save' });
                    } finally {
                      setSaving(false);
                      setTimeout(() => setSaveMessage(null), 3000);
                    }
                  } else {
                    // New project — show dialog for name + folder
                    if (!projectName && proposal.customerName) {
                      setProjectName(`${proposal.customerName} - ${new Date().toLocaleDateString()}`);
                    }
                    try {
                      const folderData = await getFolders();
                      setFolders(folderData);
                    } catch {}
                    setShowSaveDialog(true);
                  }
                }}
                disabled={saving}
              >
                <Save size={18} className="mr-2" />
                {saving ? 'Saving...' : currentProjectId ? 'Save' : 'Save As...'}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? <EyeOff size={18} className="mr-2" /> : <Eye size={18} className="mr-2" />}
                {showPreview ? 'Hide' : 'Summary'}
              </Button>
              <Button
                variant="ghost"
                onClick={handleReset}
                className="text-csev-text-muted hover:text-red-400"
              >
                <RotateCcw size={18} />
              </Button>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-csev-text-muted hover:text-csev-text-primary"
              >
                <LogOut size={18} />
              </Button>
            </div>
          </div>
          {saveMessage && (
            <div className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-lg shadow-lg border animate-fade-in text-sm font-medium ${
              saveMessage.type === 'success'
                ? 'bg-csev-green/20 border-csev-green/30 text-csev-green'
                : 'bg-red-500/20 border-red-500/30 text-red-400'
            }`}>
              {saveMessage.text}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-6">
            <div id="section-customer"><CustomerInfoForm /></div>
            <div id="section-template"><TemplateSelector /></div>
            <div id="section-evse"><EVSEForm /></div>
            <div id="section-installation"><InstallationScopeForm /></div>
            <div id="section-financial"><FinancialForm /></div>
            <div id="section-sitemap"><SiteMapForm /></div>
          </div>

          {/* Sidebar - Summary & Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-[104px] space-y-6">
              {/* Quick Summary */}
              {showPreview && (
                <div className="bg-csev-panel rounded-lg shadow-card border border-csev-border p-6 card-accent animate-fade-in">
                  <h3 className="text-lg font-semibold text-csev-text-primary mb-4 pl-2">
                    Proposal Summary
                  </h3>

                  <div className="space-y-3 text-sm pl-2">
                    <div className="flex justify-between">
                      <span className="text-csev-text-secondary">Customer:</span>
                      <span className="font-medium text-csev-text-primary">
                        {proposal.customerName || 'Not specified'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-csev-text-secondary">Project Type:</span>
                      <span className="font-medium text-csev-text-primary capitalize">
                        {PROJECT_TYPES[proposal.projectType]?.label || proposal.projectType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-csev-text-secondary">EVSE Items:</span>
                      <span className="font-medium text-csev-text-primary">{proposal.evseItems.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-csev-text-secondary">Installation Items:</span>
                      <span className="font-medium text-csev-text-primary">
                        {proposal.installationItems.length}
                      </span>
                    </div>

                    <hr className="my-3 border-csev-border" />

                    <div className="flex justify-between">
                      <span className="text-csev-text-secondary">EVSE (quoted):</span>
                      <span className="font-medium text-csev-text-primary">
                        {formatCurrency(proposal.evseQuotedPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-csev-text-secondary">CSMR (quoted):</span>
                      <span className="font-medium text-csev-text-primary">
                        {formatCurrency(proposal.csmrQuotedPrice)}
                      </span>
                    </div>

                    <hr className="my-3 border-csev-border" />

                    <div className="flex justify-between text-base">
                      <span className="text-csev-text-primary font-medium">Gross Cost:</span>
                      <span className="font-bold text-csev-text-primary">{formatCurrency(grossCost)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-csev-green">
                      <span>Total Incentives:</span>
                      <span>
                        - {formatCurrency(proposal.makeReadyIncentive + proposal.nyseradaIncentive)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg bg-csev-green/10 -mx-6 px-6 py-3 mt-3 border-y border-csev-green/30">
                      <span className="font-bold text-csev-green">Net Cost:</span>
                      <span className="font-bold text-csev-green">
                        {formatCurrency(netCost)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <StatsCard
                  label="Gross Cost"
                  value={formatCurrency(grossCost).replace('$', '')}
                  prefix="$"
                />
                <StatsCard
                  label="Net Cost"
                  value={formatCurrency(netCost).replace('$', '')}
                  prefix="$"
                />
              </div>

              {/* Download Buttons */}
              <div className="bg-csev-panel rounded-lg shadow-card border border-csev-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="section-header">
                    Generate Documents
                  </h3>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        dispatch({
                          type: 'SET_TERMS',
                          payload: { pdfTheme: 'dark' },
                        })
                      }
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-l-lg text-xs font-medium transition-colors ${
                        proposal.pdfTheme !== 'light'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-csev-slate-700 text-csev-text-muted border border-csev-border hover:bg-csev-slate-600'
                      }`}
                      title="Dark mode PDF"
                    >
                      <Moon size={12} /> Dark
                    </button>
                    <button
                      onClick={() =>
                        dispatch({
                          type: 'SET_TERMS',
                          payload: { pdfTheme: 'light' },
                        })
                      }
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-r-lg text-xs font-medium transition-colors ${
                        proposal.pdfTheme === 'light'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-csev-slate-700 text-csev-text-muted border border-csev-border hover:bg-csev-slate-600'
                      }`}
                      title="Light mode PDF"
                    >
                      <Sun size={12} /> Light
                    </button>
                  </div>
                </div>
                <p className="text-sm text-csev-text-secondary mb-4">
                  Download professional PDF documents ready to share with your
                  customer or installer.
                </p>

                <div className="space-y-3">
                  {mounted && !hasEnabledPaymentOption(proposal) && (
                    <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                      At least one payment option must be enabled to generate the proposal PDF.
                    </div>
                  )}
                  {mounted && (
                    <>
                      {hasEnabledPaymentOption(proposal) ? (
                        <PDFDownloadButton proposal={proposal} fileName={generateFileName()} />
                      ) : (
                        <Button variant="primary" size="lg" className="w-full" disabled>
                          <FileDown size={20} className="mr-2" />
                          No Payment Options Enabled
                        </Button>
                      )}
                      <EstimateDownloadButton proposal={proposal} fileName={generateEstimateFileName()} />
                      <BudgetDownloadButton proposal={proposal} fileName={generateBudgetFileName()} />
                      <ExcelExportButton proposal={proposal} />
                    </>
                  )}
                  {!mounted && (
                    <>
                      <Button variant="primary" size="lg" className="w-full" disabled>
                        <span className="animate-pulse">Loading...</span>
                      </Button>
                      <Button variant="secondary" size="lg" className="w-full" disabled>
                        <span className="animate-pulse">Loading...</span>
                      </Button>
                    </>
                  )}
                </div>

                <p className="text-xs text-csev-text-muted mt-3">
                  <strong className="text-csev-text-secondary">Proposal:</strong> Customer-facing with pricing options<br/>
                  <strong className="text-csev-text-secondary">Estimate:</strong> Installer estimate with itemized costs<br/>
                  <strong className="text-csev-text-secondary">Budget:</strong> Internal cost summary (not for distribution)<br/>
                  <strong className="text-csev-text-secondary">Excel:</strong> Utility breakdown template (when utility selected)
                </p>

                {!proposal.customerName && (
                  <p className="text-xs text-amber-500 mt-3">
                    Tip: Add a customer name for more professional documents
                  </p>
                )}
              </div>

              {/* Help Info */}
              <div className="bg-csev-slate-800 rounded-lg p-4 border border-csev-border">
                <h3 className="section-header mb-2">Quick Tips</h3>
                <ul className="text-sm text-csev-text-secondary space-y-1">
                  <li>• Click edit icon to override pricebook prices</li>
                  <li>• Upload a site map for a complete proposal</li>
                  <li>• Review payment options on page 5 of PDF</li>
                </ul>
              </div>

              {/* Field Recap */}
              <FieldRecap proposal={proposal} />
            </div>
          </div>
        </div>
      </main>

      {/* Save Dialog Modal */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-csev-panel rounded-lg shadow-xl border border-csev-border p-6 w-full max-w-md mx-4 animate-fade-in">
            <h3 className="text-lg font-semibold text-csev-text-primary mb-4">
              {currentProjectId ? 'Update Project' : 'Save Project'}
            </h3>
            <div className="mb-4">
              <Input
                label="Project Name"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder={proposal.customerName ? `${proposal.customerName} - ${new Date().toLocaleDateString()}` : 'Enter project name'}
                autoFocus
              />
            </div>
            {!currentProjectId && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-csev-text-secondary mb-1">
                  Save to Folder
                </label>
                <div className="max-h-[200px] overflow-y-auto border border-csev-border rounded-lg p-2 space-y-0.5">
                  <button
                    type="button"
                    onClick={() => setSelectedFolderId(null)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 text-sm ${
                      selectedFolderId === null
                        ? 'bg-csev-green/20 text-csev-green'
                        : 'text-csev-text-secondary hover:bg-csev-slate-700'
                    }`}
                  >
                    <List size={14} /> All Projects
                  </button>
                  {folders.filter(f => !f.parentId).map(folder => (
                    <SaveFolderNode
                      key={folder.id}
                      folder={folder}
                      folders={folders}
                      selectedFolderId={selectedFolderId}
                      onSelect={setSelectedFolderId}
                      depth={0}
                    />
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <Button
                variant="ghost"
                onClick={() => setShowSaveDialog(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={saving || !projectName.trim()}
              >
                {saving ? 'Saving...' : currentProjectId ? 'Update' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      {showResetDialog && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-csev-panel rounded-lg shadow-xl border border-csev-border p-6 w-full max-w-md mx-4 animate-fade-in">
            <h3 className="text-lg font-semibold text-csev-text-primary mb-2">Reset Proposal</h3>
            <p className="text-sm text-csev-text-secondary mb-6">
              Are you sure you want to reset? All unsaved changes will be lost and the form will be cleared.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setShowResetDialog(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={confirmReset} className="bg-red-500 hover:bg-red-600">
                Reset
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Without Saving Dialog */}
      {showLeaveDialog && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-csev-panel rounded-lg shadow-xl border border-csev-border w-full max-w-sm mx-4 animate-fade-in">
            <div className="p-5">
              <div className="flex items-start gap-3 mb-1">
                <div className="p-1.5 bg-amber-500/10 rounded-lg shrink-0 mt-0.5">
                  <AlertTriangle size={18} className="text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-csev-text-primary">Unsaved Changes</h3>
                  <p className="text-sm text-csev-text-secondary mt-1">
                    You have unsaved changes that will be lost if you leave.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 pb-5">
              <button
                onClick={() => setShowLeaveDialog(false)}
                className="px-3 py-1.5 text-sm text-csev-text-secondary hover:text-csev-text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowLeaveDialog(false); router.push('/projects'); }}
                className="px-3 py-1.5 text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                Discard
              </button>
              <Button variant="primary" size="sm" onClick={async () => {
                setShowLeaveDialog(false);
                if (currentProjectId) {
                  await updateProject(currentProjectId, proposal, projectName || undefined);
                  router.push('/projects');
                } else {
                  if (!projectName && proposal.customerName) {
                    setProjectName(`${proposal.customerName} - ${new Date().toLocaleDateString()}`);
                  }
                  try {
                    const folderData = await getFolders();
                    setFolders(folderData);
                  } catch {}
                  setShowSaveDialog(true);
                }
              }}>
                <Save size={14} className="mr-1.5" />
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loadingProject && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-csev-panel rounded-lg shadow-xl border border-csev-border p-8 animate-fade-in text-center">
            <div className="text-csev-green animate-pulse text-lg mb-2">Loading Project...</div>
            <p className="text-sm text-csev-text-muted">Fetching proposal data</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-csev-slate-800 border-t border-csev-border text-csev-text-muted py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p className="text-csev-text-secondary">
            <span className="text-csev-green">Charge</span>Smart EV - {COMPANY_INFO.tagline}
          </p>
          <p className="mt-1">
            {COMPANY_INFO.website} | {COMPANY_INFO.phone}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-csev-slate-900 flex items-center justify-center">
        <div className="text-csev-green animate-pulse">Loading...</div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  );
}
