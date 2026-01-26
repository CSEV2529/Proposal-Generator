'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { useProposal } from '@/context/ProposalContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { installationServices } from '@/lib/pricebook';
import { formatCurrency } from '@/lib/calculations';
import { InstallationItem } from '@/lib/types';

export function InstallationScopeForm() {
  const { proposal, dispatch } = useProposal();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<InstallationItem>>({});

  const materialServices = installationServices.filter(s => s.category === 'material');
  const laborServices = installationServices.filter(s => s.category === 'labor');

  const materialItems = proposal.installationItems.filter(
    i => i.category === 'material'
  );
  const laborItems = proposal.installationItems.filter(i => i.category === 'labor');

  const handleAddItem = (category: 'material' | 'labor') => {
    const services = category === 'material' ? materialServices : laborServices;
    if (services.length === 0) return;

    const service = services[0];
    const newItem: InstallationItem = {
      id: `install-${Date.now()}`,
      itemId: service.id,
      name: service.name,
      quantity: 1,
      unitPrice: service.unitPrice,
      totalPrice: service.unitPrice,
      category,
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
      unitPrice: service.unitPrice,
      totalPrice: service.unitPrice * item.quantity,
    };

    dispatch({ type: 'UPDATE_INSTALLATION_ITEM', payload: updatedItem });
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    const item = proposal.installationItems.find(i => i.id === itemId);
    if (!item) return;

    const updatedItem: InstallationItem = {
      ...item,
      quantity,
      totalPrice: item.unitPrice * quantity,
    };

    dispatch({ type: 'UPDATE_INSTALLATION_ITEM', payload: updatedItem });
  };

  const startEditing = (item: InstallationItem) => {
    setEditingId(item.id);
    setEditValues({ unitPrice: item.unitPrice });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValues({});
  };

  const saveEditing = (itemId: string) => {
    const item = proposal.installationItems.find(i => i.id === itemId);
    if (!item) return;

    const updatedItem: InstallationItem = {
      ...item,
      unitPrice: editValues.unitPrice ?? item.unitPrice,
      totalPrice: (editValues.unitPrice ?? item.unitPrice) * item.quantity,
    };

    dispatch({ type: 'UPDATE_INSTALLATION_ITEM', payload: updatedItem });
    setEditingId(null);
    setEditValues({});
  };

  const renderItemsTable = (
    items: InstallationItem[],
    services: typeof installationServices,
    category: 'material' | 'labor',
    title: string,
    totalValue: number
  ) => (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-700">{title}</h4>
      {items.length === 0 ? (
        <p className="text-gray-500 text-sm py-2">No {title.toLowerCase()} added yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2">Item</th>
                <th className="text-center py-2 px-2 w-20">Qty</th>
                <th className="text-right py-2 px-2 w-28">Unit Price</th>
                <th className="text-right py-2 px-2 w-28">Total</th>
                <th className="w-20"></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-2 px-2">
                    <Select
                      value={item.itemId}
                      onChange={e => handleServiceChange(item.id, e.target.value)}
                      options={services.map(s => ({
                        value: s.id,
                        label: `${s.name} (per ${s.unit})`,
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
                            title="Edit price"
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
                  {title} Total:
                </td>
                <td className="py-2 px-2 text-right font-bold text-csev-green">
                  {formatCurrency(totalValue)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
      <Button
        onClick={() => handleAddItem(category)}
        variant="outline"
        size="sm"
      >
        <Plus size={16} className="mr-2" />
        Add {category === 'material' ? 'Material' : 'Labor'} Item
      </Button>
    </div>
  );

  return (
    <Card
      title="Installation Scope"
      subtitle="Define material and labor requirements for the installation"
    >
      <div className="space-y-8">
        {renderItemsTable(
          materialItems,
          materialServices,
          'material',
          'Material Costs',
          proposal.materialCost
        )}

        <hr className="border-gray-200" />

        {renderItemsTable(
          laborItems,
          laborServices,
          'labor',
          'Labor Costs',
          proposal.laborCost
        )}
      </div>
    </Card>
  );
}
