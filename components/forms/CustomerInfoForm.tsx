'use client';

import React, { useState, useEffect } from 'react';
import { useProposal } from '@/context/ProposalContext';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { STATES, PROJECT_TYPES, LOCATION_TYPES } from '@/lib/constants';
import { ProjectType, LocationType } from '@/lib/types';

export function CustomerInfoForm() {
  const { proposal, dispatch } = useProposal();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    dispatch({
      type: 'SET_CUSTOMER_INFO',
      payload: { [name]: value },
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'SET_CUSTOMER_INFO',
      payload: { preparedDate: new Date(e.target.value) },
    });
  };

  const handleProjectTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: 'SET_PROJECT_TYPE',
      payload: e.target.value as ProjectType,
    });
  };

  const handleLocationTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: 'SET_CUSTOMER_INFO',
      payload: { locationType: e.target.value as LocationType },
    });
  };

  const formatDateForInput = (date: Date) => {
    try {
      return date.toISOString().split('T')[0];
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  };

  return (
    <Card title="Customer Information" subtitle="Enter the customer details for this proposal" accent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Input
            label="Customer Name"
            name="customerName"
            value={proposal.customerName}
            onChange={handleChange}
            placeholder="e.g., Best Western Holiday Inn"
          />
        </div>

        <div className="md:col-span-2">
          <Input
            label="Street Address"
            name="customerAddress"
            value={proposal.customerAddress}
            onChange={handleChange}
            placeholder="e.g., 123 Main Street"
          />
        </div>

        <Input
          label="City"
          name="customerCity"
          value={proposal.customerCity}
          onChange={handleChange}
          placeholder="e.g., Albany"
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="State"
            name="customerState"
            value={proposal.customerState}
            onChange={handleChange}
            options={STATES.map(state => ({ value: state, label: state }))}
          />

          <Input
            label="ZIP Code"
            name="customerZip"
            value={proposal.customerZip}
            onChange={handleChange}
            placeholder="e.g., 12203"
          />
        </div>

        <Input
          label="Prepared Date"
          name="preparedDate"
          type="date"
          value={mounted ? formatDateForInput(proposal.preparedDate) : ''}
          onChange={handleDateChange}
        />

        <Select
          label="Project Type"
          name="projectType"
          value={proposal.projectType}
          onChange={handleProjectTypeChange}
          options={Object.entries(PROJECT_TYPES).map(([value, { label }]) => ({
            value,
            label,
          }))}
        />

        <Select
          label="Location Type"
          name="locationType"
          value={proposal.locationType}
          onChange={handleLocationTypeChange}
          options={Object.entries(LOCATION_TYPES).map(([value, { label }]) => ({
            value,
            label,
          }))}
        />

        <Select
          label="Access Type"
          name="accessType"
          value={proposal.accessType}
          onChange={handleChange}
          options={[
            { value: 'public', label: 'Public' },
            { value: 'private', label: 'Private' },
          ]}
        />
      </div>
    </Card>
  );
}
