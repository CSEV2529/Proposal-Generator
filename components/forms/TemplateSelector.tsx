'use client';

import React from 'react';
import { useProposal } from '@/context/ProposalContext';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { getAllStates, getUtilitiesByState, getAllScopeTemplates } from '@/lib/templates';

export function TemplateSelector() {
  const { proposal, dispatch } = useProposal();

  const allStates = getAllStates();
  // Put NY and NJ at the top, then the rest alphabetically
  const states = [
    ...allStates.filter(s => s.id === 'ny'),
    ...allStates.filter(s => s.id === 'nj'),
    ...allStates.filter(s => s.id !== 'ny' && s.id !== 'nj'),
  ];
  const scopeTemplates = getAllScopeTemplates();

  // Get utilities filtered by selected state
  const utilities = proposal.projectStateId
    ? getUtilitiesByState(proposal.projectStateId)
    : [];

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateId = e.target.value;
    dispatch({ type: 'SET_PROJECT_STATE', payload: stateId });
  };

  const handleUtilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const utilityId = e.target.value;
    dispatch({ type: 'SET_UTILITY', payload: utilityId });
  };

  const handleScopeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const scopeId = e.target.value;
    if (scopeId) {
      dispatch({ type: 'APPLY_SCOPE_TEMPLATE', payload: scopeId });
    }
  };

  return (
    <Card
      title="Project Template"
      subtitle="Select state, utility, and scope of work to auto-populate equipment and installation items"
      accent
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="State"
          value={proposal.projectStateId || ''}
          onChange={handleStateChange}
          options={[
            { value: '', label: 'Select a state...' },
            ...states.map(s => ({
              value: s.id,
              label: s.name,
            })),
          ]}
        />

        <Select
          label="Utility Program"
          value={proposal.utilityId || ''}
          onChange={handleUtilityChange}
          disabled={!proposal.projectStateId}
          options={[
            { value: '', label: proposal.projectStateId ? 'Select a utility...' : 'Select a state first...' },
            ...utilities.map(u => ({
              value: u.id,
              label: u.name,
            })),
          ]}
        />

        <Select
          label="Scope of Work Template"
          value={proposal.scopeTemplateId || ''}
          onChange={handleScopeChange}
          options={[
            { value: '', label: 'Select a scope template...' },
            ...scopeTemplates.map(s => ({
              value: s.id,
              label: s.name,
            })),
          ]}
        />
      </div>

      {proposal.scopeTemplateId && (
        <p className="mt-3 text-sm text-csev-green">
          Template applied. EVSE and Installation items have been populated.
        </p>
      )}
    </Card>
  );
}
