'use client';

import React, { useState, useEffect } from 'react';
import { FileDown, RotateCcw, Eye, EyeOff, Zap } from 'lucide-react';
import { useProposal } from '@/context/ProposalContext';
import {
  CustomerInfoForm,
  EVSEForm,
  InstallationScopeForm,
  FinancialForm,
  SiteMapForm,
} from '@/components/forms';
import { Button } from '@/components/ui/Button';
import {
  formatCurrency,
  calculateGrossProjectCost,
  calculateNetProjectCost,
} from '@/lib/calculations';
import { COMPANY_INFO } from '@/lib/constants';
import type { Proposal } from '@/lib/types';

// PDF Download component that loads react-pdf only on client
function PDFDownloadButton({ proposal, fileName }: { proposal: Proposal; fileName: string }) {
  const [PDFComponents, setPDFComponents] = useState<{
    PDFDownloadLink: any;
    ProposalDocument: any;
  } | null>(null);

  useEffect(() => {
    Promise.all([
      import('@react-pdf/renderer'),
      import('@/components/pdf/ProposalDocument'),
    ]).then(([pdfRenderer, proposalDoc]) => {
      setPDFComponents({
        PDFDownloadLink: pdfRenderer.PDFDownloadLink,
        ProposalDocument: proposalDoc.ProposalDocument,
      });
    });
  }, []);

  if (!PDFComponents) {
    return (
      <Button variant="primary" size="lg" className="w-full" disabled>
        <span className="animate-pulse">Loading PDF generator...</span>
      </Button>
    );
  }

  const { PDFDownloadLink, ProposalDocument } = PDFComponents;

  return (
    <PDFDownloadLink
      document={<ProposalDocument proposal={proposal} />}
      fileName={fileName}
      className="block"
    >
      {({ loading, error }: { loading: boolean; error: any }) => (
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <span className="animate-pulse">Generating PDF...</span>
          ) : error ? (
            'Error generating PDF'
          ) : (
            <>
              <FileDown size={20} className="mr-2" />
              Download PDF
            </>
          )}
        </Button>
      )}
    </PDFDownloadLink>
  );
}

export default function HomePage() {
  const { proposal, dispatch } = useProposal();
  const [showPreview, setShowPreview] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const grossCost = calculateGrossProjectCost(proposal);
  const netCost = calculateNetProjectCost(proposal);

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the proposal? All data will be lost.')) {
      dispatch({ type: 'RESET_PROPOSAL' });
    }
  };

  const generateFileName = () => {
    const customerName = proposal.customerName
      ? proposal.customerName.replace(/[^a-zA-Z0-9]/g, '_')
      : 'Customer';
    const date = proposal.preparedDate.toISOString().split('T')[0];
    return `CSEV_Proposal_${customerName}_${date}.pdf`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-csev-green text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap size={32} className="text-white" />
              <div>
                <h1 className="text-2xl font-bold">{COMPANY_INFO.name}</h1>
                <p className="text-sm text-green-100">Proposal Generator</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="border-white text-white hover:bg-white hover:text-csev-green"
              >
                {showPreview ? <EyeOff size={18} className="mr-2" /> : <Eye size={18} className="mr-2" />}
                {showPreview ? 'Hide Summary' : 'Show Summary'}
              </Button>
              <Button
                variant="secondary"
                onClick={handleReset}
              >
                <RotateCcw size={18} className="mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-6">
            <CustomerInfoForm />
            <EVSEForm />
            <InstallationScopeForm />
            <FinancialForm />
            <SiteMapForm />
          </div>

          {/* Sidebar - Summary & Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Quick Summary */}
              {showPreview && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Proposal Summary
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer:</span>
                      <span className="font-medium">
                        {proposal.customerName || 'Not specified'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Project Type:</span>
                      <span className="font-medium capitalize">
                        {proposal.projectType === 'level2' ? 'Level 2' : 'DC Fast'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">EVSE Items:</span>
                      <span className="font-medium">{proposal.evseItems.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Installation Items:</span>
                      <span className="font-medium">
                        {proposal.installationItems.length}
                      </span>
                    </div>

                    <hr className="my-3" />

                    <div className="flex justify-between">
                      <span className="text-gray-600">EVSE Cost:</span>
                      <span className="font-medium">
                        {formatCurrency(proposal.evseCost)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Material Cost:</span>
                      <span className="font-medium">
                        {formatCurrency(proposal.materialCost)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Labor Cost:</span>
                      <span className="font-medium">
                        {formatCurrency(proposal.laborCost)}
                      </span>
                    </div>

                    <hr className="my-3" />

                    <div className="flex justify-between text-base">
                      <span className="text-gray-700 font-medium">Gross Cost:</span>
                      <span className="font-bold">{formatCurrency(grossCost)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-csev-green">
                      <span>Total Incentives:</span>
                      <span>
                        - {formatCurrency(proposal.makeReadyIncentive + proposal.nyseradaIncentive)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg bg-csev-green/10 -mx-6 px-6 py-3 mt-3">
                      <span className="font-bold text-csev-green-dark">Net Cost:</span>
                      <span className="font-bold text-csev-green">
                        {formatCurrency(netCost)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Download Button */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Generate Proposal
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Download a professional 6-page PDF proposal ready to share with your
                  customer.
                </p>

                {mounted && (
                  <PDFDownloadButton proposal={proposal} fileName={generateFileName()} />
                )}
                {!mounted && (
                  <Button variant="primary" size="lg" className="w-full" disabled>
                    <span className="animate-pulse">Loading...</span>
                  </Button>
                )}

                {!proposal.customerName && (
                  <p className="text-xs text-amber-600 mt-3">
                    Tip: Add a customer name for a more professional proposal
                  </p>
                )}
              </div>

              {/* Help Info */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Quick Tips</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Click edit icon to override pricebook prices</li>
                  <li>• Add notes to EVSE items for customization</li>
                  <li>• Upload a site map for a complete proposal</li>
                  <li>• Review payment options on page 5 of PDF</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>{COMPANY_INFO.name} - {COMPANY_INFO.tagline}</p>
          <p className="mt-1">
            {COMPANY_INFO.website} | {COMPANY_INFO.phone}
          </p>
        </div>
      </footer>
    </div>
  );
}
