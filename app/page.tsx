'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FileDown, RotateCcw, Eye, EyeOff, Zap, FileSpreadsheet, Save, FolderOpen, LogOut, Sun, Moon, AlertTriangle } from 'lucide-react';
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
import { createProject, updateProject, getProject } from '@/lib/projectStorage';
import type { Proposal } from '@/lib/types';

// Utilities that support Excel export
const EXCEL_EXPORT_UTILITIES = {
  'national-grid': 'National Grid',
  'national-grid-ma': 'National Grid',
  'nyseg': 'NYSEG',
  'rge': 'RG&E',
};

// PDF Download component that loads react-pdf only on client
function PDFDownloadButton({ proposal, fileName }: { proposal: Proposal; fileName: string }) {
  const [PDFComponents, setPDFComponents] = useState<{
    PDFDownloadLink: any;
    ProposalDocument: any;
  } | null>(null);

  useEffect(() => {
    Promise.all([
      import('@react-pdf/renderer'),
      import('@/components/pdf/ProposalDocument'),
    ]).then(([pdfRenderer, proposalDoc]) => {
      setPDFComponents({
        PDFDownloadLink: pdfRenderer.PDFDownloadLink,
        ProposalDocument: proposalDoc.ProposalDocument,
      });
    });
  }, []);

  if (!PDFComponents) {
    return (
      <Button variant="primary" size="lg" className="w-full" disabled>
        <span className="animate-pulse">Loading PDF generator...</span>
      </Button>
    );
  }

  const { PDFDownloadLink, ProposalDocument } = PDFComponents;

  return (
    <PDFDownloadLink
      document={<ProposalDocument proposal={proposal} />}
      fileName={fileName}
      className="block"
    >
      {({ loading, error }: { loading: boolean; error: any }) => (
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <span className="animate-pulse">Generating PDF...</span>
          ) : error ? (
            'Error generating PDF'
          ) : (
            <>
              <FileDown size={20} className="mr-2" />
              Download Proposal
            </>
          )}
        </Button>
      )}
    </PDFDownloadLink>
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
        const filename = filenameMatch ? filenameMatch[1] : `${utilityName} Breakdown.xlsx`;
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

// Estimate PDF Download component
function EstimateDownloadButton({ proposal, fileName }: { proposal: Proposal; fileName: string }) {
  const [PDFComponents, setPDFComponents] = useState<{
    PDFDownloadLink: any;
    EstimateDocument: any;
  } | null>(null);

  useEffect(() => {
    Promise.all([
      import('@react-pdf/renderer'),
      import('@/components/pdf/EstimateDocument'),
    ]).then(([pdfRenderer, estimateDoc]) => {
      setPDFComponents({
        PDFDownloadLink: pdfRenderer.PDFDownloadLink,
        EstimateDocument: estimateDoc.EstimateDocument,
      });
    });
  }, []);

  if (!PDFComponents) {
    return (
      <Button variant="secondary" size="lg" className="w-full" disabled>
        <span className="animate-pulse">Loading...</span>
      </Button>
    );
  }

  const { PDFDownloadLink, EstimateDocument } = PDFComponents;

  return (
    <PDFDownloadLink
      document={<EstimateDocument proposal={proposal} />}
      fileName={fileName}
      className="block"
    >
      {({ loading, error }: { loading: boolean; error: any }) => (
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <span className="animate-pulse">Generating...</span>
          ) : error ? (
            'Error generating PDF'
          ) : (
            <>
              <FileDown size={20} className="mr-2" />
              Download Estimate
            </>
          )}
        </Button>
      )}
    </PDFDownloadLink>
  );
}

