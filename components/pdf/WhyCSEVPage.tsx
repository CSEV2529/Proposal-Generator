import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { WHY_CSEV_CONTENT } from '@/lib/constants';
import { colors } from './styles';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    backgroundColor: colors.slate900,
    position: 'relative',
  },

  content: {
    padding: 40,
    paddingBottom: 100,
  },

  // Page title
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },

  titleUnderline: {
    color: colors.primary,
  },

  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'right',
    marginBottom: 20,
  },

  // Two column layout
  twoColumn: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },

  leftColumn: {
    width: '35%',
  },

  rightColumn: {
    width: '65%',
  },

  // Image placeholder
  imagePlaceholder: {
    height: 150,
    backgroundColor: colors.slate800,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
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
    marginBottom: 15,
  },

  marketsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },

  marketBox: {
    flex: 1,
    backgroundColor: colors.slate800,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: 3,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },

  marketText: {
    fontSize: 9,
    color: colors.text,
    textAlign: 'center',
  },

  andMore: {
    fontSize: 11,
    color: colors.primary,
    fontStyle: 'italic',
    textAlign: 'right',
    marginTop: 5,
  },

  // What We Offer section
  offerSection: {
    backgroundColor: colors.slate800,
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  offerTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    letterSpacing: 1,
  },

  offerItem: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'center',
  },

  offerBullet: {
    width: 15,
    fontSize: 10,
    color: colors.primary,
  },

  offerText: {
    flex: 1,
    fontSize: 10,
    color: colors.textLight,
  },

  // Charger image placeholder (right side)
  chargerImagePlaceholder: {
    height: 200,
    backgroundColor: colors.slate800,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Mission section
  missionSection: {
    marginTop: 20,
    backgroundColor: colors.slate800,
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopWidth: 4,
    borderTopColor: colors.primary,
  },

  missionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
    letterSpacing: 1,
  },

  missionParagraph: {
    fontSize: 10,
    color: colors.textLight,
    lineHeight: 1.5,
    marginBottom: 10,
    textAlign: 'justify',
  },

  // Footer
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

export function WhyCSEVPage() {
  return (
    <Page size="LETTER" style={styles.page}>
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>
          <Text style={styles.titleUnderline}>Why ChargeSmart EV?</Text>
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
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerLeft}>ChargeSmart EV Proposal</Text>
        <Text style={styles.footerRight}>02</Text>
      </View>
    </Page>
  );
}
