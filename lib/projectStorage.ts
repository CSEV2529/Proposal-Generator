// Project storage utilities for Supabase
import { supabase } from './supabase';
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

  // Format as "123 Main St, Albany, NY"
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

// Get all projects for the current user
export async function getProjects(): Promise<ProjectSummary[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('id, name, customer_name, status, created_at, updated_at, project_data, folder_id')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }

  return (data || []).map(p => mapToSummary(p as Record<string, unknown>));
}

// Get a single project with full data
export async function getProject(id: string): Promise<ProjectWithData | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    throw error;
  }

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
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('Must be logged in to save projects');
  }

  const insertData: Record<string, unknown> = {
    user_id: userData.user.id,
    name: name,
    customer_name: proposal.customerName || '',
    project_data: serializeProposal(proposal),
    status: 'draft',
  };

  if (folderId) {
    insertData.folder_id = folderId;
  }

  const { data, error } = await supabase
    .from('projects')
    .insert(insertData)
    .select('id')
    .single();

  if (error) {
    console.error('Error creating project:', error);
    throw error;
  }

  return data.id;
}

// Update an existing project
export async function updateProject(
  id: string,
  proposal: Proposal,
  name?: string,
  status?: 'draft' | 'sent' | 'completed'
): Promise<void> {
  const updateData: Record<string, unknown> = {
    project_data: serializeProposal(proposal),
    customer_name: proposal.customerName || '',
  };

  if (name !== undefined) {
    updateData.name = name;
  }

  if (status !== undefined) {
    updateData.status = status;
  }

  const { error } = await supabase
    .from('projects')
    .update(updateData)
    .eq('id', id);

  if (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}

// Update just the status of a project
export async function updateProjectStatus(
  id: string,
  status: 'draft' | 'sent' | 'completed'
): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Error updating project status:', error);
    throw error;
  }
}

// Rename a project
export async function renameProject(id: string, name: string): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .update({ name })
    .eq('id', id);

  if (error) {
    console.error('Error renaming project:', error);
    throw error;
  }
}

// Delete a project
export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

// Search projects by customer name
export async function searchProjects(query: string): Promise<ProjectSummary[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('id, name, customer_name, status, created_at, updated_at, project_data, folder_id')
    .ilike('customer_name', `%${query}%`)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error searching projects:', error);
    throw error;
  }

  return (data || []).map(p => mapToSummary(p as Record<string, unknown>));
}

// Duplicate a project
export async function duplicateProject(id: string, customName?: string, folderId?: string | null): Promise<string> {
  const original = await getProject(id);
  if (!original) throw new Error('Project not found');

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Must be logged in');

  const insertData: Record<string, unknown> = {
    user_id: userData.user.id,
    name: customName || `${original.name} (Copy)`,
    customer_name: original.customerName || '',
    project_data: serializeProposal(original.projectData),
    status: 'draft',
    folder_id: folderId !== undefined ? folderId : (original.folderId || null),
  };

  const { data, error } = await supabase
    .from('projects')
    .insert(insertData)
    .select('id')
    .single();

  if (error) {
    console.error('Error duplicating project:', error);
    throw error;
  }

  return data.id;
}

// Move a project to a folder
export async function moveProjectToFolder(projectId: string, folderId: string | null): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .update({ folder_id: folderId })
    .eq('id', projectId);

  if (error) {
    console.error('Error moving project:', error);
    throw error;
  }
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
  const { data, error } = await supabase
    .from('folders')
    .select('id, name, parent_id, created_at')
    .order('name');

  if (error) {
    // If folders table doesn't exist yet, return empty
    if (error.code === '42P01') return [];
    console.error('Error fetching folders:', error);
    throw error;
  }

  return (data || []).map(f => ({
    id: f.id,
    name: f.name,
    parentId: f.parent_id,
    createdAt: f.created_at,
  }));
}

// Create a folder
export async function createFolder(name: string, parentId: string | null = null): Promise<string> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Must be logged in');

  const { data, error } = await supabase
    .from('folders')
    .insert({
      user_id: userData.user.id,
      name,
      parent_id: parentId,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating folder:', error);
    throw error;
  }

  return data.id;
}

// Rename a folder
export async function renameFolder(id: string, name: string): Promise<void> {
  const { error } = await supabase
    .from('folders')
    .update({ name })
    .eq('id', id);

  if (error) {
    console.error('Error renaming folder:', error);
    throw error;
  }
}

// Delete a folder (projects in it become unfoldered)
export async function deleteFolder(id: string): Promise<void> {
  // Move all projects in this folder to root
  await supabase.from('projects').update({ folder_id: null }).eq('folder_id', id);
  // Move all subfolders to parent (or root)
  const { data: folder } = await supabase.from('folders').select('parent_id').eq('id', id).single();
  await supabase.from('folders').update({ parent_id: folder?.parent_id || null }).eq('parent_id', id);
  // Delete the folder
  const { error } = await supabase.from('folders').delete().eq('id', id);
  if (error) {
    console.error('Error deleting folder:', error);
    throw error;
  }
}
