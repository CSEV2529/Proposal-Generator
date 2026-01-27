'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Proposal, EVSEItem, InstallationItem, defaultProposal } from '@/lib/types';
import {
  recalculateProposalFinancials,
  calculateEVSEItemPrice,
  calculateNetworkCost,
} from '@/lib/calculations';
import { pricebookProducts, installationServices } from '@/lib/pricebook';
import { getScopeTemplateById, ScopeOfWorkTemplate } from '@/lib/templates';

type ProposalAction =
  | { type: 'SET_CUSTOMER_INFO'; payload: Partial<Proposal> }
  | { type: 'SET_PROJECT_TYPE'; payload: 'level2' | 'dcfc' }
  | { type: 'ADD_EVSE_ITEM'; payload: EVSEItem }
  | { type: 'UPDATE_EVSE_ITEM'; payload: EVSEItem }
  | { type: 'REMOVE_EVSE_ITEM'; payload: string }
  | { type: 'ADD_INSTALLATION_ITEM'; payload: InstallationItem }
  | { type: 'UPDATE_INSTALLATION_ITEM'; payload: InstallationItem }
  | { type: 'REMOVE_INSTALLATION_ITEM'; payload: string }
  | { type: 'SET_PRICING_SETTINGS'; payload: Partial<Proposal> }
  | { type: 'SET_FINANCIAL'; payload: Partial<Proposal> }
  | { type: 'SET_NETWORK_YEARS'; payload: 1 | 3 | 5 }
  | { type: 'SET_INCENTIVES'; payload: Partial<Proposal> }
  | { type: 'SET_TERMS'; payload: Partial<Proposal> }
  | { type: 'SET_SITE_MAP'; payload: string | undefined }
  | { type: 'RECALCULATE_ALL' }
  | { type: 'RESET_PROPOSAL' }
  | { type: 'LOAD_PROPOSAL'; payload: Proposal }
  | { type: 'SET_PROJECT_STATE'; payload: string }
  | { type: 'SET_UTILITY'; payload: string }
  | { type: 'APPLY_SCOPE_TEMPLATE'; payload: string };

// Helper to recalculate EVSE items with new margin
function recalculateEVSEItems(items: EVSEItem[], marginPercent: number): EVSEItem[] {
  return items.map(item => {
    const unitPrice = calculateEVSEItemPrice(item.unitCost, marginPercent);
    return {
      ...item,
      unitPrice,
      totalPrice: unitPrice * item.quantity,
    };
  });
}

// Helper to create EVSE items from a template
function createEVSEItemsFromTemplate(
  template: ScopeOfWorkTemplate,
  marginPercent: number
): EVSEItem[] {
  const items: EVSEItem[] = [];
  template.evseItems.forEach((templateItem, index) => {
    const product = pricebookProducts.find(p => p.id === templateItem.productId);
    if (!product) return;

    const unitCost = product.csevCost;
    const unitPrice = calculateEVSEItemPrice(unitCost, marginPercent);

    items.push({
      id: `evse-template-${Date.now()}-${index}`,
      productId: product.id,
      name: product.name,
      quantity: templateItem.quantity,
      unitCost,
      totalCost: unitCost * templateItem.quantity,
      unitPrice,
      totalPrice: unitPrice * templateItem.quantity,
      notes: templateItem.notes || '',
    });
  });
  return items;
}

// Helper to create Installation items from a template
function createInstallationItemsFromTemplate(
  template: ScopeOfWorkTemplate
): InstallationItem[] {
  const items: InstallationItem[] = [];
  template.installationItems.forEach((templateItem, index) => {
    const service = installationServices.find(s => s.id === templateItem.serviceId);
    if (!service) return;

    items.push({
      id: `install-template-${Date.now()}-${index}`,
      itemId: service.id,
      name: service.name,
      quantity: templateItem.quantity,
      materialPrice: service.materialPrice,
      laborPrice: service.laborPrice,
      totalMaterial: service.materialPrice * templateItem.quantity,
      totalLabor: service.laborPrice * templateItem.quantity,
      unit: service.unit,
      subgroup: service.subgroup,
    });
  });
  return items;
}

// Helper to apply all financial recalculations
function applyFinancialRecalculations(state: Proposal): Proposal {
  const updates = recalculateProposalFinancials(state);
  return { ...state, ...updates };
}

