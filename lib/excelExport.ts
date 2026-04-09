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

// Cell mappings for Central Hudson "Sheet1"
// Rows: D=Material Total, E=Labor Total, F=D+E formula
const CENTRAL_HUDSON_CELL_MAP: { [category: string]: number } = {
  'Transformers': 31,
  'Panel & Service Boards': 32,
  'Conduit & Cable': 33,
  'Trenching': 34,
  'Permits': 35,
  'Design Costs': 36,
  'Other': 37,
};

// Central Hudson ineligible rows (column D only)
const CENTRAL_HUDSON_EVSE_ROW = 47;
const CENTRAL_HUDSON_INSTALLATION_ROW = 48;
const CENTRAL_HUDSON_NETWORKING_ROW = 51;
const CENTRAL_HUDSON_FREIGHT_ROW = 54;

// Central Hudson category mapping
const CENTRAL_HUDSON_ITEM_MAP: { [itemId: string]: string } = {
  'permit-fee': 'Permits',
  'design-fee': 'Design Costs',
  'engineering-site': 'Design Costs',
  'engineering-full': 'Design Costs',
  'project-management': 'Design Costs',
};

const CENTRAL_HUDSON_SUBGROUP_MAP: { [subgroup: string]: string } = {
  'Permits': 'Permits',
  'Design': 'Design Costs',
  'Transformers': 'Transformers',
  'Trenching': 'Trenching',
  'Civil - Bases': 'Other',
  'Panels': 'Panel & Service Boards',
  'Panels/Switchgear - New Service': 'Panel & Service Boards',
  'Breakers': 'Panel & Service Boards',
  'Conduit': 'Conduit & Cable',
  'Cables': 'Conduit & Cable',
  'Striping': 'Other',
};

function getCentralHudsonCategory(item: InstallationItem): string {
  if (CENTRAL_HUDSON_ITEM_MAP[item.itemId]) {
    return CENTRAL_HUDSON_ITEM_MAP[item.itemId];
  }
  return CENTRAL_HUDSON_SUBGROUP_MAP[item.subgroup] || 'Other';
}

// Cell mappings for Eversource MA "Estimate" sheet
// Columns: E=qty, F=unit price, G=material total (formula E*F), H=labor total, J=total cost (formula G+H)
const EVERSOURCE_MA_CELL_MAP: { [category: string]: number } = {
  'Design/Engineering': 10,
  'Permitting': 11,
  'Trenching continuously paved': 13,
  'Trenching non-continuously paved': 14,
  'Conduit underground': 15,
  'Conduit above ground': 16,
  'Protective Bollards': 17,
  'Handholes/Manholes': 18,
  'Concrete Work/Bases/Pads': 19,
  'Distribution Equipment/panels/breakers': 20,
  'Metering Equipment': 21,
  'Other': 22,
};

// Eversource MA EVSE rows
const EVERSOURCE_MA_HARDWARE1_ROW = 30;
const EVERSOURCE_MA_HARDWARE2_ROW = 31;
const EVERSOURCE_MA_FREIGHT_ROW = 32;
const EVERSOURCE_MA_NETWORKING_ROW = 36;

// Eversource MA category mapping — uses item ID for granular routing
const EVERSOURCE_MA_ITEM_MAP: { [itemId: string]: string } = {
  'permit-fee': 'Permitting',
  'design-fee': 'Design/Engineering',
  'engineering-site': 'Design/Engineering',
  'engineering-full': 'Design/Engineering',
  'project-management': 'Design/Engineering',
  // Trenching: grass = non-continuously paved, asphalt/concrete/boring = continuously paved
  'trenching-grass': 'Trenching non-continuously paved',
  'trenching-asphalt': 'Trenching continuously paved',
  'trenching-concrete': 'Trenching continuously paved',
  'underground-boring': 'Trenching continuously paved',
  // Conduit: hand-hole goes to Handholes/Manholes, fittings costs go to Conduit but no qty
  'hand-hole': 'Handholes/Manholes',
  'conduit-fittings': 'Conduit underground',
  // Civil - Bases: split bollards vs concrete footings
  'bollard-bolt-on': 'Protective Bollards',
  'bollard-4in-steel': 'Protective Bollards',
  'bollard-6in-steel': 'Protective Bollards',
  'concrete-l2-footing': 'Concrete Work/Bases/Pads',
  'concrete-dcfc-footing': 'Concrete Work/Bases/Pads',
  'concrete-service-pad': 'Concrete Work/Bases/Pads',
  'tire-stop': 'Other',
};

