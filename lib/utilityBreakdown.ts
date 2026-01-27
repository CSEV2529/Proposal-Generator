import { Proposal, InstallationItem } from './types';
import { LABOR_RATE_PER_HOUR } from './constants';

// National Grid category structure
export interface UtilityBreakdownCategory {
  name: string;
  laborHours: number;
  laborCost: number;
  materialCost: number;
  totalCost: number;
  notes?: string;
}

export interface UtilityBreakdown {
  utilityId: string;
  utilityName: string;
  categories: UtilityBreakdownCategory[];
  totalLaborCost: number;
  totalMaterialCost: number;
  totalEligibleCost: number;
}

// Mapping from specific item IDs to National Grid categories (takes precedence)
const NATIONAL_GRID_ITEM_MAP: { [itemId: string]: string } = {
  'project-management': 'Professional Services',
  'permit-fee': 'Permits',
  'design-fee': 'Design',
  'engineering-site': 'Design',
  'engineering-full': 'Design',
};

// Mapping from our subgroups to National Grid categories (fallback)
const NATIONAL_GRID_SUBGROUP_MAP: { [subgroup: string]: string } = {
  'Permits': 'Permits',
  'Design': 'Design',
  'Transformers': 'Transformer (if applicable)',
  'Trenching': 'Trenching',
  'Civil - Bases': 'Site Work (concrete pads, etc.)',
  'Panels': 'Panels',
  'Panels/Switchgear - New Service': 'Switch Gear',
  'Breakers': 'Breakers',
  'Conduit': 'Conduit',
  'Cables': 'Cables/Wiring',
  'Striping': 'Site Restoration',
};

// National Grid categories in order
const NATIONAL_GRID_CATEGORIES = [
  'Permits',
  'Design',
  'Professional Services',
  'Equipment/Rentals',
  'Trenching',
  'Transformer (if applicable)',
  'Site Work (concrete pads, etc.)',
  'Panels',
  'Breakers',
  'Switch Gear',
  'Conduit',
  'Cables/Wiring',
  'Site Restoration',
  'Other',
];

// Calculate labor hours from labor cost
function laborCostToHours(laborCost: number): number {
  return laborCost / LABOR_RATE_PER_HOUR;
}

// Get National Grid category for an installation item
function getNationalGridCategory(item: InstallationItem): string {
  // Check item-specific mapping first
  if (NATIONAL_GRID_ITEM_MAP[item.itemId]) {
    return NATIONAL_GRID_ITEM_MAP[item.itemId];
  }
  // Fall back to subgroup mapping
  return NATIONAL_GRID_SUBGROUP_MAP[item.subgroup] || 'Other';
}

// Generate National Grid breakdown from proposal
export function generateNationalGridBreakdown(proposal: Proposal): UtilityBreakdown {
  // Initialize categories with zero values
  const categoryTotals: { [category: string]: { labor: number; material: number } } = {};
  NATIONAL_GRID_CATEGORIES.forEach(cat => {
    categoryTotals[cat] = { labor: 0, material: 0 };
  });

  // Map installation items to categories
  proposal.installationItems.forEach(item => {
    const category = getNationalGridCategory(item);
    categoryTotals[category].labor += item.totalLabor;
    categoryTotals[category].material += item.totalMaterial;
  });

  // Build category breakdown
  const categories: UtilityBreakdownCategory[] = NATIONAL_GRID_CATEGORIES.map(categoryName => {
    const totals = categoryTotals[categoryName];
    const laborHours = laborCostToHours(totals.labor);
    return {
      name: categoryName,
      laborHours: Math.round(laborHours * 10) / 10, // Round to 1 decimal
      laborCost: totals.labor,
      materialCost: totals.material,
      totalCost: totals.labor + totals.material,
    };
  });

  // Calculate totals
  const totalLaborCost = categories.reduce((sum, cat) => sum + cat.laborCost, 0);
  const totalMaterialCost = categories.reduce((sum, cat) => sum + cat.materialCost, 0);

  return {
    utilityId: 'national-grid',
    utilityName: 'National Grid',
    categories,
    totalLaborCost,
    totalMaterialCost,
    totalEligibleCost: totalLaborCost + totalMaterialCost,
  };
}

// ============================================================
// NYSEG & RG&E Configuration
// ============================================================

// Mapping from specific item IDs to NYSEG/RG&E categories (takes precedence)
const NYSEG_RGE_ITEM_MAP: { [itemId: string]: string } = {
  'permit-fee': 'Permitting Costs',
  'design-fee': 'Design Costs',
  'engineering-site': 'Design Costs',
  'engineering-full': 'Design Costs',
  'project-management': 'Design Costs',
};

