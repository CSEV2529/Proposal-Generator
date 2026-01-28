import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { Proposal } from '@/lib/types';
import { COMPANY_INFO } from '@/lib/constants';
import { formatCurrency, generateProposalNumber, calculateTotalPorts } from '@/lib/calculations';

const colors = {
  primary: '#4ade80',
  slate900: '#0f172a',
  slate800: '#1e293b',
  slate700: '#334155',
  text: '#f8fafc',
  textLight: '#e2e8f0',
  textMuted: '#94a3b8',
  border: '#334155',
  white: '#FFFFFF',
};

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    backgroundColor: colors.slate900,
    paddingBottom: 60,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingTop: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },

  headerLeft: {
    flex: 1,
  },

  budgetTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
    letterSpacing: 2,
  },

  budgetSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 10,
  },

  companyName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.textLight,
    marginBottom: 2,
  },

  companyInfo: {
    fontSize: 9,
    color: colors.textMuted,
    marginBottom: 1,
  },

  logoContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },

  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  logoCharge: {
    color: colors.primary,
  },

  logoSmart: {
    color: colors.text,
  },

  // Project Info Section
  projectSection: {
    marginHorizontal: 40,
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: colors.slate800,
    borderRadius: 8,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  projectTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
    letterSpacing: 1,
  },

  projectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  projectItem: {
    width: '50%',
    marginBottom: 8,
  },

  projectLabel: {
    fontSize: 9,
    color: colors.textMuted,
    marginBottom: 2,
  },

  projectValue: {
    fontSize: 11,
    color: colors.text,
    fontWeight: 'bold',
  },

  // Budget Table
  table: {
    marginHorizontal: 40,
    marginTop: 10,
  },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.slate700,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },

  tableHeaderCell: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 0.5,
  },

  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.slate800,
  },

  tableRowAlt: {
    backgroundColor: colors.slate700,
  },

  tableCell: {
    fontSize: 10,
    color: colors.text,
  },

  tableCellMuted: {
    fontSize: 9,
    color: colors.textMuted,
  },

  tableCellBold: {
    fontSize: 10,
    color: colors.text,
    fontWeight: 'bold',
  },

  // Column widths
  colCategory: { width: '50%' },
  colDescription: { width: '25%' },
  colAmount: { width: '25%', textAlign: 'right' },

  // Separator
  separator: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: colors.slate700,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },

  // Total row
  totalRow: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },

  totalCell: {
    fontSize: 13,
    color: colors.slate900,
    fontWeight: 'bold',
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
    paddingTop: 10,
  },

  footerLeft: {
    fontSize: 8,
    color: colors.textMuted,
  },

  footerRight: {
    fontSize: 8,
    color: colors.textMuted,
  },

  // Confidential stamp
  confidentialBadge: {
    position: 'absolute',
    top: 35,
    right: 40,
    backgroundColor: '#dc2626',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
  },

  confidentialText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.white,
    letterSpacing: 1,
  },

  // Notes section
  notesSection: {
    marginHorizontal: 40,
    marginTop: 20,
    backgroundColor: colors.slate800,
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },

  notesTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },

  notesText: {
    fontSize: 9,
    color: colors.textMuted,
    lineHeight: 1.4,
  },
});

interface BudgetLineItem {
  category: string;
  description: string;
  amount: number;
}

interface BudgetDocumentProps {
  proposal: Proposal;
}

function prepareBudgetLines(proposal: Proposal): BudgetLineItem[] {
  const lines: BudgetLineItem[] = [];

  // EVSE Equipment (our cost)
  if (proposal.evseActualCost > 0) {
    const evseItemCount = proposal.evseItems.reduce((sum, item) => sum + item.quantity, 0);
    lines.push({
      category: 'EVSE Equipment',
      description: `${evseItemCount} unit(s)`,
      amount: proposal.evseActualCost,
    });
  }

  // Installation / CSMR (our cost)
  if (proposal.csmrActualCost > 0) {
    const installItemCount = proposal.installationItems.length;
    lines.push({
      category: 'Installation (CSMR)',
      description: `${installItemCount} line item(s)`,
      amount: proposal.csmrActualCost,
    });
  }

  // Utility Allowance (pass-through)
  if (proposal.utilityAllowance > 0) {
    lines.push({
      category: 'Utility Allowance',
      description: 'Make-ready allowance',
      amount: proposal.utilityAllowance,
    });
  }

  // Shipping (pass-through)
  if (proposal.shippingCost > 0) {
    lines.push({
      category: 'Shipping',
      description: 'Equipment delivery',
      amount: proposal.shippingCost,
    });
  }

  // Network Plan (pass-through)
  if (proposal.networkPlanCost > 0) {
    lines.push({
      category: 'Network Plan',
      description: `${proposal.networkYears} year plan`,
      amount: proposal.networkPlanCost,
    });
  }

  return lines;
}