function proposalReducer(state: Proposal, action: ProposalAction): Proposal {
  switch (action.type) {
    case 'SET_CUSTOMER_INFO':
      return { ...state, ...action.payload };

    case 'SET_PROJECT_TYPE':
      return { ...state, projectType: action.payload };

    case 'ADD_EVSE_ITEM': {
      const newItems = [...state.evseItems, action.payload];
      const newState = { ...state, evseItems: newItems };
      return applyFinancialRecalculations(newState);
    }

    case 'UPDATE_EVSE_ITEM': {
      const newItems = state.evseItems.map(item =>
        item.id === action.payload.id ? action.payload : item
      );
      const newState = { ...state, evseItems: newItems };
      return applyFinancialRecalculations(newState);
    }

    case 'REMOVE_EVSE_ITEM': {
      const newItems = state.evseItems.filter(item => item.id !== action.payload);
      const newState = { ...state, evseItems: newItems };
      return applyFinancialRecalculations(newState);
    }

    case 'ADD_INSTALLATION_ITEM': {
      const newItems = [...state.installationItems, action.payload];
      const newState = { ...state, installationItems: newItems };
      return applyFinancialRecalculations(newState);
    }

    case 'UPDATE_INSTALLATION_ITEM': {
      const newItems = state.installationItems.map(item =>
        item.id === action.payload.id ? action.payload : item
      );
      const newState = { ...state, installationItems: newItems };
      return applyFinancialRecalculations(newState);
    }

    case 'REMOVE_INSTALLATION_ITEM': {
      const newItems = state.installationItems.filter(
        item => item.id !== action.payload
      );
      const newState = { ...state, installationItems: newItems };
      return applyFinancialRecalculations(newState);
    }

    case 'SET_PRICING_SETTINGS': {
      let newState = { ...state, ...action.payload };

      // If EVSE margin changed, recalculate all EVSE item prices
      if (action.payload.evseMarginPercent !== undefined) {
        const updatedItems = recalculateEVSEItems(
          state.evseItems,
          action.payload.evseMarginPercent
        );
        newState = { ...newState, evseItems: updatedItems };
      }

      return applyFinancialRecalculations(newState);
    }

    case 'SET_FINANCIAL': {
      const newState = { ...state, ...action.payload };
      return applyFinancialRecalculations(newState);
    }

    case 'SET_NETWORK_YEARS': {
      const networkYears = action.payload;
      const networkPlanCost = calculateNetworkCost(state.evseItems, networkYears);
      const newState = { ...state, networkYears, networkPlanCost };
      return applyFinancialRecalculations(newState);
    }

    case 'SET_INCENTIVES': {
      const newState = { ...state, ...action.payload };
      return applyFinancialRecalculations(newState);
    }

    case 'SET_TERMS':
      return { ...state, ...action.payload };

    case 'SET_SITE_MAP':
      return { ...state, siteMapImage: action.payload };

    case 'RECALCULATE_ALL':
      return applyFinancialRecalculations(state);

    case 'RESET_PROPOSAL':
      return { ...defaultProposal, preparedDate: new Date() };

    case 'LOAD_PROPOSAL':
      return applyFinancialRecalculations(action.payload);

    case 'SET_PROJECT_STATE': {
      // When state changes, clear the utility selection since utilities are state-specific
      return { ...state, projectStateId: action.payload, utilityId: undefined };
    }

    case 'SET_UTILITY': {
      return { ...state, utilityId: action.payload };
    }

    case 'APPLY_SCOPE_TEMPLATE': {
      const scopeId = action.payload;
      const template = getScopeTemplateById(scopeId);
      if (!template) return state;

      // Create new items from template
      const evseItems = createEVSEItemsFromTemplate(template, state.evseMarginPercent);
      const installationItems = createInstallationItemsFromTemplate(template);

      // Update state with new items and template selection
      const newState = {
        ...state,
        scopeTemplateId: scopeId,
        evseItems,
        installationItems,
      };

      return applyFinancialRecalculations(newState);
    }

    default:
      return state;
  }
}

interface ProposalContextType {
  proposal: Proposal;
  dispatch: React.Dispatch<ProposalAction>;
}

const ProposalContext = createContext<ProposalContextType | undefined>(undefined);

export function ProposalProvider({ children }: { children: ReactNode }) {
  const [proposal, dispatch] = useReducer(proposalReducer, {
    ...defaultProposal,
    preparedDate: new Date(),
  });

  return (
    <ProposalContext.Provider value={{ proposal, dispatch }}>
      {children}
    </ProposalContext.Provider>
  );
}

export function useProposal() {
  const context = useContext(ProposalContext);
  if (context === undefined) {
    throw new Error('useProposal must be used within a ProposalProvider');
  }
  return context;
}
