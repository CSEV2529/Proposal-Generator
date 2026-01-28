'use client';

import React from 'react';
import { useProposal } from '@/context/ProposalContext';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import {
  formatCurrency,
  formatPercentage,
  calculateTotalPorts,
  analyzeAllPaymentOptions,
  projectRequiresSalesTax,
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

  const handlePricingChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    dispatch({
      type: 'SET_PRICING_SETTINGS',
      payload: { [field]: value },
    });
  };

  const handleIncentiveChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    dispatch({
      type: 'SET_INCENTIVES',
      payload: { [field]: value },
    });
  };

  // Get payment option analysis
  const paymentAnalysis = analyzeAllPaymentOptions(proposal);

  return (
    <Card
      title="Financial Summary"
      subtitle="Pricing settings, costs, and profitability analysis"
      accent
    >
      <div className="space-y-6">
        {/* Pricing Settings */}
        <div className="space-y-4">
          <h4 className="section-header">Pricing Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              label="EVSE Margin %"
              type="number"
              min="0"
              max="100"
              step="1"
              value={proposal.evseMarginPercent}
              onChange={handlePricingChange('evseMarginPercent')}
              helperText="Target margin on equipment (e.g., 40 = 40%)"
            />

            <Input
              label="CSMR Cost Basis %"
              type="number"
              min="0"
              max="100"
              step="1"
              value={proposal.csmrCostBasisPercent}
              onChange={handlePricingChange('csmrCostBasisPercent')}
              helperText="% of pricebook that is our actual cost"
            />

            <Input
              label="CSMR Margin %"
              type="number"
              min="0"
              max="100"
              step="1"
              value={proposal.csmrMarginPercent}
              onChange={handlePricingChange('csmrMarginPercent')}
              helperText="Target margin on installation work"
            />

            <Input
              label="Sales Tax Rate %"
              type="number"
              min="0"
              max="20"
              step="0.1"
              value={proposal.salesTaxRate}
              onChange={handlePricingChange('salesTaxRate')}
              helperText={projectRequiresSalesTax(proposal.projectType) ? 'Applied to EVSE cost' : 'N/A for Distribution'}
            />
          </div>
        </div>

        {/* Cost vs Price Breakdown */}
        <div className="bg-csev-slate-800 rounded-lg p-4 space-y-3 border border-csev-border">
          <h4 className="section-header mb-3">Cost vs. Quoted Price</h4>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <span className="text-csev-text-secondary font-medium"></span>
            <span className="text-right text-csev-text-muted font-medium">Our Cost</span>
            <span className="text-right text-csev-text-primary font-medium">Quoted Price</span>

            <span className="text-csev-text-secondary">EVSE Equipment:</span>
            <span className="text-right text-csev-text-muted">
              {formatCurrency(proposal.evseActualCost)}
            </span>
            <span className="text-right font-medium text-csev-text-primary">
              {formatCurrency(proposal.evseQuotedPrice)}
            </span>

            {proposal.evseSalesTax > 0 && (
              <>
                <span className="text-csev-text-secondary">EVSE Sales Tax ({proposal.salesTaxRate}%):</span>
                <span className="text-right text-csev-text-muted">
                  {formatCurrency(proposal.evseSalesTax)}
                </span>
                <span className="text-right font-medium text-csev-text-primary">
                  -
                </span>
              </>
            )}

            <span className="text-csev-text-secondary">Installation (CSMR):</span>
            <span className="text-right text-csev-text-muted">
              {formatCurrency(proposal.csmrActualCost)}
            </span>
            <span className="text-right font-medium text-csev-text-primary">
              {formatCurrency(proposal.csmrQuotedPrice)}
            </span>

            <span className="text-csev-text-secondary">Utility Allowance:</span>
            <span className="text-right text-csev-text-muted">
              {formatCurrency(proposal.utilityAllowance)}
            </span>
            <span className="text-right font-medium text-csev-text-primary">
              {formatCurrency(proposal.utilityAllowance)}
            </span>

            <span className="text-csev-text-secondary">Shipping:</span>
            <span className="text-right text-csev-text-muted">
              {formatCurrency(proposal.shippingCost)}
            </span>
            <span className="text-right font-medium text-csev-text-primary">
              {formatCurrency(proposal.shippingCost)}
            </span>

            <span className="text-csev-text-secondary">Network Plan:</span>
            <span className="text-right text-csev-text-muted">
              {formatCurrency(proposal.networkActualCost)}
            </span>
            <span className="text-right font-medium text-csev-text-primary">
              {formatCurrency(proposal.networkPlanCost)}
            </span>

            <hr className="col-span-3 border-csev-border" />

            <span className="text-csev-text-primary font-medium">Subtotals:</span>
            <span className="text-right text-csev-text-secondary font-medium">
              {formatCurrency(proposal.totalActualCost)}
            </span>
            <span className="text-right font-bold text-csev-text-primary">
              {formatCurrency(proposal.grossProjectCost)}
            </span>
          </div>
        </div>

        {/* Additional Costs */}
        <div className="space-y-4">
          <h4 className="section-header">Additional Costs</h4>
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

            <div>
              <label className="block text-sm font-medium text-csev-text-secondary mb-1">
                Shipping Cost
              </label>
              <div className="mt-1 block w-full rounded-lg border border-csev-border bg-csev-slate-700 px-3 py-2 text-csev-text-primary">
                {formatCurrency(proposal.shippingCost)}
              </div>
              <p className="text-xs text-csev-text-muted mt-1">
                Auto-calculated from EVSE SKUs
              </p>
            </div>

            <div>
              <Select
                label="CSEV Network Plan"
                value={String(proposal.networkYears)}
                onChange={e => {
                  const years = parseInt(e.target.value) as 1 | 3 | 5;
                  dispatch({ type: 'SET_NETWORK_YEARS', payload: years });
                }}
                options={[
                  { value: '1', label: '1 Year of CSEV Network' },
                  { value: '3', label: '3 Years of CSEV Network' },
                  { value: '5', label: '5 Years of CSEV Network' },
                ]}
              />
              <p className="text-xs text-csev-text-muted mt-1">
                Network plan cost per SKU x {proposal.networkYears} yr = {formatCurrency(proposal.networkPlanCost)}
              </p>
            </div>
          </div>
        </div>

        {/* Incentives */}
        <div className="space-y-4">
          <h4 className="section-header">Incentives & Rebates</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Estimated Make Ready Incentive"
              type="number"
              min="0"
              step="100"
              value={proposal.makeReadyIncentive || ''}
              onChange={handleIncentiveChange('makeReadyIncentive')}
              placeholder="0"
              helperText="Utility make-ready incentive amount"
            />

            <Input
              label="EVSE Program Incentive or Grant"
              type="number"
              min="0"
              step="100"
              value={proposal.nyseradaIncentive || ''}
              onChange={handleIncentiveChange('nyseradaIncentive')}
              placeholder="0"
              helperText="State Grant or Incentive"
            />
          </div>
        </div>

        {/* Terms */}
        <div className="space-y-4">
          <h4 className="section-header">Agreement Terms</h4>
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
        <div className="bg-csev-green/10 rounded-lg p-4 space-y-3 border border-csev-green/30">
          <div className="flex justify-between items-center text-lg">
            <span className="font-medium text-csev-text-primary">Gross Project Cost:</span>
            <span className="font-bold text-csev-text-primary">{formatCurrency(proposal.grossProjectCost)}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-csev-text-secondary">
            <span>Less: Total Incentives</span>
            <span>- {formatCurrency(proposal.totalIncentives)}</span>
          </div>
          <hr className="border-csev-green/30" />
          <div className="flex justify-between items-center text-xl">
            <span className="font-bold text-csev-green">
              Net Project Cost:
            </span>
            <span className="font-bold text-csev-green">{formatCurrency(proposal.netProjectCost)}</span>
          </div>
        </div>

        {/* Payment Option Analysis */}
        <div className="space-y-4">
          <div className="flex items-end gap-4">
            <h4 className="section-header flex-1">Payment Option Profitability Analysis</h4>
            <div className="w-64">
              <Input
                label="Actual Cost Override"
                type="number"
                min="0"
                step="100"
                value={proposal.actualCostOverride || ''}
                onChange={e => {
                  const value = e.target.value ? parseFloat(e.target.value) : undefined;
                  dispatch({
                    type: 'SET_FINANCIAL',
                    payload: { actualCostOverride: value },
                  });
                }}
                placeholder={formatCurrency(proposal.totalActualCost)}
                helperText={proposal.actualCostOverride ? 'Using actual costs' : 'Leave empty to use estimated'}
              />
            </div>
          </div>
          <p className="text-xs text-csev-text-muted mb-2">
            Formula: Gross Project Cost - Customer Discount - CSEV Cost = CSEV Profit
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-csev-border bg-csev-slate-800">
                  <th className="text-left py-2 px-3 text-csev-text-secondary">Payment Option</th>
                  <th className="text-right py-2 px-3 text-csev-text-secondary">Gross Cost</th>
                  <th className="text-right py-2 px-3 text-csev-text-secondary">Customer Discount</th>
                  <th className="text-right py-2 px-3 text-csev-text-secondary">CSEV Cost</th>
                  <th className="text-right py-2 px-3 text-csev-text-secondary">CSEV Profit</th>
                  <th className="text-right py-2 px-3 text-csev-text-secondary">Margin</th>
                </tr>
              </thead>
              <tbody>
                {paymentAnalysis.map((analysis, index) => (
                  <tr key={index} className="border-b border-csev-border/50">
                    <td className="py-2 px-3 font-medium text-csev-text-primary">{analysis.optionName}</td>
                    <td className="py-2 px-3 text-right text-csev-text-primary">{formatCurrency(proposal.grossProjectCost)}</td>
                    <td className="py-2 px-3 text-right text-amber-500">
                      {analysis.customerDiscount > 0 ? `- ${formatCurrency(analysis.customerDiscount)}` : '-'}
                    </td>
                    <td className="py-2 px-3 text-right text-csev-text-muted">- {formatCurrency(analysis.csevCost)}</td>
                    <td className={`py-2 px-3 text-right font-medium ${analysis.csevProfit >= 0 ? 'text-csev-green' : 'text-red-400'}`}>
                      = {formatCurrency(analysis.csevProfit)}
                    </td>
                    <td className={`py-2 px-3 text-right font-medium ${analysis.csevMarginPercent >= 0 ? 'text-csev-green' : 'text-red-400'}`}>
                      {formatPercentage(analysis.csevMarginPercent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-csev-text-muted">
            Option 2 gives customer 50% discount, Option 3 gives customer 100% discount (FREE).
          </p>
        </div>
      </div>
    </Card>
  );
}
