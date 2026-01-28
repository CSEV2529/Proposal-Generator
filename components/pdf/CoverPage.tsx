import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { Proposal } from '@/lib/types';
import { PROJECT_TYPES, COMPANY_INFO } from '@/lib/constants';
import { colors } from './styles';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: colors.slate900,
    position: 'relative',
  },

  // Logo section at top
  logoSection: {
    paddingTop: 40,
    paddingHorizontal: 40,
    marginBottom: 20,
  },

  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
  },

  logoCharge: {
    color: colors.primary,
  },

  logoSmart: {
    color: colors.text,
  },

  logoEV: {
    color: colors.text,
  },

  tagline: {
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: 4,
  },

  // Green accent banner with title
  banner: {
    backgroundColor: colors.slate800,
    paddingVertical: 30,
    paddingHorizontal: 40,
    marginTop: 10,
    borderTopWidth: 4,
    borderTopColor: colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  bannerTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 10,
  },

  bannerSubtitle: {
    fontSize: 14,
    color: colors.primary,
    textAlign: 'center',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },

  // Hero image placeholder
  heroSection: {
    height: 280,
    backgroundColor: colors.slate800,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    margin: 40,
    marginTop: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },

  heroPlaceholder: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },

  // Prepared For section
  preparedForSection: {
    marginHorizontal: 40,
    marginTop: 10,
    paddingLeft: 15,
    paddingVertical: 15,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    backgroundColor: colors.slate800,
    borderRadius: 4,
  },

  preparedForLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    letterSpacing: 2,
  },

  customerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },

  customerAddress: {
    fontSize: 12,
    color: colors.textMuted,
  },

  // Date box at bottom
  dateBox: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  dateBoxInner: {
    backgroundColor: colors.slate700,
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.primary,
  },

  dateText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

interface CoverPageProps {
  proposal: Proposal;
}

export function CoverPage({ proposal }: CoverPageProps) {
  const projectTypeLabel = PROJECT_TYPES[proposal.projectType]?.label || proposal.projectType;

  const fullAddress = [
    proposal.customerAddress,
    [proposal.customerCity, proposal.customerState, proposal.customerZip]
      .filter(Boolean)
      .join(', '),
  ]
    .filter(Boolean)
    .join(', ');

  // Format date as "MONTH DD, YYYY"
  const formattedDate = proposal.preparedDate
    ? new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
        .format(new Date(proposal.preparedDate))
        .toUpperCase()
    : 'DATE NOT SET';

  return (
    <Page size="LETTER" style={styles.page}>
      {/* Logo */}
      <View style={styles.logoSection}>
        <Text style={styles.logoText}>
          <Text style={styles.logoCharge}>Charge</Text>
          <Text style={styles.logoSmart}>Smart EV</Text>
          <Text style={{ fontSize: 12, verticalAlign: 'super' }}>®</Text>
        </Text>
        <Text style={styles.tagline}>{COMPANY_INFO.tagline}</Text>
      </View>

      {/* Green Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>EV Project Proposal</Text>
        <Text style={styles.bannerSubtitle}>{projectTypeLabel.toUpperCase()}</Text>
      </View>

      {/* Hero Image Placeholder */}
      <View style={styles.heroSection}>
        <Text style={styles.heroPlaceholder}>
          [EV Charger Image]
          {'\n'}
          Upload a cover image in the app settings
        </Text>
      </View>

      {/* Prepared For */}
      <View style={styles.preparedForSection}>
        <Text style={styles.preparedForLabel}>PREPARED FOR:</Text>
        <Text style={styles.customerName}>
          {proposal.customerName || 'Customer Name'}
        </Text>
        <Text style={styles.customerAddress}>
          {fullAddress || 'Customer Address'}
        </Text>
      </View>

      {/* Date Box */}
      <View style={styles.dateBox}>
        <View style={styles.dateBoxInner}>
          <Text style={styles.dateText}>PREPARED ON: {formattedDate}</Text>
        </View>
      </View>
    </Page>
  );
}
