import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { Proposal } from '@/lib/types';
import {
  formatCurrencyWithCents,
  calculateGrossProjectCost,
  calculateNetProjectCost,
  calculateMaterialCost,
  calculateLaborCost,
} from '@/lib/calculations';
import { FOOTNOTES, getIncentiveLabels, getAdditionalTerms } from '@/lib/constants';
import { getPdfColors, PdfColorPalette, PdfTheme } from './pdfTheme';
import { PageWrapper } from './PageWrapper';

const ROW_HEIGHT = 18;

function getStyles(colors: PdfColorPalette) {
  return StyleSheet.create({
    // Title — Orbitron 28px, matches pages 2-3
    title: {
      fontFamily: 'Orbitron',
      fontSize: 28,
      fontWeight: 700,
      color: colors.white,
      marginBottom: 8,
    },

    // Section header bar (Financial Breakdown, Additional Terms, Proposal Acceptance)
    sectionHeader: {
      flexDirection: 'row',
      backgroundColor: colors.headerBg,
      paddingVertical: 5,
      paddingHorizontal: 15,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },

    sectionHeaderLabel: {
      flex: 1,
      fontFamily: 'Roboto',
      color: colors.primary,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 0.5,
    },

    sectionHeaderCost: {
      width: 100,
      fontFamily: 'Roboto',
      color: colors.primary,
      fontSize: 10,
      fontWeight: 700,
      textAlign: 'center',
    },

    sectionHeaderNotes: {
      width: 130,
      fontFamily: 'Roboto',
      color: colors.primary,
      fontSize: 10,
      fontWeight: 700,
      textAlign: 'center',
    },

    // Standard table row
    tableRow: {
      flexDirection: 'row',
      height: ROW_HEIGHT,
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      alignItems: 'center',
    },

    // Bold/total row (darker background)
    tableRowBold: {
      flexDirection: 'row',
      height: ROW_HEIGHT,
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      alignItems: 'center',
      backgroundColor: colors.headerBg,
    },

    tableRowLabel: {
      flex: 1,
      fontFamily: 'Roboto',
      fontSize: 9,
      color: colors.textLight,
      paddingLeft: 15,
    },

    tableRowLabelBold: {
      flex: 1,
      fontFamily: 'Roboto',
      fontSize: 9,
      color: colors.white,
      fontWeight: 700,
    },

    tableRowCost: {
      width: 100,
      fontFamily: 'Roboto',
      fontSize: 9,
      color: colors.text,
      textAlign: 'center',
    },

    tableRowCostBold: {
      width: 100,
      fontFamily: 'Roboto',
      fontSize: 9,
      color: colors.white,
      textAlign: 'center',
      fontWeight: 700,
    },

    tableRowCostNegative: {
      width: 100,
      fontFamily: 'Roboto',
      fontSize: 9,
      color: '#ef4444',
      textAlign: 'center',
    },

    tableRowNotes: {
      width: 130,
      fontFamily: 'Roboto',
      fontSize: 7,
      color: colors.textMuted,
      textAlign: 'center',
    },

    // Footnotes
    footnotes: {
      marginTop: 6,
      paddingHorizontal: 15,
    },

    footnoteText: {
      fontFamily: 'Roboto',
      fontSize: 6,
      color: colors.textMuted,
      lineHeight: 1.4,
      marginBottom: 2,
    },

    // Additional Terms — 2 columns
    additionalTermsSection: {
      marginTop: 10,
    },

    termsHeaderLabel: {
      flex: 1,
      fontFamily: 'Roboto',
      color: colors.primary,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 0.5,
    },

    termsHeaderNotes: {
      flex: 1,
      fontFamily: 'Roboto',
      color: colors.primary,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 0.5,
    },

    termRow: {
      flexDirection: 'row',
      minHeight: ROW_HEIGHT,
      paddingHorizontal: 15,
      paddingVertical: 3,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      alignItems: 'center',
    },

    termLabel: {
      flex: 1,
      fontFamily: 'Roboto',
      fontSize: 8,
      color: colors.textLight,
    },

    termValue: {
      flex: 1,
      fontFamily: 'Roboto',
      fontSize: 8,
      color: colors.text,
    },

    acceptanceHeaderText: {
      flex: 1,
      fontFamily: 'Roboto',
      color: colors.primary,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 0.5,
    },

    acceptanceContent: {
      paddingHorizontal: 15,
      paddingTop: 6,
    },

    acceptanceRow: {
      marginBottom: 6,
    },

    acceptanceLabel: {
      fontFamily: 'Roboto',
      fontSize: 8,
      color: colors.textMuted,
      fontWeight: 700,
      marginBottom: 2,
    },

    acceptanceLine: {
      borderBottomWidth: 1,
      borderBottomColor: colors.textMuted,
      height: 14,
    },

    acceptanceGrid: {
      flexDirection: 'row',
      gap: 25,
      marginTop: 8,
    },

    acceptanceCol: {
      flex: 1,
    },
  });
}

