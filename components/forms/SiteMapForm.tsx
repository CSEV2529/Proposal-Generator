'use client';

import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useProposal } from '@/context/ProposalContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function SiteMapForm() {
  const { proposal, dispatch } = useProposal();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      dispatch({ type: 'SET_SITE_MAP', payload: base64 });
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    dispatch({ type: 'SET_SITE_MAP', payload: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please drop an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      dispatch({ type: 'SET_SITE_MAP', payload: base64 });
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card
      title="Site Map"
      subtitle="Upload a site map or layout showing proposed charger locations"
      accent
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {proposal.siteMapImage ? (
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden border border-csev-border">
            <img
              src={proposal.siteMapImage}
              alt="Site Map"
              className="w-full h-auto max-h-96 object-contain bg-csev-slate-800"
            />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              title="Remove image"
            >
              <X size={16} />
            </button>
          </div>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload size={16} className="mr-2" />
            Replace Image
          </Button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-csev-border rounded-lg p-8 text-center hover:border-csev-green hover:bg-csev-green/5 transition-colors cursor-pointer"
        >
          <ImageIcon size={48} className="mx-auto text-csev-text-muted mb-4" />
          <p className="text-csev-text-secondary mb-2">
            Drag and drop an image here, or click to select
          </p>
          <p className="text-sm text-csev-text-muted">
            Supports: JPG, PNG, GIF (max 5MB)
          </p>
        </div>
      )}
    </Card>
  );
}
