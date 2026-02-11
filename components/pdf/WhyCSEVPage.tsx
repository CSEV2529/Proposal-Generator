import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { WHY_CSEV_CONTENT } from '@/lib/constants';
import { getPdfColors, PdfColorPalette, PdfTheme } from './pdfTheme';
import { PageWrapper } from './PageWrapper';
import { INSTALLATION_IMAGE_L2_BASE64 } from './installationImageL2';
import { INSTALLATION_IMAGE_L3_BASE64 } from './installationImageL3';
import { INSTALLATION_IMAGE_MIXED_BASE64 } from './installationImageMixed';
import { INSTALLATION_IMAGE_SITE_HOST_BASE64 } from './installationImageSiteHost';
import { INSTALLATION_IMAGE_DISTRIBUTION_BASE64 } from './installationImageDistribution';
import { STATION_IMAGE_L2_BASE64 } from './stationImageL2';
import { STATION_IMAGE_L3_BASE64 } from './stationImageL3';
import { STATION_IMAGE_MIXED_BASE64 } from './stationImageMixed';
import { STATION_IMAGE_SITE_HOST_BASE64 } from './stationImageSiteHost';
import { STATION_IMAGE_DISTRIBUTION_BASE64 } from './stationImageDistribution';
import type { ProjectType } from '@/lib/types';

// Image mapping by project type
const INSTALLATION_IMAGES: Record<ProjectType, string | null> = {
  'level2-epc': INSTALLATION_IMAGE_L2_BASE64,
  'level3-epc': INSTALLATION_IMAGE_L3_BASE64,
  'mixed-epc': INSTALLATION_IMAGE_MIXED_BASE64,
  'site-host': INSTALLATION_IMAGE_SITE_HOST_BASE64,
  'distribution': INSTALLATION_IMAGE_DISTRIBUTION_BASE64,
};

const STATION_IMAGES: Record<ProjectType, string | null> = {
  'level2-epc': STATION_IMAGE_L2_BASE64,
  'level3-epc': STATION_IMAGE_L3_BASE64,
  'mixed-epc': STATION_IMAGE_MIXED_BASE64,
  'site-host': STATION_IMAGE_SITE_HOST_BASE64,
  'distribution': STATION_IMAGE_DISTRIBUTION_BASE64,
};

function getStyles(colors: PdfColorPalette) {
  return StyleSheet.create({
    // Page title — Orbitron
    title: {
      fontFamily: 'Orbitron',
      fontSize: 28,
      fontWeight: 700,
      color: colors.white,
      marginBottom: 12,
    },

    // ── Top section: installation image (left) + subtitle/grid/offer (right) ──
    topRow: {
      flexDirection: 'row',
      marginBottom: 6,
    },

    installationImageCol: {
      width: '35%',
      marginRight: 14,
    },

    // Height spans from top of grid to bottom of What We Offer
    installationImage: {
      width: '100%',
      height: 242,
      objectFit: 'cover',
      borderRadius: 6,
    },

    installationPlaceholder: {
      width: '100%',
      height: 242,
      backgroundColor: colors.panelBg,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.border,
    },

    placeholderText: {
      fontSize: 9,
      color: colors.textMuted,
    },

    rightCol: {
      flex: 1,
    },

    subtitle: {
      fontSize: 11,
      fontFamily: 'Roboto',
      color: colors.primary,
      textAlign: 'left',
      marginBottom: 6,
    },

    // Markets grid
    marketsGrid: {
      marginBottom: 4,
    },

    marketsRow: {
      flexDirection: 'row',
      marginBottom: 5,
    },

    marketBox: {
      flex: 1,
      backgroundColor: colors.panelBg,
      paddingVertical: 10,
      paddingHorizontal: 6,
      marginHorizontal: 3,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 4,
      borderLeftWidth: 3,
      borderLeftColor: colors.primary,
      minHeight: 40,
    },

    marketText: {
      fontSize: 9.5,
      fontFamily: 'Roboto',
      fontWeight: 500,
      color: colors.text,
      textAlign: 'center',
    },

    andMore: {
      fontSize: 9,
      fontFamily: 'Roboto',
      color: colors.primary,
      textAlign: 'right',
      marginTop: 0,
      marginBottom: 9,
    },

    // What We Offer — full width of right column, below grid
    offerSection: {
      backgroundColor: colors.panelBg,
      padding: 10,
      marginHorizontal: 3,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.border,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },

    offerTitle: {
      fontSize: 11,
      fontFamily: 'Roboto',
      fontWeight: 700,
      color: colors.primary,
      marginBottom: 6,
      letterSpacing: 1,
      borderBottomWidth: 1,
      borderBottomColor: colors.primary,
      alignSelf: 'flex-start',
    },

    offerItem: {
      flexDirection: 'row',
      marginBottom: 4,
      alignItems: 'center',
    },

    offerBullet: {
      width: 14,
      fontSize: 10,
      color: colors.primary,
      fontWeight: 700,
    },

    offerText: {
      flex: 1,
      fontSize: 9,
      fontFamily: 'Roboto',
      color: colors.textLight,
      fontWeight: 500,
    },

    // ── Bottom section: Mission (left) + Station image (right) ──
    // Fixed height to prevent page overflow (LETTER=792, top content ~280, padding ~90)
    bottomRow: {
      flexDirection: 'row',
      height: 380,
      marginTop: 10,
    },

    bottomLeftCol: {
      width: '60%',
      marginRight: 10,
      height: 380,
    },

    bottomRightCol: {
      width: '40%',
      alignItems: 'center',
      justifyContent: 'flex-end',
      height: 380,
    },

    // Station image — bottom-aligned with mission section
    stationImage: {
      width: '90%',
      height: 370,
      objectFit: 'contain',
    },

    stationPlaceholder: {
      width: '100%',
      height: 380,
      backgroundColor: colors.panelBg,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },

    // Mission section — no background box, text fills space
    missionSection: {
      height: 380,
      paddingTop: 14,
    },

    missionTitle: {
      fontSize: 14,
      fontFamily: 'Roboto',
      fontWeight: 700,
      color: colors.primary,
      marginBottom: 10,
      letterSpacing: 1,
    },

    missionParagraph: {
      fontSize: 10.5,
      fontFamily: 'Roboto',
      color: colors.textLight,
      lineHeight: 1.6,
      marginBottom: 10,
      textAlign: 'justify',
    },
  });
}

