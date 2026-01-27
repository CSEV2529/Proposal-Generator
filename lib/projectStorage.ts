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
  status: 'draft' | 'sent' | 'accepted' | 'completed';
  createdAt: string;
  updatedAt: string;
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

// Get all projects for the current user
export async function getProjects(): Promise<ProjectSummary[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('id, name, customer_name, status, created_at, updated_at, project_data')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }

  return (data || []).map(p => ({
    id: p.id,
    name: p.name,
    customerName: p.customer_name || '',
    customerAddress: formatAddress(p.project_data as Record<string, unknown>),
    status: p.status,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  }));
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

  return {
    id: data.id,
    name: data.name,
    customerName: data.customer_name || '',
    customerAddress: formatAddress(data.project_data as Record<string, unknown>),
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    projectData: deserializeProposal(data.project_data as Record<string, unknown>),
  };
}

// Save a new project
export async function createProject(
  name: string,
  proposal: Proposal
): Promise<string> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('Must be logged in to save projects');
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: userData.user.id,
      name: name,
      customer_name: proposal.customerName || '',
      project_data: serializeProposal(proposal),
      status: 'draft',
    })
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
  status?: 'draft' | 'sent' | 'accepted' | 'completed'
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
    .select('id, name, customer_name, status, created_at, updated_at, project_data')
    .ilike('customer_name', `%${query}%`)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error searching projects:', error);
    throw error;
  }

  return (data || []).map(p => ({
    id: p.id,
    name: p.name,
    customerName: p.customer_name || '',
    customerAddress: formatAddress(p.project_data as Record<string, unknown>),
    status: p.status,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  }));
}
