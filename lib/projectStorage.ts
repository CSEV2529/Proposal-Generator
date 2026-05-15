// Project storage utilities — calls our own API routes (backed by Railway PostgreSQL)
import { Proposal } from './types';

// Serialize proposal for storage (convert Date to ISO string)
function serializeProposal(proposal: Proposal): Record<string, unknown> {
  return {
    ...proposal,
    preparedDate: proposal.preparedDate.toISOString(),
  };
}

// Deserialize proposal from storage (convert ISO string back to Date)
function deserializeProposal(data: Record<string, unknown>): Proposal {
  return {
    ...data,
    preparedDate: new Date(data.preparedDate as string),
  } as Proposal;
}

export interface ProjectSummary {
  id: string;
  name: string;
  customerName: string;
  customerAddress: string;
  status: 'draft' | 'sent' | 'completed';
  folderId: string | null;
  createdAt: string;
  updatedAt: string;
  // Preview fields extracted from project_data
  projectType: string;
  totalPorts: number;
  grossProjectCost: number;
  evseItemCount: number;
}

export interface ProjectWithData extends ProjectSummary {
  projectData: Proposal;
}

// Helper to format address from project data
function formatAddress(projectData: Record<string, unknown> | null): string {
  if (!projectData) return '';
  const street = projectData.customerAddress as string || '';
  const city = projectData.customerCity as string || '';
  const state = projectData.customerState as string || '';
  const cityState = [city, state].filter(Boolean).join(', ');
  const parts = [street, cityState].filter(Boolean);
  return parts.join(', ');
}

// Extract preview fields from project_data JSONB
function extractPreview(pd: Record<string, unknown> | null) {
  if (!pd) return { projectType: '', totalPorts: 0, grossProjectCost: 0, evseItemCount: 0 };
  const evseItems = (pd.evseItems as Array<Record<string, unknown>>) || [];
  return {
    projectType: (pd.projectType as string) || '',
    totalPorts: (pd.totalPorts as number) || 0,
    grossProjectCost: (pd.grossProjectCost as number) || 0,
    evseItemCount: evseItems.length,
  };
}

// Map a raw DB row to ProjectSummary
function mapToSummary(p: Record<string, unknown>): ProjectSummary {
  const pd = p.project_data as Record<string, unknown> | null;
  const preview = extractPreview(pd);
  return {
    id: p.id as string,
    name: p.name as string,
    customerName: (p.customer_name as string) || '',
    customerAddress: formatAddress(pd),
    status: p.status as ProjectSummary['status'],
    folderId: (p.folder_id as string) || null,
    createdAt: p.created_at as string,
    updatedAt: p.updated_at as string,
    ...preview,
  };
}

// Get all projects
export async function getProjects(): Promise<ProjectSummary[]> {
  const res = await fetch('/api/projects');
  if (!res.ok) throw new Error('Failed to fetch projects');
  const { data } = await res.json();
  return (data || []).map((p: Record<string, unknown>) => mapToSummary(p));
}

// Get a single project with full data
export async function getProject(id: string): Promise<ProjectWithData | null> {
  const res = await fetch(`/api/projects/${id}`);
  if (!res.ok) throw new Error('Failed to fetch project');
  const { data } = await res.json();
  if (!data) return null;
  const pd = data.project_data as Record<string, unknown>;
  return {
    ...mapToSummary(data as Record<string, unknown>),
    projectData: deserializeProposal(pd),
  };
}

// Save a new project
export async function createProject(
  name: string,
  proposal: Proposal,
  folderId?: string | null
): Promise<string> {
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      customer_name: proposal.customerName || '',
      project_data: serializeProposal(proposal),
      status: 'draft',
      folder_id: folderId || null,
    }),
  });
  if (!res.ok) throw new Error('Failed to create project');
  const { id } = await res.json();
  return id;
}

// Update an existing project
export async function updateProject(
  id: string,
  proposal: Proposal,
  name?: string,
  status?: 'draft' | 'sent' | 'completed'
): Promise<void> {
  const body: Record<string, unknown> = {
    project_data: serializeProposal(proposal),
    customer_name: proposal.customerName || '',
  };
  if (name !== undefined) body.name = name;
  if (status !== undefined) body.status = status;

  const res = await fetch(`/api/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Failed to update project');
}

// Update just the status of a project
export async function updateProjectStatus(
  id: string,
  status: 'draft' | 'sent' | 'completed'
): Promise<void> {
  const res = await fetch(`/api/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update project status');
}

// Rename a project
export async function renameProject(id: string, name: string): Promise<void> {
  const res = await fetch(`/api/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error('Failed to rename project');
}

// Delete a project
export async function deleteProject(id: string): Promise<void> {
  const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete project');
}

// Search projects by customer name
export async function searchProjects(query: string): Promise<ProjectSummary[]> {
  const res = await fetch(`/api/projects?search=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to search projects');
  const { data } = await res.json();
  return (data || []).map((p: Record<string, unknown>) => mapToSummary(p));
}

// Duplicate a project
export async function duplicateProject(id: string, customName?: string, folderId?: string | null): Promise<string> {
  const res = await fetch(`/api/projects/${id}/duplicate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: customName, folder_id: folderId }),
  });
  if (!res.ok) throw new Error('Failed to duplicate project');
  const { id: newId } = await res.json();
  return newId;
}

// Move a project to a folder
export async function moveProjectToFolder(projectId: string, folderId: string | null): Promise<void> {
  const res = await fetch(`/api/projects/${projectId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder_id: folderId }),
  });
  if (!res.ok) throw new Error('Failed to move project');
}

// Folder types
export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
}

// Get all folders
export async function getFolders(): Promise<Folder[]> {
  try {
    const res = await fetch('/api/folders');
    if (!res.ok) return [];
    const { data } = await res.json();
    return (data || []).map((f: Record<string, unknown>) => ({
      id: f.id as string,
      name: f.name as string,
      parentId: (f.parent_id as string) || null,
      createdAt: f.created_at as string,
    }));
  } catch {
    return [];
  }
}

// Create a folder
export async function createFolder(name: string, parentId: string | null = null): Promise<string> {
  const res = await fetch('/api/folders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, parent_id: parentId }),
  });
  if (!res.ok) throw new Error('Failed to create folder');
  const { id } = await res.json();
  return id;
}

// Rename a folder
export async function renameFolder(id: string, name: string): Promise<void> {
  const res = await fetch(`/api/folders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error('Failed to rename folder');
}

// Delete a folder (projects in it become unfoldered)
export async function deleteFolder(id: string): Promise<void> {
  const res = await fetch(`/api/folders/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete folder');
}
