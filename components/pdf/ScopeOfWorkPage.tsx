import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { Proposal } from '@/lib/types';
import { RESPONSIBILITIES } from '@/lib/constants';
import { calculateTotalPorts } from '@/lib/calculations';
import { PdfTheme } from './pdfTheme';
import { colors, SOW_DISCLAIMER_TEXT } from './styles';
import { PageWrapper } from './PageWrapper';

const styles = StyleSheet.create({
  // Title
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },

  titleAccent: {
    color: colors.primary,
  },

  // Table header
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.headerBg,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  tableHeaderItem: {
    flex: 3,
    color: colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  tableHeaderQty: {
    width: 70,
    color: colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  tableHeaderNotes: {
    flex: 2,
    color: colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Section label (EVSE, INSTALLATION SCOPE)
  sectionLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 15,
    backgroundColor: colors.panelBg,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },

  sectionLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 15,
    backgroundColor: colors.panelBg,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },

  parkingSpaces: {
    fontSize: 8,
    color: colors.textMuted,
    fontWeight: 'bold',
  },

  // Table row - dynamic sizing based on item count
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.panelBg,
  },

  tableRowItem: {
    flex: 3,
    fontSize: 9,
    color: colors.textLight,
    paddingLeft: 15,
  },

  tableRowQty: {
    width: 70,
    fontSize: 9,
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

  // Empty state
  emptyText: {
    fontSize: 9,
    fontStyle: 'italic',
    color: colors.textMuted,
    paddingVertical: 8,
    paddingHorizontal: 30,
  },

  // Responsibilities section
  responsibilitiesContainer: {
    marginTop: 15,
  },

  responsibilitiesGrid: {
    flexDirection: 'row',
    gap: 12,
  },

  responsibilityBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: colors.panelBg,
  },

  responsibilityHeader: {
    backgroundColor: colors.headerBg,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  responsibilityHeaderText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  responsibilityContent: {
    padding: 10,
  },

  responsibilityItem: {
    fontSize: 8,
    color: colors.textLight,
    marginBottom: 4,
    lineHeight: 1.4,
  },

  // SOW disclaimer at bottom of content
  sowDisclaimer: {
    marginTop: 12,
    backgroundColor: colors.panelBg,
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },

  sowDisclaimerText: {
    fontSize: 7,
    color: colors.textMuted,
    lineHeight: 1.4,
  },
});

interface ScopeOfWorkPageProps {
  proposal: Proposal;
  theme?: PdfTheme;
}

export function ScopeOfWorkPage({ proposal }: ScopeOfWorkPageProps) {
  const totalPorts = calculateTotalPorts(proposal.evseItems);

  // Helper to get unit display
  const getUnitSuffix = (unit: string) => {
    switch (unit) {
      case 'ft':
        return ' (ft)';
      default:
        return '';
    }
  };

  // Determine if we need compact mode (many items)
  const totalItems = proposal.evseItems.length + proposal.installationItems.length;
  const compact = totalItems > 12;

  const rowPadding = compact ? 3 : 5;
  const fontSize = compact ? 8 : 9;

  return (
    <PageWrapper pageNumber={3} showDisclaimer={true}>
      {/* Title */}
      <Text style={styles.title}>
        <Text style={styles.titleAccent}>Proposed Scope of Work</Text>
      </Text>

      {/* Table Header */}
      <View style={styles.tableHeader} wrap={false}>
        <Text style={styles.tableHeaderItem}>Item</Text>
        <Text style={styles.tableHeaderQty}>Quantity</Text>
        <Text style={styles.tableHeaderNotes}>Notes</Text>
      </View>

      {/* EVSE Section */}
      <View style={styles.sectionLabel} wrap={false}>
        <Text>EVSE</Text>
      </View>

      {proposal.evseItems.length === 0 ? (
        <Text style={styles.emptyText}>No equipment specified</Text>
      ) : (
        proposal.evseItems.map((item) => (
          <View key={item.id} style={[styles.tableRow, { paddingVertical: rowPadding }]} wrap={false}>
            <Text style={[styles.tableRowItem, { fontSize }]}>{item.name}</Text>
            <Text style={[styles.tableRowQty, { fontSize }]}>{item.quantity}</Text>
            <Text style={[styles.tableRowNotes, { fontSize: fontSize - 1 }]}>{item.notes || '-'}</Text>
          </View>
        ))
      )}

      {/* Installation Scope Section */}
      <View style={styles.sectionLabelRow} wrap={false}>
        <Text style={{ fontSize: 10, fontWeight: 'bold', color: colors.primary }}>
          INSTALLATION SCOPE
        </Text>
        {totalPorts > 0 && (
          <Text style={styles.parkingSpaces}>
            For {totalPorts} parking space{totalPorts !== 1 ? 's' : ''}
          </Text>
        )}
      </View>

      {proposal.installationItems.length === 0 ? (
        <Text style={styles.emptyText}>No installation items specified</Text>
      ) : (
        proposal.installationItems.map((item) => (
          <View key={item.id} style={[styles.tableRow, { paddingVertical: rowPadding }]} wrap={false}>
            <Text style={[styles.tableRowItem, { fontSize }]}>
              {item.name}{getUnitSuffix(item.unit)}
            </Text>
            <Text style={[styles.tableRowQty, { fontSize }]}>{item.quantity}</Text>
            <Text style={[styles.tableRowNotes, { fontSize: fontSize - 1 }]}>-</Text>
          </View>
        ))
      )}

      {/* Responsibilities */}
      <View style={styles.responsibilitiesContainer} wrap={false}>
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

      {/* SOW Disclaimer */}
      <View style={styles.sowDisclaimer} wrap={false}>
        <Text style={styles.sowDisclaimerText}>*{SOW_DISCLAIMER_TEXT}</Text>
      </View>
    </PageWrapper>
  );
}
