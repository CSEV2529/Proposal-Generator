import React from 'react';
import { Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { Proposal } from '@/lib/types';
import { COMPANY_INFO } from '@/lib/constants';
import { colors } from './styles';

const siteStyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 40,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 12,
    marginBottom: 20,
    marginHorizontal: -40,
    marginTop: -40,
  },
  headerText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginBottom: 15,
  },
  mapContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    marginBottom: 20,
    minHeight: 350,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 10,
  },
  placeholderSubtext: {
    fontSize: 9,
    color: colors.textLight,
  },
  notesSection: {
    marginBottom: 20,
  },
  notesTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginBottom: 8,
  },
  notesBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    padding: 15,
    minHeight: 60,
    backgroundColor: colors.background,
  },
  notesText: {
    fontSize: 9,
    color: colors.textLight,
    fontStyle: 'italic',
  },
  signatureSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: colors.background,
    borderRadius: 4,
  },
  signatureTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginBottom: 15,
  },
  signatureText: {
    fontSize: 9,
    color: colors.text,
    marginBottom: 15,
    lineHeight: 1.5,
  },
  signatureGrid: {
    flexDirection: 'row',
    gap: 40,
  },
  signatureBlock: {
    flex: 1,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: colors.text,
    marginBottom: 5,
    height: 25,
  },
  signatureLabel: {
    fontSize: 8,
    color: colors.textLight,
    marginBottom: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: colors.textLight,
  },
});

interface SiteMapPageProps {
  proposal: Proposal;
}

export function SiteMapPage({ proposal }: SiteMapPageProps) {
  return (
    <Page size="LETTER" style={siteStyles.page}>
      <View style={siteStyles.header}>
        <Text style={siteStyles.headerText}>{COMPANY_INFO.name}</Text>
      </View>

      <Text style={siteStyles.title}>Proposed Site Map</Text>

      <View style={siteStyles.mapContainer}>
        {proposal.siteMapImage ? (
          <Image src={proposal.siteMapImage} style={siteStyles.siteMapImage} />
        ) : (
          <View style={siteStyles.placeholder}>
            <Text style={siteStyles.placeholderText}>Site Map Image</Text>
            <Text style={siteStyles.placeholderSubtext}>
              A detailed site map showing proposed charger locations
              {'\n'}will be provided upon site assessment
            </Text>
          </View>
        )}
      </View>

      <View style={siteStyles.notesSection}>
        <Text style={siteStyles.notesTitle}>Site Notes</Text>
        <View style={siteStyles.notesBox}>
          <Text style={siteStyles.notesText}>
            Final charger placement subject to site conditions, utility requirements, and
            customer approval. ChargeSmart EV will conduct a thorough site assessment to
            determine optimal placement for accessibility, visibility, and electrical
            infrastructure.
          </Text>
        </View>
      </View>

      <View style={siteStyles.signatureSection}>
        <Text style={siteStyles.signatureTitle}>Site Map Approval</Text>
        <Text style={siteStyles.signatureText}>
          By signing below, Customer approves the proposed charger locations as shown in
          the site map above. Any changes to approved locations may result in additional
          costs and project timeline adjustments.
        </Text>
        <View style={siteStyles.signatureGrid}>
          <View style={siteStyles.signatureBlock}>
            <View style={siteStyles.signatureLine}></View>
            <Text style={siteStyles.signatureLabel}>Customer Signature</Text>
            <View style={siteStyles.signatureLine}></View>
            <Text style={siteStyles.signatureLabel}>Printed Name</Text>
          </View>
          <View style={siteStyles.signatureBlock}>
            <View style={siteStyles.signatureLine}></View>
            <Text style={siteStyles.signatureLabel}>Date</Text>
            <View style={siteStyles.signatureLine}></View>
            <Text style={siteStyles.signatureLabel}>CSEV Representative</Text>
          </View>
        </View>
      </View>

      <Text style={siteStyles.footer}>Page 6 of 6</Text>
    </Page>
  );
}
