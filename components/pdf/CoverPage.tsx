import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { Proposal } from '@/lib/types';
import { formatDate } from '@/lib/calculations';
import { PROJECT_TYPES, COMPANY_INFO } from '@/lib/constants';
import { colors } from './styles';

const coverStyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: colors.white,
  },
  greenBanner: {
    backgroundColor: colors.primary,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  companyName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 10,
  },
  tagline: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 60,
    justifyContent: 'center',
  },
  proposalTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginBottom: 20,
    textAlign: 'center',
  },
  projectType: {
    fontSize: 18,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 60,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  preparedFor: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 10,
  },
  customerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 10,
  },
  customerAddress: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 40,
  },
  dateSection: {
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 10,
    color: colors.textLight,
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: colors.text,
  },
  footer: {
    backgroundColor: colors.background,
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    color: colors.textLight,
  },
});

interface CoverPageProps {
  proposal: Proposal;
}

export function CoverPage({ proposal }: CoverPageProps) {
  const projectTypeLabel =
    proposal.projectType === 'level2'
      ? PROJECT_TYPES.level2.label
      : PROJECT_TYPES.dcfc.label;

  const fullAddress = [
    proposal.customerAddress,
    proposal.customerCity,
    proposal.customerState,
    proposal.customerZip,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Page size="LETTER" style={coverStyles.page}>
      <View style={coverStyles.greenBanner}>
        <Text style={coverStyles.companyName}>{COMPANY_INFO.name}</Text>
        <Text style={coverStyles.tagline}>{COMPANY_INFO.tagline}</Text>
      </View>

      <View style={coverStyles.content}>
        <Text style={coverStyles.proposalTitle}>EV Project Proposal</Text>
        <Text style={coverStyles.projectType}>{projectTypeLabel}</Text>

        <Text style={coverStyles.preparedFor}>Prepared For</Text>
        <Text style={coverStyles.customerName}>
          {proposal.customerName || 'Customer Name'}
        </Text>
        <Text style={coverStyles.customerAddress}>
          {fullAddress || 'Customer Address'}
        </Text>

        <View style={coverStyles.dateSection}>
          <Text style={coverStyles.dateLabel}>Prepared Date</Text>
          <Text style={coverStyles.date}>{formatDate(proposal.preparedDate)}</Text>
        </View>
      </View>

      <View style={coverStyles.footer}>
        <Text style={coverStyles.footerText}>
          {COMPANY_INFO.website} | {COMPANY_INFO.phone} | {COMPANY_INFO.email}
        </Text>
      </View>
    </Page>
  );
}
