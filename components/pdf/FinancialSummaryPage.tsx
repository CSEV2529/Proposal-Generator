import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { Proposal } from '@/lib/types';
import {
  formatCurrency,
  formatCurrencyWithCents,
  calculateGrossProjectCost,
  calculateNetProjectCost,
} from '@/lib/calculations';
import { ADDITIONAL_TERMS, FOOTNOTES, getIncentiveLabels } from '@/lib/constants';
import { PdfTheme } from './pdfTheme';
import { colors } from './styles';
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

  // Financial table
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.headerBg,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  tableHeaderLabel: {
    flex: 3,
    color: colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  tableHeaderCost: {
    width: 100,
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

  // Table rows
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.panelBg,
  },

  tableRowBold: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.headerBg,
  },

  tableRowLabel: {
    flex: 3,
    fontSize: 9,
    color: colors.textLight,
    paddingLeft: 15,
  },

  tableRowLabelBold: {
    flex: 3,
    fontSize: 9,
    color: colors.text,
    fontWeight: 'bold',
  },

  tableRowCost: {
    width: 100,
    fontSize: 9,
    color: colors.text,
    textAlign: 'right',
  },

  tableRowCostBold: {
    width: 100,
    fontSize: 9,
    color: colors.text,
    textAlign: 'right',
    fontWeight: 'bold',
  },

  tableRowCostNegative: {
    width: 100,
    fontSize: 9,
    color: colors.primary,
    textAlign: 'right',
  },

  tableRowNotes: {
    flex: 2,
    fontSize: 7,
    color: colors.textMuted,
    textAlign: 'center',
  },

  // Footnotes
  footnotes: {
    marginTop: 8,
    paddingHorizontal: 15,
    backgroundColor: colors.panelBg,
    paddingVertical: 8,
    borderRadius: 4,
  },

  footnoteText: {
    fontSize: 6,
    color: colors.textMuted,
    lineHeight: 1.4,
    marginBottom: 2,
  },

  // Additional Terms section
  additionalTermsSection: {
    marginTop: 10,
  },

  additionalTermsHeader: {
    flexDirection: 'row',
    backgroundColor: colors.headerBg,
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  additionalTermsHeaderLabel: {
    flex: 1,
    color: colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
  },

  additionalTermsHeaderNotes: {
    flex: 1,
    color: colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
  },

  termRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.panelBg,
  },

  termLabel: {
    flex: 1,
    fontSize: 8,
    color: colors.textLight,
  },

  termValue: {
    flex: 1,
    fontSize: 8,
    color: colors.text,
  },

  // Proposal Acceptance section
  acceptanceSection: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: colors.panelBg,
  },

  acceptanceHeader: {
    backgroundColor: colors.headerBg,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  acceptanceHeaderText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  acceptanceContent: {
    padding: 12,
  },

  acceptanceRow: {
    marginBottom: 8,
  },

  acceptanceLabel: {
    fontSize: 8,
    color: colors.textMuted,
    fontWeight: 'bold',
    marginBottom: 2,
  },

  acceptanceLine: {
    borderBottomWidth: 1,
    borderBottomColor: colors.textMuted,
    height: 16,
  },

  acceptanceGrid: {
    flexDirection: 'row',
    gap: 25,
    marginTop: 10,
  },

  acceptanceCol: {
    flex: 1,
  },
});

interface FinancialSummaryPageProps {
  proposal: Proposal;
  theme?: PdfTheme;
}

