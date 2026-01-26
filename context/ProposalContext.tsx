'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Proposal, EVSEItem, InstallationItem, defaultProposal } from '@/lib/types';
import {
  calculateEVSETotal,
  calculateMaterialCost,
  calculateLaborCost,
} from '@/lib/calculations';

type ProposalAction =
  | { type: 'SET_CUSTOMER_INFO'; payload: Partial<Proposal> }
  | { type: 'SET_PROJECT_TYPE'; payload: 'level2' | 'dcfc' }
  | { type: 'ADD_EVSE_ITEM'; payload: EVSEItem }
  | { type: 'UPDATE_EVSE_ITEM'; payload: EVSEItem }
  | { type: 'REMOVE_EVSE_ITEM'; payload: string }
  | { type: 'ADD_INSTALLATION_ITEM'; payload: InstallationItem }
  | { type: 'UPDATE_INSTALLATION_ITEM'; payload: InstallationItem }
  | { type: 'REMOVE_INSTALLATION_ITEM'; payload: string }
  | { type: 'SET_FINANCIAL'; payload: Partial<Proposal> }
  | { type: 'SET_INCENTIVES'; payload: Partial<Proposal> }
  | { type: 'SET_TERMS'; payload: Partial<Proposal> }
  | { type: 'SET_SITE_MAP'; payload: string | undefined }
  | { type: 'RECALCULATE_COSTS' }
  | { type: 'RESET_PROPOSAL' }
  | { type: 'LOAD_PROPOSAL'; payload: Proposal };

function proposalReducer(state: Proposal, action: ProposalAction): Proposal {
  switch (action.type) {
    case 'SET_CUSTOMER_INFO':
      return { ...state, ...action.payload };

    case 'SET_PROJECT_TYPE':
      return { ...state, projectType: action.payload };

    case 'ADD_EVSE_ITEM': {
      const newItems = [...state.evseItems, action.payload];
      return {
        ...state,
        evseItems: newItems,
        evseCost: calculateEVSETotal(newItems),
      };
    }

    case 'UPDATE_EVSE_ITEM': {
      const newItems = state.evseItems.map(item =>
        item.id === action.payload.id ? action.payload : item
      );
      return {
        ...state,
        evseItems: newItems,
        evseCost: calculateEVSETotal(newItems),
      };
    }

    case 'REMOVE_EVSE_ITEM': {
      const newItems = state.evseItems.filter(item => item.id !== action.payload);
      return {
        ...state,
        evseItems: newItems,
        evseCost: calculateEVSETotal(newItems),
      };
    }

    case 'ADD_INSTALLATION_ITEM': {
      const newItems = [...state.installationItems, action.payload];
      return {
        ...state,
        installationItems: newItems,
        materialCost: calculateMaterialCost(newItems),
        laborCost: calculateLaborCost(newItems),
      };
    }

    case 'UPDATE_INSTALLATION_ITEM': {
      const newItems = state.installationItems.map(item =>
        item.id === action.payload.id ? action.payload : item
      );
      return {
        ...state,
        installationItems: newItems,
        materialCost: calculateMaterialCost(newItems),
        laborCost: calculateLaborCost(newItems),
      };
    }

    case 'REMOVE_INSTALLATION_ITEM': {
      const newItems = state.installationItems.filter(
        item => item.id !== action.payload
      );
      return {
        ...state,
        installationItems: newItems,
        materialCost: calculateMaterialCost(newItems),
        laborCost: calculateLaborCost(newItems),
      };
    }

    case 'SET_FINANCIAL':
      return { ...state, ...action.payload };

    case 'SET_INCENTIVES':
      return { ...state, ...action.payload };

    case 'SET_TERMS':
      return { ...state, ...action.payload };

    case 'SET_SITE_MAP':
      return { ...state, siteMapImage: action.payload };

    case 'RECALCULATE_COSTS':
      return {
        ...state,
        evseCost: calculateEVSETotal(state.evseItems),
        materialCost: calculateMaterialCost(state.installationItems),
        laborCost: calculateLaborCost(state.installationItems),
      };

    case 'RESET_PROPOSAL':
      return { ...defaultProposal, preparedDate: new Date() };

    case 'LOAD_PROPOSAL':
      return action.payload;

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
