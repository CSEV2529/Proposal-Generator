'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback, useMemo, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import {
  getProjects, getProject, deleteProject, duplicateProject,
  getFolders, createFolder, renameFolder, deleteFolder,
  moveProjectToFolder, updateProjectStatus, renameProject,
  ProjectSummary, ProjectWithData, Folder,
} from '@/lib/projectStorage';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Plus, Search, Trash2, Edit, LogOut, Copy,
  FolderPlus, FolderOpen, ChevronRight, ArrowLeft,
  ChevronUp, ChevronDown, ChevronLeft, Clock,
  AlertTriangle, CheckSquare, Square, X, MoveRight,
  List, FileDown, FileSpreadsheet, Sun, Moon, Download,
  RotateCcw, Filter,
} from 'lucide-react';

// Helper to trigger a file download from a blob (returns a promise that resolves after a delay to prevent browser blocking)
function triggerDownload(blob: Blob, filename: string): Promise<void> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Small delay before revoking URL and allowing next download — browsers block rapid sequential downloads
    setTimeout(() => {
      URL.revokeObjectURL(url);
      resolve();
    }, 500);
  });
}

// Build document filename: "Customer Name-City ST-DocType-MM.DD.YYYY.ext"
function buildDownloadName(proposal: { customerName?: string; customerCity?: string; customerState?: string }, docType: string, ext = 'pdf') {
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
  return parts.join('-').replace(/[/\\:*?"<>|]/g, '') + `.${ext}`;
}

type SortField = 'name' | 'customerName' | 'status' | 'createdAt' | 'updatedAt';
type SortDir = 'asc' | 'desc';
type ProjectStatus = 'draft' | 'sent' | 'completed';

const ITEMS_PER_PAGE = 10;

const PROJECT_TYPE_LABELS: Record<string, string> = {
  'level2-epc': 'Level 2 EPC',
  'level3-epc': 'Level 3 EPC',
  'mixed-epc': 'Mixed EPC',
  'site-host': 'Site Host',
  'level2-site-host': 'L2 Site Host',
  'distribution': 'Distribution',
};

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-csev-slate-700 text-csev-text-secondary',
  sent: 'bg-blue-500/20 text-blue-400',
  completed: 'bg-purple-500/20 text-purple-400',
};

const STATUS_RING_COLORS: Record<string, string> = {
  draft: 'ring-csev-text-secondary/40',
  sent: 'ring-blue-400/40',
  completed: 'ring-purple-400/40',
};

// Confirmation dialog component
function ConfirmDialog({ title, message, confirmLabel, confirmVariant = 'danger', onConfirm, onCancel }: {
  title: string;
  message: string;
  confirmLabel: string;
  confirmVariant?: 'danger' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]">
      <div className="bg-csev-panel rounded-lg shadow-xl border border-csev-border p-6 w-full max-w-md mx-4 animate-fade-in">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-red-500/10 rounded-lg shrink-0 mt-0.5">
            <AlertTriangle size={20} className="text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-csev-text-primary">{title}</h3>
            <p className="text-sm text-csev-text-secondary mt-1">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button variant={confirmVariant === 'danger' ? 'danger' : 'primary'} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Expandable folder tree node for dialog pickers — auto-expands when selected folder is within
function DialogFolderNode({ folder, folders, selectedFolderId, onSelect, depth }: {
  folder: Folder;
  folders: Folder[];
  selectedFolderId: string | null;
  onSelect: (id: string) => void;
  depth: number;
}) {
  const children = folders.filter(f => f.parentId === folder.id);
  const hasChildren = children.length > 0;
  const isSelected = selectedFolderId === folder.id;
  const containsSelected = hasDescendant(folder.id, selectedFolderId, folders);
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
            onClick={() => setExpanded(!expanded)}
            className="p-0.5 text-csev-text-secondary hover:text-csev-green shrink-0"
            style={{ marginLeft: `${depth * 16}px` }}
          >
            <ChevronRight size={12} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </button>
        ) : (
          <span style={{ marginLeft: `${depth * 16 + 16}px` }} />
        )}
        <button
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
        <DialogFolderNode
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

// Duplicate dialog with name + folder picker
function DuplicateDialog({ project, folders, onDuplicate, onClose }: {
  project: ProjectSummary;
  folders: Folder[];
  onDuplicate: (name: string, folderId: string | null) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(`${project.name} (Copy)`);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(project.folderId);
  const rootFolders = folders.filter(f => !f.parentId);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]">
      <div className="bg-csev-panel rounded-lg shadow-xl border border-csev-border w-full max-w-lg mx-4 animate-fade-in">
        <div className="flex items-center justify-between p-4 border-b border-csev-border">
          <h3 className="text-lg font-semibold text-csev-text-primary">Duplicate Project</h3>
          <button onClick={onClose} className="p-1 text-csev-text-muted hover:text-csev-text-primary">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <Input
            label="Project Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && name.trim() && onDuplicate(name.trim(), selectedFolderId)}
          />
          <div>
            <p className="text-xs font-medium text-csev-text-secondary mb-2">Save to folder:</p>
            <div className="max-h-[200px] overflow-y-auto space-y-0.5 border border-csev-border rounded-lg p-2">
              <button
                onClick={() => setSelectedFolderId(null)}
                className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 text-sm ${
                  selectedFolderId === null
                    ? 'bg-csev-green/20 text-csev-green'
                    : 'text-csev-text-secondary hover:bg-csev-slate-700'
                }`}
              >
                <List size={14} /> All Projects
              </button>
              {rootFolders.map(folder => (
                <DialogFolderNode
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
        </div>
        <div className="flex gap-3 justify-end p-4 border-t border-csev-border">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={() => name.trim() && onDuplicate(name.trim(), selectedFolderId)} disabled={!name.trim()}>
            <Copy size={16} className="mr-2" />
            Duplicate
          </Button>
        </div>
      </div>
    </div>
  );
}

// Move-to-folder modal
function MoveToFolderModal({ folders, currentFolderIds, projectCount, onMove, onClose }: {
  folders: Folder[];
  currentFolderIds: (string | null)[];
  projectCount: number;
  onMove: (folderId: string | null) => void;
  onClose: () => void;
}) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null | undefined>(undefined);
  const rootFolders = folders.filter(f => !f.parentId);
  const isRootCurrent = currentFolderIds.length === 1 && currentFolderIds[0] === null;
  const isRootSelected = selectedFolderId === null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]">
      <div className="bg-csev-panel rounded-lg shadow-xl border border-csev-border w-full max-w-lg mx-4 animate-fade-in">
        <div className="flex items-center justify-between p-4 border-b border-csev-border">
          <h3 className="text-lg font-semibold text-csev-text-primary">
            Move {projectCount} {projectCount === 1 ? 'Project' : 'Projects'}
          </h3>
          <button onClick={onClose} className="p-1 text-csev-text-muted hover:text-csev-text-primary">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          <p className="text-xs text-csev-text-muted mb-3">Select destination folder:</p>
          <div className="max-h-[300px] overflow-y-auto space-y-1 mb-4 pr-1">
            <button
              onClick={() => setSelectedFolderId(null)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                isRootSelected
                  ? 'bg-csev-green/20 text-csev-green border border-csev-green/30'
                  : isRootCurrent
                  ? 'bg-csev-slate-700 text-csev-text-muted'
                  : 'text-csev-text-secondary hover:bg-csev-slate-700 hover:text-csev-text-primary'
              }`}
            >
              <List size={16} className={isRootSelected ? 'text-csev-green' : ''} />
              <span className="text-sm font-medium">All Projects</span>
              {isRootCurrent && <span className="text-[10px] text-csev-text-muted ml-auto">(current)</span>}
            </button>
            {rootFolders.map(folder => (
              <DialogFolderNode
                key={folder.id}
                folder={folder}
                folders={folders}
                selectedFolderId={selectedFolderId === undefined ? null : selectedFolderId}
                onSelect={(id) => setSelectedFolderId(id)}
                depth={0}
              />
            ))}
          </div>
          {folders.length === 0 && (
            <p className="text-xs text-csev-text-muted text-center py-4">No folders yet. Create one from the Projects page.</p>
          )}
        </div>
        <div className="flex gap-3 justify-end p-4 border-t border-csev-border">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            onClick={() => selectedFolderId !== undefined && onMove(selectedFolderId)}
            disabled={selectedFolderId === undefined}
          >
            <MoveRight size={16} className="mr-2" />
            Move Here
          </Button>
        </div>
      </div>
    </div>
  );
}

