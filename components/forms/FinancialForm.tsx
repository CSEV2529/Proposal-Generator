'use client';

import React from 'react';
import { useProposal } from '@/context/ProposalContext';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import {
  formatCurrency,
  calculateGrossProjectCost,
  calculateNetProjectCost,
} from '@/lib/calculations';

export function FinancialForm() {
  const { proposal, dispatch } = useProposal();

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    dispatch({
      type: 'SET_FINANCIAL',
      payload: { [field]: value },
    });
  };

  const grossCost = calculateGrossProjectCost(proposal);
  const netCost = calculateNetProjectCost(proposal);

  return (
    <Card
      title="Financial Summary"
      subtitle="Additional costs and project totals"
    >
      <div className="space-y-6">
        {/* Cost Summary from EVSE and Installation */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <h4 className="font-medium text-gray-700 mb-3">Calculated Costs</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-gray-600">EVSE Cost:</span>
            <span className="text-right font-medium">
              {formatCurrency(proposal.evseCost)}
            </span>
            <span className="text-gray-600">Material Cost:</span>
            <span className="text-right font-medium">
              {formatCurrency(proposal.materialCost)}
            </span>
            <span className="text-gray-600">Labor Cost:</span>
            <span className="text-right font-medium">
              {formatCurrency(proposal.laborCost)}
            </span>
          </div>
        </div>

        {/* Additional Costs */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Additional Costs</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Utility Side Make Ready (Allowance)"
              type="number"
              min="0"
              step="100"
              value={proposal.utilityAllowance || ''}
              onChange={handleChange('utilityAllowance')}
              placeholder="0"
              helperText="Estimated utility-side infrastructure costs"
            />

            <Input
              label="Shipping Cost"
              type="number"
              min="0"
              step="50"
              value={proposal.shippingCost || ''}
              onChange={handleChange('shippingCost')}
              placeholder="0"
            />

            <Input
              label="Annual Network Plan (5 years)"
              type="number"
              min="0"
              step="100"
              value={proposal.networkPlanCost || ''}
              onChange={handleChange('networkPlanCost')}
              placeholder="0"
              helperText="5-year network/software subscription included"
            />
          </div>
        </div>

        {/* Incentives */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Incentives & Rebates</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Estimated Make Ready Incentive"
              type="number"
              min="0"
              step="100"
              value={proposal.makeReadyIncentive || ''}
              onChange={handleChange('makeReadyIncentive')}
              placeholder="0"
              helperText="Utility make-ready incentive amount"
            />

            <Input
              label="NYSERDA Charge Ready 2.0 Incentive"
              type="number"
              min="0"
              step="100"
              value={proposal.nyseradaIncentive || ''}
              onChange={handleChange('nyseradaIncentive')}
              placeholder="0"
              helperText="NY state incentive if applicable"
            />
          </div>
        </div>

        {/* Terms */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Agreement Terms</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Processing Fees"
              type="text"
              value={proposal.processingFees}
              onChange={e =>
                dispatch({
                  type: 'SET_TERMS',
                  payload: { processingFees: e.target.value },
                })
              }
              placeholder="e.g., 3.5%"
            />

            <Input
              label="Agreement Term (Years)"
              type="number"
              min="1"
              max="10"
              value={proposal.agreementTerm}
              onChange={e =>
                dispatch({
                  type: 'SET_TERMS',
                  payload: { agreementTerm: parseInt(e.target.value) || 5 },
                })
              }
            />

            <Input
              label="Recommended $/kWh Rate"
              type="number"
              min="0"
              step="0.01"
              value={proposal.recommendedKwhRate}
              onChange={e =>
                dispatch({
                  type: 'SET_TERMS',
                  payload: { recommendedKwhRate: parseFloat(e.target.value) || 0 },
                })
              }
            />
          </div>
        </div>

        {/* Totals */}
        <div className="bg-csev-green/10 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center text-lg">
            <span className="font-medium">Gross Project Cost:</span>
            <span className="font-bold">{formatCurrency(grossCost)}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Less: Total Incentives</span>
            <span>
              - {formatCurrency(proposal.makeReadyIncentive + proposal.nyseradaIncentive)}
            </span>
          </div>
          <hr className="border-csev-green/30" />
          <div className="flex justify-between items-center text-xl">
            <span className="font-bold text-csev-green-dark">
              Project Cost (with Incentives):
            </span>
            <span className="font-bold text-csev-green">{formatCurrency(netCost)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
