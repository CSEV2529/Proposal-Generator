import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { Proposal } from '@/lib/types';
import { getPdfColors, PdfColorPalette, PdfTheme } from './pdfTheme';
import { PageWrapper } from './PageWrapper';

function getStyles(colors: PdfColorPalette) {
  return StyleSheet.create({
    // Title — Orbitron 28px, matches pages 2-5
    title: {
      fontFamily: 'Orbitron',
      fontSize: 28,
      fontWeight: 700,
      color: colors.white,
      marginBottom: 8,
    },

    introText: {
      fontFamily: 'Roboto',
      fontSize: 9,
      color: colors.textLight,
      lineHeight: 1.5,
      marginBottom: 10,
    },

    // Image container — centered vertically in available space
    imageContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    siteMapImage: {
      width: '80%',
      objectFit: 'contain',
    },

    placeholder: {
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },

    placeholderText: {
      fontFamily: 'Orbitron',
      fontSize: 28,
      color: colors.textMuted,
    },

    placeholderSubtext: {
      fontFamily: 'Roboto',
      fontSize: 10,
      color: colors.textMuted,
    },

    // Site Map Approval — pinned to bottom via flexGrow spacer above
    sectionHeader: {
      flexDirection: 'row',
      backgroundColor: colors.headerBg,
      paddingVertical: 5,
      paddingHorizontal: 15,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },

    sectionHeaderText: {
      fontFamily: 'Roboto',
      color: colors.primary,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 0.5,
    },

    approvalContent: {
      paddingHorizontal: 15,
      paddingTop: 8,
    },

    signatureRow: {
      marginBottom: 6,
    },

    signatureLabel: {
      fontFamily: 'Roboto',
      fontSize: 8,
      color: colors.textMuted,
      fontWeight: 700,
      marginBottom: 2,
    },

    signatureLine: {
      borderBottomWidth: 1,
      borderBottomColor: colors.textMuted,
      height: 14,
    },
  });
}

interface SiteMapPageProps {
  proposal: Proposal;
  theme?: PdfTheme;
}

export function SiteMapPage({ proposal, theme }: SiteMapPageProps) {
  const colors = getPdfColors(theme);
  const styles = getStyles(colors);

  return (
    <PageWrapper pageNumber={6} showDisclaimer={true} disclaimerBorder={false} theme={theme}>
      {/* Title */}
      <Text style={styles.title}>Proposed Site Map</Text>

      <Text style={styles.introText}>
        Below you will see a proposed site map for installing EV chargers at your location. Actual Scope of
        Work may change depending on power availability, utility determinations and other on-site factors.
      </Text>

      {/* Image — centered vertically in available space */}
      <View style={styles.imageContainer}>
        {proposal.siteMapImage ? (
          <Image src={proposal.siteMapImage} style={styles.siteMapImage} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Site Map TBD</Text>
          </View>
        )}
      </View>

      {/* Site Map Approval — pinned to bottom */}
      <View style={{ marginBottom: 15 }}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Site Map Approval</Text>
        </View>
        <View style={styles.approvalContent}>
          {(proposal.projectType === 'site-host' || proposal.projectType === 'level2-site-host') && (
            <View style={styles.signatureRow}>
              <Text style={styles.signatureLabel}>Location Option Selected</Text>
              <View style={styles.signatureLine} />
            </View>
          )}
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
