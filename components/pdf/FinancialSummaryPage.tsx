import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { Proposal } from '@/lib/types';
import {
  formatCurrency,
  formatCurrencyWithCents,
  calculateGrossProjectCost,
  calculateNetProjectCost,
} from '@/lib/calculations';
import { ADDITIONAL_TERMS, FOOTNOTES } from '@/lib/constants';
import { colors, DISCLAIMER_TEXT } from './styles';

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

  // Financial table
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.slate700,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  tableHeaderLabel: {
    flex: 3,
    color: colors.primary,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  tableHeaderCost: {
    width: 100,
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

  // Table rows
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.slate800,
  },

  tableRowBold: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.slate700,
  },

  tableRowLabel: {
    flex: 3,
    fontSize: 10,
    color: colors.textLight,
    paddingLeft: 15,
  },

  tableRowLabelBold: {
    flex: 3,
    fontSize: 10,
    color: colors.text,
    fontWeight: 'bold',
  },

  tableRowCost: {
    width: 100,
    fontSize: 10,
    color: colors.text,
    textAlign: 'right',
  },

  tableRowCostBold: {
    width: 100,
    fontSize: 10,
    color: colors.text,
    textAlign: 'right',
    fontWeight: 'bold',
  },

  tableRowCostNegative: {
    width: 100,
    fontSize: 10,
    color: colors.primary,
    textAlign: 'right',
  },

  tableRowNotes: {
    flex: 2,
    fontSize: 8,
    color: colors.textMuted,
    textAlign: 'center',
  },

  // Footnotes
  footnotes: {
    marginTop: 10,
    paddingHorizontal: 15,
    backgroundColor: colors.slate800,
    paddingVertical: 10,
    borderRadius: 4,
  },

  footnoteText: {
    fontSize: 7,
    color: colors.textMuted,
    lineHeight: 1.4,
    marginBottom: 3,
  },

  // Additional Terms section
  additionalTermsSection: {
    marginTop: 15,
  },

  additionalTermsHeader: {
    flexDirection: 'row',
    backgroundColor: colors.slate700,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  additionalTermsHeaderLabel: {
    flex: 1,
    color: colors.primary,
    fontSize: 11,
    fontWeight: 'bold',
  },

  additionalTermsHeaderNotes: {
    flex: 1,
    color: colors.primary,
    fontSize: 11,
    fontWeight: 'bold',
  },

  termRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.slate800,
  },

  termLabel: {
    flex: 1,
    fontSize: 9,
    color: colors.textLight,
  },

  termValue: {
    flex: 1,
    fontSize: 9,
    color: colors.text,
  },

  // Proposal Acceptance section
  acceptanceSection: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.slate800,
  },

  acceptanceHeader: {
    backgroundColor: colors.slate700,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  acceptanceHeaderText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  acceptanceContent: {
    padding: 15,
  },

  acceptanceRow: {
    marginBottom: 12,
  },

  acceptanceLabel: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: 'bold',
    marginBottom: 2,
  },

  acceptanceLine: {
    borderBottomWidth: 1,
    borderBottomColor: colors.textMuted,
    height: 18,
  },

  acceptanceGrid: {
    flexDirection: 'row',
    gap: 30,
    marginTop: 15,
  },

  acceptanceCol: {
    flex: 1,
  },

  // Disclaimer footer
  disclaimerFooter: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    backgroundColor: colors.slate800,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderTopWidth: 1,
    borderTopColor: colors.primary,
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

interface FinancialSummaryPageProps {
  proposal: Proposal;
}

export function FinancialSummaryPage({ proposal }: FinancialSummaryPageProps) {
  const grossCost = calculateGrossProjectCost(proposal);
  const netCost = calculateNetProjectCost(proposal);

  // Get network years label
  const networkYearsLabel = `${proposal.networkYears} Years Included`;

  return (
    <Page size="LETTER" style={styles.page}>
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>
          <Text style={styles.titleUnderline}>Financial Summary</Text>
        </Text>

        {/* Financial Breakdown Table */}
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderLabel}>Financial Breakdown</Text>
          <Text style={styles.tableHeaderCost}>Cost</Text>
          <Text style={styles.tableHeaderNotes}>Notes</Text>
        </View>

        {/* Cost rows */}
        <View style={styles.tableRow}>
          <Text style={styles.tableRowLabel}>EVSE Cost</Text>
          <Text style={styles.tableRowCost}>{formatCurrency(proposal.evseQuotedPrice)}</Text>
          <Text style={styles.tableRowNotes}>-</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.tableRowLabel}>Customer Side Make Ready</Text>
          <Text style={styles.tableRowCost}>{formatCurrency(proposal.csmrQuotedPrice)}</Text>
          <Text style={styles.tableRowNotes}>Material + Labor</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.tableRowLabel}>Utility Side Make Ready (Allowance)</Text>
          <Text style={styles.tableRowCost}>{formatCurrency(proposal.utilityAllowance)}</Text>
          <Text style={styles.tableRowNotes}>-</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.tableRowLabel}>Shipping Cost</Text>
          <Text style={styles.tableRowCost}>{formatCurrency(proposal.shippingCost)}</Text>
          <Text style={styles.tableRowNotes}>-</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.tableRowLabel}>Annual Network Plan*</Text>
          <Text style={styles.tableRowCost}>{formatCurrency(proposal.networkPlanCost)}</Text>
          <Text style={styles.tableRowNotes}>{networkYearsLabel}</Text>
        </View>

        {/* Gross Project Cost */}
        <View style={styles.tableRowBold}>
          <Text style={styles.tableRowLabelBold}>Gross Project Cost</Text>
          <Text style={styles.tableRowCostBold}>{formatCurrency(grossCost)}</Text>
          <Text style={styles.tableRowNotes}>-</Text>
        </View>

        {/* Incentives */}
        <View style={styles.tableRow}>
          <Text style={styles.tableRowLabel}>Estimated Make Ready Incentive</Text>
          <Text style={styles.tableRowCostNegative}>- {formatCurrency(proposal.makeReadyIncentive)}</Text>
          <Text style={styles.tableRowNotes}>-</Text>
        </View>

        {proposal.nyseradaIncentive > 0 && (
          <View style={styles.tableRow}>
            <Text style={styles.tableRowLabel}>NYSERDA Charge Ready 2.0 Incentive</Text>
            <Text style={styles.tableRowCostNegative}>- {formatCurrency(proposal.nyseradaIncentive)}</Text>
            <Text style={styles.tableRowNotes}>-</Text>
          </View>
        )}

        {/* Net Project Cost */}
        <View style={styles.tableRowBold}>
          <Text style={styles.tableRowLabelBold}>Project Cost (with Incentives)**</Text>
          <Text style={styles.tableRowCostBold}>{formatCurrency(netCost)}</Text>
          <Text style={styles.tableRowNotes}>-</Text>
        </View>

        {/* Footnotes */}
        <View style={styles.footnotes}>
          <Text style={styles.footnoteText}>{FOOTNOTES.networkPlan}</Text>
          <Text style={styles.footnoteText}>{FOOTNOTES.paymentOptions}</Text>
        </View>

        {/* Additional Terms */}
        <View style={styles.additionalTermsSection}>
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
        <View style={styles.acceptanceSection}>
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
      </View>

      {/* Disclaimer Footer */}
      <View style={styles.disclaimerFooter}>
        <Text style={styles.disclaimerText}>{DISCLAIMER_TEXT}</Text>
      </View>

      {/* Page Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerLeft}>ChargeSmart EV Proposal</Text>
        <Text style={styles.footerRight}>04</Text>
      </View>
    </Page>
  );
}
