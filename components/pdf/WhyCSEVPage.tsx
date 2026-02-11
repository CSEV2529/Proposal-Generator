import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { WHY_CSEV_CONTENT } from '@/lib/constants';
import { PdfTheme } from './pdfTheme';
import { colors } from './styles';
import { PageWrapper } from './PageWrapper';

const styles = StyleSheet.create({
  // Page title
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },

  titleAccent: {
    color: colors.primary,
  },

  subtitle: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'right',
    marginBottom: 18,
  },

  // Two column layout
  twoColumn: {
    flexDirection: 'row',
    gap: 18,
    marginBottom: 18,
  },

  leftColumn: {
    width: '35%',
  },

  rightColumn: {
    width: '65%',
  },

  // Image placeholder
  imagePlaceholder: {
    height: 140,
    backgroundColor: colors.panelBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },

  imagePlaceholderText: {
    fontSize: 10,
    color: colors.textMuted,
  },

  // Markets grid
  marketsGrid: {
    marginBottom: 12,
  },

  marketsRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },

  marketBox: {
    flex: 1,
    backgroundColor: colors.panelBg,
    paddingVertical: 10,
    paddingHorizontal: 6,
    marginHorizontal: 3,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },

  marketText: {
    fontSize: 8,
    color: colors.text,
    textAlign: 'center',
  },

  andMore: {
    fontSize: 10,
    color: colors.primary,
    fontStyle: 'italic',
    textAlign: 'right',
    marginTop: 4,
  },

  // What We Offer section
  offerSection: {
    backgroundColor: colors.panelBg,
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  offerTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    letterSpacing: 1,
  },

  offerItem: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center',
  },

  offerBullet: {
    width: 14,
    fontSize: 10,
    color: colors.primary,
  },

  offerText: {
    flex: 1,
    fontSize: 9,
    color: colors.textLight,
  },

  // Charger image placeholder (right side)
  chargerImagePlaceholder: {
    height: 180,
    backgroundColor: colors.panelBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Mission section
  missionSection: {
    marginTop: 15,
    backgroundColor: colors.panelBg,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopWidth: 4,
    borderTopColor: colors.primary,
  },

  missionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    letterSpacing: 1,
  },

  missionParagraph: {
    fontSize: 9,
    color: colors.textLight,
    lineHeight: 1.5,
    marginBottom: 8,
    textAlign: 'justify',
  },
});

interface WhyCSEVPageProps {
  theme?: PdfTheme;
}

export function WhyCSEVPage({}: WhyCSEVPageProps) {
  return (
    <PageWrapper pageNumber={2} showDisclaimer={false}>
      {/* Title */}
      <Text style={styles.title}>
        <Text style={styles.titleAccent}>Why ChargeSmart EV?</Text>
      </Text>

      <Text style={styles.subtitle}>{WHY_CSEV_CONTENT.subtitle}</Text>

      {/* Two column layout */}
      <View style={styles.twoColumn}>
        {/* Left column - image */}
        <View style={styles.leftColumn}>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>[Charger Installation Image]</Text>
          </View>
        </View>

        {/* Right column - markets grid */}
        <View style={styles.rightColumn}>
          <View style={styles.marketsGrid}>
            {/* Row 1 */}
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
            {/* Row 2 */}
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
        </View>
      </View>

      {/* What We Offer + Charger Image row */}
      <View style={styles.twoColumn}>
        <View style={styles.leftColumn}>
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

        <View style={styles.rightColumn}>
          <View style={styles.chargerImagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>[Single Charger Image]</Text>
          </View>
        </View>
      </View>

      {/* Mission Section */}
      <View style={styles.missionSection}>
        <Text style={styles.missionTitle}>{WHY_CSEV_CONTENT.missionTitle}</Text>
        {WHY_CSEV_CONTENT.missionParagraphs.map((paragraph, index) => (
          <Text key={index} style={styles.missionParagraph}>
            {paragraph}
          </Text>
        ))}
      </View>
    </PageWrapper>
  );
}
