'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, AlertTriangle } from 'lucide-react';
import { useProposal } from '@/context/ProposalContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { installationServices, getSubgroups, getServicesBySubgroup } from '@/lib/pricebook';
import { formatCurrency, calculateMaterialCost, calculateLaborCost } from '@/lib/calculations';
import { InstallationItem } from '@/lib/types';

export function InstallationScopeForm() {
  const { proposal, dispatch } = useProposal();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<InstallationItem>>({});
  const [selectedSubgroup, setSelectedSubgroup] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const MAX_INSTALLATION_ITEMS = 25;
  const subgroups = getSubgroups();
  const isAtLimit = proposal.installationItems.length >= MAX_INSTALLATION_ITEMS;

  const handleAddItem = (subgroup: string) => {
    const services = getServicesBySubgroup(subgroup);
    if (services.length === 0) return;

    const service = services[0];
    const newItem: InstallationItem = {
      id: `install-${Date.now()}`,
      itemId: service.id,
      name: service.name,
      quantity: 1,
      materialPrice: service.materialPrice,
      laborPrice: service.laborPrice,
      totalMaterial: service.materialPrice,
      totalLabor: service.laborPrice,
      unit: service.unit,
      subgroup: service.subgroup,
      defaultNote: service.defaultNote,
    };

    dispatch({ type: 'ADD_INSTALLATION_ITEM', payload: newItem });
  };

  const handleRemoveItem = (id: string) => {
    dispatch({ type: 'REMOVE_INSTALLATION_ITEM', payload: id });
  };

  const handleServiceChange = (itemId: string, serviceId: string) => {
    const service = installationServices.find(s => s.id === serviceId);
    if (!service) return;

    const item = proposal.installationItems.find(i => i.id === itemId);
    if (!item) return;

    const updatedItem: InstallationItem = {
      ...item,
      itemId: service.id,
      name: service.name,
      materialPrice: service.materialPrice,
      laborPrice: service.laborPrice,
      totalMaterial: service.materialPrice * item.quantity,
      totalLabor: service.laborPrice * item.quantity,
      unit: service.unit,
      subgroup: service.subgroup,
      defaultNote: service.defaultNote,
    };

    dispatch({ type: 'UPDATE_INSTALLATION_ITEM', payload: updatedItem });
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    const item = proposal.installationItems.find(i => i.id === itemId);
    if (!item) return;

    const updatedItem: InstallationItem = {
      ...item,
      quantity,
      totalMaterial: item.materialPrice * quantity,
      totalLabor: item.laborPrice * quantity,
    };

    dispatch({ type: 'UPDATE_INSTALLATION_ITEM', payload: updatedItem });
  };

  const startEditing = (item: InstallationItem) => {
    setEditingId(item.id);
    setEditValues({
      materialPrice: item.materialPrice,
      laborPrice: item.laborPrice,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValues({});
  };

  const saveEditing = (itemId: string) => {
    const item = proposal.installationItems.find(i => i.id === itemId);
    if (!item) return;

    const materialPrice = editValues.materialPrice ?? item.materialPrice;
    const laborPrice = editValues.laborPrice ?? item.laborPrice;

    const updatedItem: InstallationItem = {
      ...item,
      materialPrice,
      laborPrice,
      totalMaterial: materialPrice * item.quantity,
      totalLabor: laborPrice * item.quantity,
    };

    dispatch({ type: 'UPDATE_INSTALLATION_ITEM', payload: updatedItem });
    setEditingId(null);
    setEditValues({});
  };

  // Group items by subgroup for display
  const itemsBySubgroup = proposal.installationItems.reduce((acc, item) => {
    if (!acc[item.subgroup]) {
      acc[item.subgroup] = [];
    }
    acc[item.subgroup].push(item);
    return acc;
  }, {} as Record<string, InstallationItem[]>);

  const getUnitLabel = (unit: string) => {
    switch (unit) {
      case 'ft': return '/ft';
      case 'each': return '/ea';
      case 'circuit': return '/circuit';
      case 'project': return '/project';
      default: return '';
    }
  };

  return (
    <Card
      title="Installation Scope"
      subtitle="Add labor and material items from the pricebook"
      accent
    >
      <div className="space-y-6">
        {/* Add Item Section */}
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Select
              label="Select Category"
              value={selectedSubgroup}
              onChange={(e) => setSelectedSubgroup(e.target.value)}
              options={[
                { value: '', label: 'Choose a category...' },
                ...subgroups.map(sg => ({ value: sg, label: sg }))
              ]}
            />
          </div>
          <Button
            onClick={() => handleAddItem(selectedSubgroup)}
            variant="primary"
            disabled={!selectedSubgroup || isAtLimit}
          >
            <Plus size={16} className="mr-2" />
            Add Item
          </Button>
          {proposal.installationItems.length > 0 && (
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              variant="danger"
            >
              <Trash2 size={16} className="mr-2" />
              Delete All
            </Button>
          )}
        </div>

        {/* 20-item limit warning */}
        {isAtLimit && (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 text-sm">
            <AlertTriangle size={16} className="flex-shrink-0" />
            <span>Maximum of {MAX_INSTALLATION_ITEMS} installation scope line items reached (PDF page limit).</span>
          </div>
        )}

        {/* Delete All Confirmation */}
        {showDeleteConfirm && (
          <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <AlertTriangle size={18} className="text-red-400 flex-shrink-0" />
            <span className="text-red-300 text-sm flex-1">
              Are you sure you want to delete all {proposal.installationItems.length} installation items? This cannot be undone.
            </span>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                dispatch({ type: 'CLEAR_INSTALLATION_ITEMS' });
                setShowDeleteConfirm(false);
              }}
            >
              Yes, Delete All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
          </div>
        )}

        {/* Items Table */}
        {proposal.installationItems.length === 0 ? (
          <p className="text-csev-text-muted text-center py-8">
            No installation items added yet. Select a category above and click &quot;Add Item&quot;.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-csev-border bg-csev-slate-800">
                  <th className="text-left py-3 px-2 text-csev-text-secondary font-medium">Item</th>
                  <th className="py-3 px-2 w-28 text-csev-text-secondary font-medium">
                    <span className="block text-center w-16">Qty</span>
                  </th>
                  <th className="text-right py-3 px-2 w-24 text-csev-text-secondary font-medium">Material</th>
                  <th className="text-right py-3 px-2 w-24 text-csev-text-secondary font-medium">Labor</th>
                  <th className="text-right py-3 px-2 w-24 text-csev-text-secondary font-medium">Total</th>
                  <th className="w-20"></th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(itemsBySubgroup).map(([subgroup, items]) => (
                  <React.Fragment key={subgroup}>
                    <tr className="bg-csev-slate-700/50">
                      <td colSpan={6} className="py-2 px-2 font-semibold text-csev-green text-xs uppercase tracking-wide">
                        {subgroup}
                      </td>
                    </tr>
                    {items.map(item => {
                      const services = getServicesBySubgroup(item.subgroup);
                      return (
                        <tr key={item.id} className="border-b border-csev-border/50">
                          <td className="py-2 px-2">
                            <Select
                              value={item.itemId}
                              onChange={e => handleServiceChange(item.id, e.target.value)}
                              options={services.map(s => ({
                                value: s.id,
                                label: `${s.name}`,
                              }))}
                              className="text-sm"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <div className="flex items-center gap-1">
                              <div className="w-16 flex-shrink-0">
                                <Input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={e =>
                                    handleQuantityChange(item.id, parseInt(e.target.value) || 1)
                                  }
                                  className="text-center text-sm"
                                />
                              </div>
                              <span className="text-xs text-csev-text-muted whitespace-nowrap">
                                {getUnitLabel(item.unit)}
                              </span>
                            </div>
                          </td>
                          <td className="py-2 px-2">
                            {editingId === item.id ? (
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={editValues.materialPrice}
                                onChange={e =>
                                  setEditValues({
                                    ...editValues,
                                    materialPrice: parseFloat(e.target.value) || 0,
                                  })
                                }
                                className="text-right text-sm"
                              />
                            ) : (
                              <span className="block text-right text-csev-text-primary">
                                {formatCurrency(item.totalMaterial)}
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-2">
                            {editingId === item.id ? (
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={editValues.laborPrice}
                                onChange={e =>
                                  setEditValues({
                                    ...editValues,
                                    laborPrice: parseFloat(e.target.value) || 0,
                                  })
                                }
                                className="text-right text-sm"
                              />
                            ) : (
                              <span className="block text-right text-csev-text-primary">
                                {formatCurrency(item.totalLabor)}
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-2 text-right font-medium text-csev-text-primary">
                            {formatCurrency(item.totalMaterial + item.totalLabor)}
                          </td>
                          <td className="py-2 px-2">
                            <div className="flex items-center gap-1 justify-end">
                              {editingId === item.id ? (
                                <>
                                  <button
                                    onClick={() => saveEditing(item.id)}
                                    className="p-1 text-csev-green hover:bg-csev-green/10 rounded"
                                    title="Save"
                                  >
                                    <Check size={16} />
                                  </button>
                                  <button
                                    onClick={cancelEditing}
                                    className="p-1 text-csev-text-muted hover:bg-csev-slate-700 rounded"
                                    title="Cancel"
                                  >
                                    <X size={16} />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => startEditing(item)}
                                    className="p-1 text-csev-green hover:bg-csev-green/10 rounded"
                                    title="Edit prices"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="p-1 text-red-400 hover:bg-red-400/10 rounded"
                                    title="Remove"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-csev-slate-800 border-t-2 border-csev-border">
                  <td colSpan={2} className="py-3 px-2 text-right font-semibold text-csev-text-primary">
                    Pricebook Total:
                  </td>
                  <td className="py-3 px-2 text-right font-bold text-blue-400">
                    {formatCurrency(calculateMaterialCost(proposal.installationItems))}
                  </td>
                  <td className="py-3 px-2 text-right font-bold text-amber-400">
                    {formatCurrency(calculateLaborCost(proposal.installationItems))}
                  </td>
                  <td className="py-3 px-2 text-right font-bold text-csev-text-primary">
                    {formatCurrency(proposal.csmrPricebookTotal)}
                  </td>
                  <td></td>
                </tr>
                <tr className="bg-csev-slate-700/50">
                  <td colSpan={4} className="py-2 px-2 text-right text-sm text-csev-text-secondary">
                    Our Cost ({proposal.csmrCostBasisPercent}% of pricebook):
                  </td>
                  <td className="py-2 px-2 text-right font-medium text-csev-text-muted">
                    {formatCurrency(proposal.csmrActualCost)}
                  </td>
                  <td></td>
                </tr>
                <tr className="bg-csev-green/10">
                  <td colSpan={4} className="py-2 px-2 text-right font-semibold text-csev-text-primary">
                    Quoted Price (with {proposal.csmrMarginPercent}% margin):
                  </td>
                  <td className="py-2 px-2 text-right font-bold text-csev-green">
                    {formatCurrency(proposal.csmrQuotedPrice)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
}
