import React from 'react';
import { Document } from '@react-pdf/renderer';
import { Proposal } from '@/lib/types';
import { PdfTheme } from './pdfTheme';
import './fonts';
import { CoverPage } from './CoverPage';
import { WhyCSEVPage } from './WhyCSEVPage';
import { ScopeOfWorkPage } from './ScopeOfWorkPage';
import { FinancialSummaryPage } from './FinancialSummaryPage';
import { PaymentOptionsPage } from './PaymentOptionsPage';
import { SiteMapPage } from './SiteMapPage';

interface ProposalDocumentProps {
  proposal: Proposal;
  theme?: PdfTheme;
}

export function ProposalDocument({ proposal, theme }: ProposalDocumentProps) {
  const pdfTheme = theme || proposal.pdfTheme || 'dark';

  return (
    <Document
      title={`EV Proposal - ${proposal.customerName || 'Customer'}`}
      author="ChargeSmart EV"
      subject="EV Charging Station Proposal"
      creator="ChargeSmart EV Proposal Generator"
    >
      <CoverPage proposal={proposal} theme={pdfTheme} />
      <WhyCSEVPage projectType={proposal.projectType} theme={pdfTheme} />
      <ScopeOfWorkPage proposal={proposal} theme={pdfTheme} />
      <FinancialSummaryPage proposal={proposal} theme={pdfTheme} />
      <PaymentOptionsPage proposal={proposal} theme={pdfTheme} />
      <SiteMapPage proposal={proposal} theme={pdfTheme} />
    </Document>
  );
}
