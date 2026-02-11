import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { Proposal } from '@/lib/types';
import { RESPONSIBILITIES } from '@/lib/constants';
import { calculateTotalPorts } from '@/lib/calculations';
import { PdfTheme } from './pdfTheme';
import { colors, SOW_DISCLAIMER_TEXT } from './styles';
import { PageWrapper } from './PageWrapper';

// Fixed slot counts — section heights stay constant regardless of item count
const EVSE_SLOTS = 4;
const INSTALLATION_SLOTS = 25;

const ROW_HEIGHT = 15; // Compact row height to fit single page

const styles = StyleSheet.create({
  // Title — Orbitron, matches page 2
  title: {
    fontFamily: 'Orbitron',
    fontSize: 28,
    fontWeight: 700,
    color: '#FFFFFF',
    marginBottom: 8,
  },

  // Table header row
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.headerBg,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  tableHeaderItem: {
    flex: 1,
    fontFamily: 'Roboto',
    color: colors.primary,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 0.5,
  },

  tableHeaderQty: {
    width: 80,
    fontFamily: 'Roboto',
    color: colors.primary,
    fontSize: 10,
    fontWeight: 700,
    textAlign: 'center',
  },

  // Section label (EVSE, INSTALLATION SCOPE)
  sectionLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 15,
    marginTop: 5,
  },

  sectionLabelText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: 700,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  parkingSpaces: {
    fontFamily: 'Roboto',
    fontSize: 8,
    color: colors.textMuted,
    fontWeight: 700,
  },

  // Table row
  tableRow: {
    flexDirection: 'row',
    height: ROW_HEIGHT,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },

  // Empty row — same height, no text, no border
  emptyRow: {
    height: ROW_HEIGHT,
  },

  tableRowItem: {
    flex: 1,
    fontFamily: 'Roboto',
    fontSize: 9,
    color: colors.textLight,
    paddingLeft: 15,
  },

  tableRowQty: {
    width: 80,
    fontFamily: 'Roboto',
    fontSize: 9,
    color: colors.text,
    textAlign: 'center',
    fontWeight: 700,
  },


  // Responsibilities section
  responsibilitiesContainer: {
    marginTop: 5,
  },

  responsibilitiesGrid: {
    flexDirection: 'row',
    gap: 12,
  },

  responsibilityBox: {
    flex: 1,
  },

  responsibilityHeader: {
    backgroundColor: colors.headerBg,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  responsibilityHeaderText: {
    fontFamily: 'Roboto',
    color: colors.primary,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 0.5,
  },

  responsibilityItem: {
    paddingVertical: 3,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  responsibilityItemText: {
    fontFamily: 'Roboto',
    fontSize: 8,
    color: colors.textLight,
    lineHeight: 1.3,
  },
});

interface ScopeOfWorkPageProps {
  proposal: Proposal;
  theme?: PdfTheme;
}

const formatQty = (n: number) => n.toLocaleString();

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

  // Build EVSE data rows: user items + auto-generated EV Parking Signs + empty fill
  const evseDataRows: Array<{ name: string; quantity: number } | null> = [];

  // Add user EVSE items
  for (const item of proposal.evseItems) {
    evseDataRows.push({ name: item.name, quantity: item.quantity });
  }

  // Auto-generate EV Parking Signs row from total ports
  if (totalPorts > 0) {
    evseDataRows.push({
      name: 'EV Parking Signs',
      quantity: totalPorts,
    });
  }

  // Build EVSE rendered rows — always exactly EVSE_SLOTS rows
  const evseRows = [];
  for (let i = 0; i < EVSE_SLOTS; i++) {
    const data = evseDataRows[i];
    if (data) {
      evseRows.push(
        <View key={`evse-${i}`} style={styles.tableRow}>
          <Text style={styles.tableRowItem}>{data.name}</Text>
          <Text style={styles.tableRowQty}>{formatQty(data.quantity)}</Text>
        </View>
      );
    } else {
      evseRows.push(<View key={`evse-${i}`} style={styles.emptyRow} />);
    }
  }

  // Build Installation rows — always exactly INSTALLATION_SLOTS rows
  const installRows = [];
  for (let i = 0; i < INSTALLATION_SLOTS; i++) {
    const item = proposal.installationItems[i];
    if (item) {
      installRows.push(
        <View key={`install-${i}`} style={styles.tableRow}>
          <Text style={styles.tableRowItem}>
            {item.name}{getUnitSuffix(item.unit)}
          </Text>
          <Text style={styles.tableRowQty}>{formatQty(item.quantity)}</Text>
        </View>
      );
    } else {
      installRows.push(<View key={`install-${i}`} style={styles.emptyRow} />);
    }
  }

  return (
    <PageWrapper
      pageNumber={3}
      showDisclaimer={true}
      disclaimerText={`*${SOW_DISCLAIMER_TEXT}`}
      disclaimerBorder={false}
    >
      {/* Title */}
      <Text style={styles.title}>Proposed Scope of Work</Text>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderItem}>Item</Text>
        <Text style={styles.tableHeaderQty}>Quantity</Text>
      </View>

      {/* EVSE Section */}
      <View style={styles.sectionLabel}>
        <Text style={styles.sectionLabelText}>EVSE</Text>
      </View>
      <View style={{ height: EVSE_SLOTS * ROW_HEIGHT }}>
        {evseRows}
      </View>

      {/* Installation Scope Section */}
      <View style={styles.sectionLabel}>
        <Text style={styles.sectionLabelText}>INSTALLATION SCOPE</Text>
      </View>
      <View style={{ height: INSTALLATION_SLOTS * ROW_HEIGHT }}>
        {installRows}
      </View>

      {/* Responsibilities — anchored to bottom of content area */}
      <View style={styles.responsibilitiesContainer}>
        <View style={styles.responsibilitiesGrid}>
          {/* CSEV Responsibilities */}
          <View style={styles.responsibilityBox}>
            <View style={styles.responsibilityHeader}>
              <Text style={styles.responsibilityHeaderText}>CSEV Responsibilities</Text>
            </View>
            {RESPONSIBILITIES.csev.map((item, index) => (
              <View key={index} style={styles.responsibilityItem}>
                <Text style={styles.responsibilityItemText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Customer Responsibilities */}
          <View style={styles.responsibilityBox}>
            <View style={styles.responsibilityHeader}>
              <Text style={styles.responsibilityHeaderText}>Customer Responsibilities</Text>
            </View>
            {RESPONSIBILITIES.customer.map((item, index) => (
              <View key={index} style={styles.responsibilityItem}>
                <Text style={styles.responsibilityItemText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </PageWrapper>
  );
}
