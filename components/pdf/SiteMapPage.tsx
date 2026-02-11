import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { Proposal } from '@/lib/types';
import { PdfTheme } from './pdfTheme';
import { colors } from './styles';
import { PageWrapper } from './PageWrapper';

const styles = StyleSheet.create({
  // Title
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },

  titleAccent: {
    color: colors.primary,
  },

  introText: {
    fontSize: 9,
    color: colors.textLight,
    lineHeight: 1.5,
    marginBottom: 15,
  },

  // Map container
  mapContainer: {
    flex: 1,
    minHeight: 340,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.panelBg,
    borderRadius: 8,
  },

  siteMapImage: {
    maxWidth: '100%',
    maxHeight: 340,
    objectFit: 'contain',
  },

  placeholder: {
    textAlign: 'center',
    padding: 40,
  },

  placeholderText: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 10,
  },

  placeholderSubtext: {
    fontSize: 10,
    color: colors.textMuted,
  },

  // Site Map Approval section
  approvalSection: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: colors.panelBg,
  },

  approvalHeader: {
    backgroundColor: colors.headerBg,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  approvalHeaderText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  approvalContent: {
    padding: 15,
  },

  signatureRow: {
    marginBottom: 12,
  },

  signatureLabel: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: 'bold',
    marginBottom: 3,
  },

  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: colors.textMuted,
    height: 18,
  },
});

interface SiteMapPageProps {
  proposal: Proposal;
  theme?: PdfTheme;
}

export function SiteMapPage({ proposal }: SiteMapPageProps) {
  return (
    <PageWrapper pageNumber={6} showDisclaimer={true}>
      {/* Title */}
      <Text style={styles.title}>
        <Text style={styles.titleAccent}>Proposed Site Map</Text>
      </Text>

      <Text style={styles.introText}>
        Below you will see a proposed site map for installing EV chargers at your location. Actual Scope of
        Work may change depending on power availability, utility determinations and other on-site factors.
      </Text>

      {/* Map Container */}
      <View style={styles.mapContainer}>
        {proposal.siteMapImage ? (
          <Image src={proposal.siteMapImage} style={styles.siteMapImage} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>[Site Map Image]</Text>
            <Text style={styles.placeholderSubtext}>
              Upload a site map image in the app to display here
            </Text>
          </View>
        )}
      </View>

      {/* Site Map Approval */}
      <View style={styles.approvalSection} wrap={false}>
        <View style={styles.approvalHeader}>
          <Text style={styles.approvalHeaderText}>Site Map Approval</Text>
        </View>
        <View style={styles.approvalContent}>
          <View style={styles.signatureRow}>
            <Text style={styles.signatureLabel}>Signature</Text>
            <View style={styles.signatureLine} />
          </View>
          <View style={styles.signatureRow}>
            <Text style={styles.signatureLabel}>Date Signed</Text>
            <View style={styles.signatureLine} />
          </View>
        </View>
      </View>
    </PageWrapper>
  );
}