// Mapping from our subgroups to NYSEG/RG&E categories (fallback)
const NYSEG_RGE_SUBGROUP_MAP: { [subgroup: string]: string } = {
  'Panels': 'Electrical Panel/Breakers',
  'Breakers': 'Electrical Panel/Breakers',
  'Panels/Switchgear - New Service': 'Service Boards',
  'Permits': 'Permitting Costs',
  'Design': 'Design Costs',
  'Trenching': 'Trenching/Restoration',
  'Striping': 'Trenching/Restoration',
  'Conduit': 'Conduit & Cable',
  'Cables': 'Conduit & Cable',
  'Transformers': 'Transformers',
  'Civil - Bases': 'Pads/Foundations',
};

// NYSEG/RG&E categories in order
const NYSEG_RGE_CATEGORIES = [
  'Electrical Panel/Breakers',
  'Service Boards',
  'Meter Provision (if separate from panel)',
  'Permitting Costs',
  'Design Costs',
  'Trenching/Restoration',
  'Conduit & Cable',
  'Transformers',
  'Pads/Foundations',
  'Other [please describe]',
];

// Get NYSEG/RG&E category for an installation item
function getNYSEGRGECategory(item: InstallationItem): string {
  // Check item-specific mapping first
  if (NYSEG_RGE_ITEM_MAP[item.itemId]) {
    return NYSEG_RGE_ITEM_MAP[item.itemId];
  }
  // Fall back to subgroup mapping
  return NYSEG_RGE_SUBGROUP_MAP[item.subgroup] || 'Other [please describe]';
}

// Generate NYSEG/RG&E breakdown from proposal
export function generateNYSEGRGEBreakdown(proposal: Proposal): UtilityBreakdown {
  // Initialize categories with zero values
  const categoryTotals: { [category: string]: { labor: number; material: number } } = {};
  NYSEG_RGE_CATEGORIES.forEach(cat => {
    categoryTotals[cat] = { labor: 0, material: 0 };
  });

  // Map installation items to categories
  proposal.installationItems.forEach(item => {
    const category = getNYSEGRGECategory(item);
    categoryTotals[category].labor += item.totalLabor;
    categoryTotals[category].material += item.totalMaterial;
  });

  // Build category breakdown
  const categories: UtilityBreakdownCategory[] = NYSEG_RGE_CATEGORIES.map(categoryName => {
    const totals = categoryTotals[categoryName];
    const laborHours = laborCostToHours(totals.labor);
    return {
      name: categoryName,
      laborHours: Math.round(laborHours * 10) / 10, // Round to 1 decimal
      laborCost: totals.labor,
      materialCost: totals.material,
      totalCost: totals.labor + totals.material,
    };
  });

  // Calculate totals
  const totalLaborCost = categories.reduce((sum, cat) => sum + cat.laborCost, 0);
  const totalMaterialCost = categories.reduce((sum, cat) => sum + cat.materialCost, 0);

  // Determine utility name based on proposal
  const utilityName = proposal.utilityId === 'rge' ? 'Rochester Gas & Electric' : 'NYSEG';

  return {
    utilityId: proposal.utilityId || 'nyseg',
    utilityName,
    categories,
    totalLaborCost,
    totalMaterialCost,
    totalEligibleCost: totalLaborCost + totalMaterialCost,
  };
}

// ============================================================
// Generic Utility Breakdown Generator
// ============================================================

// Generic function to get utility breakdown based on utility ID
export function generateUtilityBreakdown(proposal: Proposal): UtilityBreakdown | null {
  if (!proposal.utilityId) {
    return null;
  }

  // Map utility IDs to breakdown generators
  switch (proposal.utilityId) {
    case 'national-grid':
    case 'national-grid-ma':
      return generateNationalGridBreakdown(proposal);

    case 'nyseg':
    case 'rge':
      return generateNYSEGRGEBreakdown(proposal);

    // Add other utilities here as we build them
    // case 'central-hudson':
    //   return generateCentralHudsonBreakdown(proposal);

    default:
      // Return National Grid format as default for now
      return generateNationalGridBreakdown(proposal);
  }
}

// Export breakdown to format suitable for Excel/PDF
export function formatBreakdownForExport(breakdown: UtilityBreakdown) {
  return {
    utility: breakdown.utilityName,
    categories: breakdown.categories.filter(cat => cat.totalCost > 0).map(cat => ({
      category: cat.name,
      laborHours: cat.laborHours,
      laborCost: cat.laborCost,
      materialCost: cat.materialCost,
      total: cat.totalCost,
    })),
    summary: {
      totalLabor: breakdown.totalLaborCost,
      totalMaterial: breakdown.totalMaterialCost,
      totalEligible: breakdown.totalEligibleCost,
    },
  };
}
