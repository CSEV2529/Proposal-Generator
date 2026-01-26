import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { Proposal } from '@/lib/types';
import {
  formatCurrency,
  formatCurrencyWithCents,
  calculateGrossProjectCost,
  calculateNetProjectCost,
} from '@/lib/calculations';
import { COMPANY_INFO } from '@/lib/constants';
import { colors } from './styles';

const finStyles = StyleSheet.create({
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
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginBottom: 8,
    marginTop: 15,
  },
  costTable: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    marginBottom: 15,
  },
  costRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  costRowAlt: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: '#FAFAFA',
  },
  costRowTotal: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
  },
  costRowHighlight: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.primary,
  },
  costLabel: {
    flex: 3,
    fontSize: 10,
    color: colors.text,
  },
  costLabelBold: {
    flex: 3,
    fontSize: 10,
    color: colors.text,
    fontWeight: 'bold',
  },
  costLabelWhite: {
    flex: 3,
    fontSize: 11,
    color: colors.white,
    fontWeight: 'bold',
  },
  costValue: {
    flex: 1,
    fontSize: 10,
    color: colors.text,
    textAlign: 'right',
  },
  costValueBold: {
    flex: 1,
    fontSize: 10,
    color: colors.text,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  costValueWhite: {
    flex: 1,
    fontSize: 11,
    color: colors.white,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  incentiveRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  incentiveLabel: {
    flex: 3,
    fontSize: 10,
    color: colors.primary,
  },
  incentiveValue: {
    flex: 1,
    fontSize: 10,
    color: colors.primary,
    textAlign: 'right',
  },
  termsSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: colors.background,
    borderRadius: 4,
  },
  termsTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginBottom: 10,
  },
  termsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  termItem: {
    width: '50%',
    marginBottom: 8,
  },
  termLabel: {
    fontSize: 8,
    color: colors.textLight,
  },
  termValue: {
    fontSize: 10,
    color: colors.text,
    fontWeight: 'bold',
  },
  signatureSection: {
    marginTop: 30,
  },
  signatureTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginBottom: 15,
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
    height: 30,
  },
  signatureLabel: {
    fontSize: 8,
    color: colors.textLight,
    marginBottom: 15,
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

interface FinancialSummaryPageProps {
  proposal: Proposal;
}

export function FinancialSummaryPage({ proposal }: FinancialSummaryPageProps) {
  const grossCost = calculateGrossProjectCost(proposal);
  const netCost = calculateNetProjectCost(proposal);
  const totalIncentives = proposal.makeReadyIncentive + proposal.nyseradaIncentive;

  return (
    <Page size="LETTER" style={finStyles.page}>
      <View style={finStyles.header}>
        <Text style={finStyles.headerText}>{COMPANY_INFO.name}</Text>
      </View>

      <Text style={finStyles.title}>Financial Summary</Text>

      <Text style={finStyles.sectionTitle}>Cost Breakdown</Text>
      <View style={finStyles.costTable}>
        <View style={finStyles.costRow}>
          <Text style={finStyles.costLabel}>EVSE Cost</Text>
          <Text style={finStyles.costValue}>{formatCurrency(proposal.evseCost)}</Text>
        </View>
        <View style={finStyles.costRowAlt}>
          <Text style={finStyles.costLabel}>Customer Side MR - Material Cost</Text>
          <Text style={finStyles.costValue}>
            {formatCurrency(proposal.materialCost)}
          </Text>
        </View>
        <View style={finStyles.costRow}>
          <Text style={finStyles.costLabel}>Customer Side MR - Labor Cost</Text>
          <Text style={finStyles.costValue}>{formatCurrency(proposal.laborCost)}</Text>
        </View>
        <View style={finStyles.costRowAlt}>
          <Text style={finStyles.costLabel}>Utility Side Make Ready (Allowance)</Text>
          <Text style={finStyles.costValue}>
            {formatCurrency(proposal.utilityAllowance)}
          </Text>
        </View>
        <View style={finStyles.costRow}>
          <Text style={finStyles.costLabel}>Shipping Cost</Text>
          <Text style={finStyles.costValue}>
            {formatCurrency(proposal.shippingCost)}
          </Text>
        </View>
        <View style={finStyles.costRowAlt}>
          <Text style={finStyles.costLabel}>Annual Network Plan (5 years included)</Text>
          <Text style={finStyles.costValue}>
            {formatCurrency(proposal.networkPlanCost)}
          </Text>
        </View>
        <View style={finStyles.costRowTotal}>
          <Text style={finStyles.costLabelBold}>Gross Project Cost</Text>
          <Text style={finStyles.costValueBold}>{formatCurrency(grossCost)}</Text>
        </View>
      </View>

      <Text style={finStyles.sectionTitle}>Incentives</Text>
      <View style={finStyles.costTable}>
        <View style={finStyles.incentiveRow}>
          <Text style={finStyles.incentiveLabel}>Estimated Make Ready Incentive</Text>
          <Text style={finStyles.incentiveValue}>
            - {formatCurrency(proposal.makeReadyIncentive)}
          </Text>
        </View>
        {proposal.nyseradaIncentive > 0 && (
          <View style={finStyles.incentiveRow}>
            <Text style={finStyles.incentiveLabel}>
              NYSERDA Charge Ready 2.0 Incentive
            </Text>
            <Text style={finStyles.incentiveValue}>
              - {formatCurrency(proposal.nyseradaIncentive)}
            </Text>
          </View>
        )}
        <View style={finStyles.costRowTotal}>
          <Text style={finStyles.costLabelBold}>Total Incentives</Text>
          <Text style={finStyles.costValueBold}>
            - {formatCurrency(totalIncentives)}
          </Text>
        </View>
        <View style={finStyles.costRowHighlight}>
          <Text style={finStyles.costLabelWhite}>Project Cost (with Incentives)</Text>
          <Text style={finStyles.costValueWhite}>{formatCurrency(netCost)}</Text>
        </View>
      </View>

      <View style={finStyles.termsSection}>
        <Text style={finStyles.termsTitle}>Additional Terms</Text>
        <View style={finStyles.termsGrid}>
          <View style={finStyles.termItem}>
            <Text style={finStyles.termLabel}>Processing Fees</Text>
            <Text style={finStyles.termValue}>{proposal.processingFees}</Text>
          </View>
          <View style={finStyles.termItem}>
            <Text style={finStyles.termLabel}>Agreement Term</Text>
            <Text style={finStyles.termValue}>{proposal.agreementTerm} Years</Text>
          </View>
          <View style={finStyles.termItem}>
            <Text style={finStyles.termLabel}>Recommended $/kWh Rate</Text>
            <Text style={finStyles.termValue}>
              {formatCurrencyWithCents(proposal.recommendedKwhRate)}/kWh
            </Text>
          </View>
        </View>
      </View>

      <View style={finStyles.signatureSection}>
        <Text style={finStyles.signatureTitle}>Customer Acceptance</Text>
        <View style={finStyles.signatureGrid}>
          <View style={finStyles.signatureBlock}>
            <View style={finStyles.signatureLine}></View>
            <Text style={finStyles.signatureLabel}>Authorized Signature</Text>
            <View style={finStyles.signatureLine}></View>
            <Text style={finStyles.signatureLabel}>Printed Name</Text>
          </View>
          <View style={finStyles.signatureBlock}>
            <View style={finStyles.signatureLine}></View>
            <Text style={finStyles.signatureLabel}>Title</Text>
            <View style={finStyles.signatureLine}></View>
            <Text style={finStyles.signatureLabel}>Date</Text>
          </View>
        </View>
      </View>

      <Text style={finStyles.footer}>Page 4 of 6</Text>
    </Page>
  );
}