const EVERSOURCE_MA_SUBGROUP_MAP: { [subgroup: string]: string } = {
  'Permits': 'Permitting',
  'Design': 'Design/Engineering',
  'Transformers': 'Distribution Equipment/panels/breakers',
  'Trenching': 'Trenching continuously paved',
  'Civil - Bases': 'Concrete Work/Bases/Pads',
  'Panels': 'Distribution Equipment/panels/breakers',
  'Panels/Switchgear - New Service': 'Distribution Equipment/panels/breakers',
  'Breakers': 'Distribution Equipment/panels/breakers',
  'Conduit': 'Conduit underground',
  'Cables': 'Conduit underground',
  'Striping': 'Other',
};

function getEversourceMACategory(item: InstallationItem): string {
  // Item-level mapping takes precedence
  if (EVERSOURCE_MA_ITEM_MAP[item.itemId]) {
    return EVERSOURCE_MA_ITEM_MAP[item.itemId];
  }
  return EVERSOURCE_MA_SUBGROUP_MAP[item.subgroup] || 'Other';
}

// Cell mappings for National Grid MA "Estimate" sheet
// Columns: D=qty, E=material total, F=labor total, G=total cost (formula E+F)
const NATIONAL_GRID_MA_CELL_MAP: { [category: string]: number } = {
  'Design/Engineering/Permitting': 10,
  'Trenching continuously paved': 12,
  'Trenching non-continuously paved': 13,
  'Conduit & Cable': 14,
  'Protective Bollards': 15,
  'Handholes/Manholes': 16,
  'Concrete Work/Bases/Pads': 17,
  'Panels/Service Board/Breakers': 18,
  'Other': 19,
};

// National Grid MA EVSE rows (column E)
const NATIONAL_GRID_MA_HARDWARE1_ROW = 27;
const NATIONAL_GRID_MA_HARDWARE2_ROW = 28;
const NATIONAL_GRID_MA_FREIGHT_ROW = 29;
const NATIONAL_GRID_MA_NETWORKING_ROW = 32;

// National Grid MA category mapping
const NATIONAL_GRID_MA_ITEM_MAP: { [itemId: string]: string } = {
  'permit-fee': 'Design/Engineering/Permitting',
  'design-fee': 'Design/Engineering/Permitting',
  'engineering-site': 'Design/Engineering/Permitting',
  'engineering-full': 'Design/Engineering/Permitting',
  'project-management': 'Design/Engineering/Permitting',
};

const NATIONAL_GRID_MA_SUBGROUP_MAP: { [subgroup: string]: string } = {
  'Permits': 'Design/Engineering/Permitting',
  'Design': 'Design/Engineering/Permitting',
  'Transformers': 'Other',
  'Trenching': 'Trenching continuously paved',
  'Civil - Bases': 'Concrete Work/Bases/Pads',
  'Panels': 'Panels/Service Board/Breakers',
  'Panels/Switchgear - New Service': 'Panels/Service Board/Breakers',
  'Breakers': 'Panels/Service Board/Breakers',
  'Conduit': 'Conduit & Cable',
  'Cables': 'Conduit & Cable',
  'Striping': 'Other',
};

function getNationalGridMACategory(item: InstallationItem): string {
  if (NATIONAL_GRID_MA_ITEM_MAP[item.itemId]) {
    return NATIONAL_GRID_MA_ITEM_MAP[item.itemId];
  }
  return NATIONAL_GRID_MA_SUBGROUP_MAP[item.subgroup] || 'Other';
}

// Cell mappings for Seattle City Light "Cost Template" sheet
// Material rows: F=qty, G=unit cost, H=total (formula F*G)
const SEATTLE_MATERIAL_CELL_MAP: { [category: string]: number } = {
  'Chargers/Outlets': 32,
  'Conduit & Cable': 33,
  'Panel & Service Boards': 34,
  'Trenching & Wall Coring': 36,
  'Permits': 37,
  'Freight': 41,
  'EV Signage': 43,
  'Striping/Painting': 47,
};

