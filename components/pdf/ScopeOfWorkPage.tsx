import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { Proposal } from '@/lib/types';
import { RESPONSIBILITIES } from '@/lib/constants';
import { colors, SOW_DISCLAIMER_TEXT } from './styles';

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
    marginBottom: 20,
  },

  titleUnderline: {
    color: colors.primary,
  },

  // Table header
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.slate700,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  tableHeaderItem: {
    flex: 3,
    color: colors.primary,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  tableHeaderQty: {
    width: 80,
    color: colors.primary,
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  tableHeaderNotes: {
    flex: 2,
    color: colors.primary,
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Section label (EVSE, INSTALLATION SCOPE)
  sectionLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: colors.slate800,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },

  qtyUpTo: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: 'bold',
  },

  // Table row
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.slate800,
  },

  tableRowItem: {
    flex: 3,
    fontSize: 9,
    color: colors.textLight,
    paddingLeft: 15,
  },

  tableRowQty: {
    width: 80,
    fontSize: 10,
    color: colors.text,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  tableRowNotes: {
    flex: 2,
    fontSize: 8,
    color: colors.textMuted,
    textAlign: 'center',
  },

  // Empty row placeholder
  emptyRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.slate800,
  },

  emptyCell: {
    fontSize: 9,
    color: colors.textMuted,
    textAlign: 'center',
  },

  // Responsibilities section
  responsibilitiesContainer: {
    marginTop: 20,
  },

  responsibilitiesGrid: {
    flexDirection: 'row',
    gap: 15,
  },

  responsibilityBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.slate800,
  },

  responsibilityHeader: {
    backgroundColor: colors.slate700,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  responsibilityHeaderText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  responsibilityContent: {
    padding: 12,
  },

  responsibilityItem: {
    fontSize: 9,
    color: colors.textLight,
    marginBottom: 6,
    lineHeight: 1.4,
  },

  // Disclaimer footer
  disclaimerFooter: {
    position: 'absolute',
    bottom: 50,
    left: 40,
    right: 40,
    backgroundColor: colors.slate800,
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
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

interface ScopeOfWorkPageProps {
  proposal: Proposal;
}

export function ScopeOfWorkPage({ proposal }: ScopeOfWorkPageProps) {
  // Helper to get unit display
  const getUnitSuffix = (unit: string) => {
    switch (unit) {
      case 'ft':
        return ' (ft)';
      case 'each':
        return '';
      case 'circuit':
        return '';
      case 'project':
        return '';
      default:
        return '';
    }
  };

  return (
    <Page size="LETTER" style={styles.page}>
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>
          <Text style={styles.titleUnderline}>Proposed Scope of Work</Text>
        </Text>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderItem}>Item</Text>
          <Text style={styles.tableHeaderQty}>Quantity</Text>
          <Text style={styles.tableHeaderNotes}>Notes</Text>
        </View>

        {/* EVSE Section */}
        <View style={styles.sectionLabel}>
          <Text>EVSE</Text>
        </View>

        {proposal.evseItems.length === 0 ? (
          <View style={styles.emptyRow}>
            <Text style={[styles.tableRowItem, { fontStyle: 'italic', color: colors.textLight }]}>
              No equipment specified
            </Text>
            <Text style={styles.tableRowQty}>-</Text>
            <Text style={styles.tableRowNotes}>-</Text>
          </View>
        ) : (
          proposal.evseItems.map((item, index) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.tableRowItem}>{item.name}</Text>
              <Text style={styles.tableRowQty}>{item.quantity}</Text>
              <Text style={styles.tableRowNotes}>{item.notes || '-'}</Text>
            </View>
          ))
        )}

        {/* Empty placeholder row */}
        <View style={styles.tableRow}>
          <Text style={styles.tableRowItem}>-</Text>
          <Text style={styles.tableRowQty}>-</Text>
          <Text style={styles.tableRowNotes}>-</Text>
        </View>

        {/* Installation Scope Section */}
        <View style={[styles.sectionLabel, { flexDirection: 'row', justifyContent: 'space-between' }]}>
          <Text>INSTALLATION SCOPE</Text>
          <Text style={styles.qtyUpTo}>QTY UP TO:</Text>
        </View>

        {proposal.installationItems.length === 0 ? (
          <View style={styles.emptyRow}>
            <Text style={[styles.tableRowItem, { fontStyle: 'italic', color: colors.textLight }]}>
              No installation items specified
            </Text>
            <Text style={styles.tableRowQty}>-</Text>
            <Text style={styles.tableRowNotes}>-</Text>
          </View>
        ) : (
          proposal.installationItems.map((item, index) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.tableRowItem}>
                {item.name}{getUnitSuffix(item.unit)}
              </Text>
              <Text style={styles.tableRowQty}>{item.quantity}</Text>
              <Text style={styles.tableRowNotes}>-</Text>
            </View>
          ))
        )}

        {/* Empty placeholder rows for installation */}
        {[1, 2, 3].map((_, index) => (
          <View key={`empty-${index}`} style={styles.tableRow}>
            <Text style={styles.tableRowItem}>-</Text>
            <Text style={styles.tableRowQty}>-</Text>
            <Text style={styles.tableRowNotes}>-</Text>
          </View>
        ))}

        {/* Responsibilities */}
        <View style={styles.responsibilitiesContainer}>
          <View style={styles.responsibilitiesGrid}>
            {/* CSEV Responsibilities */}
            <View style={styles.responsibilityBox}>
              <View style={styles.responsibilityHeader}>
                <Text style={styles.responsibilityHeaderText}>CSEV Responsibilities</Text>
              </View>
              <View style={styles.responsibilityContent}>
                {RESPONSIBILITIES.csev.map((item, index) => (
                  <Text key={index} style={styles.responsibilityItem}>
                    {item}
                  </Text>
                ))}
              </View>
            </View>

            {/* Customer Responsibilities */}
            <View style={styles.responsibilityBox}>
              <View style={styles.responsibilityHeader}>
                <Text style={styles.responsibilityHeaderText}>Customer Responsibilities</Text>
              </View>
              <View style={styles.responsibilityContent}>
                {RESPONSIBILITIES.customer.map((item, index) => (
                  <Text key={index} style={styles.responsibilityItem}>
                    {item}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Disclaimer */}
      <View style={styles.disclaimerFooter}>
        <Text style={styles.disclaimerText}>{SOW_DISCLAIMER_TEXT}</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerLeft}>ChargeSmart EV Proposal</Text>
        <Text style={styles.footerRight}>03</Text>
      </View>
    </Page>
  );
}
