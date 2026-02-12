import { Proposal, EVSEItem, InstallationItem, PaymentOption, PaymentOptionAnalysis, ProjectType } from './types';
import { pricebookProducts } from './pricebook';
import { getPaymentOptions } from './constants';

// ============================================
// EVSE Calculations
// ============================================

export function calculateEVSEActualCost(items: EVSEItem[]): number {
  return items.reduce((sum, item) => sum + item.totalCost, 0);
}

export function calculateEVSEQuotedPrice(items: EVSEItem[]): number {
  return items.reduce((sum, item) => sum + item.totalPrice, 0);
}

export function calculateTotalPorts(items: EVSEItem[]): number {
  return items.reduce((sum, item) => {
    const product = pricebookProducts.find(p => p.id === item.productId);
    const portsPerUnit = product?.numberOfPlugs || 1;
    return sum + (item.quantity * portsPerUnit);
  }, 0);
}

// Calculate network plan price (what we charge the customer)
export function calculateNetworkCost(items: EVSEItem[], years: 1 | 3 | 5): number {
  return items.reduce((sum, item) => {
    const product = pricebookProducts.find(p => p.id === item.productId);
    if (!product) return sum;

    // Get the appropriate network plan price based on years
    let networkPricePerUnit: number;
    switch (years) {
      case 1:
        networkPricePerUnit = product.networkPlan1Year;
        break;
      case 3:
        networkPricePerUnit = product.networkPlan3Year;
        break;
      case 5:
        networkPricePerUnit = product.networkPlan5Year;
        break;
    }

    return sum + (networkPricePerUnit * item.quantity);
  }, 0);
}

// Calculate actual network cost (what we pay)
export function calculateActualNetworkCost(items: EVSEItem[], years: 1 | 3 | 5): number {
  return items.reduce((sum, item) => {
    const product = pricebookProducts.find(p => p.id === item.productId);
    if (!product) return sum;

    // Get the appropriate network cost based on years
    let networkCostPerUnit: number;
    switch (years) {
      case 1:
        networkCostPerUnit = product.networkCost1Year;
        break;
      case 3:
        networkCostPerUnit = product.networkCost3Year;
        break;
      case 5:
        networkCostPerUnit = product.networkCost5Year;
        break;
    }

    return sum + (networkCostPerUnit * item.quantity);
  }, 0);
}

export function calculateShippingCost(items: EVSEItem[]): number {
  return items.reduce((sum, item) => {
    const product = pricebookProducts.find(p => p.id === item.productId);
    if (!product) return sum;

    return sum + (product.shippingCost * item.quantity);
  }, 0);
}

// Calculate EVSE item prices based on cost and margin
export function calculateEVSEItemPrice(unitCost: number, marginPercent: number): number {
  // Price = Cost / (1 - margin%)
  // This gives us the price where margin% of price is profit
  // e.g., cost=$100, margin=40% -> price=$166.67 (profit=$66.67 which is 40% of $166.67)
  return unitCost / (1 - marginPercent / 100);
}

// ============================================
// Sales Tax Calculations
// ============================================

// Project types that require sales tax on EVSE equipment
const SALES_TAX_PROJECT_TYPES: ProjectType[] = ['level2-epc', 'level3-epc', 'mixed-epc', 'site-host', 'level2-site-host'];

export function projectRequiresSalesTax(projectType: ProjectType): boolean {
  return SALES_TAX_PROJECT_TYPES.includes(projectType);
}

export function calculateEVSESalesTax(evseActualCost: number, salesTaxRate: number, projectType: ProjectType): number {
  if (!projectRequiresSalesTax(projectType)) {
    return 0;
  }
  return evseActualCost * (salesTaxRate / 100);
}

// ============================================
// CSMR (Installation) Calculations
// ============================================

export function calculateCSMRPricebookTotal(items: InstallationItem[]): number {
  return items.reduce((sum, item) => sum + item.totalMaterial + item.totalLabor, 0);
}

export function calculateCSMRActualCost(pricebookTotal: number, costBasisPercent: number): number {
  return pricebookTotal * (costBasisPercent / 100);
}

export function calculateCSMRQuotedPrice(actualCost: number, marginPercent: number): number {
  // Price = Cost / (1 - margin%)
  return actualCost / (1 - marginPercent / 100);
}

// ============================================
// Project Totals
// ============================================

export function calculateTotalActualCost(proposal: Proposal): number {
  return (
    proposal.evseActualCost +
    proposal.evseSalesTax +
    proposal.csmrActualCost +
    proposal.utilityAllowance +
    proposal.shippingCost +
    proposal.networkActualCost
  );
}

export function calculateGrossProjectCost(proposal: Proposal): number {
  return (
    proposal.evseQuotedPrice +
    proposal.csmrQuotedPrice +
    proposal.utilityAllowance +
    proposal.shippingCost +
    proposal.networkPlanCost
  );
}