// Labor rows: F=hours, G=hourly rate ($125), H=total (formula F*G)
const SEATTLE_LABOR_CELL_MAP: { [category: string]: number } = {
  'Engineering & Design': 57,
  'Charger Installation': 58,
  'Project Management': 59,
};

// Networking row
const SEATTLE_NETWORKING_ROW = 38;

// Seattle City Light category mapping (maps to material categories)
const SEATTLE_ITEM_MAP: { [itemId: string]: { material?: string; labor?: string } } = {
  'permit-fee': { material: 'Permits' },
  'design-fee': { labor: 'Engineering & Design' },
  'engineering-site': { labor: 'Engineering & Design' },
  'engineering-full': { labor: 'Engineering & Design' },
  'project-management': { labor: 'Project Management' },
};

const SEATTLE_SUBGROUP_MAP: { [subgroup: string]: { material?: string; labor?: string } } = {
  'Permits': { material: 'Permits' },
  'Design': { labor: 'Engineering & Design' },
  'Transformers': { material: 'Panel & Service Boards' },
  'Trenching': { material: 'Trenching & Wall Coring' },
  'Civil - Bases': { material: 'Trenching & Wall Coring' },
  'Panels': { material: 'Panel & Service Boards' },
  'Panels/Switchgear - New Service': { material: 'Panel & Service Boards' },
  'Breakers': { material: 'Panel & Service Boards' },
  'Conduit': { material: 'Conduit & Cable' },
  'Cables': { material: 'Conduit & Cable' },
  'Striping': { material: 'Striping/Painting' },
};

function getSeattleCategoryMapping(item: InstallationItem): { material?: string; labor?: string } {
  if (SEATTLE_ITEM_MAP[item.itemId]) {
    return SEATTLE_ITEM_MAP[item.itemId];
  }
  return SEATTLE_SUBGROUP_MAP[item.subgroup] || { material: 'Conduit & Cable' };
}

export interface ExcelExportData {
  utilityType: 'national-grid' | 'nyseg-rge' | 'central-hudson' | 'eversource-ma' | 'national-grid-ma' | 'seattle-city-light';
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
  // National Grid project info
  trenchingFeet?: number;
  // Quantities for NYSEG/RG&E
  trenchingQty?: number;
  conduitQty?: number;
  cablesQty?: number;
  categories: {
    [category: string]: {
      laborCost: number;
      laborHours: number;
      materialCost: number;
      quantity: number;
    };
  };
  // Item descriptions per category for "Specify" notes columns
  categoryNotes?: { [category: string]: string };
}

export function prepareNationalGridExport(proposal: Proposal): ExcelExportData {
  const categories: ExcelExportData['categories'] = {};

  // Initialize all categories
  Object.keys(NATIONAL_GRID_CELL_MAP).forEach(cat => {
    categories[cat] = { laborCost: 0, laborHours: 0, materialCost: 0, quantity: 0 };
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
      categories[category] = { laborCost: 0, laborHours: 0, materialCost: 0, quantity: 0 };
    }
    categories[category].laborCost += quotedLabor;
    categories[category].laborHours += item.totalLabor / LABOR_RATE_PER_HOUR;
    categories[category].materialCost += quotedMaterial;
    // Track quantities per category for material row D column
    // Conduit & Cables/Wiring: only count per-foot items (exclude fittings, hand holes, mounting, etc.)
    // Trenching: always qty 1 if any trenching exists
    // All others: sum quantities of items that have material cost
    if (item.materialPrice > 0) {
      if (category === 'Conduit' || category === 'Cables/Wiring') {
        if (item.unit === 'ft') {
          categories[category].quantity += item.quantity;
        }
      } else if (category === 'Trenching') {
        categories[category].quantity = 1;
      } else {
        categories[category].quantity += item.quantity;
      }
    }
  });

  // Calculate total trenching feet across all trenching items
  let trenchingFeet = 0;
  proposal.installationItems.forEach(item => {
    if (item.subgroup === 'Trenching' && item.unit === 'ft') {
      trenchingFeet += item.quantity;
    }
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
    trenchingFeet,
    categories,
  };
}