// Budget PDF Download component
function BudgetDownloadButton({ proposal, fileName }: { proposal: Proposal; fileName: string }) {
  const [PDFComponents, setPDFComponents] = useState<{
    PDFDownloadLink: any;
    BudgetDocument: any;
  } | null>(null);

  useEffect(() => {
    Promise.all([
      import('@react-pdf/renderer'),
      import('@/components/pdf/BudgetDocument'),
    ]).then(([pdfRenderer, budgetDoc]) => {
      setPDFComponents({
        PDFDownloadLink: pdfRenderer.PDFDownloadLink,
        BudgetDocument: budgetDoc.BudgetDocument,
      });
    });
  }, []);

  if (!PDFComponents) {
    return (
      <Button variant="secondary" size="lg" className="w-full" disabled>
        <span className="animate-pulse">Loading...</span>
      </Button>
    );
  }

  const { PDFDownloadLink, BudgetDocument } = PDFComponents;

  return (
    <PDFDownloadLink
      document={<BudgetDocument proposal={proposal} />}
      fileName={fileName}
      className="block"
    >
      {({ loading, error }: { loading: boolean; error: any }) => (
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <span className="animate-pulse">Generating...</span>
          ) : error ? (
            'Error generating PDF'
          ) : (
            <>
              <FileDown size={20} className="mr-2" />
              Download Budget (Internal)
            </>
          )}
        </Button>
      )}
    </PDFDownloadLink>
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

  // Financial — top 4 pricing settings
  const pricingComplete =
    proposal.evseMarginPercent > 0 &&
    proposal.csmrCostBasisPercent > 0 &&
    proposal.csmrMarginPercent > 0 &&
    proposal.salesTaxRate >= 0;

  // Incentives — check both fields
  const hasMakeReady = proposal.makeReadyIncentive > 0;
  const hasSecondary = proposal.nyseradaIncentive > 0;
  const incentiveIncomplete = (!hasMakeReady ? 1 : 0) + (!hasSecondary ? 1 : 0);

  // Payment options — count enabled
  const configEntries = getPaymentOptions(proposal.projectType);
  const enabledFlags = getEffectivePaymentOptionEnabled(proposal);
  const enabledCount = configEntries.filter((_, i) => enabledFlags[i] ?? true).length;

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
        : <span className="text-red-400">{customerIncomplete} FIELD{customerIncomplete > 1 ? 'S' : ''} INCOMPLETE</span>,
    },
    {
      label: 'Project Template',
      sectionId: 'section-template',
      status: templateIncomplete === 0
        ? <span className="text-csev-green">ALL COMPLETED</span>
        : <span className="text-red-400">{templateIncomplete} FIELD{templateIncomplete > 1 ? 'S' : ''} INCOMPLETE</span>,
    },
    {
      label: 'EVSE Equipment',
      sectionId: 'section-evse',
      status: evseCount > 0
        ? <span className="text-csev-green">{evseCount} ITEM{evseCount > 1 ? 'S' : ''} ADDED</span>
        : <span className="text-red-400">NO ITEMS ADDED</span>,
    },
    {
      label: 'Installation Scope',
      sectionId: 'section-installation',
      status: installCount > 0
        ? <span className="text-csev-green">{installCount} LINE{installCount > 1 ? 'S' : ''} ADDED</span>
        : <span className="text-red-400">NO LINES ADDED</span>,
    },
    {
      label: 'Financial Summary',
      sectionId: 'section-financial',
      status: pricingComplete
        ? <span className="text-csev-green">ALL COMPLETED</span>
        : <span className="text-red-400">PRICING INCOMPLETE</span>,
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
      sectionId: 'section-financial',
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
    try {
      const project = await getProject(projectId);
      if (project) {
        setCurrentProjectId(project.id);
        setProjectName(project.name);
        dispatch({ type: 'LOAD_PROPOSAL', payload: project.projectData });
      }
    } catch (error) {
      console.error('Error loading project:', error);
    }
  }, [dispatch]);

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Load project if ID is in URL
    const projectId = searchParams.get('project');
    if (projectId && mounted) {
      loadProject(projectId);
    }
  }, [searchParams, mounted, loadProject]);

  const handleSave = async () => {
    const nameToSave = projectName.trim() || (proposal.customerName ? `${proposal.customerName} Proposal` : '');

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
        const newId = await createProject(nameToSave, proposal);
        setCurrentProjectId(newId);
        setProjectName(nameToSave);
        setSaveMessage({ type: 'success', text: 'Project created!' });
        // Update URL without full navigation
        window.history.replaceState({}, '', `/?project=${newId}`);
      }
      setShowSaveDialog(false);
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
    router.push('/login');
  };

  const grossCost = calculateGrossProjectCost(proposal);
  const netCost = calculateNetProjectCost(proposal);

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the proposal? All data will be lost.')) {
      dispatch({ type: 'RESET_PROPOSAL' });
      setCurrentProjectId(null);
      setProjectName('');
      // Remove project ID from URL
      window.history.replaceState({}, '', '/');
    }
  };

  const generateFileName = () => {
    const customerName = proposal.customerName
      ? proposal.customerName.replace(/[^a-zA-Z0-9]/g, '_')
      : 'Customer';
    const date = proposal.preparedDate.toISOString().split('T')[0];
    return `CSEV_Proposal_${customerName}_${date}.pdf`;
  };

  const generateEstimateFileName = () => {
    const customerName = proposal.customerName
      ? proposal.customerName.replace(/[^a-zA-Z0-9]/g, '_')
      : 'Customer';
    const date = proposal.preparedDate.toISOString().split('T')[0];
    return `CSEV_Estimate_${customerName}_${date}.pdf`;
  };

  const generateBudgetFileName = () => {
    const customerName = proposal.customerName
      ? proposal.customerName.replace(/[^a-zA-Z0-9]/g, '_')
      : 'Customer';
    const date = proposal.preparedDate.toISOString().split('T')[0];
    return `CSEV_Budget_${customerName}_${date}.pdf`;
  };

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
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {userEmail && (
                <span className="text-sm text-csev-text-muted hidden sm:inline">{userEmail}</span>
              )}
              <Button
                variant="ghost"
                onClick={() => router.push('/projects')}
              >
                <FolderOpen size={18} className="mr-2" />
                Projects
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  // Auto-populate project name if not set
                  if (!projectName && proposal.customerName) {
                    setProjectName(`${proposal.customerName} Proposal`);
                  }
                  setShowSaveDialog(true);
                }}
                disabled={saving}
              >
                <Save size={18} className="mr-2" />
                {saving ? 'Saving...' : 'Save'}
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
            <div className={`mt-2 text-sm ${saveMessage.type === 'success' ? 'text-csev-green' : 'text-red-400'}`}>
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
                placeholder={proposal.customerName ? `${proposal.customerName} Proposal` : 'Enter project name'}
                autoFocus
              />
            </div>
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