export function calculateTotalIncentives(proposal: Proposal): number {
  return proposal.makeReadyIncentive + proposal.nyseradaIncentive;
}

export function calculateNetProjectCost(proposal: Proposal): number {
  const gross = calculateGrossProjectCost(proposal);
  const incentives = calculateTotalIncentives(proposal);
  return Math.max(0, gross - incentives);
}

// ============================================
// Profitability Calculations
// ============================================

export function calculateGrossProfit(proposal: Proposal): number {
  return proposal.netProjectCost - proposal.totalActualCost;
}

export function calculateGrossMarginPercent(proposal: Proposal): number {
  if (proposal.netProjectCost === 0) return 0;
  return (proposal.grossProfit / proposal.netProjectCost) * 100;
}

// ============================================
// Payment Option Analysis
// ============================================

export const paymentOptions: PaymentOption[] = [
  {
    name: 'Option 1 - Full Payment',
    costPercentage: 100,
    revenueShare: 100,
    warrantyYears: 3,
    warrantyType: 'parts',
  },
  {
    name: 'Option 2 - Half Payment',
    costPercentage: 50,
    revenueShare: 75,
    warrantyYears: 3,
    warrantyType: 'parts',
  },
  {
    name: 'Option 3 - Zero Upfront',
    costPercentage: 0,
    revenueShare: 50,
    warrantyYears: 5,
    warrantyType: 'full',
  },
];

export function analyzePaymentOption(
  proposal: Proposal,
  option: PaymentOption,
  costDollarOverride?: number
): PaymentOptionAnalysis {
  const netProjectCost = proposal.netProjectCost;

  // Use actual cost override if provided, otherwise use estimated cost
  const csevCost = proposal.actualCostOverride && proposal.actualCostOverride > 0
    ? proposal.actualCostOverride
    : proposal.totalActualCost;

  // Customer Discount = percentage of Net Project Cost they DON'T pay
  // e.g., Cost% = 70% means customer pays 70% of net, discount = 30% of net
  // If dollar override is set, discount = Net - dollar override amount
  let customerDiscount: number;
  let customerPays: number;
  if (costDollarOverride !== undefined && costDollarOverride >= 0) {
    customerPays = costDollarOverride;
    customerDiscount = netProjectCost - costDollarOverride;
  } else {
    customerDiscount = netProjectCost * (1 - option.costPercentage / 100);
    customerPays = netProjectCost - customerDiscount;
  }

  // What CSEV receives = net project cost minus customer discount
  const csevRevenue = netProjectCost - Math.abs(customerDiscount);

  // CSEV Profit = Gross Cost - Customer Discount - CSEV Cost
  // Discount and cost are always positive values subtracted from gross
  const csevProfit = proposal.grossProjectCost - Math.abs(customerDiscount) - Math.abs(csevCost);

  // Margin calculation (avoid division by zero)
  let csevMarginPercent = 0;
  if (csevRevenue > 0) {
    csevMarginPercent = (csevProfit / csevRevenue) * 100;
  } else if (csevCost > 0) {
    // For free option, show negative margin as percentage of cost
    csevMarginPercent = (csevProfit / csevCost) * 100;
  }

  return {
    optionName: option.name,
    customerPays,
    customerDiscount,
    revenueShare: option.revenueShare,
    csevRevenue,
    csevCost,
    csevProfit,
    csevMarginPercent,
  };
}

export function analyzeAllPaymentOptions(proposal: Proposal): PaymentOptionAnalysis[] {
  // Build payment options from project-type config, applying per-proposal overrides
  const configs = getPaymentOptions(proposal.projectType);
  const costPercentOverrides = proposal.paymentOptionCostPercentOverrides || [];
  const revShareOverrides = proposal.paymentOptionRevShareOverrides || [];
  const costDollarOverrides = proposal.paymentOptionCostOverrides || [];
  const options: PaymentOption[] = configs.map((cfg, i) => ({
    name: cfg.title,
    costPercentage: costPercentOverrides[i] ?? cfg.costPercentage,
    revenueShare: revShareOverrides[i] ?? cfg.revenueShare,
    warrantyYears: cfg.warrantyValue ? 5 : 3,
    warrantyType: cfg.warrantyValue ? 'full' as const : 'parts' as const,
  }));
  return options.map((option, i) => analyzePaymentOption(proposal, option, costDollarOverrides[i]));
}

