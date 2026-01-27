'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getProjects, deleteProject, ProjectSummary } from '@/lib/projectStorage';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Search, Trash2, Edit, LogOut, Zap } from 'lucide-react';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkAuthAndLoadProjects = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    setUserEmail(user.email || null);
    loadProjects();
  }, [router, loadProjects]);

  useEffect(() => {
    checkAuthAndLoadProjects();
  }, [checkAuthAndLoadProjects]);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const filteredProjects = projects.filter(p =>
    p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.customerAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-csev-text-muted" size={20} />
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="primary" onClick={() => router.push('/')}>
            <Plus size={20} className="mr-2" />
            New Proposal
          </Button>
        </div>

        {/* Projects List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-csev-text-muted animate-pulse">Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-csev-panel rounded-lg shadow-card border border-csev-border p-12 text-center">
            <p className="text-csev-text-secondary mb-4">
              {searchQuery ? 'No projects match your search.' : 'No projects yet.'}
            </p>
            <Button variant="primary" onClick={() => router.push('/')}>
              <Plus size={20} className="mr-2" />
              Create Your First Proposal
            </Button>
          </div>
        ) : (
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
                  <th className="text-left px-6 py-3 text-xs font-medium text-csev-text-secondary uppercase tracking-wider">
                    Location
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-csev-text-secondary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-csev-text-secondary uppercase tracking-wider">
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
                    <td className="px-6 py-4 text-csev-text-muted text-sm">
                      {project.customerAddress || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-csev-text-muted">
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
                          onClick={() => handleDelete(project.id, project.name)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
