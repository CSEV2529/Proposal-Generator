import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { Proposal } from '@/lib/types';
import { COMPANY_INFO, PROJECT_TYPES } from '@/lib/constants';
import { formatCurrency, generateProposalNumber, calculateTotalPorts } from '@/lib/calculations';
import { getUtilityById } from '@/lib/templates';
import { getPdfColors, PdfColorPalette, PdfTheme } from './pdfTheme';
import { LOGO_DARK_BASE64 } from './logoDark';
import { LOGO_LIGHT_BASE64 } from './logoLight';
import { NODES_IMAGE_BASE64 } from './nodesImage';

const ROW_HEIGHT = 20;
const BANNER_HEIGHT = 22;
const BANNER_OFFSET = 10;

function getStyles(colors: PdfColorPalette, theme: PdfTheme) {
  return StyleSheet.create({
    page: {
      fontFamily: 'Roboto',
      fontSize: 9,
      backgroundColor: colors.pageBg,
      position: 'relative',
    },

    // Background nodes — matches Estimate/PageWrapper
    backgroundNodes: {
      position: 'absolute',
      top: -30,
      left: '-10%',
      width: '120%',
      height: 360,
      opacity: theme === 'dark' ? 0.075 : 0.12,
    },

    backgroundNodesImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },

    // ── Confidential banners — full width, top and bottom ──
    bannerTop: {
      position: 'absolute',
      top: BANNER_OFFSET,
      left: 0,
      right: 0,
      height: BANNER_HEIGHT,
      backgroundColor: '#dc2626',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },

    bannerBottom: {
      position: 'absolute',
      bottom: BANNER_OFFSET,
      left: 0,
      right: 0,
      height: BANNER_HEIGHT,
      backgroundColor: '#dc2626',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },

    bannerText: {
      fontFamily: 'Roboto',
      fontSize: 9,
      fontWeight: 700,
      color: '#FFFFFF',
      letterSpacing: 1.5,
      textAlign: 'center',
    },

    // ── Header: Title + Company | Logo + Details ──
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 40,
      paddingTop: BANNER_OFFSET + BANNER_HEIGHT + 12,
      paddingBottom: 15,
      position: 'relative',
      zIndex: 1,
    },

    headerLeft: {},

    headerRight: {
      alignItems: 'flex-end',
    },

    budgetTitle: {
      fontFamily: 'Orbitron',
      fontSize: 26,
      fontWeight: 700,
      color: colors.primary,
      marginBottom: 6,
    },

    companyName: {
      fontFamily: 'Roboto',
      fontSize: 10,
      fontWeight: 700,
      color: colors.white,
      marginBottom: 2,
    },

    companyInfo: {
      fontFamily: 'Roboto',
      fontSize: 8,
      color: colors.textMuted,
      marginBottom: 1,
    },

    logo: {
      width: 140,
      height: 42,
      objectFit: 'contain',
      marginBottom: 8,
    },

    // Details under logo, right-aligned
    detailRow: {
      flexDirection: 'row',
      marginBottom: 2,
    },

    detailLabel: {
      fontFamily: 'Roboto',
      fontSize: 8,
      color: colors.textMuted,
      width: 75,
      textAlign: 'right',
      marginRight: 6,
    },

    detailValue: {
      fontFamily: 'Roboto',
      fontSize: 8,
      color: colors.white,
      fontWeight: 700,
      width: 80,
    },

    // ── Project Details ──
    projectSection: {
      marginHorizontal: 40,
      marginBottom: 12,
      backgroundColor: colors.headerBg,
      padding: 12,
      borderRadius: 6,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
      position: 'relative',
      zIndex: 1,
    },

    projectTitle: {
      fontFamily: 'Roboto',
      fontSize: 10,
      fontWeight: 700,
      color: colors.primary,
      marginBottom: 8,
      letterSpacing: 0.5,
    },

    projectGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },

    projectItemThird: {
      width: '33.33%',
      marginBottom: 10,
      minHeight: 30,
    },

    projectLabel: {
      fontFamily: 'Roboto',
      fontSize: 8,
      color: colors.textMuted,
      marginBottom: 2,
    },

    projectValue: {
      fontFamily: 'Roboto',
      fontSize: 10,
      color: colors.white,
      fontWeight: 700,
    },

    // ── Table ──
    table: {
      marginHorizontal: 40,
      position: 'relative',
      zIndex: 1,
    },

    tableHeader: {
      flexDirection: 'row',
      backgroundColor: colors.headerBg,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
      borderRadius: 6,
    },

    tableHeaderCell: {
      fontFamily: 'Roboto',
      fontSize: 10,
      fontWeight: 700,
      color: colors.primary,
      letterSpacing: 0.3,
    },

    tableRow: {
      flexDirection: 'row',
      minHeight: 26,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      alignItems: 'center',
    },

    tableRowAlt: {
      backgroundColor: colors.panelBg,
    },

    tableCell: {
      fontFamily: 'Roboto',
      fontSize: 10,
      color: colors.textLight,
    },

    tableCellBold: {
      fontFamily: 'Roboto',
      fontSize: 10,
      color: colors.white,
      fontWeight: 700,
    },

    // Column widths
    colCategory: { width: '40%' } as any,
    colDescription: { width: '35%' } as any,
    colAmount: { width: '25%', textAlign: 'right' } as any,

    // Subtotal row
    subtotalRow: {
      flexDirection: 'row',
      height: ROW_HEIGHT,
      paddingHorizontal: 10,
      borderTopWidth: 2,
      borderTopColor: colors.white,
      alignItems: 'center',
      marginTop: 2,
    },

    // Total row — CSEV green
    totalRow: {
      flexDirection: 'row',
      paddingVertical: 10,
      paddingHorizontal: 10,
      backgroundColor: colors.primary,
      borderRadius: 6,
      marginTop: 6,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.primaryDark,
    },

    totalCell: {
      fontFamily: 'Roboto',
      fontSize: 12,
      color: colors.pageBg,
      fontWeight: 700,
    },

    // ── Notes section ──
    notesSection: {
      marginHorizontal: 40,
      marginTop: 15,
      backgroundColor: colors.headerBg,
      borderRadius: 6,
      padding: 12,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
      position: 'relative',
      zIndex: 1,
    },

    notesTitle: {
      fontFamily: 'Roboto',
      fontSize: 10,
      fontWeight: 700,
      color: colors.primary,
      marginBottom: 6,
      letterSpacing: 0.3,
    },

    notesText: {
      fontFamily: 'Roboto',
      fontSize: 9,
      color: colors.textMuted,
      lineHeight: 1.5,
    },
  });
}

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

  // EVSE Sales Tax (only for EPC and Site Host projects)
  if (proposal.evseSalesTax > 0) {
    lines.push({
      category: 'EVSE Sales Tax',
      description: `${proposal.salesTaxRate}% on equipment`,
      amount: proposal.evseSalesTax,
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

  // Network Plan (our actual cost)
  if (proposal.networkActualCost > 0) {
    lines.push({
      category: 'Network Plan',
      description: `${proposal.networkYears} year plan`,
      amount: proposal.networkActualCost,
    });
  }

  return lines;
}

export function BudgetDocument({ proposal }: BudgetDocumentProps) {
  const theme: PdfTheme = proposal.pdfTheme || 'dark';
  const colors = getPdfColors(theme);
  const styles = getStyles(colors, theme);
  const logoSrc = theme === 'dark' ? LOGO_DARK_BASE64 : LOGO_LIGHT_BASE64;

  const lines = prepareBudgetLines(proposal);
  const totalCost = proposal.totalActualCost;
  const totalPorts = calculateTotalPorts(proposal.evseItems);

  const budgetDate = proposal.preparedDate
    ? new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(proposal.preparedDate))
    : new Date().toLocaleDateString();

  const generatedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  const projectNumber = generateProposalNumber();
  const projectTypeLabel = PROJECT_TYPES[proposal.projectType]?.label || proposal.projectType;

  const cityStateZip = [proposal.customerCity, proposal.customerState, proposal.customerZip]
    .filter(Boolean)
    .join(', ');

  const utility = proposal.utilityId ? getUtilityById(proposal.utilityId) : undefined;
  const utilityName = utility?.name || 'Not selected';

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Background nodes */}
        <View style={styles.backgroundNodes}>
          <Image src={NODES_IMAGE_BASE64} style={styles.backgroundNodesImage} />
        </View>

        {/* Top confidential banner */}
        <View style={styles.bannerTop}>
          <Text style={styles.bannerText}>CONFIDENTIAL - NOT FOR DISTRIBUTION:  INTERNAL USE ONLY</Text>
        </View>

        {/* Bottom confidential banner */}
        <View style={styles.bannerBottom}>
          <Text style={styles.bannerText}>CONFIDENTIAL - NOT FOR DISTRIBUTION:  INTERNAL USE ONLY</Text>
        </View>

        {/* Header — Title + Company Info | Logo + Details */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.budgetTitle}>Project Budget</Text>
            <Text style={styles.companyName}>{COMPANY_INFO.legalName}</Text>
            <Text style={styles.companyInfo}>{COMPANY_INFO.address}</Text>
            <Text style={styles.companyInfo}>{COMPANY_INFO.city}, {COMPANY_INFO.state} {COMPANY_INFO.zip}</Text>
            <Text style={styles.companyInfo}>{COMPANY_INFO.email} | {COMPANY_INFO.phone}</Text>
          </View>
          <View style={styles.headerRight}>
            <Image src={logoSrc} style={styles.logo} />
          </View>
        </View>

        {/* Project Details */}
        <View style={styles.projectSection}>
          <Text style={styles.projectTitle}>PROJECT DETAILS</Text>
          <View style={styles.projectGrid}>
            {/* Row 1 */}
            <View style={styles.projectItemThird}>
              <Text style={styles.projectLabel}>Customer</Text>
              <Text style={styles.projectValue}>{proposal.customerName || 'Not specified'}</Text>
            </View>
            <View style={styles.projectItemThird}>
              <Text style={styles.projectLabel}>Site Address</Text>
              <Text style={styles.projectValue}>{proposal.customerAddress || 'Not specified'}</Text>
              {cityStateZip ? <Text style={styles.projectValue}>{cityStateZip}</Text> : null}
            </View>
            <View style={styles.projectItemThird}>
              <Text style={styles.projectLabel}>Generated Date</Text>
              <Text style={styles.projectValue}>{generatedDate}</Text>
            </View>
            {/* Row 2 */}
            <View style={styles.projectItemThird}>
              <Text style={styles.projectLabel}>Project #</Text>
              <Text style={styles.projectValue}>{projectNumber}</Text>
            </View>
            <View style={styles.projectItemThird}>
              <Text style={styles.projectLabel}>Project Type</Text>
              <Text style={styles.projectValue}>{projectTypeLabel}</Text>
            </View>
            <View style={styles.projectItemThird}>
              <Text style={styles.projectLabel}>Access Type</Text>
              <Text style={styles.projectValue}>{proposal.accessType === 'public' ? 'Public' : 'Private'}</Text>
            </View>
            {/* Row 3 */}
            <View style={styles.projectItemThird}>
              <Text style={styles.projectLabel}>Utility Program</Text>
              <Text style={styles.projectValue}>{utilityName}</Text>
            </View>
            <View style={styles.projectItemThird}>
              <Text style={styles.projectLabel}>Total Ports</Text>
              <Text style={styles.projectValue}>{totalPorts}</Text>
            </View>
            <View style={styles.projectItemThird}>
              <Text style={styles.projectLabel}>Network Term</Text>
              <Text style={styles.projectValue}>{proposal.networkYears} Year(s)</Text>
            </View>
          </View>
        </View>

        {/* Budget Table */}
        <View style={styles.table}>
          {/* Table header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colCategory]}>Cost Category</Text>
            <Text style={[styles.tableHeaderCell, styles.colDescription]}>Description</Text>
            <Text style={[styles.tableHeaderCell, styles.colAmount]}>Our Cost</Text>
          </View>

          {/* Line items */}
          {lines.map((item, index) => (
            <View key={index} style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : {}, index === lines.length - 1 ? { borderBottomWidth: 0 } : {}]}>
              <Text style={[styles.tableCellBold, styles.colCategory]}>{item.category}</Text>
              <Text style={[styles.tableCell, styles.colDescription]}>{item.description}</Text>
              <Text style={[styles.tableCellBold, styles.colAmount]}>{formatCurrency(item.amount)}</Text>
            </View>
          ))}

          {/* Total */}
          <View style={styles.totalRow}>
            <Text style={[styles.totalCell, styles.colCategory]}>TOTAL PROJECT COST</Text>
            <Text style={[styles.totalCell, styles.colDescription]}></Text>
            <Text style={[styles.totalCell, styles.colAmount]}>{formatCurrency(totalCost)}</Text>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>Notes</Text>
          <Text style={styles.notesText}>
            This budget represents ChargeSmart EV internal costs only. EVSE Equipment cost is based on
            pricebook unit costs. Installation cost reflects actual cost basis ({proposal.csmrCostBasisPercent}% of
            pricebook prices). Utility allowance, shipping, and network plan are pass-through costs with no margin.
            This document is confidential and not intended for customer distribution.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