// Get effective enabled state for each payment option
// If user has explicitly set paymentOptionEnabled, use that.
// Otherwise, auto-compute: negative profitability = disabled.
// Site Host: only Option 1 enabled by default (Options 2+ off).
export function getEffectivePaymentOptionEnabled(proposal: Proposal): boolean[] {
  const analyses = analyzeAllPaymentOptions(proposal);
  const userEnabled = proposal.paymentOptionEnabled;
  const isSiteHost = proposal.projectType === 'site-host';

  return analyses.map((analysis, i) => {
    // If user has explicitly set this index, use their value
    if (userEnabled && i < userEnabled.length) {
      return userEnabled[i];
    }
    // Option 1 always enabled by default (even if negative profitability)
    if (i === 0) {
      return true;
    }
    // Site Host: only first option enabled by default
    if (isSiteHost) {
      return false;
    }
    // Auto-default: enabled if margin >= 0
    return analysis.csevMarginPercent >= 0;
  });
}

// Check if at least one payment option is enabled for PDF generation
export function hasEnabledPaymentOption(proposal: Proposal): boolean {
  const enabled = getEffectivePaymentOptionEnabled(proposal);
  return enabled.some(v => v);
}

// ============================================
// Recalculate All Financials
// ============================================

export function recalculateProposalFinancials(proposal: Proposal): Partial<Proposal> {
  // EVSE calculations
  const evseActualCost = calculateEVSEActualCost(proposal.evseItems);
  const evseBaseQuotedPrice = calculateEVSEQuotedPrice(proposal.evseItems);
  const evseQuotedPrice = evseBaseQuotedPrice + (proposal.evseQuotedPriceAdjustment || 0);

  // Sales tax on EVSE (only for EPC and Site Host projects)
  const evseSalesTax = calculateEVSESalesTax(evseActualCost, proposal.salesTaxRate, proposal.projectType);

  // CSMR calculations
  const csmrPricebookTotal = calculateCSMRPricebookTotal(proposal.installationItems);
  const csmrActualCost = calculateCSMRActualCost(csmrPricebookTotal, proposal.csmrCostBasisPercent);
  const csmrBaseQuotedPrice = calculateCSMRQuotedPrice(csmrActualCost, proposal.csmrMarginPercent);
  const csmrQuotedPrice = csmrBaseQuotedPrice + (proposal.csmrQuotedPriceAdjustment || 0);

  // Network cost (what we charge customer) and actual cost (what we pay)
  const networkPlanCost = calculateNetworkCost(proposal.evseItems, proposal.networkYears);
  const networkActualCost = calculateActualNetworkCost(proposal.evseItems, proposal.networkYears);

  // Shipping cost (use override if set, otherwise auto-calculate from EVSE SKUs)
  const shippingCost = (proposal.shippingCostOverride !== undefined && proposal.shippingCostOverride >= 0)
    ? proposal.shippingCostOverride
    : calculateShippingCost(proposal.evseItems);

  // Build partial proposal with calculated values
  const updates: Partial<Proposal> = {
    evseActualCost,
    evseQuotedPrice,
    evseSalesTax,
    csmrPricebookTotal,
    csmrActualCost,
    csmrQuotedPrice,
    networkPlanCost,
    networkActualCost,
    shippingCost,
  };

  // Create temporary proposal to calculate totals
  const tempProposal = { ...proposal, ...updates };

  // Calculate totals
  updates.totalActualCost = calculateTotalActualCost(tempProposal as Proposal);
  updates.grossProjectCost = calculateGrossProjectCost(tempProposal as Proposal);
  updates.totalIncentives = calculateTotalIncentives(tempProposal as Proposal);
  updates.netProjectCost = calculateNetProjectCost({ ...tempProposal, ...updates } as Proposal);

  // Calculate profitability
  const finalProposal = { ...tempProposal, ...updates } as Proposal;
  updates.grossProfit = calculateGrossProfit(finalProposal);
  updates.grossMarginPercent = calculateGrossMarginPercent(finalProposal);

  return updates;
}

// ============================================
// Formatting Utilities
// ============================================

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyWithCents(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function generateProposalNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `CSEV-${year}${month}${day}-${random}`;
}

// Calculate payment option cost with optional manual override
export function calculatePaymentOptionCostWithOverride(
  netProjectCost: number,
  costPercentage: number,
  overrideValue?: number
): number {
  if (overrideValue !== undefined && overrideValue >= 0) return overrideValue;
  return (netProjectCost * costPercentage) / 100;
}

// Legacy function for backwards compatibility
export function calculatePaymentOptionCost(
  netProjectCost: number,
  option: PaymentOption
): number {
  return (netProjectCost * option.costPercentage) / 100;
}

// Legacy aliases
export const calculateEVSETotal = calculateEVSEQuotedPrice;
export const calculateMaterialCost = (items: InstallationItem[]): number => {
  return items.reduce((sum, item) => sum + item.totalMaterial, 0);
};
export const calculateLaborCost = (items: InstallationItem[]): number => {
  return items.reduce((sum, item) => sum + item.totalLabor, 0);
};
