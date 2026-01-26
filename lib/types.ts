export type ProjectType = 'level2' | 'dcfc';

export interface EVSEItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface InstallationItem {
  id: string;
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: 'material' | 'labor';
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

  // EVSE Items
  evseItems: EVSEItem[];

  // Installation Scope
  installationItems: InstallationItem[];

  // Financial
  evseCost: number;
  materialCost: number;
  laborCost: number;
  utilityAllowance: number;
  shippingCost: number;
  networkPlanCost: number;

  // Incentives
  makeReadyIncentive: number;
  nyseradaIncentive: number;

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
  unitPrice: number;
  category: 'charger' | 'accessory';
  projectType: ProjectType | 'both';
}

export interface InstallationService {
  id: string;
  name: string;
  description: string;
  unitPrice: number;
  category: 'material' | 'labor';
  unit: string;
}

export interface PaymentOption {
  name: string;
  costPercentage: number;
  revenueShare: number;
  warrantyYears: number;
  warrantyType: 'parts' | 'full';
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
  evseCost: 0,
  materialCost: 0,
  laborCost: 0,
  utilityAllowance: 0,
  shippingCost: 0,
  networkPlanCost: 0,
  makeReadyIncentive: 0,
  nyseradaIncentive: 0,
  processingFees: '3.5%',
  agreementTerm: 5,
  recommendedKwhRate: 0.35,
};