interface WhyCSEVPageProps {
  projectType?: ProjectType;
  theme?: PdfTheme;
}

export function WhyCSEVPage({ projectType = 'level2-epc', theme }: WhyCSEVPageProps) {
  const colors = getPdfColors(theme);
  const styles = getStyles(colors);
  const installationImage = INSTALLATION_IMAGES[projectType];
  const stationImage = STATION_IMAGES[projectType];

  return (
    <PageWrapper pageNumber={2} showDisclaimer={false} theme={theme}>
      {/* Title */}
      <Text style={styles.title}>Why ChargeSmart EV?</Text>

      {/* Top section: Installation image (left) + subtitle/grid/offer (right) */}
      <View style={styles.topRow}>
        {/* Left — installation image spanning grid top to offer bottom */}
        <View style={styles.installationImageCol}>
          {installationImage ? (
            <Image src={installationImage} style={styles.installationImage} />
          ) : (
            <View style={styles.installationPlaceholder}>
              <Text style={styles.placeholderText}>[Installation Image]</Text>
            </View>
          )}
        </View>

        {/* Right — subtitle + 2x3 grid + and more + What We Offer */}
        <View style={styles.rightCol}>
          <Text style={styles.subtitle}>{WHY_CSEV_CONTENT.subtitle}</Text>

          <View style={styles.marketsGrid}>
            <View style={styles.marketsRow}>
              <View style={styles.marketBox}>
                <Text style={styles.marketText}>Multi-family/</Text>
                <Text style={styles.marketText}>Apartments</Text>
              </View>
              <View style={styles.marketBox}>
                <Text style={styles.marketText}>Hotels/</Text>
                <Text style={styles.marketText}>Hospitality</Text>
              </View>
              <View style={styles.marketBox}>
                <Text style={styles.marketText}>Retail/</Text>
                <Text style={styles.marketText}>Shopping Plazas</Text>
              </View>
            </View>
            <View style={styles.marketsRow}>
              <View style={styles.marketBox}>
                <Text style={styles.marketText}>Workplaces</Text>
              </View>
              <View style={styles.marketBox}>
                <Text style={styles.marketText}>Auto</Text>
                <Text style={styles.marketText}>Dealerships</Text>
              </View>
              <View style={styles.marketBox}>
                <Text style={styles.marketText}>Municipalities</Text>
              </View>
            </View>
          </View>
          <Text style={styles.andMore}>...and more</Text>

          {/* What We Offer — spans full width of right column */}
          <View style={styles.offerSection}>
            <Text style={styles.offerTitle}>What We Offer:</Text>
            {WHY_CSEV_CONTENT.whatWeOffer.map((item, index) => (
              <View key={index} style={styles.offerItem}>
                <Text style={styles.offerBullet}>•</Text>
                <Text style={styles.offerText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Bottom section: Mission (left) + Station image (right) */}
      <View style={styles.bottomRow}>
        <View style={styles.bottomLeftCol}>
          <View style={styles.missionSection}>
            <Text style={styles.missionTitle}>{WHY_CSEV_CONTENT.missionTitle}</Text>
            {WHY_CSEV_CONTENT.missionParagraphs.map((paragraph, index) => (
              <Text key={index} style={styles.missionParagraph}>
                {paragraph}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.bottomRightCol}>
          {stationImage ? (
            <Image src={stationImage} style={styles.stationImage} />
          ) : (
            <View style={styles.stationPlaceholder}>
              <Text style={styles.placeholderText}>[Station Image]</Text>
            </View>
          )}
        </View>
      </View>
    </PageWrapper>
  );
}
