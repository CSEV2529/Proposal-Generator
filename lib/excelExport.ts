import { Proposal, InstallationItem, ProjectType } from './types';
import { LABOR_RATE_PER_HOUR } from './constants';

// Helper to determine charging level from project type
function getChargingLevelFromProjectType(projectType: ProjectType): 'level2' | 'dcfc' {
  switch (projectType) {
    case 'level3-epc':
      return 'dcfc';
    case 'level2-epc':
    case 'mixed-epc':
    case 'site-host':
    case 'level2-site-host':
    case 'distribution':
    default:
      return 'level2';
  }
}

// Cell mappings for National Grid Make-Ready sheet
// Format: { category: { laborRow, materialRow } }
// Columns: D=Qty, F=Rate, G=Price (0-indexed: D=3, F=5, G=6)
const NATIONAL_GRID_CELL_MAP: { [category: string]: { laborRow?: number; materialRow?: number; feesRow?: number } } = {
  'Permits': { laborRow: 21, feesRow: 22 },
  'Design': { laborRow: 23, materialRow: 24 },
  'Professional Services': { laborRow: 25 },
  'Equipment/Rentals': { laborRow: 26, materialRow: 27 },
  'Trenching': { laborRow: 28, materialRow: 29 },
  'Transformer (if applicable)': { laborRow: 30, materialRow: 31 },
  'Site Work (concrete pads, etc.)': { laborRow: 32, materialRow: 33 },
  'Panels': { laborRow: 34, materialRow: 35 },
  'Breakers': { laborRow: 36, materialRow: 37 },
  'Switch Gear': { laborRow: 38, materialRow: 39 },
  'Conduit': { laborRow: 40, materialRow: 41 },
  'Cables/Wiring': { laborRow: 42, materialRow: 43 },
  'Site Restoration': { laborRow: 44, materialRow: 45 },
  'Other': { laborRow: 46, materialRow: 47 },
};

// Cell mappings for NYSEG/RG&E sheets (L2 costs and DCFC costs have same structure)
// Columns: E=Material, F=Labor (Total in G is likely a formula)
// Row numbers are 1-indexed (Excel rows)
const NYSEG_RGE_CELL_MAP: { [category: string]: number } = {
  'Electrical Panel/Breakers': 25,
  'Service Boards': 26,
  'Meter Provision (if separate from panel)': 27,
  'Permitting Costs': 28,
  'Design Costs': 29,
  'Trenching/Restoration': 30,
  'Conduit & Cable': 31,
  'Transformers': 32,
  'Pads/Foundations': 33,
  'Other [please describe]': 34,
};

// EVSE price row for NYSEG/RG&E
const NYSEG_RGE_EVSE_ROW = 42;

// National Grid category mapping (same as in EstimateDocument)
const NATIONAL_GRID_ITEM_MAP: { [itemId: string]: string } = {
  'project-management': 'Professional Services',
  'permit-fee': 'Permits',
  'design-fee': 'Design',
  'engineering-site': 'Design',
  'engineering-full': 'Design',
};

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

// NYSEG/RG&E category mapping
const NYSEG_RGE_ITEM_MAP: { [itemId: string]: string } = {
  'permit-fee': 'Permitting Costs',
  'design-fee': 'Design Costs',
  'engineering-site': 'Design Costs',
  'engineering-full': 'Design Costs',
  'project-management': 'Design Costs',
};

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

function getNationalGridCategory(item: InstallationItem): string {
  if (NATIONAL_GRID_ITEM_MAP[item.itemId]) {
    return NATIONAL_GRID_ITEM_MAP[item.itemId];
  }
  return NATIONAL_GRID_SUBGROUP_MAP[item.subgroup] || 'Other';
}

function getNYSEGRGECategory(item: InstallationItem): string {
  if (NYSEG_RGE_ITEM_MAP[item.itemId]) {
    return NYSEG_RGE_ITEM_MAP[item.itemId];
  }
  return NYSEG_RGE_SUBGROUP_MAP[item.subgroup] || 'Other [please describe]';
}

