import React from 'react';
import { Document } from '@react-pdf/renderer';
import { Proposal } from '@/lib/types';
import { CoverPage } from './CoverPage';
import { WhyCSEVPage } from './WhyCSEVPage';
import { ScopeOfWorkPage } from './ScopeOfWorkPage';
import { FinancialSummaryPage } from './FinancialSummaryPage';
import { PaymentOptionsPage } from './PaymentOptionsPage';
import { SiteMapPage } from './SiteMapPage';

interface ProposalDocumentProps {
  proposal: Proposal;
}

export function ProposalDocument({ proposal }: ProposalDocumentProps) {
  return (
    <Document
      title={`EV Proposal - ${proposal.customerName || 'Customer'}`}
      author="ChargeSmart EV"
      subject="EV Charging Station Proposal"
      creator="ChargeSmart EV Proposal Generator"
    >
      <CoverPage proposal={proposal} />
      <WhyCSEVPage />
      <ScopeOfWorkPage proposal={proposal} />
      <FinancialSummaryPage proposal={proposal} />
      <PaymentOptionsPage proposal={proposal} />
      <SiteMapPage proposal={proposal} />
    </Document>
  );
}
