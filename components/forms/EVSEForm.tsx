'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, AlertTriangle } from 'lucide-react';
import { useProposal } from '@/context/ProposalContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { pricebookProducts } from '@/lib/pricebook';
import { formatCurrency, calculateEVSEItemPrice } from '@/lib/calculations';
import { EVSEItem } from '@/lib/types';

export function EVSEForm() {
  const { proposal, dispatch } = useProposal();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<EVSEItem>>({});

  const MAX_EVSE_ITEMS = 3; // 3 user items + 1 auto-calculated EV Parking Signs = 4 PDF slots
  const isAtLimit = proposal.evseItems.length >= MAX_EVSE_ITEMS;

  // All EVSE products available regardless of project type
  const availableProducts = pricebookProducts;

  const handleAddItem = () => {
    if (availableProducts.length === 0) return;

    const product = availableProducts[0];
    // Use csevCost as our actual cost, calculate price using margin
    const unitCost = product.csevCost;
    const unitPrice = calculateEVSEItemPrice(unitCost, proposal.evseMarginPercent);

    const newItem: EVSEItem = {
      id: `evse-${Date.now()}`,
      productId: product.id,
      name: product.name,
      quantity: 1,
      unitCost,
      totalCost: unitCost,
      unitPrice,
      totalPrice: unitPrice,
      notes: '',
    };

    dispatch({ type: 'ADD_EVSE_ITEM', payload: newItem });
  };

  const handleRemoveItem = (id: string) => {
    dispatch({ type: 'REMOVE_EVSE_ITEM', payload: id });
  };

  const handleProductChange = (itemId: string, productId: string) => {
    const product = pricebookProducts.find(p => p.id === productId);
    if (!product) return;

    const item = proposal.evseItems.find(i => i.id === itemId);
    if (!item) return;

    // Use csevCost as our actual cost, calculate price using margin
    const unitCost = product.csevCost;
    const unitPrice = calculateEVSEItemPrice(unitCost, proposal.evseMarginPercent);

    const updatedItem: EVSEItem = {
      ...item,
      productId: product.id,
      name: product.name,
      unitCost,
      totalCost: unitCost * item.quantity,
      unitPrice,
      totalPrice: unitPrice * item.quantity,
    };

    dispatch({ type: 'UPDATE_EVSE_ITEM', payload: updatedItem });
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    const item = proposal.evseItems.find(i => i.id === itemId);
    if (!item) return;

    const updatedItem: EVSEItem = {
      ...item,
      quantity,
      totalCost: item.unitCost * quantity,
      totalPrice: item.unitPrice * quantity,
    };

    dispatch({ type: 'UPDATE_EVSE_ITEM', payload: updatedItem });
  };

  const startEditing = (item: EVSEItem) => {
    setEditingId(item.id);
    setEditValues({
      unitPrice: item.unitPrice,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValues({});
  };

  const saveEditing = (itemId: string) => {
    const item = proposal.evseItems.find(i => i.id === itemId);
    if (!item) return;

    const newUnitPrice = editValues.unitPrice ?? item.unitPrice;

    const updatedItem: EVSEItem = {
      ...item,
      unitPrice: newUnitPrice,
      totalPrice: newUnitPrice * item.quantity,
    };

    dispatch({ type: 'UPDATE_EVSE_ITEM', payload: updatedItem });
    setEditingId(null);
    setEditValues({});
  };

  return (
    <Card
      title="EVSE Equipment"
      subtitle="Add charging equipment from the pricebook or customize pricing"
      accent
    >
      <div className="space-y-4">
        {proposal.evseItems.length === 0 ? (
          <p className="text-csev-text-muted text-center py-4">
            No equipment added yet. Click the button below to add items.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-csev-border">
                  <th className="text-left py-2 px-2 text-csev-text-secondary font-medium">Product</th>
                  <th className="text-center py-2 px-2 w-16 text-csev-text-secondary font-medium">Qty</th>
                  <th className="text-right py-2 px-2 w-24 text-csev-text-secondary font-medium">Unit Cost</th>
                  <th className="text-right py-2 px-2 w-24 text-csev-text-secondary font-medium">Unit Price</th>
                  <th className="text-right py-2 px-2 w-24 text-csev-text-secondary font-medium">Total Price</th>
                  <th className="w-20"></th>
                </tr>
              </thead>
              <tbody>
                {proposal.evseItems.map(item => (
                  <tr key={item.id} className="border-b border-csev-border/50">
                    <td className="py-2 px-2">
                      <Select
                        value={item.productId}
                        onChange={e => handleProductChange(item.id, e.target.value)}
                        options={availableProducts.map(p => ({
                          value: p.id,
                          label: p.name,
                        }))}
                        className="text-sm"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e =>
                          handleQuantityChange(item.id, parseInt(e.target.value) || 1)
                        }
                        className="text-center text-sm"
                      />
                    </td>
                    <td className="py-2 px-2 text-right text-csev-text-muted">
                      {formatCurrency(item.unitCost)}
                    </td>
                    <td className="py-2 px-2">
                      {editingId === item.id ? (
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={editValues.unitPrice}
                          onChange={e =>
                            setEditValues({
                              ...editValues,
                              unitPrice: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="text-right text-sm"
                        />
                      ) : (
                        <span className="block text-right text-csev-text-primary">
                          {formatCurrency(item.unitPrice)}
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-right font-medium text-csev-text-primary">
                      {formatCurrency(item.totalPrice)}
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
                              title="Edit price"
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
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-csev-slate-800">
                  <td colSpan={2} className="py-2 px-2 text-right font-semibold text-csev-text-primary">
                    EVSE Totals:
                  </td>
                  <td className="py-2 px-2 text-right text-csev-text-muted">
                    {formatCurrency(proposal.evseActualCost)}
                  </td>
                  <td></td>
                  <td className="py-2 px-2 text-right font-bold text-csev-green">
                    {formatCurrency(proposal.evseQuotedPrice)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {isAtLimit && (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400 text-sm">
            <AlertTriangle size={16} className="flex-shrink-0" />
            <span>Maximum of {MAX_EVSE_ITEMS} EVSE line items reached (PDF page limit). The EV Parking Signs row is auto-generated.</span>
          </div>
        )}

        <Button onClick={handleAddItem} variant="outline" size="sm" disabled={isAtLimit}>
          <Plus size={16} className="mr-2" />
          Add Equipment
        </Button>
      </div>
    </Card>
  );
}