export interface ExcelExportData {
  utilityType: 'national-grid' | 'nyseg-rge';
  utilityLabel?: string; // Display name for filename (e.g. "National Grid", "NYSEG", "RG&E")
  chargingLevel: 'level2' | 'dcfc';
  customerName: string;
  siteAddress: string;
  siteCity: string;
  siteState: string;
  siteZip: string;
  numPlugs: number;
  numStations: number;
  // EVSE info
  evsePrice?: number;
  evseModel?: string;
  evsePartNumber?: string;
  evseQuantity?: number;
  evseUnitPrice?: number;
  // Network plan info
  networkPlanQty?: number;
  networkPlanUnitPrice?: number;
  networkPlanTotal?: number;
  // Shipping
  shippingCost?: number;
  shippingAndNetworkCost?: number;
  // Quantities for NYSEG/RG&E
  trenchingQty?: number;
  conduitQty?: number;
  cablesQty?: number;
  categories: {
    [category: string]: {
      laborCost: number;
      laborHours: number;
      materialCost: number;
    };
  };
}

export function prepareNationalGridExport(proposal: Proposal): ExcelExportData {
  const categories: ExcelExportData['categories'] = {};

  // Initialize all categories
  Object.keys(NATIONAL_GRID_CELL_MAP).forEach(cat => {
    categories[cat] = { laborCost: 0, laborHours: 0, materialCost: 0 };
  });

  // Calculate markup factor to convert pricebook costs to quoted prices
  // quotedPrice = pricebookTotal * costBasisPercent / (1 - marginPercent/100)
  const costBasis = proposal.csmrCostBasisPercent / 100;
  const marginMultiplier = 1 / (1 - proposal.csmrMarginPercent / 100);
  const markupFactor = costBasis * marginMultiplier;

  // Aggregate costs by category (applying markup to get quoted prices)
  proposal.installationItems.forEach(item => {
    const category = getNationalGridCategory(item);
    // Apply markup factor to get quoted prices
    const quotedMaterial = item.totalMaterial * markupFactor;
    const quotedLabor = item.totalLabor * markupFactor;

    if (!categories[category]) {
      categories[category] = { laborCost: 0, laborHours: 0, materialCost: 0 };
    }
    categories[category].laborCost += quotedLabor;
    categories[category].laborHours += item.totalLabor / LABOR_RATE_PER_HOUR;
    categories[category].materialCost += quotedMaterial;
  });

  // Calculate total plugs, stations, and EVSE info
  let numPlugs = 0;
  let numStations = 0;
  let evseQuantity = 0;
  let evseUnitPrice = 0;
  let evsePartNumber = '';

  proposal.evseItems.forEach(item => {
    numStations += item.quantity;
    evseQuantity += item.quantity;
    // Estimate plugs based on product type (dual port = 2, single = 1)
    const isDualPort = item.productId.includes('-dp-') || item.productId.includes('dchp');
    numPlugs += item.quantity * (isDualPort ? 2 : 1);
    // Use first item's info for part number and unit price
    if (!evsePartNumber && item.productId) {
      evsePartNumber = item.productId;
      evseUnitPrice = item.unitPrice;
    }
  });

  // Calculate network plan info
  // networkPlanCost is total, need to figure out qty and unit price
  // networkYears determines which plan pricing to use
  const networkPlanQty = numStations; // One plan per station
  const networkPlanTotal = proposal.networkPlanCost || 0;
  const networkPlanUnitPrice = networkPlanQty > 0 ? networkPlanTotal / networkPlanQty : 0;

  return {
    utilityType: 'national-grid',
    utilityLabel: 'National Grid',
    chargingLevel: getChargingLevelFromProjectType(proposal.projectType),
    customerName: proposal.customerName || '',
    siteAddress: proposal.customerAddress || '',
    siteCity: proposal.customerCity || '',
    siteState: proposal.customerState || '',
    siteZip: proposal.customerZip || '',
    numPlugs,
    numStations,
    evsePartNumber,
    evseQuantity,
    evseUnitPrice,
    evsePrice: proposal.evseQuotedPrice,
    networkPlanQty,
    networkPlanUnitPrice,
    networkPlanTotal,
    shippingCost: proposal.shippingCost || 0,
    categories,
  };
}