export function prepareNYSEGRGEExport(proposal: Proposal): ExcelExportData {
  const categories: ExcelExportData['categories'] = {};

  // Initialize all categories
  Object.keys(NYSEG_RGE_CELL_MAP).forEach(cat => {
    categories[cat] = { laborCost: 0, laborHours: 0, materialCost: 0, quantity: 0 };
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
      if (item.materialPrice > 0) {
        categories['Other [please describe]'].quantity += item.quantity;
      }
    } else {
      categories[category].laborCost += quotedLabor;
      categories[category].laborHours += item.totalLabor / LABOR_RATE_PER_HOUR;
      categories[category].materialCost += quotedMaterial;
      if (item.materialPrice > 0) {
        categories[category].quantity += item.quantity;
      }
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

export function prepareCentralHudsonExport(proposal: Proposal): ExcelExportData {
  const categories: ExcelExportData['categories'] = {};

  // Initialize all categories
  Object.keys(CENTRAL_HUDSON_CELL_MAP).forEach(cat => {
    categories[cat] = { laborCost: 0, laborHours: 0, materialCost: 0, quantity: 0 };
  });

  // Calculate markup factor
  const costBasis = proposal.csmrCostBasisPercent / 100;
  const marginMultiplier = 1 / (1 - proposal.csmrMarginPercent / 100);
  const markupFactor = costBasis * marginMultiplier;

  // Aggregate costs by category (applying markup to get quoted prices)
  proposal.installationItems.forEach(item => {
    const category = getCentralHudsonCategory(item);
    const quotedMaterial = item.totalMaterial * markupFactor;
    const quotedLabor = item.totalLabor * markupFactor;

    if (!categories[category]) {
      categories['Other'].laborCost += quotedLabor;
      categories['Other'].laborHours += item.totalLabor / LABOR_RATE_PER_HOUR;
      categories['Other'].materialCost += quotedMaterial;
      if (item.materialPrice > 0) {
        categories['Other'].quantity += item.quantity;
      }
    } else {
      categories[category].laborCost += quotedLabor;
      categories[category].laborHours += item.totalLabor / LABOR_RATE_PER_HOUR;
      categories[category].materialCost += quotedMaterial;
      if (item.materialPrice > 0) {
        categories[category].quantity += item.quantity;
      }
    }
  });

  // Calculate total plugs, stations, and EVSE info
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

  // Sum total installation cost for the "Station Installation" ineligible line
  let totalInstallationCost = 0;
  Object.values(categories).forEach(cat => {
    totalInstallationCost += cat.laborCost + cat.materialCost;
  });

  return {
    utilityType: 'central-hudson',
    utilityLabel: 'Central Hudson',
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
    networkPlanTotal: proposal.networkPlanCost || 0,
    shippingCost: proposal.shippingCost || 0,
    categories,
  };
}

export function prepareEversourceMAExport(proposal: Proposal): ExcelExportData {
  const categories: ExcelExportData['categories'] = {};
  const categoryNotes: { [category: string]: string } = {};
  const categoryItemNames: { [category: string]: string[] } = {};

  // Initialize all categories
  Object.keys(EVERSOURCE_MA_CELL_MAP).forEach(cat => {
    categories[cat] = { laborCost: 0, laborHours: 0, materialCost: 0, quantity: 0 };
    categoryItemNames[cat] = [];
  });

  // Calculate markup factor
  const costBasis = proposal.csmrCostBasisPercent / 100;
  const marginMultiplier = 1 / (1 - proposal.csmrMarginPercent / 100);
  const markupFactor = costBasis * marginMultiplier;

  // Aggregate costs by category (applying markup to get quoted prices)
  proposal.installationItems.forEach(item => {
    const category = getEversourceMACategory(item);
    const quotedMaterial = item.totalMaterial * markupFactor;
    const quotedLabor = item.totalLabor * markupFactor;

    const target = categories[category] || categories['Other'];
    const targetCategory = categories[category] ? category : 'Other';
    target.laborCost += quotedLabor;
    target.laborHours += item.totalLabor / LABOR_RATE_PER_HOUR;
    target.materialCost += quotedMaterial;
    // Track quantity only for categories that use E/F columns (Feet and Each rows)
    const qtyCategories = ['Trenching continuously paved', 'Trenching non-continuously paved',
      'Conduit underground', 'Conduit above ground', 'Protective Bollards', 'Handholes/Manholes'];
    if (qtyCategories.includes(targetCategory)) {
      if (item.unit === 'ft') {
        target.quantity += item.quantity;
      } else if (item.unit === 'each') {
        target.quantity += item.quantity;
      }
    }
    // Collect item names for notes
    if (!categoryItemNames[targetCategory]) categoryItemNames[targetCategory] = [];
    const desc = `${item.name} (x${item.quantity})`;
    if (!categoryItemNames[targetCategory].includes(desc)) {
      categoryItemNames[targetCategory].push(desc);
    }
  });

  // Build notes strings from collected item names
  Object.entries(categoryItemNames).forEach(([cat, names]) => {
    if (names.length > 0) {
      categoryNotes[cat] = names.join(', ');
    }
  });

  // Calculate total plugs, stations, and EVSE info
  let numPlugs = 0;
  let numStations = 0;
  let evseQuantity = 0;
  let evseUnitPrice = 0;
  const evseModels: string[] = [];
  proposal.evseItems.forEach(item => {
    numStations += item.quantity;
    evseQuantity += item.quantity;
    const isDualPort = item.productId.includes('-dp-') || item.productId.includes('dchp');
    numPlugs += item.quantity * (isDualPort ? 2 : 1);
    if (item.name && !evseModels.includes(item.name)) {
      evseModels.push(item.name);
    }
    if (!evseUnitPrice && item.unitPrice) {
      evseUnitPrice = item.unitPrice;
    }
  });

  return {
    utilityType: 'eversource-ma',
    utilityLabel: 'Eversource',
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
    evseQuantity,
    evseUnitPrice,
    networkPlanTotal: proposal.networkPlanCost || 0,
    shippingCost: proposal.shippingCost || 0,
    categories,
    categoryNotes,
  };
}

export function prepareNationalGridMAExport(proposal: Proposal): ExcelExportData {
  const categories: ExcelExportData['categories'] = {};

  // Initialize all categories
  Object.keys(NATIONAL_GRID_MA_CELL_MAP).forEach(cat => {
    categories[cat] = { laborCost: 0, laborHours: 0, materialCost: 0, quantity: 0 };
  });

  // Calculate markup factor
  const costBasis = proposal.csmrCostBasisPercent / 100;
  const marginMultiplier = 1 / (1 - proposal.csmrMarginPercent / 100);
  const markupFactor = costBasis * marginMultiplier;

  // Aggregate costs by category (applying markup to get quoted prices)
  proposal.installationItems.forEach(item => {
    const category = getNationalGridMACategory(item);
    const quotedMaterial = item.totalMaterial * markupFactor;
    const quotedLabor = item.totalLabor * markupFactor;

    if (!categories[category]) {
      categories['Other'].laborCost += quotedLabor;
      categories['Other'].laborHours += item.totalLabor / LABOR_RATE_PER_HOUR;
      categories['Other'].materialCost += quotedMaterial;
      if (item.materialPrice > 0) {
        categories['Other'].quantity += item.quantity;
      }
    } else {
      categories[category].laborCost += quotedLabor;
      categories[category].laborHours += item.totalLabor / LABOR_RATE_PER_HOUR;
      categories[category].materialCost += quotedMaterial;
      if (item.materialPrice > 0) {
        categories[category].quantity += item.quantity;
      }
    }
  });

  // Calculate total plugs, stations, and EVSE info
  let numPlugs = 0;
  let numStations = 0;
  let evseQuantity = 0;
  let evseUnitPrice = 0;
  const evseModels: string[] = [];
  proposal.evseItems.forEach(item => {
    numStations += item.quantity;
    evseQuantity += item.quantity;
    const isDualPort = item.productId.includes('-dp-') || item.productId.includes('dchp');
    numPlugs += item.quantity * (isDualPort ? 2 : 1);
    if (item.name && !evseModels.includes(item.name)) {
      evseModels.push(item.name);
    }
    if (!evseUnitPrice && item.unitPrice) {
      evseUnitPrice = item.unitPrice;
    }
  });

  return {
    utilityType: 'national-grid-ma',
    utilityLabel: 'National Grid',
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
    evseQuantity,
    evseUnitPrice,
    networkPlanTotal: proposal.networkPlanCost || 0,
    shippingCost: proposal.shippingCost || 0,
    categories,
  };
}

export function prepareSeattleCityLightExport(proposal: Proposal): ExcelExportData {
  const categories: ExcelExportData['categories'] = {};

  // Initialize material categories
  Object.keys(SEATTLE_MATERIAL_CELL_MAP).forEach(cat => {
    categories[cat] = { laborCost: 0, laborHours: 0, materialCost: 0, quantity: 0 };
  });
  // Initialize labor categories
  Object.keys(SEATTLE_LABOR_CELL_MAP).forEach(cat => {
    categories[cat] = { laborCost: 0, laborHours: 0, materialCost: 0, quantity: 0 };
  });

  // Calculate markup factor
  const costBasis = proposal.csmrCostBasisPercent / 100;
  const marginMultiplier = 1 / (1 - proposal.csmrMarginPercent / 100);
  const markupFactor = costBasis * marginMultiplier;

  // Seattle splits material and labor into separate sheet sections
  // Aggregate costs using the dual mapping
  proposal.installationItems.forEach(item => {
    const mapping = getSeattleCategoryMapping(item);
    const quotedMaterial = item.totalMaterial * markupFactor;
    const quotedLabor = item.totalLabor * markupFactor;

    // Material goes to the material category
    if (mapping.material && quotedMaterial > 0) {
      if (!categories[mapping.material]) {
        categories[mapping.material] = { laborCost: 0, laborHours: 0, materialCost: 0, quantity: 0 };
      }
      categories[mapping.material].materialCost += quotedMaterial;
      if (item.materialPrice > 0) {
        categories[mapping.material].quantity += item.quantity;
      }
    }

    // Labor goes to the labor category (default to Charger Installation)
    const laborCat = mapping.labor || 'Charger Installation';
    if (quotedLabor > 0) {
      if (!categories[laborCat]) {
        categories[laborCat] = { laborCost: 0, laborHours: 0, materialCost: 0, quantity: 0 };
      }
      categories[laborCat].laborCost += quotedLabor;
      categories[laborCat].laborHours += quotedLabor / LABOR_RATE_PER_HOUR;
    }
  });

  // Calculate total plugs, stations, and EVSE info
  let numPlugs = 0;
  let numStations = 0;
  let evseQuantity = 0;
  let evseUnitPrice = 0;
  const evseModels: string[] = [];
  proposal.evseItems.forEach(item => {
    numStations += item.quantity;
    evseQuantity += item.quantity;
    const isDualPort = item.productId.includes('-dp-') || item.productId.includes('dchp');
    numPlugs += item.quantity * (isDualPort ? 2 : 1);
    if (item.name && !evseModels.includes(item.name)) {
      evseModels.push(item.name);
    }
    if (!evseUnitPrice && item.unitPrice) {
      evseUnitPrice = item.unitPrice;
    }
  });

  return {
    utilityType: 'seattle-city-light',
    utilityLabel: 'Seattle City Light',
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
    evseQuantity,
    evseUnitPrice,
    networkPlanTotal: proposal.networkPlanCost || 0,
    shippingCost: proposal.shippingCost || 0,
    categories,
  };
}

// Export the cell mappings for use by the API route
export {
  NATIONAL_GRID_CELL_MAP,
  NYSEG_RGE_CELL_MAP,
  NYSEG_RGE_EVSE_ROW,
  CENTRAL_HUDSON_CELL_MAP,
  CENTRAL_HUDSON_EVSE_ROW,
  CENTRAL_HUDSON_INSTALLATION_ROW,
  CENTRAL_HUDSON_NETWORKING_ROW,
  CENTRAL_HUDSON_FREIGHT_ROW,
  EVERSOURCE_MA_CELL_MAP,
  EVERSOURCE_MA_HARDWARE1_ROW,
  EVERSOURCE_MA_HARDWARE2_ROW,
  EVERSOURCE_MA_FREIGHT_ROW,
  EVERSOURCE_MA_NETWORKING_ROW,
  NATIONAL_GRID_MA_CELL_MAP,
  NATIONAL_GRID_MA_HARDWARE1_ROW,
  NATIONAL_GRID_MA_HARDWARE2_ROW,
  NATIONAL_GRID_MA_FREIGHT_ROW,
  NATIONAL_GRID_MA_NETWORKING_ROW,
  SEATTLE_MATERIAL_CELL_MAP,
  SEATTLE_LABOR_CELL_MAP,
  SEATTLE_NETWORKING_ROW,
  LABOR_RATE_PER_HOUR,
};