export function BudgetDocument({ proposal }: BudgetDocumentProps) {
  const lines = prepareBudgetLines(proposal);
  const totalCost = proposal.totalActualCost;

  // Calculate total ports
  const totalPorts = calculateTotalPorts(proposal.evseItems);

  // Format date
  const budgetDate = proposal.preparedDate
    ? new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(proposal.preparedDate))
    : new Date().toLocaleDateString();

  const projectNumber = generateProposalNumber();

  // Full address
  const fullAddress = [
    proposal.customerAddress,
    [proposal.customerCity, proposal.customerState, proposal.customerZip]
      .filter(Boolean)
      .join(', '),
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Confidential Badge */}
        <View style={styles.confidentialBadge}>
          <Text style={styles.confidentialText}>INTERNAL USE ONLY</Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.budgetTitle}>PROJECT BUDGET</Text>
            <Text style={styles.budgetSubtitle}>Internal Cost Summary</Text>
            <Text style={styles.companyName}>{COMPANY_INFO.legalName}</Text>
            <Text style={styles.companyInfo}>{COMPANY_INFO.email} | {COMPANY_INFO.phone}</Text>
          </View>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>
              <Text style={styles.logoCharge}>Charge</Text>
              <Text style={styles.logoSmart}>Smart EV</Text>
            </Text>
          </View>
        </View>

        {/* Project Info */}
        <View style={styles.projectSection}>
          <Text style={styles.projectTitle}>PROJECT DETAILS</Text>
          <View style={styles.projectGrid}>
            <View style={styles.projectItem}>
              <Text style={styles.projectLabel}>Customer</Text>
              <Text style={styles.projectValue}>{proposal.customerName || 'Not specified'}</Text>
            </View>
            <View style={styles.projectItem}>
              <Text style={styles.projectLabel}>Project #</Text>
              <Text style={styles.projectValue}>{projectNumber}</Text>
            </View>
            <View style={styles.projectItem}>
              <Text style={styles.projectLabel}>Site Address</Text>
              <Text style={styles.projectValue}>{fullAddress || 'Not specified'}</Text>
            </View>
            <View style={styles.projectItem}>
              <Text style={styles.projectLabel}>Date</Text>
              <Text style={styles.projectValue}>{budgetDate}</Text>
            </View>
            <View style={styles.projectItem}>
              <Text style={styles.projectLabel}>Total Ports</Text>
              <Text style={styles.projectValue}>{totalPorts}</Text>
            </View>
            <View style={styles.projectItem}>
              <Text style={styles.projectLabel}>Network Term</Text>
              <Text style={styles.projectValue}>{proposal.networkYears} Year(s)</Text>
            </View>
          </View>
        </View>

        {/* Budget Table */}
        <View style={styles.table}>
          {/* Table header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colCategory]}>COST CATEGORY</Text>
            <Text style={[styles.tableHeaderCell, styles.colDescription]}>DESCRIPTION</Text>
            <Text style={[styles.tableHeaderCell, styles.colAmount]}>OUR COST</Text>
          </View>

          {/* Line items */}
          {lines.map((item, index) => (
            <View key={index} style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : {}]}>
              <Text style={[styles.tableCellBold, styles.colCategory]}>{item.category}</Text>
              <Text style={[styles.tableCellMuted, styles.colDescription]}>{item.description}</Text>
              <Text style={[styles.tableCellBold, styles.colAmount]}>{formatCurrency(item.amount)}</Text>
            </View>
          ))}

          {/* Separator */}
          <View style={styles.separator}>
            <Text style={[styles.tableCellMuted, styles.colCategory]}></Text>
            <Text style={[styles.tableCellMuted, styles.colDescription]}></Text>
            <Text style={[styles.tableCellMuted, styles.colAmount]}></Text>
          </View>

          {/* Total */}
          <View style={styles.totalRow}>
            <Text style={[styles.totalCell, styles.colCategory]}>TOTAL PROJECT COST</Text>
            <Text style={[styles.totalCell, styles.colDescription]}></Text>
            <Text style={[styles.totalCell, styles.colAmount]}>{formatCurrency(totalCost)}</Text>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>NOTES</Text>
          <Text style={styles.notesText}>
            This budget represents ChargeSmart EV internal costs for this project.
            EVSE Equipment cost is based on pricebook unit costs. Installation cost reflects
            actual cost basis ({proposal.csmrCostBasisPercent}% of pricebook prices).
            Utility allowance, shipping, and network plan are pass-through costs with no margin applied.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerLeft}>
            Generated: {new Date().toLocaleDateString()} | CONFIDENTIAL - NOT FOR DISTRIBUTION
          </Text>
          <Text style={styles.footerRight}>
            {COMPANY_INFO.name}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
