import { Proposal, EVSEItem, InstallationItem, PaymentOption } from './types';

export function calculateEVSETotal(items: EVSEItem[]): number {
  return items.reduce((sum, item) => sum + item.totalPrice, 0);
}

export function calculateMaterialCost(items: InstallationItem[]): number {
  return items
    .filter(item => item.category === 'material')
    .reduce((sum, item) => sum + item.totalPrice, 0);
}

export function calculateLaborCost(items: InstallationItem[]): number {
  return items
    .filter(item => item.category === 'labor')
    .reduce((sum, item) => sum + item.totalPrice, 0);
}

export function calculateGrossProjectCost(proposal: Proposal): number {
  return (
    proposal.evseCost +
    proposal.materialCost +
    proposal.laborCost +
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

export function calculatePaymentOptionCost(
  netProjectCost: number,
  option: PaymentOption
): number {
  return (netProjectCost * option.costPercentage) / 100;
}

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
  return `${value}%`;
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
