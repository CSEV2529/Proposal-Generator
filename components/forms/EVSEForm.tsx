'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { useProposal } from '@/context/ProposalContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { pricebookProducts, getProductsByProjectType } from '@/lib/pricebook';
import { formatCurrency } from '@/lib/calculations';
import { EVSEItem } from '@/lib/types';

export function EVSEForm() {
  const { proposal, dispatch } = useProposal();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<EVSEItem>>({});

  const availableProducts = getProductsByProjectType(proposal.projectType);

  const handleAddItem = () => {
    if (availableProducts.length === 0) return;

    const product = availableProducts[0];
    const newItem: EVSEItem = {
      id: `evse-${Date.now()}`,
      productId: product.id,
      name: product.name,
      quantity: 1,
      unitPrice: product.unitPrice,
      totalPrice: product.unitPrice,
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

    const updatedItem: EVSEItem = {
      ...item,
      productId: product.id,
      name: product.name,
      unitPrice: product.unitPrice,
      totalPrice: product.unitPrice * item.quantity,
    };

    dispatch({ type: 'UPDATE_EVSE_ITEM', payload: updatedItem });
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    const item = proposal.evseItems.find(i => i.id === itemId);
    if (!item) return;

    const updatedItem: EVSEItem = {
      ...item,
      quantity,
      totalPrice: item.unitPrice * quantity,
    };

    dispatch({ type: 'UPDATE_EVSE_ITEM', payload: updatedItem });
  };

  const startEditing = (item: EVSEItem) => {
    setEditingId(item.id);
    setEditValues({
      unitPrice: item.unitPrice,
      notes: item.notes,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValues({});
  };

  const saveEditing = (itemId: string) => {
    const item = proposal.evseItems.find(i => i.id === itemId);
    if (!item) return;

    const updatedItem: EVSEItem = {
      ...item,
      unitPrice: editValues.unitPrice ?? item.unitPrice,
      totalPrice: (editValues.unitPrice ?? item.unitPrice) * item.quantity,
      notes: editValues.notes ?? item.notes,
    };

    dispatch({ type: 'UPDATE_EVSE_ITEM', payload: updatedItem });
    setEditingId(null);
    setEditValues({});
  };

  return (
    <Card
      title="EVSE Equipment"
      subtitle="Add charging equipment from the pricebook or customize pricing"
    >
      <div className="space-y-4">
        {proposal.evseItems.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No equipment added yet. Click the button below to add items.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-2">Product</th>
                  <th className="text-center py-2 px-2 w-20">Qty</th>
                  <th className="text-right py-2 px-2 w-28">Unit Price</th>
                  <th className="text-right py-2 px-2 w-28">Total</th>
                  <th className="text-left py-2 px-2">Notes</th>
                  <th className="w-24"></th>
                </tr>
              </thead>
              <tbody>
                {proposal.evseItems.map(item => (
                  <tr key={item.id} className="border-b border-gray-100">
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
                        <span className="block text-right">
                          {formatCurrency(item.unitPrice)}
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-right font-medium">
                      {formatCurrency(item.totalPrice)}
                    </td>
                    <td className="py-2 px-2">
                      {editingId === item.id ? (
                        <Input
                          type="text"
                          value={editValues.notes || ''}
                          onChange={e =>
                            setEditValues({ ...editValues, notes: e.target.value })
                          }
                          placeholder="Add notes..."
                          className="text-sm"
                        />
                      ) : (
                        <span className="text-gray-500 text-sm">
                          {item.notes || '-'}
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-1 justify-end">
                        {editingId === item.id ? (
                          <>
                            <button
                              onClick={() => saveEditing(item.id)}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                              title="Save"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                              title="Cancel"
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditing(item)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit price/notes"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
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
                <tr className="bg-gray-50">
                  <td colSpan={3} className="py-2 px-2 text-right font-semibold">
                    EVSE Total:
                  </td>
                  <td className="py-2 px-2 text-right font-bold text-csev-green">
                    {formatCurrency(proposal.evseCost)}
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        <Button onClick={handleAddItem} variant="outline" size="sm">
          <Plus size={16} className="mr-2" />
          Add Equipment
        </Button>
      </div>
    </Card>
  );
}
