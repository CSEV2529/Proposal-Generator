import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { WHY_CSEV_CONTENT, COMPANY_INFO } from '@/lib/constants';
import { colors, styles } from './styles';

const whyStyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 40,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 15,
    marginBottom: 25,
    marginHorizontal: -40,
    marginTop: -40,
  },
  headerText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginBottom: 15,
    textAlign: 'center',
  },
  missionSection: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: colors.background,
    borderRadius: 4,
  },
  missionText: {
    fontSize: 11,
    color: colors.text,
    lineHeight: 1.6,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginBottom: 12,
    marginTop: 10,
  },
  marketsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  marketItem: {
    width: '50%',
    paddingRight: 10,
    marginBottom: 12,
  },
  marketName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 3,
  },
  marketDesc: {
    fontSize: 9,
    color: colors.textLight,
    lineHeight: 1.4,
  },
  offerList: {
    marginTop: 10,
  },
  offerItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  checkmark: {
    width: 18,
    fontSize: 12,
    color: colors.primary,
  },
  offerText: {
    flex: 1,
    fontSize: 10,
    color: colors.text,
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: colors.textLight,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
});

export function WhyCSEVPage() {
  return (
    <Page size="LETTER" style={whyStyles.page}>
      <View style={whyStyles.header}>
        <Text style={whyStyles.headerText}>{COMPANY_INFO.name}</Text>
      </View>

      <Text style={whyStyles.title}>Why ChargeSmart EV?</Text>

      <View style={whyStyles.missionSection}>
        <Text style={whyStyles.missionText}>{WHY_CSEV_CONTENT.mission}</Text>
      </View>

      <Text style={whyStyles.sectionTitle}>Markets We Serve</Text>
      <View style={whyStyles.marketsGrid}>
        {WHY_CSEV_CONTENT.targetMarkets.map((market, index) => (
          <View key={index} style={whyStyles.marketItem}>
            <Text style={whyStyles.marketName}>{market.name}</Text>
            <Text style={whyStyles.marketDesc}>{market.description}</Text>
          </View>
        ))}
      </View>

      <Text style={whyStyles.sectionTitle}>What We Offer</Text>
      <View style={whyStyles.offerList}>
        {WHY_CSEV_CONTENT.whatWeOffer.map((item, index) => (
          <View key={index} style={whyStyles.offerItem}>
            <Text style={whyStyles.checkmark}>✓</Text>
            <Text style={whyStyles.offerText}>{item}</Text>
          </View>
        ))}
      </View>

      <Text style={whyStyles.footer}>
        {COMPANY_INFO.name} - {COMPANY_INFO.tagline}
      </Text>
    </Page>
  );
}
