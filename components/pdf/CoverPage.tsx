import React from 'react';
import { Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { Proposal } from '@/lib/types';
import { COVER_PAGE_TITLES } from '@/lib/constants';
import { getPdfColors, PdfColorPalette, PdfTheme } from './pdfTheme';
import { NODES_IMAGE_BASE64 } from './nodesImage';
import { LOGO_DARK_BASE64 } from './logoDark';
import { LOGO_LIGHT_BASE64 } from './logoLight';
import type { ProjectType } from '@/lib/types';
import { HERO_LEVEL2_BASE64 } from './heroLevel2';

// Hero image mapping by project type
// Replace null values with base64 data URLs when images are provided
const HERO_IMAGES: Record<ProjectType, string | null> = {
  'level2-epc': HERO_LEVEL2_BASE64,
  'level3-epc': null,
  'mixed-epc': null,
  'site-host': null,
  'distribution': null,
};

function getStyles(colors: PdfColorPalette) {
  return StyleSheet.create({
    page: {
      fontFamily: 'Roboto',
      backgroundColor: colors.pageBg,
      position: 'relative',
    },

    // Background nodes — same size as PageWrapper (height: 300)
    backgroundNodes: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 300,
      opacity: 0.075,
    },

    backgroundNodesImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },

    // ── Top: Logo — 75% width, centered ──
    logoSection: {
      paddingTop: 20,
      paddingBottom: 18,
      alignItems: 'center',
      position: 'relative',
      zIndex: 1,
    },

    logoImage: {
      width: '75%',
      objectFit: 'contain',
    },

    // ── Green banner: Title ──
    titleBanner: {
      backgroundColor: colors.primary,
      marginTop: 10,
      paddingVertical: 16,
      paddingHorizontal: 50,
      position: 'relative',
      zIndex: 1,
    },

    mainTitle: {
      fontFamily: 'Orbitron',
      fontSize: 36,
      fontWeight: 700,
      color: colors.white,
      marginBottom: 6,
    },

    projectTypeSubtitle: {
      fontFamily: 'Roboto',
      fontSize: 13,
      fontWeight: 500,
      color: colors.white,
      letterSpacing: 4,
      textTransform: 'uppercase',
    },

    // ── Hero image area — fixed height to keep everything on 1 page ──
    heroSection: {
      position: 'relative',
      zIndex: 1,
      height: 390,
      overflow: 'hidden',
    },

    heroImage: {
      width: '100%',
      height: 390,
      objectFit: 'cover',
    },

    heroPlaceholder: {
      width: '100%',
      height: 390,
      backgroundColor: colors.panelBg,
      justifyContent: 'center',
      alignItems: 'center',
    },

    heroPlaceholderText: {
      fontSize: 14,
      color: colors.textMuted,
    },

    heroPlaceholderSub: {
      fontSize: 10,
      color: colors.textMuted,
      marginTop: 4,
    },

    // ── Green banner: Prepared For (full width, ~33% bigger) ──
    preparedForBanner: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      paddingHorizontal: 50,
      position: 'relative',
      zIndex: 1,
    },

    preparedForLabel: {
      fontFamily: 'Orbitron',
      fontSize: 15,
      fontWeight: 700,
      color: colors.white,
      letterSpacing: 3,
      textTransform: 'uppercase',
      marginBottom: 5,
    },

    preparedForName: {
      fontFamily: 'Roboto',
      fontSize: 14,
      fontWeight: 700,
      color: colors.white,
      marginBottom: 2,
    },

    preparedForAddress: {
      fontFamily: 'Roboto',
      fontSize: 13,
      fontWeight: 400,
      color: colors.white,
    },

    // ── Spacer pushes Prepared On toward bottom ──
    bottomSpacer: {
      flexGrow: 1,
    },

    // ── Prepared On pill (centered) ──
    preparedOnSection: {
      paddingBottom: 20,
      paddingHorizontal: 50,
      alignItems: 'center',
      position: 'relative',
      zIndex: 1,
    },

    preparedOnPill: {
      backgroundColor: colors.panelBg,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 30,
    },

    preparedOnText: {
      fontFamily: 'Roboto',
      fontSize: 12,
      fontWeight: 700,
      color: colors.text,
      letterSpacing: 2,
    },
  });
}

interface CoverPageProps {
  proposal: Proposal;
  theme?: PdfTheme;
}

export function CoverPage({ proposal, theme }: CoverPageProps) {
  const pdfTheme = theme || 'dark';
  const colors = getPdfColors(pdfTheme);
  const styles = getStyles(colors);
  const projectTypeTitle = COVER_PAGE_TITLES[proposal.projectType] || 'EV CHARGING STATIONS';
  const logoSrc = pdfTheme === 'dark' ? LOGO_DARK_BASE64 : LOGO_LIGHT_BASE64;
  const heroImage = HERO_IMAGES[proposal.projectType];

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
      {/* Background nodes — same height as other pages */}
      <View style={styles.backgroundNodes}>
        <Image src={NODES_IMAGE_BASE64} style={styles.backgroundNodesImage} />
      </View>

      {/* Top: Logo — 75% width, centered */}
      <View style={styles.logoSection}>
        <Image src={logoSrc} style={styles.logoImage} />
      </View>

      {/* Green banner: Title + Project Type */}
      <View style={styles.titleBanner}>
        <Text style={styles.mainTitle}>EV Project Proposal</Text>
        <Text style={styles.projectTypeSubtitle}>{projectTypeTitle}</Text>
      </View>

      {/* Hero image — fills remaining space */}
      <View style={styles.heroSection}>
        {heroImage ? (
          <Image src={heroImage} style={styles.heroImage} />
        ) : (
          <View style={styles.heroPlaceholder}>
            <Text style={styles.heroPlaceholderText}>[Hero Image]</Text>
            <Text style={styles.heroPlaceholderSub}>
              Add project-type images to display here
            </Text>
          </View>
        )}
      </View>

      {/* Green banner: Prepared For — full page width */}
      <View style={styles.preparedForBanner}>
        <Text style={styles.preparedForLabel}>PREPARED FOR:</Text>
        <Text style={styles.preparedForName}>
          {proposal.customerName || 'Customer Name'}
        </Text>
        <Text style={styles.preparedForAddress}>
          {fullAddress || 'Customer Address'}
        </Text>
      </View>

      {/* Spacer pushes Prepared On toward bottom of page */}
      <View style={styles.bottomSpacer} />

      {/* Prepared On — bottom pill */}
      <View style={styles.preparedOnSection}>
        <View style={styles.preparedOnPill}>
          <Text style={styles.preparedOnText}>
            PREPARED ON:  {formattedDate}
          </Text>
        </View>
      </View>
    </Page>
  );
}
