'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  getProjects, deleteProject, duplicateProject,
  getFolders, createFolder, renameFolder, deleteFolder,
  moveProjectToFolder,
  ProjectSummary, Folder,
} from '@/lib/projectStorage';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Plus, Search, Trash2, Edit, LogOut, Zap, Copy,
  FolderPlus, FolderOpen, ChevronRight, ArrowLeft, MoreVertical,
} from 'lucide-react';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [renamingFolder, setRenamingFolder] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [movingProjectId, setMovingProjectId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [projectData, folderData] = await Promise.all([
        getProjects(),
        getFolders(),
      ]);
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
    if (!user) {
      router.push('/login');
      return;
    }
    setUserEmail(user.email || null);
    loadData();
  }, [router, loadData]);

  useEffect(() => {
    checkAuthAndLoad();
  }, [checkAuthAndLoad]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateProject(id);
      await loadData();
    } catch (error) {
      console.error('Error duplicating project:', error);
      alert('Failed to duplicate project');
    }
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
      alert('Failed to create folder');
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

  const handleDeleteFolder = async (id: string, name: string) => {
    if (!confirm(`Delete folder "${name}"? Projects inside will be moved to the root level.`)) return;
    try {
      await deleteFolder(id);
      if (currentFolderId === id) setCurrentFolderId(null);
      await loadData();
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  const handleMoveProject = async (projectId: string, folderId: string | null) => {
    try {
      await moveProjectToFolder(projectId, folderId);
      setMovingProjectId(null);
      await loadData();
    } catch (error) {
      console.error('Error moving project:', error);
    }
  };

  // Build folder breadcrumb path
  const folderBreadcrumb = useMemo(() => {
    const path: Folder[] = [];
    let id = currentFolderId;
    while (id) {
      const folder = folders.find(f => f.id === id);
      if (folder) {
        path.unshift(folder);
        id = folder.parentId;
      } else break;
    }
    return path;
  }, [currentFolderId, folders]);

  // Filter projects and folders for current view
  const currentFolders = folders.filter(f => f.parentId === currentFolderId);

  const filteredProjects = projects.filter(p => {
    const inFolder = p.folderId === currentFolderId;
    const matchesSearch = !searchQuery ||
      p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customerAddress.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    // When searching, show results across all folders
    return (searchQuery ? matchesSearch : (inFolder && matchesSearch)) && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-csev-slate-700 text-csev-text-secondary';
      case 'sent': return 'bg-blue-500/20 text-blue-400';
      case 'accepted': return 'bg-csev-green/20 text-csev-green';
      case 'completed': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-csev-slate-700 text-csev-text-secondary';
    }
  };

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: projects.length };
    projects.forEach(p => {
      counts[p.status] = (counts[p.status] || 0) + 1;
    });
    return counts;
  }, [projects]);

  return (
    <div className="min-h-screen bg-csev-slate-900 bg-network-pattern">
      {/* Header */}
      <header className="bg-csev-slate-800 border-b border-csev-border shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-csev-green/20 rounded-lg">
              <Zap size={24} className="text-csev-green" />
            </div>
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

      <main className="max-w-7xl mx-auto px-4 py-8">
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
            <Button variant="primary" onClick={() => router.push('/')}>
              <Plus size={20} className="mr-2" />
              New Proposal
            </Button>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {['all', 'draft', 'sent', 'accepted', 'completed'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-csev-green/20 text-csev-green border border-csev-green/30'
                  : 'bg-csev-slate-800 text-csev-text-muted border border-csev-border hover:bg-csev-slate-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {statusCounts[status] ? ` (${statusCounts[status]})` : ''}
            </button>
          ))}
        </div>

        {/* Folder Breadcrumb */}
        {!searchQuery && (
          <div className="flex items-center gap-1 mb-4 text-sm">
            <button
              onClick={() => setCurrentFolderId(null)}
              className={`hover:text-csev-green transition-colors ${
                !currentFolderId ? 'text-csev-green font-medium' : 'text-csev-text-muted'
              }`}
            >
              All Projects
            </button>
            {folderBreadcrumb.map(folder => (
              <span key={folder.id} className="flex items-center gap-1">
                <ChevronRight size={14} className="text-csev-text-muted" />
                <button
                  onClick={() => setCurrentFolderId(folder.id)}
                  className={`hover:text-csev-green transition-colors ${
                    currentFolderId === folder.id ? 'text-csev-green font-medium' : 'text-csev-text-muted'
                  }`}
                >
                  {folder.name}
                </button>
              </span>
            ))}
            {currentFolderId && (
              <button
                onClick={() => {
                  const parent = folders.find(f => f.id === currentFolderId);
                  setCurrentFolderId(parent?.parentId || null);
                }}
                className="ml-3 text-csev-text-muted hover:text-csev-text-primary transition-colors flex items-center gap-1"
              >
                <ArrowLeft size={14} /> Back
              </button>
            )}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-csev-text-muted animate-pulse">Loading projects...</p>
          </div>
        ) : (
          <>
            {/* Subfolders */}
            {!searchQuery && currentFolders.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                {currentFolders.map(folder => (
                  <div
                    key={folder.id}
                    className="bg-csev-panel rounded-lg border border-csev-border p-4 hover:border-csev-green/30 transition-colors cursor-pointer group relative"
                  >
                    <div
                      onClick={() => setCurrentFolderId(folder.id)}
                      className="flex items-center gap-3"
                    >
                      <FolderOpen size={20} className="text-csev-green shrink-0" />
                      {renamingFolder === folder.id ? (
                        <input
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onBlur={() => handleRenameFolder(folder.id)}
                          onKeyDown={(e) => e.key === 'Enter' && handleRenameFolder(folder.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="bg-csev-slate-700 border border-csev-border rounded px-2 py-0.5 text-sm text-csev-text-primary w-full"
                          autoFocus
                        />
                      ) : (
                        <span className="text-sm font-medium text-csev-text-primary truncate">{folder.name}</span>
                      )}
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setRenamingFolder(folder.id);
                          setRenameValue(folder.name);
                        }}
                        className="p-1 text-csev-text-muted hover:text-csev-text-primary"
                        title="Rename"
                      >
                        <Edit size={12} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFolder(folder.id, folder.name);
                        }}
                        className="p-1 text-csev-text-muted hover:text-red-400"
                        title="Delete folder"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Projects Table */}
            {filteredProjects.length === 0 && currentFolders.length === 0 ? (
              <div className="bg-csev-panel rounded-lg shadow-card border border-csev-border p-12 text-center">
                <p className="text-csev-text-secondary mb-4">
                  {searchQuery ? 'No projects match your search.' : 'No projects here yet.'}
                </p>
                <Button variant="primary" onClick={() => router.push('/')}>
                  <Plus size={20} className="mr-2" />
                  Create Your First Proposal
                </Button>
              </div>
            ) : filteredProjects.length > 0 && (
              <div className="bg-csev-panel rounded-lg shadow-card border border-csev-border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-csev-slate-800 border-b border-csev-border">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-medium text-csev-text-secondary uppercase tracking-wider">
                        Project
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-csev-text-secondary uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-csev-text-secondary uppercase tracking-wider hidden md:table-cell">
                        Location
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-csev-text-secondary uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-csev-text-secondary uppercase tracking-wider hidden sm:table-cell">
                        Last Updated
                      </th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-csev-text-secondary uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-csev-border/50">
                    {filteredProjects.map((project) => (
                      <tr key={project.id} className="hover:bg-csev-slate-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-csev-text-primary">{project.name}</p>
                        </td>
                        <td className="px-6 py-4 text-csev-text-secondary">
                          {project.customerName || '-'}
                        </td>
                        <td className="px-6 py-4 text-csev-text-muted text-sm hidden md:table-cell">
                          {project.customerAddress || '-'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-csev-text-muted hidden sm:table-cell">
                          {formatDate(project.updatedAt)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/?project=${project.id}`)}
                            >
                              <Edit size={16} className="mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDuplicate(project.id)}
                              title="Duplicate"
                            >
                              <Copy size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setMovingProjectId(movingProjectId === project.id ? null : project.id)}
                              title="Move to folder"
                              className={movingProjectId === project.id ? 'text-csev-green' : ''}
                            >
                              <FolderOpen size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(project.id, project.name)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                          {/* Move to folder dropdown */}
                          {movingProjectId === project.id && (
                            <div className="mt-2 bg-csev-slate-800 border border-csev-border rounded-lg p-2 text-left text-sm">
                              <p className="text-xs text-csev-text-muted mb-2 px-2">Move to:</p>
                              <button
                                onClick={() => handleMoveProject(project.id, null)}
                                className={`w-full text-left px-2 py-1.5 rounded hover:bg-csev-slate-700 transition-colors ${
                                  !project.folderId ? 'text-csev-green' : 'text-csev-text-secondary'
                                }`}
                              >
                                Root (No folder)
                              </button>
                              {folders.map(f => (
                                <button
                                  key={f.id}
                                  onClick={() => handleMoveProject(project.id, f.id)}
                                  className={`w-full text-left px-2 py-1.5 rounded hover:bg-csev-slate-700 transition-colors flex items-center gap-2 ${
                                    project.folderId === f.id ? 'text-csev-green' : 'text-csev-text-secondary'
                                  }`}
                                >
                                  <FolderOpen size={14} /> {f.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>

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
    </div>
  );
}
