export type ProjectType = 'level2' | 'dcfc';

export interface EVSEItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  // Cost (what we pay)
  unitCost: number;      // From pricebook csevCost
  totalCost: number;     // unitCost * quantity
  // Price (what customer pays)
  unitPrice: number;     // Quoted price per unit
  totalPrice: number;    // unitPrice * quantity
  notes?: string;
}

export interface InstallationItem {
  id: string;
  itemId: string;
  name: string;
  quantity: number;
  // Pricebook prices (used as basis for cost calculation)
  materialPrice: number;
  laborPrice: number;
  totalMaterial: number;
  totalLabor: number;
  unit: string;
  subgroup: string;
}

export interface Proposal {
  // Customer Info
  customerName: string;
  customerAddress: string;
  customerCity: string;
  customerState: string;
  customerZip: string;
  preparedDate: Date;
  projectType: ProjectType;

  // State, Utility & Template Selection
  projectStateId?: string;    // State for utility selection
  utilityId?: string;
  scopeTemplateId?: string;

  // EVSE Items
  evseItems: EVSEItem[];

  // Installation Scope
  installationItems: InstallationItem[];

  // Pricing Settings
  evseMarginPercent: number;      // Target margin for EVSE (e.g., 40 = 40%)
  csmrCostBasisPercent: number;   // What % of CSMR prices are our actual cost (e.g., 60 = 60%)
  csmrMarginPercent: number;      // Target margin for CSMR on top of cost (e.g., 40 = 40%)

  // EVSE Financials (auto-calculated)
  evseActualCost: number;         // Sum of all EVSE item costs
  evseQuotedPrice: number;        // Sum of all EVSE item prices (with margin)

  // CSMR Financials (auto-calculated)
  csmrPricebookTotal: number;     // Raw pricebook total (material + labor)
  csmrActualCost: number;         // csmrPricebookTotal * costBasisPercent
  csmrQuotedPrice: number;        // csmrActualCost * (1 + marginPercent)

  // Other Costs (pass-through, no margin)
  utilityAllowance: number;
  shippingCost: number;
  networkYears: 1 | 3 | 5;
  networkPlanCost: number;

  // Totals
  totalActualCost: number;        // evseActualCost + csmrActualCost + other costs
  grossProjectCost: number;       // evseQuotedPrice + csmrQuotedPrice + other costs

  // Incentives
  makeReadyIncentive: number;
  nyseradaIncentive: number;
  totalIncentives: number;

  // Net (after incentives)
  netProjectCost: number;         // grossProjectCost - incentives

  // Profitability
  grossProfit: number;            // netProjectCost - totalActualCost
  grossMarginPercent: number;     // grossProfit / netProjectCost * 100
  actualCostOverride?: number;    // Optional: actual costs to override estimated for true profitability

  // Terms
  processingFees: string;
  agreementTerm: number;
  recommendedKwhRate: number;

  // Site Map
  siteMapImage?: string;
}

export interface PricebookProduct {
  id: string;
  name: string;
  description: string;
  manufacturer: string;
  unitPrice: number;
  csevCost: number;
  annualNetworkPlan: number;
  networkPlan1Year: number;
  networkPlan3Year: number;
  networkPlan5Year: number;
  shippingCost: number;
  numberOfPlugs: number;
  category: 'charger' | 'accessory';
  projectType: ProjectType | 'both';
}

export interface InstallationService {
  id: string;
  name: string;
  description: string;
  materialPrice: number;
  laborPrice: number;
  unit: string;
  subgroup: string;
}

export interface PaymentOption {
  name: string;
  costPercentage: number;
  revenueShare: number;
  warrantyYears: number;
  warrantyType: 'parts' | 'full';
}

// Payment option profitability analysis
export interface PaymentOptionAnalysis {
  optionName: string;
  customerPays: number;           // What customer actually pays
  customerDiscount: number;       // Discount given to customer
  revenueShare: number;           // Customer's revenue share %
  csevRevenue: number;            // What CSEV receives upfront
  csevCost: number;               // Our total actual cost
  csevProfit: number;             // csevRevenue - csevCost
  csevMarginPercent: number;      // csevProfit / csevRevenue * 100
}

export const defaultProposal: Proposal = {
  customerName: '',
  customerAddress: '',
  customerCity: '',
  customerState: 'NY',
  customerZip: '',
  preparedDate: new Date(),
  projectType: 'level2',
  evseItems: [],
  installationItems: [],

  // Default pricing settings
  evseMarginPercent: 50,          // 50% margin on EVSE
  csmrCostBasisPercent: 100,      // 100% of CSMR prices are our cost
  csmrMarginPercent: 40,          // 40% margin on CSMR

  // EVSE
  evseActualCost: 0,
  evseQuotedPrice: 0,

  // CSMR
  csmrPricebookTotal: 0,
  csmrActualCost: 0,
  csmrQuotedPrice: 0,

  // Other
  utilityAllowance: 0,
  shippingCost: 0,
  networkYears: 5,
  networkPlanCost: 0,

  // Totals
  totalActualCost: 0,
  grossProjectCost: 0,

  // Incentives
  makeReadyIncentive: 0,
  nyseradaIncentive: 0,
  totalIncentives: 0,

  // Net
  netProjectCost: 0,

  // Profitability
  grossProfit: 0,
  grossMarginPercent: 0,

  // Terms
  processingFees: '$0.49 + 9%',
  agreementTerm: 5,
  recommendedKwhRate: 0.40,
};