export function FinancialSummaryPage({ proposal }: FinancialSummaryPageProps) {
  const grossCost = calculateGrossProjectCost(proposal);
  const netCost = calculateNetProjectCost(proposal);

  // Get network years label
  const networkYearsLabel = `${proposal.networkYears} Years Included`;

  // Get incentive labels (auto-mapped from utility, with user overrides)
  const defaultLabels = getIncentiveLabels(proposal.utilityId);
  const makeReadyLabel = proposal.makeReadyIncentiveLabel || defaultLabels.makeReady;
  const secondaryLabel = proposal.secondaryIncentiveLabel || defaultLabels.secondary;

  return (
    <PageWrapper pageNumber={4} showDisclaimer={true}>
      {/* Title */}
      <Text style={styles.title}>
        <Text style={styles.titleAccent}>Financial Summary</Text>
      </Text>

      {/* Financial Breakdown Table */}
      <View style={styles.tableHeader} wrap={false}>
        <Text style={styles.tableHeaderLabel}>Financial Breakdown</Text>
        <Text style={styles.tableHeaderCost}>Cost</Text>
        <Text style={styles.tableHeaderNotes}>Notes</Text>
      </View>

      {/* Cost rows */}
      <View style={styles.tableRow} wrap={false}>
        <Text style={styles.tableRowLabel}>EVSE Cost</Text>
        <Text style={styles.tableRowCost}>{formatCurrency(proposal.evseQuotedPrice)}</Text>
        <Text style={styles.tableRowNotes}>-</Text>
      </View>

      <View style={styles.tableRow} wrap={false}>
        <Text style={styles.tableRowLabel}>Customer Side Make Ready</Text>
        <Text style={styles.tableRowCost}>{formatCurrency(proposal.csmrQuotedPrice)}</Text>
        <Text style={styles.tableRowNotes}>Material + Labor</Text>
      </View>

      <View style={styles.tableRow} wrap={false}>
        <Text style={styles.tableRowLabel}>Utility Side Make Ready (Allowance)</Text>
        <Text style={styles.tableRowCost}>{formatCurrency(proposal.utilityAllowance)}</Text>
        <Text style={styles.tableRowNotes}>-</Text>
      </View>

      <View style={styles.tableRow} wrap={false}>
        <Text style={styles.tableRowLabel}>Shipping Cost</Text>
        <Text style={styles.tableRowCost}>{formatCurrency(proposal.shippingCost)}</Text>
        <Text style={styles.tableRowNotes}>-</Text>
      </View>

      <View style={styles.tableRow} wrap={false}>
        <Text style={styles.tableRowLabel}>Annual Network Plan*</Text>
        <Text style={styles.tableRowCost}>{formatCurrency(proposal.networkPlanCost)}</Text>
        <Text style={styles.tableRowNotes}>{networkYearsLabel}</Text>
      </View>

      {/* Gross Project Cost */}
      <View style={styles.tableRowBold} wrap={false}>
        <Text style={styles.tableRowLabelBold}>Gross Project Cost</Text>
        <Text style={styles.tableRowCostBold}>{formatCurrency(grossCost)}</Text>
        <Text style={styles.tableRowNotes}>-</Text>
      </View>

      {/* Incentives */}
      <View style={styles.tableRow} wrap={false}>
        <Text style={styles.tableRowLabel}>{makeReadyLabel}</Text>
        <Text style={styles.tableRowCostNegative}>- {formatCurrency(proposal.makeReadyIncentive)}</Text>
        <Text style={styles.tableRowNotes}>-</Text>
      </View>

      {proposal.nyseradaIncentive > 0 && (
        <View style={styles.tableRow} wrap={false}>
          <Text style={styles.tableRowLabel}>{secondaryLabel}</Text>
          <Text style={styles.tableRowCostNegative}>- {formatCurrency(proposal.nyseradaIncentive)}</Text>
          <Text style={styles.tableRowNotes}>-</Text>
        </View>
      )}

      {/* Net Project Cost */}
      <View style={styles.tableRowBold} wrap={false}>
        <Text style={styles.tableRowLabelBold}>Project Cost (with Incentives)**</Text>
        <Text style={styles.tableRowCostBold}>{formatCurrency(netCost)}</Text>
        <Text style={styles.tableRowNotes}>-</Text>
      </View>

      {/* Footnotes */}
      <View style={styles.footnotes} wrap={false}>
        <Text style={styles.footnoteText}>{FOOTNOTES.networkPlan}</Text>
        <Text style={styles.footnoteText}>{FOOTNOTES.paymentOptions}</Text>
      </View>

      {/* Additional Terms */}
      <View style={styles.additionalTermsSection} wrap={false}>
        <View style={styles.additionalTermsHeader}>
          <Text style={styles.additionalTermsHeaderLabel}>Additional Terms</Text>
          <Text style={styles.additionalTermsHeaderNotes}>Notes</Text>
        </View>

        <View style={styles.termRow}>
          <Text style={styles.termLabel}>Processing Fees</Text>
          <Text style={styles.termValue}>{ADDITIONAL_TERMS.processingFees}</Text>
        </View>

        <View style={styles.termRow}>
          <Text style={styles.termLabel}>Agreement Term (Years)</Text>
          <Text style={styles.termValue}>{proposal.agreementTerm} Years</Text>
        </View>

        <View style={styles.termRow}>
          <Text style={styles.termLabel}>Recommended $/kWh</Text>
          <Text style={styles.termValue}>{formatCurrencyWithCents(proposal.recommendedKwhRate)}/kWh</Text>
        </View>

        <View style={styles.termRow}>
          <Text style={styles.termLabel}>Party Responsible for Paying Network Fees</Text>
          <Text style={styles.termValue}>{ADDITIONAL_TERMS.networkFeesResponsibility}</Text>
        </View>

        <View style={styles.termRow}>
          <Text style={styles.termLabel}>Party Responsible for Paying Utility Bills</Text>
          <Text style={styles.termValue}>{ADDITIONAL_TERMS.utilityBillsResponsibility}</Text>
        </View>
      </View>

      {/* Proposal Acceptance */}
      <View style={styles.acceptanceSection} wrap={false}>
        <View style={styles.acceptanceHeader}>
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