export function prepareNYSEGRGEExport(proposal: Proposal): ExcelExportData {
  const categories: ExcelExportData['categories'] = {};

  // Initialize all categories
  Object.keys(NYSEG_RGE_CELL_MAP).forEach(cat => {
    categories[cat] = { laborCost: 0, laborHours: 0, materialCost: 0 };
  });

  // Calculate markup factor to convert pricebook costs to quoted prices
  // quotedPrice = pricebookTotal * costBasisPercent / (1 - marginPercent/100)
  const costBasis = proposal.csmrCostBasisPercent / 100;
  const marginMultiplier = 1 / (1 - proposal.csmrMarginPercent / 100);
  const markupFactor = costBasis * marginMultiplier;

  // Aggregate costs by category (applying markup to get quoted prices)
  proposal.installationItems.forEach(item => {
    const category = getNYSEGRGECategory(item);
    // Apply markup factor to get quoted prices
    const quotedMaterial = item.totalMaterial * markupFactor;
    const quotedLabor = item.totalLabor * markupFactor;

    if (!categories[category]) {
      // Item mapped to unknown category - put in Other
      categories['Other [please describe]'].laborCost += quotedLabor;
      categories['Other [please describe]'].laborHours += item.totalLabor / LABOR_RATE_PER_HOUR;
      categories['Other [please describe]'].materialCost += quotedMaterial;
    } else {
      categories[category].laborCost += quotedLabor;
      categories[category].laborHours += item.totalLabor / LABOR_RATE_PER_HOUR;
      categories[category].materialCost += quotedMaterial;
    }
  });

  // Calculate total plugs and stations
  let numPlugs = 0;
  let numStations = 0;
  const evseModels: string[] = [];
  proposal.evseItems.forEach(item => {
    numStations += item.quantity;
    const isDualPort = item.productId.includes('-dp-') || item.productId.includes('dchp');
    numPlugs += item.quantity * (isDualPort ? 2 : 1);
    if (item.name && !evseModels.includes(item.name)) {
      evseModels.push(item.name);
    }
  });

  // Calculate quantities for specific subgroups
  let trenchingQty = 0;
  let conduitQty = 0;
  let cablesQty = 0;
  proposal.installationItems.forEach(item => {
    if (item.subgroup === 'Trenching') {
      trenchingQty += item.quantity;
    } else if (item.subgroup === 'Conduit') {
      conduitQty += item.quantity;
    } else if (item.subgroup === 'Cables') {
      cablesQty += item.quantity;
    }
  });

  return {
    utilityType: 'nyseg-rge',
    chargingLevel: getChargingLevelFromProjectType(proposal.projectType),
    customerName: proposal.customerName || '',
    siteAddress: proposal.customerAddress || '',
    siteCity: proposal.customerCity || '',
    siteState: proposal.customerState || '',
    siteZip: proposal.customerZip || '',
    numPlugs,
    numStations,
    evsePrice: proposal.evseQuotedPrice,
    evseModel: evseModels.join(', '),
    shippingAndNetworkCost: (proposal.shippingCost || 0) + (proposal.networkPlanCost || 0),
    trenchingQty,
    conduitQty,
    cablesQty,
    categories,
  };
}

// Export the cell mappings for use by the API route
export { NATIONAL_GRID_CELL_MAP, NYSEG_RGE_CELL_MAP, NYSEG_RGE_EVSE_ROW, LABOR_RATE_PER_HOUR };