interface FinancialSummaryPageProps {
  proposal: Proposal;
  theme?: PdfTheme;
}

export function FinancialSummaryPage({ proposal, theme }: FinancialSummaryPageProps) {
  const colors = getPdfColors(theme);
  const styles = getStyles(colors);

  const grossCost = calculateGrossProjectCost(proposal);
  const netCost = calculateNetProjectCost(proposal);

  // Split CSMR into material and labor quoted prices
  const materialPricebook = calculateMaterialCost(proposal.installationItems);
  const laborPricebook = calculateLaborCost(proposal.installationItems);
  const pricebookTotal = proposal.csmrPricebookTotal;

  // Apply same cost basis + margin ratio to each portion
  const materialQuoted = pricebookTotal > 0
    ? (materialPricebook / pricebookTotal) * proposal.csmrQuotedPrice
    : 0;
  const laborQuoted = pricebookTotal > 0
    ? (laborPricebook / pricebookTotal) * proposal.csmrQuotedPrice
    : 0;

  // Network years label
  const networkYearsLabel = `${proposal.networkYears} Years Included`;

  // Incentive labels (auto-mapped from utility, with user overrides)
  const defaultLabels = getIncentiveLabels(proposal.utilityId);
  const makeReadyLabel = proposal.makeReadyIncentiveLabel || defaultLabels.makeReady;
  const secondaryLabel = proposal.secondaryIncentiveLabel || defaultLabels.secondary;

  // Additional Terms based on selected project type + network years, with user overrides
  const additionalTermsBase = getAdditionalTerms(proposal.projectType, proposal.networkYears);
  const overrides = proposal.additionalTermsOverrides || {};
  const additionalTerms = additionalTermsBase.map(term => ({
    ...term,
    notes: overrides[term.label] || term.notes,
  }));

  return (
    <PageWrapper pageNumber={4} showDisclaimer={true} disclaimerBorder={false} theme={theme}>
      {/* Title */}
      <Text style={styles.title}>Financial Summary</Text>

      {/* Financial Breakdown Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderLabel}>Financial Breakdown</Text>
        <Text style={styles.sectionHeaderCost}>Cost</Text>
        <Text style={styles.sectionHeaderNotes}>Notes</Text>
      </View>

      {/* EVSE Cost */}
      <View style={styles.tableRow}>
        <Text style={styles.tableRowLabel}>EVSE Cost</Text>
        <Text style={styles.tableRowCost}>{formatCurrencyWithCents(proposal.evseQuotedPrice)}</Text>
        <Text style={styles.tableRowNotes}>-</Text>
      </View>

      {/* Customer Side MR - Material Cost */}
      <View style={styles.tableRow}>
        <Text style={styles.tableRowLabel}>Customer Side MR - Material Cost</Text>
        <Text style={styles.tableRowCost}>{formatCurrencyWithCents(materialQuoted)}</Text>
        <Text style={styles.tableRowNotes}>-</Text>
      </View>

      {/* Customer Side MR - Labor Cost */}
      <View style={styles.tableRow}>
        <Text style={styles.tableRowLabel}>Customer Side MR - Labor Cost</Text>
        <Text style={styles.tableRowCost}>{formatCurrencyWithCents(laborQuoted)}</Text>
        <Text style={styles.tableRowNotes}>-</Text>
      </View>

      {/* Utility Side Make Ready */}
      <View style={styles.tableRow}>
        <Text style={styles.tableRowLabel}>Utility Side Make Ready (Allowance)</Text>
        <Text style={styles.tableRowCost}>
          {proposal.utilityAllowance > 0 ? formatCurrencyWithCents(proposal.utilityAllowance) : '-'}
        </Text>
        <Text style={styles.tableRowNotes}>-</Text>
      </View>

      {/* Shipping Cost */}
      <View style={styles.tableRow}>
        <Text style={styles.tableRowLabel}>Shipping Cost</Text>
        <Text style={styles.tableRowCost}>{formatCurrencyWithCents(proposal.shippingCost)}</Text>
        <Text style={styles.tableRowNotes}>-</Text>
      </View>

      {/* Annual Network Plan */}
      <View style={styles.tableRow}>
        <Text style={styles.tableRowLabel}>Annual Network Plan*</Text>
        <Text style={styles.tableRowCost}>{formatCurrencyWithCents(proposal.networkPlanCost)}</Text>
        <Text style={styles.tableRowNotes}>{networkYearsLabel}</Text>
      </View>

      {/* Gross Project Cost (bold row) */}
      <View style={styles.tableRowBold}>
        <Text style={styles.tableRowLabelBold}>Gross Project Cost</Text>
        <Text style={styles.tableRowCostBold}>{formatCurrencyWithCents(grossCost)}</Text>
        <Text style={styles.tableRowNotes}>-</Text>
      </View>

      {/* Make Ready Incentive */}
      <View style={styles.tableRow}>
        <Text style={styles.tableRowLabel}>{makeReadyLabel}</Text>
        <Text style={styles.tableRowCostNegative}>
          {proposal.makeReadyIncentive > 0 ? `- ${formatCurrencyWithCents(proposal.makeReadyIncentive)}` : '-'}
        </Text>
        <Text style={styles.tableRowNotes}>-</Text>
      </View>

      {/* Secondary Incentive (only if > 0) */}
      {proposal.nyseradaIncentive > 0 && (
        <View style={styles.tableRow}>
          <Text style={styles.tableRowLabel}>{secondaryLabel}</Text>
          <Text style={styles.tableRowCostNegative}>- {formatCurrencyWithCents(proposal.nyseradaIncentive)}</Text>
          <Text style={styles.tableRowNotes}>-</Text>
        </View>
      )}

      {/* Project Cost with Incentives (bold row) */}
      <View style={styles.tableRowBold}>
        <Text style={styles.tableRowLabelBold}>Project Cost (with Incentives)**</Text>
        <Text style={styles.tableRowCostBold}>{formatCurrencyWithCents(netCost)}</Text>
        <Text style={styles.tableRowNotes}>-</Text>
      </View>

      {/* Footnotes */}
      <View style={styles.footnotes}>
        <Text style={styles.footnoteText}>{FOOTNOTES.networkPlan}</Text>
        <Text style={styles.footnoteText}>{FOOTNOTES.paymentOptions}</Text>
      </View>

      {/* Additional Terms */}
      <View style={styles.additionalTermsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.termsHeaderLabel}>Additional Terms</Text>
          <Text style={styles.termsHeaderNotes}>Notes</Text>
        </View>

        {additionalTerms.map((term, index) => (
          <View key={index} style={styles.termRow}>
            <Text style={styles.termLabel}>{term.label}</Text>
            <Text style={styles.termValue}>{term.notes}</Text>
          </View>
        ))}
      </View>

      {/* Spacer pushes Acceptance to bottom of page */}
      <View style={{ flexGrow: 1 }} />

      {/* Proposal Acceptance — pinned above disclaimer */}
      <View>
        <View style={styles.sectionHeader}>
          <Text style={styles.acceptanceHeaderText}>Proposal Acceptance - CUSTOMER INFO</Text>
        </View>
        <View style={styles.acceptanceContent}>
          <View style={styles.acceptanceRow}>
            <Text style={styles.acceptanceLabel}>Name</Text>
            <View style={styles.acceptanceLine} />
          </View>
          <View style={styles.acceptanceRow}>
            <Text style={styles.acceptanceLabel}>Title</Text>
            <View style={styles.acceptanceLine} />
          </View>
          <View style={styles.acceptanceRow}>
            <Text style={styles.acceptanceLabel}>Email</Text>
            <View style={styles.acceptanceLine} />
          </View>

          <View style={styles.acceptanceGrid}>
            <View style={styles.acceptanceCol}>
              <Text style={styles.acceptanceLabel}>Signature</Text>
              <View style={styles.acceptanceLine} />
            </View>
            <View style={styles.acceptanceCol}>
              <Text style={styles.acceptanceLabel}>Date Signed</Text>
              <View style={styles.acceptanceLine} />
            </View>
          </View>
        </View>
      </View>
    </PageWrapper>
  );
}