// "Complete" status dialog with export options
function CompleteDialog({ project, onConfirm, onClose }: {
  project: ProjectSummary;
  onConfirm: (downloads: { type: string; theme: 'dark' | 'light' }[]) => void;
  onClose: () => void;
}) {
  const [globalTheme, setGlobalTheme] = useState<'dark' | 'light'>('dark');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isDistribution = project.projectType === 'distribution';

  const outputs = useMemo(() => {
    const list: { id: string; label: string; icon: typeof FileDown; available: boolean; hasTheme: boolean }[] = [];
    list.push({ id: 'proposal', label: 'Proposal PDF', icon: FileDown, available: !isDistribution, hasTheme: true });
    list.push({ id: 'estimate', label: 'Estimate PDF', icon: FileDown, available: true, hasTheme: true });
    list.push({ id: 'budget', label: 'Budget PDF', icon: FileDown, available: true, hasTheme: true });
    list.push({ id: 'excel', label: 'Utility Breakdown (Excel)', icon: FileSpreadsheet, available: true, hasTheme: false });
    return list;
  }, [isDistribution]);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [themeOverrides, setThemeOverrides] = useState<Record<string, 'dark' | 'light'>>({});

  const toggleOutput = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const getTheme = (id: string) => themeOverrides[id] || globalTheme;
  const hasOverride = (id: string) => id in themeOverrides && themeOverrides[id] !== globalTheme;

  const handleDownloadAndComplete = async () => {
    setGenerating(true);
    setError(null);
    let downloadCount = 0;
    try {
      // Load full project data for PDF generation
      const fullProject = await getProject(project.id);
      if (!fullProject) throw new Error('Project not found');
      const proposal = fullProject.projectData;

      // Import @react-pdf/renderer once upfront
      const { pdf } = await import('@react-pdf/renderer');

      for (const id of Array.from(selected)) {
        const theme = getTheme(id);

        try {
          if (id === 'proposal') {
            const { ProposalDocument } = await import('@/components/pdf/ProposalDocument');
            const doc = <ProposalDocument proposal={{ ...proposal, pdfTheme: theme }} />;
            const blob = await pdf(doc).toBlob();
            await triggerDownload(blob, buildDownloadName(proposal, 'Proposal'));
            downloadCount++;
          } else if (id === 'estimate') {
            const { EstimateDocument } = await import('@/components/pdf/EstimateDocument');
            const doc = <EstimateDocument proposal={{ ...proposal, pdfTheme: theme }} />;
            const blob = await pdf(doc).toBlob();
            await triggerDownload(blob, buildDownloadName(proposal, 'Estimate'));
            downloadCount++;
          } else if (id === 'budget') {
            const { BudgetDocument } = await import('@/components/pdf/BudgetDocument');
            const doc = <BudgetDocument proposal={{ ...proposal, pdfTheme: theme }} />;
            const blob = await pdf(doc).toBlob();
            await triggerDownload(blob, buildDownloadName(proposal, 'Budget (INTERNAL ONLY)'));
            downloadCount++;
          } else if (id === 'excel') {
            const { prepareNationalGridExport, prepareNYSEGRGEExport } = await import('@/lib/excelExport');
            const utilityId = proposal.utilityId;
            let exportData;
            if (utilityId === 'national-grid' || utilityId === 'national-grid-ma') {
              exportData = prepareNationalGridExport(proposal);
            } else if (utilityId === 'nyseg') {
              exportData = prepareNYSEGRGEExport(proposal);
              exportData.utilityLabel = 'NYSEG';
            } else if (utilityId === 'rge') {
              exportData = prepareNYSEGRGEExport(proposal);
              exportData.utilityLabel = 'RG&E';
            }
            if (exportData) {
              const response = await fetch('/api/export-excel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ exportData }),
              });
              if (response.ok) {
                const blob = await response.blob();
                // Read filename from API response header, fallback to convention
                const contentDisposition = response.headers.get('Content-Disposition');
                const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
                const filename = filenameMatch ? filenameMatch[1] : buildDownloadName(proposal, `${exportData.utilityLabel || 'Utility'} Breakdown`, 'xlsx');
                await triggerDownload(blob, filename);
                downloadCount++;
              }
            }
          }
        } catch (itemErr) {
          console.error(`Error generating ${id}:`, itemErr);
        }
      }

      // All downloads attempted — confirm completion
      const downloads = Array.from(selected).map(id => ({ type: id, theme: getTheme(id) }));
      onConfirm(downloads);
    } catch (e) {
      console.error('Error generating downloads:', e);
      setError(e instanceof Error ? e.message : 'Failed to generate downloads. Check browser console for details.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]">
      <div className="bg-csev-panel rounded-lg shadow-xl border border-csev-border w-full max-w-lg mx-4 animate-fade-in">
        <div className="flex items-center justify-between p-4 border-b border-csev-border">
          <h3 className="text-lg font-semibold text-csev-text-primary">Mark as Completed</h3>
          <button onClick={onClose} className="p-1 text-csev-text-muted hover:text-csev-text-primary">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          <p className="text-sm text-csev-text-secondary mb-4">
            Download final documents for <span className="text-csev-text-primary font-medium">{project.name}</span>?
          </p>

          {/* Global theme toggle — right-aligned to match row toggles */}
          <div className="flex items-center justify-end gap-2 mb-2 pr-3">
            <span className="text-[10px] text-csev-text-muted uppercase tracking-wide">All outputs</span>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => { setGlobalTheme('dark'); setThemeOverrides({}); }}
                className={`p-1 rounded transition-colors ${
                  globalTheme === 'dark' && Object.keys(themeOverrides).length === 0
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'text-csev-text-muted hover:text-blue-400'
                }`}
                title="Set all to Dark"
              >
                <Moon size={13} />
              </button>
              <button
                onClick={() => { setGlobalTheme('light'); setThemeOverrides({}); }}
                className={`p-1 rounded transition-colors ${
                  globalTheme === 'light' && Object.keys(themeOverrides).length === 0
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'text-csev-text-muted hover:text-amber-400'
                }`}
                title="Set all to Light"
              >
                <Sun size={13} />
              </button>
            </div>
          </div>

          {/* Output checkboxes */}
          <div className="space-y-1.5 mb-4">
            {outputs.map(output => {
              const Icon = output.icon;
              const isSelected = selected.has(output.id);
              const theme = getTheme(output.id);
              const isOverridden = hasOverride(output.id);
              return (
                <div
                  key={output.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors ${
                    !output.available
                      ? 'border-csev-border/30 opacity-40 cursor-not-allowed'
                      : isSelected
                      ? 'border-csev-green/30 bg-csev-green/5'
                      : 'border-csev-border hover:border-csev-border/80 cursor-pointer'
                  }`}
                  onClick={() => output.available && toggleOutput(output.id)}
                >
                  <div className="text-csev-text-secondary">
                    {isSelected ? (
                      <CheckSquare size={16} className="text-csev-green" />
                    ) : (
                      <Square size={16} />
                    )}
                  </div>
                  <Icon size={16} className={isSelected ? 'text-csev-green' : 'text-csev-text-muted'} />
                  <span className={`text-sm flex-1 ${isSelected ? 'text-csev-text-primary' : 'text-csev-text-secondary'}`}>
                    {output.label}
                  </span>
                  {output.hasTheme && (
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); if (isSelected) setThemeOverrides(prev => ({ ...prev, [output.id]: 'dark' })); }}
                        className={`p-1 rounded transition-colors ${
                          !isSelected
                            ? 'text-csev-text-muted/20 cursor-default'
                            : theme === 'dark'
                            ? `bg-blue-500/20 text-blue-400${isOverridden ? ' ring-1 ring-blue-400/40' : ''}`
                            : 'text-csev-text-muted hover:text-blue-400'
                        }`}
                        title="Dark theme"
                        disabled={!isSelected}
                      >
                        <Moon size={12} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); if (isSelected) setThemeOverrides(prev => ({ ...prev, [output.id]: 'light' })); }}
                        className={`p-1 rounded transition-colors ${
                          !isSelected
                            ? 'text-csev-text-muted/20 cursor-default'
                            : theme === 'light'
                            ? `bg-amber-500/20 text-amber-400${isOverridden ? ' ring-1 ring-amber-400/40' : ''}`
                            : 'text-csev-text-muted hover:text-amber-400'
                        }`}
                        title="Light theme"
                        disabled={!isSelected}
                      >
                        <Sun size={12} />
                      </button>
                    </div>
                  )}
                  {!output.available && (
                    <span className="text-[10px] text-csev-text-muted">N/A</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {error && (
          <div className="mx-4 mb-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400">
            {error}
          </div>
        )}
        <div className="flex gap-3 justify-end p-4 border-t border-csev-border">
          <button
            onClick={() => onConfirm([])}
            className="px-4 py-2 text-sm text-csev-text-secondary hover:text-csev-text-primary transition-colors"
          >
            Skip Downloads
          </button>
          <Button
            variant="primary"
            onClick={handleDownloadAndComplete}
            disabled={selected.size === 0 || generating}
          >
            {generating ? (
              <span className="animate-pulse">Generating...</span>
            ) : (
              <>
                <Download size={16} className="mr-2" />
                Download & Complete
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Sidebar folder node with expand/collapse for subfolders
// Check if a folder has a descendant matching the target id
function hasDescendant(folderId: string, targetId: string | null, allFolders: Folder[]): boolean {
  if (!targetId) return false;
  const children = allFolders.filter(f => f.parentId === folderId);
  for (const child of children) {
    if (child.id === targetId || hasDescendant(child.id, targetId, allFolders)) return true;
  }
  return false;
}

function SidebarFolderNode({ folder, allFolders, projects, currentFolderId, onNavigate, depth }: {
  folder: Folder;
  allFolders: Folder[];
  projects: ProjectSummary[];
  currentFolderId: string | null;
  onNavigate: (id: string) => void;
  depth: number;
}) {
  const children = allFolders.filter(f => f.parentId === folder.id);
  const hasChildren = children.length > 0;
  const projectCount = projects.filter(p => p.folderId === folder.id).length;
  const isActive = currentFolderId === folder.id;
  const containsActive = hasDescendant(folder.id, currentFolderId, allFolders);
  const shouldExpand = isActive || containsActive;
  const [expanded, setExpanded] = useState(shouldExpand);

  // Auto-expand when this folder or a descendant becomes active
  useEffect(() => {
    if (shouldExpand) setExpanded(true);
  }, [shouldExpand]);

  return (
    <div>
      <div className="flex items-center">
        {hasChildren ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-0.5 text-csev-text-secondary hover:text-csev-green shrink-0"
            style={{ marginLeft: `${depth * 12}px` }}
          >
            <ChevronRight size={12} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </button>
        ) : (
          <span style={{ marginLeft: `${depth * 12 + 16}px` }} />
        )}
        <button
          onClick={() => onNavigate(folder.id)}
          className={`flex-1 min-w-0 text-left px-2 py-1.5 rounded-lg transition-colors group flex items-center gap-2 ${
            isActive
              ? 'bg-csev-green/10 text-csev-green'
              : 'hover:bg-csev-slate-700 text-csev-text-primary'
          }`}
        >
          <FolderOpen size={13} className={isActive ? 'text-csev-green' : 'text-csev-text-secondary group-hover:text-csev-green'} />
          <span className="text-xs font-medium truncate flex-1">{folder.name}</span>
          <span className="text-[10px] text-csev-text-secondary shrink-0" title={`${projectCount} project${projectCount !== 1 ? 's' : ''}`}>
            {projectCount}
          </span>
        </button>
      </div>
      {expanded && hasChildren && children.map(child => (
        <SidebarFolderNode
          key={child.id}
          folder={child}
          allFolders={allFolders}
          projects={projects}
          currentFolderId={currentFolderId}
          onNavigate={onNavigate}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [renamingFolder, setRenamingFolder] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [renamingProjectId, setRenamingProjectId] = useState<string | null>(null);
  const [renamingProjectValue, setRenamingProjectValue] = useState('');
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [moveTargetIds, setMoveTargetIds] = useState<string[]>([]);
  const [duplicatingProject, setDuplicatingProject] = useState<ProjectSummary | null>(null);
  const [completingProject, setCompletingProject] = useState<ProjectSummary | null>(null);
  const [showAllSubfolders, setShowAllSubfolders] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    title: string; message: string; confirmLabel: string;
    confirmVariant?: 'danger' | 'primary'; onConfirm: () => void;
  } | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [projectData, folderData] = await Promise.all([getProjects(), getFolders()]);
      setProjects(projectData);
      setFolders(folderData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkAuthAndLoad = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }
    setUserEmail(user.email || null);
    loadData();
  }, [router, loadData]);

  useEffect(() => { checkAuthAndLoad(); }, [checkAuthAndLoad]);

  // -- Handlers --

  const handleDelete = (id: string, name: string) => {
    setConfirmDialog({
      title: 'Delete Project',
      message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      confirmLabel: 'Delete',
      confirmVariant: 'danger',
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          await deleteProject(id);
          setProjects(prev => prev.filter(p => p.id !== id));
          setSelectedIds(prev => { const next = new Set(prev); next.delete(id); return next; });
        } catch (error) {
          console.error('Error deleting project:', error);
          setToast({ type: 'error', text: 'Failed to delete project' });
        }
      },
    });
  };

  const handleBulkDelete = () => {
    const count = selectedIds.size;
    setConfirmDialog({
      title: `Delete ${count} Project${count > 1 ? 's' : ''}`,
      message: `Are you sure you want to delete ${count} selected project${count > 1 ? 's' : ''}? This action cannot be undone.`,
      confirmLabel: `Delete ${count} Project${count > 1 ? 's' : ''}`,
      confirmVariant: 'danger',
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          await Promise.all(Array.from(selectedIds).map(id => deleteProject(id)));
          setSelectedIds(new Set());
          await loadData();
        } catch (error) {
          console.error('Error bulk deleting:', error);
          setToast({ type: 'error', text: 'Some projects failed to delete' });
          await loadData();
        }
      },
    });
  };

  const handleOpenMoveModal = (projectIds: string[]) => {
    setMoveTargetIds(projectIds);
    setShowMoveModal(true);
  };

  const handleMoveConfirm = async (folderId: string | null) => {
    setShowMoveModal(false);
    try {
      await Promise.all(moveTargetIds.map(id => moveProjectToFolder(id, folderId)));
      setSelectedIds(new Set());
      setMoveTargetIds([]);
      await loadData();
    } catch (error) {
      console.error('Error moving projects:', error);
      setToast({ type: 'error', text: 'Some projects failed to move' });
      await loadData();
    }
  };

  const handleDuplicateWithDialog = (project: ProjectSummary) => {
    setDuplicatingProject(project);
  };

  const handleDuplicateConfirm = async (name: string, folderId: string | null) => {
    if (!duplicatingProject) return;
    setDuplicatingProject(null);
    try {
      await duplicateProject(duplicatingProject.id, name, folderId);
      await loadData();
      const folderName = folderId ? folders.find(f => f.id === folderId)?.name : null;
      setToast({ type: 'success', text: `Duplicated as "${name}"${folderName ? ` in ${folderName}` : ''}` });
    } catch (error) {
      console.error('Error duplicating project:', error);
      setToast({ type: 'error', text: 'Failed to duplicate project' });
    }
  };

  const handleStatusChange = async (id: string, newStatus: ProjectStatus) => {
    // If changing to completed, show the export dialog
    if (newStatus === 'completed') {
      const project = projects.find(p => p.id === id);
      if (project) {
        setCompletingProject(project);
        return;
      }
    }
    try {
      await updateProjectStatus(id, newStatus);
      setProjects(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
      setToast({ type: 'success', text: `Status updated to ${newStatus}` });
    } catch (error) {
      console.error('Error updating status:', error);
      setToast({ type: 'error', text: 'Failed to update status' });
    }
  };

  const handleCompleteConfirm = async (downloads: { type: string; theme: 'dark' | 'light' }[]) => {
    if (!completingProject) return;
    const projectId = completingProject.id;
    setCompletingProject(null);

    try {
      await updateProjectStatus(projectId, 'completed');
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: 'completed' } : p));
      const msg = downloads.length > 0
        ? `Completed — ${downloads.length} file${downloads.length > 1 ? 's' : ''} downloaded`
        : 'Status updated to completed';
      setToast({ type: 'success', text: msg });
    } catch (error) {
      console.error('Error completing project:', error);
      setToast({ type: 'error', text: 'Failed to update status' });
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      await createFolder(newFolderName.trim(), currentFolderId);
      setNewFolderName('');
      setShowNewFolderDialog(false);
      await loadData();
    } catch (error) {
      console.error('Error creating folder:', error);
      setToast({ type: 'error', text: 'Failed to create folder' });
    }
  };

  const handleRenameFolder = async (id: string) => {
    if (!renameValue.trim()) return;
    try {
      await renameFolder(id, renameValue.trim());
      setRenamingFolder(null);
      setRenameValue('');
      await loadData();
    } catch (error) {
      console.error('Error renaming folder:', error);
    }
  };

  const handleDeleteFolder = (id: string, name: string) => {
    setConfirmDialog({
      title: 'Delete Folder',
      message: `Delete folder "${name}"? Projects inside will be moved to the root level. This cannot be undone.`,
      confirmLabel: 'Delete Folder',
      confirmVariant: 'danger',
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          await deleteFolder(id);
          if (currentFolderId === id) setCurrentFolderId(null);
          await loadData();
        } catch (error) {
          console.error('Error deleting folder:', error);
        }
      },
    });
  };

  const handleRenameProject = async (id: string) => {
    const newName = renamingProjectValue.trim();
    if (!newName) { setRenamingProjectId(null); return; }
    try {
      await renameProject(id, newName);
      setProjects(prev => prev.map(p => p.id === id ? { ...p, name: newName } : p));
      setToast({ type: 'success', text: 'Project renamed' });
    } catch (error) {
      console.error('Error renaming project:', error);
      setToast({ type: 'error', text: 'Failed to rename project' });
    }
    setRenamingProjectId(null);
    setRenamingProjectValue('');
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir(field === 'updatedAt' || field === 'createdAt' ? 'desc' : 'asc');
    }
    setCurrentPage(1);
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTypeFilter('all');
    setDateFilter('all');
    setCurrentPage(1);
  };

  const hasActiveFilters = statusFilter !== 'all' || typeFilter !== 'all' || dateFilter !== 'all' || !!searchQuery;

  const getFolderName = (folderId: string | null): string | null => {
    if (!folderId) return null;
    return folders.find(f => f.id === folderId)?.name || null;
  };

  const folderBreadcrumb = useMemo(() => {
    const path: Folder[] = [];
    let id = currentFolderId;
    while (id) {
      const folder = folders.find(f => f.id === id);
      if (folder) { path.unshift(folder); id = folder.parentId; } else break;
    }
    return path;
  }, [currentFolderId, folders]);

  const recentProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
  }, [projects]);

  const rootFolders = useMemo(() => folders.filter(f => !f.parentId), [folders]);

  const currentFolders = folders.filter(f => f.parentId === currentFolderId);

  // Date filter helper
  const isWithinDateRange = useCallback((dateStr: string, range: string): boolean => {
    if (range === 'all') return true;
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    switch (range) {
      case 'today': return diffDays < 1;
      case 'week': return diffDays < 7;
      case 'month': return diffDays < 30;
      case '90days': return diffDays < 90;
      default: return true;
    }
  }, []);

  // Filtered, sorted, paginated projects
  const { paginatedProjects, totalPages, totalFiltered } = useMemo(() => {
    let filtered = projects.filter(p => {
      const matchesSearch = !searchQuery ||
        p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.customerAddress.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchesType = typeFilter === 'all' || p.projectType === typeFilter;
      const matchesDate = isWithinDateRange(p.updatedAt, dateFilter);

      // Folder filtering: null = show all, otherwise filter by folder
      if (currentFolderId && !searchQuery) {
        return p.folderId === currentFolderId && matchesSearch && matchesStatus && matchesType && matchesDate;
      }
      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });

    filtered.sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      if (sortField === 'updatedAt' || sortField === 'createdAt') {
        const diff = new Date(aVal).getTime() - new Date(bVal).getTime();
        return sortDir === 'asc' ? diff : -diff;
      }
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { sensitivity: 'base' });
      return sortDir === 'asc' ? cmp : -cmp;
    });

    const totalFiltered = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalFiltered / ITEMS_PER_PAGE));
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedProjects = filtered.slice(start, start + ITEMS_PER_PAGE);

    return { paginatedProjects, totalPages, totalFiltered };
  }, [projects, currentFolderId, searchQuery, statusFilter, typeFilter, dateFilter, sortField, sortDir, currentPage, isWithinDateRange]);

  useEffect(() => {
    setSelectedIds(new Set());
    setCurrentPage(1);
    setShowAllSubfolders(false);
  }, [searchQuery, statusFilter, typeFilter, dateFilter, currentFolderId]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedProjects.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedProjects.map(p => p.id)));
    }
  };

  const getMoveContextFolderIds = (): (string | null)[] => {
    return moveTargetIds.map(id => projects.find(p => p.id === id)?.folderId ?? null);
  };

  const formatDateTwoLine = (dateString: string) => {
    const d = new Date(dateString);
    const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return { date, time };
  };

  const formatCurrency = (value: number) => {
    if (!value) return '$0';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  };

  const formatProjectType = (type: string) => PROJECT_TYPE_LABELS[type] || type || '—';
  const getStatusColor = (status: string) => STATUS_COLORS[status] || STATUS_COLORS.draft;

  // All project types for filter dropdown (always show all, not just what's in data)
  const ALL_PROJECT_TYPES = Object.keys(PROJECT_TYPE_LABELS);

  const SortHeader = ({ field, label, className = '', align = 'left', width }: { field: SortField; label: string; className?: string; align?: 'left' | 'center'; width?: string }) => (
    <th
      className={`px-4 py-2.5 text-xs font-medium text-csev-text-secondary uppercase tracking-wider cursor-pointer hover:text-csev-text-primary select-none ${className}`}
      onClick={() => handleSort(field)}
      style={width ? { width } : undefined}
    >
      <div className={`flex items-center gap-1 ${align === 'center' ? 'justify-center' : ''}`}>
        {label}
        {sortField === field ? (
          sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
        ) : (
          <span className="w-3" />
        )}
      </div>
    </th>
  );

  // Select dropdown styling
  const filterSelectClass = "px-2.5 py-1.5 rounded-lg bg-csev-slate-800 border border-csev-border text-xs text-csev-text-primary focus:outline-none focus:ring-1 focus:ring-csev-green cursor-pointer";

  return (
    <div className="min-h-screen bg-csev-slate-900 bg-network-pattern">
      {/* Header */}
      <header className="bg-csev-slate-800 border-b border-csev-border shadow-lg">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/CSEV logo for dark background.png" alt="ChargeSmart EV" width={40} height={40} className="rounded-lg" />
            <div>
              <h1 className="text-xl font-bold text-csev-text-primary">
                <span className="text-csev-green">Charge</span>Smart EV
              </h1>
              <p className="text-sm text-csev-text-secondary">Proposal Generator</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-csev-text-muted">{userEmail}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut size={16} className="mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 py-8 flex gap-6">
        {/* Left Sidebar */}
        <aside className="w-64 shrink-0 hidden lg:block">
          <div className="sticky top-8">
            {/* Recently Opened */}
            <div className="bg-csev-panel rounded-lg border border-csev-border p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-csev-text-primary mb-3">
                <Clock size={14} className="text-csev-green" />
                Recently Opened
              </h3>
              {recentProjects.length === 0 ? (
                <p className="text-xs text-csev-text-muted">No projects yet</p>
              ) : (
                <div className="space-y-0.5">
                  {recentProjects.map(p => (
                    <div
                      key={p.id}
                      className="flex items-center gap-1 rounded-lg hover:bg-csev-slate-700 transition-colors group"
                    >
                      <button
                        onClick={() => router.push(`/?project=${p.id}`)}
                        className="flex-1 min-w-0 text-left px-2.5 py-2"
                      >
                        <p className="text-xs font-medium text-csev-text-primary truncate group-hover:text-csev-green transition-colors">
                          {p.name}
                        </p>
                        <p className="text-[10px] text-csev-text-muted truncate">
                          {p.customerName || 'No customer'}
                          {getFolderName(p.folderId) && (
                            <span className="ml-1">&middot; {getFolderName(p.folderId)}</span>
                          )}
                        </p>
                      </button>
                      {/* Always-visible quick actions */}
                      <button
                        onClick={() => router.push(`/?project=${p.id}`)}
                        title="Open & Edit"
                        className="p-1.5 text-csev-text-secondary hover:text-csev-green transition-colors shrink-0"
                      >
                        <Edit size={13} />
                      </button>
                      <button
                        onClick={() => {
                          setCurrentFolderId(p.folderId || null);
                          setExpandedId(p.id);
                          setCurrentPage(1);
                        }}
                        title={p.folderId ? `Go to ${getFolderName(p.folderId)}` : 'Go to All Projects'}
                        className="p-1.5 text-csev-text-secondary hover:text-csev-green transition-colors shrink-0 mr-0.5"
                      >
                        <FolderOpen size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Folders Nav */}
            <div className="bg-csev-panel rounded-lg border border-csev-border p-4 mt-3">
              <button
                onClick={() => setCurrentFolderId(null)}
                className={`flex items-center gap-2 text-sm font-semibold mb-3 transition-colors w-full text-left rounded-lg px-2 py-1.5 -mx-1 ${
                  !currentFolderId
                    ? 'text-csev-green bg-csev-green/10'
                    : 'text-csev-text-primary hover:text-csev-green hover:bg-csev-slate-700'
                }`}
              >
                <List size={14} className="text-csev-green" />
                All Projects
              </button>
              <div className="space-y-0.5">
                {rootFolders.length === 0 ? (
                  <p className="text-xs text-csev-text-muted">No folders yet</p>
                ) : (
                  rootFolders.map(folder => (
                    <SidebarFolderNode
                      key={folder.id}
                      folder={folder}
                      allFolders={folders}
                      projects={projects}
                      currentFolderId={currentFolderId}
                      onNavigate={setCurrentFolderId}
                      depth={0}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Page Title */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-csev-text-primary">Projects</h2>
            <p className="text-csev-text-secondary">Manage your EV charging proposals</p>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-csev-text-muted" size={20} />
              <Input
                type="text"
                placeholder="Search all projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowNewFolderDialog(true)}>
                <FolderPlus size={18} className="mr-2" />
                New Folder
              </Button>
              <Button variant="primary" onClick={() => router.push('/?new=1')}>
                <Plus size={20} className="mr-2" />
                New Proposal
              </Button>
            </div>
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <Filter size={14} className="text-csev-text-muted" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={filterSelectClass}>
              <option value="all">Any Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="completed">Completed</option>
            </select>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={filterSelectClass}>
              <option value="all">Any Type</option>
              {ALL_PROJECT_TYPES.map(t => (
                <option key={t} value={t}>{formatProjectType(t)}</option>
              ))}
            </select>
            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className={filterSelectClass}>
              <option value="all">Last Updated: Any Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="90days">Last 90 Days</option>
            </select>
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 transition-colors"
              >
                <RotateCcw size={12} /> Reset All
              </button>
            )}
          </div>

          {/* Folder Navigation Bar */}
          {currentFolderId && !searchQuery && (
            <div className="mb-4 space-y-3">
              {/* Breadcrumb + All Projects button */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentFolderId(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-csev-green/10 text-csev-green text-xs font-semibold hover:bg-csev-green/20 transition-colors shrink-0"
                >
                  <ArrowLeft size={13} />
                  All Projects
                </button>
                <div className="flex items-center gap-1 text-sm overflow-x-auto">
                  {folderBreadcrumb.map((folder, i) => (
                    <span key={folder.id} className="flex items-center gap-1 shrink-0">
                      {i > 0 && <ChevronRight size={12} className="text-csev-text-muted" />}
                      <button
                        onClick={() => setCurrentFolderId(folder.id)}
                        className={`hover:text-csev-green transition-colors ${
                          currentFolderId === folder.id ? 'text-csev-text-primary font-medium' : 'text-csev-text-muted'
                        }`}
                      >
                        {folder.name}
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              {/* Subfolder cards */}
              {currentFolders.length > 0 && (() => {
                const SUBFOLDER_CAP = 8;
                const visibleFolders = showAllSubfolders ? currentFolders : currentFolders.slice(0, SUBFOLDER_CAP);
                const hiddenCount = currentFolders.length - SUBFOLDER_CAP;
                return (
                  <div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {visibleFolders.map(folder => {
                        const count = projects.filter(p => p.folderId === folder.id).length;
                        const subCount = folders.filter(f => f.parentId === folder.id).length;
                        return (
                          <button
                            key={folder.id}
                            onClick={() => setCurrentFolderId(folder.id)}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-csev-panel border border-csev-border text-left hover:border-csev-green/40 hover:bg-csev-green/[0.03] transition-colors group"
                          >
                            <FolderOpen size={18} className="text-csev-green shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-csev-text-primary truncate group-hover:text-csev-green transition-colors">{folder.name}</p>
                              <p className="text-[10px] text-csev-text-muted">
                                {count} project{count !== 1 ? 's' : ''}
                                {subCount > 0 && ` · ${subCount} subfolder${subCount !== 1 ? 's' : ''}`}
                              </p>
                            </div>
                            <ChevronRight size={14} className="text-csev-text-muted shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                    {hiddenCount > 0 && !showAllSubfolders && (
                      <button
                        onClick={() => setShowAllSubfolders(true)}
                        className="mt-2 text-xs text-csev-text-secondary hover:text-csev-green transition-colors"
                      >
                        Show all {currentFolders.length} folders ({hiddenCount} more)
                      </button>
                    )}
                    {showAllSubfolders && currentFolders.length > SUBFOLDER_CAP && (
                      <button
                        onClick={() => setShowAllSubfolders(false)}
                        className="mt-2 text-xs text-csev-text-secondary hover:text-csev-green transition-colors"
                      >
                        Show fewer
                      </button>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-csev-text-muted animate-pulse">Loading projects...</p>
            </div>
          ) : (
            <>
              {/* Bulk Action Bar */}
              {selectedIds.size > 0 && (
                <div className="bg-csev-slate-800 border border-csev-green/30 rounded-lg px-4 py-2.5 mb-4 flex items-center gap-3 animate-fade-in">
                  <span className="text-sm text-csev-text-primary font-medium">
                    {selectedIds.size} selected
                  </span>
                  <div className="h-4 w-px bg-csev-border" />
                  <button
                    onClick={() => handleOpenMoveModal(Array.from(selectedIds))}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-csev-text-secondary hover:text-csev-text-primary bg-csev-slate-700 hover:bg-csev-slate-600 rounded-lg transition-colors"
                  >
                    <MoveRight size={14} /> Move
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                  <button
                    onClick={() => setSelectedIds(new Set())}
                    className="ml-auto text-xs text-csev-text-muted hover:text-csev-text-primary transition-colors"
                  >
                    Clear selection
                  </button>
                </div>
              )}

              {/* Projects Table */}
              {paginatedProjects.length === 0 ? (
                <div className="bg-csev-panel rounded-lg shadow-card border border-csev-border p-12 text-center">
                  <p className="text-csev-text-secondary mb-4">
                    {searchQuery || hasActiveFilters ? 'No projects match your filters.' : currentFolderId ? 'This folder is empty.' : 'No projects here yet.'}
                  </p>
                  {hasActiveFilters ? (
                    <Button variant="outline" onClick={resetAllFilters}>
                      <RotateCcw size={16} className="mr-2" />
                      Reset Filters
                    </Button>
                  ) : (
                    <Button variant="primary" onClick={() => router.push('/?new=1')}>
                      <Plus size={20} className="mr-2" />
                      Create Your First Proposal
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <div className="bg-csev-panel rounded-lg shadow-card border border-csev-border overflow-hidden">
                    <table className="w-full" style={{ tableLayout: 'fixed' }}>
                      <colgroup>
                        <col style={{ width: '40px' }} />
                        <col style={{ width: '35%' }} />
                        <col style={{ width: '20%' }} />
                        <col style={{ width: '100px' }} />
                        <col style={{ width: '110px' }} />
                        <col style={{ width: '110px' }} />
                        <col style={{ width: '32px' }} />
                      </colgroup>
                      <thead className="bg-csev-slate-800 border-b border-csev-border">
                        <tr>
                          <th className="w-10 px-3 py-2.5">
                            <button onClick={toggleSelectAll} className="text-csev-text-secondary hover:text-csev-text-primary transition-colors">
                              {selectedIds.size === paginatedProjects.length && paginatedProjects.length > 0 ? (
                                <CheckSquare size={16} className="text-csev-green" />
                              ) : (
                                <Square size={16} />
                              )}
                            </button>
                          </th>
                          <SortHeader field="name" label="Project" />
                          <SortHeader field="customerName" label="Customer" />
                          <th
                            className="py-2.5 text-xs font-medium text-csev-text-secondary uppercase tracking-wider cursor-pointer hover:text-csev-text-primary select-none text-center"
                            onClick={() => handleSort('status')}
                          >
                            Status{sortField === 'status' ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}
                          </th>
                          <SortHeader field="createdAt" label="Created" className="hidden md:table-cell !px-2" />
                          <SortHeader field="updatedAt" label="Last Updated" className="hidden sm:table-cell !px-2" />
                          <th className="w-8 px-2 py-2.5" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-csev-border/50">
                        {paginatedProjects.map((project) => (
                          <Fragment key={project.id}>
                            <tr
                              className={`cursor-pointer transition-colors ${
                                expandedId === project.id
                                  ? 'bg-csev-green/[0.04]'
                                  : selectedIds.has(project.id)
                                  ? 'bg-csev-green/5 hover:bg-csev-green/10'
                                  : 'hover:bg-csev-slate-800/50'
                              }`}
                              style={expandedId === project.id ? { boxShadow: 'inset 3px 0 0 0 #4CBC88' } : undefined}
                              onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}
                            >
                              <td className="w-10 px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => toggleSelect(project.id)} className="text-csev-text-secondary hover:text-csev-text-primary transition-colors">
                                  {selectedIds.has(project.id) ? (
                                    <CheckSquare size={16} className="text-csev-green" />
                                  ) : (
                                    <Square size={16} />
                                  )}
                                </button>
                              </td>
                              <td className="px-4 py-2.5 overflow-hidden">
                                <p className={`text-sm font-medium truncate ${expandedId === project.id ? 'text-csev-green' : 'text-csev-text-primary'}`}>{project.name}</p>
                              </td>
                              <td className="px-4 py-2.5 text-sm text-csev-text-secondary overflow-hidden truncate">
                                {project.customerName || '-'}
                              </td>
                              <td className="px-4 py-2.5 text-center">
                                <span className={`inline-block w-[72px] text-center py-0.5 text-[10px] font-medium rounded-full ${getStatusColor(project.status)}`}>
                                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-2 py-2.5 hidden md:table-cell whitespace-nowrap">
                                <p className="text-[11px] text-csev-text-muted">{formatDateTwoLine(project.createdAt).date}</p>
                                <p className="text-[10px] text-csev-text-muted/70">{formatDateTwoLine(project.createdAt).time}</p>
                              </td>
                              <td className="px-2 py-2.5 hidden sm:table-cell whitespace-nowrap">
                                <p className="text-[11px] text-csev-text-muted">{formatDateTwoLine(project.updatedAt).date}</p>
                                <p className="text-[10px] text-csev-text-muted/70">{formatDateTwoLine(project.updatedAt).time}</p>
                              </td>
                              <td className="w-8 px-2 py-2.5">
                                <ChevronDown size={14} className={`transition-transform ${expandedId === project.id ? 'rotate-180 text-csev-green' : 'text-csev-text-secondary'}`} />
                              </td>
                            </tr>
                            {/* Expanded detail panel */}
                            {expandedId === project.id && (
                              <tr>
                                <td colSpan={7} className="bg-csev-green/[0.04]" style={{ boxShadow: 'inset 3px 0 0 0 #4CBC88, 0 1px 0 0 rgba(76,188,136,0.2)' }}>
                                  <div className="px-6 py-4">
                                    {renamingProjectId === project.id ? (
                                      <div className="flex items-center gap-2 mb-3" onClick={(e) => e.stopPropagation()}>
                                        <input
                                          autoFocus
                                          value={renamingProjectValue}
                                          onChange={(e) => setRenamingProjectValue(e.target.value)}
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleRenameProject(project.id);
                                            if (e.key === 'Escape') { setRenamingProjectId(null); setRenamingProjectValue(''); }
                                          }}
                                          className="flex-1 text-sm font-semibold px-2 py-1 rounded bg-csev-slate-700 border border-csev-green/50 text-csev-green outline-none"
                                        />
                                        <button
                                          onClick={() => handleRenameProject(project.id)}
                                          disabled={!renamingProjectValue.trim()}
                                          className="px-2.5 py-1 text-xs font-medium rounded bg-csev-green/20 text-csev-green hover:bg-csev-green/30 disabled:opacity-40 transition-colors"
                                        >
                                          Save
                                        </button>
                                        <button
                                          onClick={() => { setRenamingProjectId(null); setRenamingProjectValue(''); }}
                                          className="px-2 py-1 text-xs text-csev-text-muted hover:text-csev-text-primary transition-colors"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2 mb-3">
                                        <p className="text-sm font-semibold text-csev-green">{project.name}</p>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); setRenamingProjectId(project.id); setRenamingProjectValue(project.name); }}
                                          className="p-0.5 text-csev-text-muted hover:text-csev-green transition-colors"
                                          title="Rename project"
                                        >
                                          <Edit size={12} />
                                        </button>
                                      </div>
                                    )}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                      <div>
                                        <p className="text-[10px] text-csev-text-muted uppercase tracking-wider mb-1">Location</p>
                                        <p className="text-xs text-csev-text-primary">{project.customerAddress || '—'}</p>
                                      </div>
                                      <div>
                                        <p className="text-[10px] text-csev-text-muted uppercase tracking-wider mb-1">Folder</p>
                                        {getFolderName(project.folderId) ? (
                                          <button
                                            onClick={(e) => { e.stopPropagation(); setCurrentFolderId(project.folderId); setExpandedId(null); }}
                                            className="text-xs text-csev-text-primary flex items-center gap-1 hover:text-csev-green transition-colors"
                                          >
                                            <FolderOpen size={11} className="text-csev-green" /> {getFolderName(project.folderId)}
                                          </button>
                                        ) : (
                                          <p className="text-xs text-csev-text-muted">All Projects</p>
                                        )}
                                      </div>
                                      <div>
                                        <p className="text-[10px] text-csev-text-muted uppercase tracking-wider mb-1">Project Type</p>
                                        <p className="text-xs text-csev-text-primary">{formatProjectType(project.projectType)}</p>
                                      </div>
                                      <div>
                                        <p className="text-[10px] text-csev-text-muted uppercase tracking-wider mb-1">Gross Project Cost</p>
                                        <p className="text-xs text-csev-text-primary font-medium">{project.grossProjectCost ? formatCurrency(project.grossProjectCost) : '—'}</p>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                      <div>
                                        <p className="text-[10px] text-csev-text-muted uppercase tracking-wider mb-1">Total Ports</p>
                                        <p className="text-xs text-csev-text-primary">{project.totalPorts || '—'}</p>
                                      </div>
                                      <div>
                                        <p className="text-[10px] text-csev-text-muted uppercase tracking-wider mb-1">EVSE Items</p>
                                        <p className="text-xs text-csev-text-primary">{project.evseItemCount || '—'}</p>
                                      </div>
                                      {/* Status selector — fills the right two columns */}
                                      <div className="md:col-span-2" onClick={(e) => e.stopPropagation()}>
                                        <p className="text-[10px] text-csev-text-muted uppercase tracking-wider mb-2">Status</p>
                                        <div className="flex gap-1.5">
                                          {(['draft', 'sent', 'completed'] as const).map(s => (
                                            <button
                                              key={s}
                                              onClick={() => handleStatusChange(project.id, s)}
                                              className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                                                project.status === s
                                                  ? `${getStatusColor(s)} ring-1 ring-offset-1 ring-offset-csev-slate-800 ${STATUS_RING_COLORS[s]}`
                                                  : 'bg-csev-slate-700/50 text-csev-text-muted hover:bg-csev-slate-700 hover:text-csev-text-secondary'
                                              }`}
                                            >
                                              {s.charAt(0).toUpperCase() + s.slice(1)}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                    {/* Action buttons */}
                                    <div className="flex gap-2 pt-2 border-t border-csev-border/30">
                                      <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={(e) => { e.stopPropagation(); router.push(`/?project=${project.id}`); }}
                                        className="text-xs"
                                      >
                                        <Edit size={14} className="mr-1.5" />
                                        Open & Edit
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => { e.stopPropagation(); handleOpenMoveModal([project.id]); }}
                                        className="text-xs"
                                      >
                                        <MoveRight size={14} className="mr-1.5" />
                                        Move
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => { e.stopPropagation(); handleDuplicateWithDialog(project); }}
                                        className="text-xs"
                                      >
                                        <Copy size={14} className="mr-1.5" />
                                        Duplicate
                                      </Button>
                                      <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={(e) => { e.stopPropagation(); handleDelete(project.id, project.name); }}
                                        className="text-xs"
                                      >
                                        <Trash2 size={14} className="mr-1.5" />
                                        Delete
                                      </Button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-xs text-csev-text-muted">
                        Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, totalFiltered)} of {totalFiltered}
                      </p>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="p-1.5 rounded hover:bg-csev-slate-700 text-csev-text-muted hover:text-csev-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                              currentPage === page
                                ? 'bg-csev-green/20 text-csev-green'
                                : 'text-csev-text-muted hover:bg-csev-slate-700 hover:text-csev-text-primary'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="p-1.5 rounded hover:bg-csev-slate-700 text-csev-text-muted hover:text-csev-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </main>
      </div>

      {/* New Folder Dialog */}
      {showNewFolderDialog && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-csev-panel rounded-lg shadow-xl border border-csev-border p-6 w-full max-w-md mx-4 animate-fade-in">
            <h3 className="text-lg font-semibold text-csev-text-primary mb-4">
              New Folder {currentFolderId && `in ${folderBreadcrumb[folderBreadcrumb.length - 1]?.name}`}
            </h3>
            <div className="mb-4">
              <Input
                label="Folder Name"
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="e.g. NJ Projects"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => { setShowNewFolderDialog(false); setNewFolderName(''); }}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
                Create
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Move to Folder Modal */}
      {showMoveModal && (
        <MoveToFolderModal
          folders={folders}
          currentFolderIds={getMoveContextFolderIds()}
          projectCount={moveTargetIds.length}
          onMove={handleMoveConfirm}
          onClose={() => { setShowMoveModal(false); setMoveTargetIds([]); }}
        />
      )}

      {/* Duplicate Dialog */}
      {duplicatingProject && (
        <DuplicateDialog
          project={duplicatingProject}
          folders={folders}
          onDuplicate={handleDuplicateConfirm}
          onClose={() => setDuplicatingProject(null)}
        />
      )}

      {/* Complete Status Dialog */}
      {completingProject && (
        <CompleteDialog
          project={completingProject}
          onConfirm={handleCompleteConfirm}
          onClose={() => setCompletingProject(null)}
        />
      )}

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmLabel={confirmDialog.confirmLabel}
          confirmVariant={confirmDialog.confirmVariant}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(null)}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[70] px-4 py-3 rounded-lg shadow-xl border animate-fade-in flex items-center gap-2 ${
          toast.type === 'success'
            ? 'bg-csev-green/20 border-csev-green/30 text-csev-green'
            : 'bg-red-500/20 border-red-500/30 text-red-400'
        }`}>
          <span className="text-sm font-medium">{toast.text}</span>
          <button onClick={() => setToast(null)} className="p-0.5 hover:opacity-70">
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
