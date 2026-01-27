import React from 'react';
import { Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { Proposal } from '@/lib/types';
import { colors, DISCLAIMER_TEXT } from './styles';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    backgroundColor: colors.slate900,
    position: 'relative',
  },

  content: {
    padding: 40,
    paddingBottom: 120,
  },

  // Title
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },

  titleUnderline: {
    color: colors.primary,
  },

  introText: {
    fontSize: 10,
    color: colors.textLight,
    lineHeight: 1.5,
    marginBottom: 20,
  },

  // Map container
  mapContainer: {
    flex: 1,
    minHeight: 350,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.slate800,
    borderRadius: 8,
  },

  siteMapImage: {
    maxWidth: '100%',
    maxHeight: 350,
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
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.slate800,
  },

  approvalAccentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.primary,
  },

  approvalHeader: {
    backgroundColor: colors.slate700,
    paddingVertical: 10,
    paddingHorizontal: 15,
    paddingLeft: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  approvalHeaderText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  approvalContent: {
    padding: 20,
    paddingLeft: 25,
  },

  signatureRow: {
    marginBottom: 15,
  },

  signatureLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: 'bold',
    marginBottom: 3,
  },

  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: colors.textMuted,
    height: 20,
  },

  // Disclaimer footer
  disclaimerFooter: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    backgroundColor: colors.slate800,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderTopWidth: 1,
    borderTopColor: colors.primary,
  },

  disclaimerText: {
    fontSize: 7,
    color: colors.textMuted,
    lineHeight: 1.4,
  },

  // Page footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },

  footerLeft: {
    fontSize: 9,
    color: colors.textMuted,
  },

  footerRight: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
});

interface SiteMapPageProps {
  proposal: Proposal;
}

export function SiteMapPage({ proposal }: SiteMapPageProps) {
  return (
    <Page size="LETTER" style={styles.page}>
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>
          <Text style={styles.titleUnderline}>Proposed Site Map</Text>
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
        <View style={styles.approvalSection}>
          <View style={styles.approvalAccentBar} />
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
      </View>

      {/* Disclaimer Footer */}
      <View style={styles.disclaimerFooter}>
        <Text style={styles.disclaimerText}>{DISCLAIMER_TEXT}</Text>
      </View>

      {/* Page Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerLeft}>ChargeSmart EV Proposal</Text>
        <Text style={styles.footerRight}>06</Text>
      </View>
    </Page>
  );
}
