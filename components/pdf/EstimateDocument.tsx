import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { Proposal, InstallationItem } from '@/lib/types';
import { COMPANY_INFO, LABOR_RATE_PER_HOUR, PROJECT_TYPES } from '@/lib/constants';
import { formatCurrency, generateProposalNumber } from '@/lib/calculations';
import { getProductById } from '@/lib/pricebook';
import { getPdfColors, PdfColorPalette, PdfTheme } from './pdfTheme';
import { LOGO_DARK_BASE64 } from './logoDark';
import { LOGO_LIGHT_BASE64 } from './logoLight';
import { NODES_IMAGE_BASE64 } from './nodesImage';

// Utilities with custom category mappings
const UTILITIES_WITH_CATEGORY_MAPPING = ['national-grid', 'national-grid-ma', 'nyseg', 'rge'];

// National Grid category mapping
const NATIONAL_GRID_ITEM_MAP: { [itemId: string]: string } = {
  'project-management': 'Professional Services',
  'permit-fee': 'Permits',
  'design-fee': 'Design',
  'engineering-site': 'Design',
  'engineering-full': 'Design',
};

const NATIONAL_GRID_SUBGROUP_MAP: { [subgroup: string]: string } = {
  'Permits': 'Permits',
  'Design': 'Design',
  'Transformers': 'Transformer (if applicable)',
  'Trenching': 'Trenching',
  'Civil - Bases': 'Site Work (concrete pads, etc.)',
  'Panels': 'Panels',
  'Panels/Switchgear - New Service': 'Switch Gear',
  'Breakers': 'Breakers',
  'Conduit': 'Conduit',
  'Cables': 'Cables/Wiring',
  'Striping': 'Site Restoration',
};

// NYSEG/RG&E category mapping
const NYSEG_RGE_ITEM_MAP: { [itemId: string]: string } = {
  'permit-fee': 'Permitting Costs',
  'design-fee': 'Design Costs',
  'engineering-site': 'Design Costs',
  'engineering-full': 'Design Costs',
  'project-management': 'Design Costs',
};

const NYSEG_RGE_SUBGROUP_MAP: { [subgroup: string]: string } = {
  'Panels': 'Electrical Panel/Breakers',
  'Breakers': 'Electrical Panel/Breakers',
  'Panels/Switchgear - New Service': 'Service Boards',
  'Permits': 'Permitting Costs',
  'Design': 'Design Costs',
  'Trenching': 'Trenching/Restoration',
  'Striping': 'Trenching/Restoration',
  'Conduit': 'Conduit & Cable',
  'Cables': 'Conduit & Cable',
  'Transformers': 'Transformers',
  'Civil - Bases': 'Pads/Foundations',
};

// Get the category name for an installation item based on utility
function getItemCategory(item: InstallationItem, utilityId: string | undefined): string {
  if (!utilityId || !UTILITIES_WITH_CATEGORY_MAPPING.includes(utilityId)) {
    return item.subgroup;
  }

  if (utilityId === 'national-grid' || utilityId === 'national-grid-ma') {
    if (NATIONAL_GRID_ITEM_MAP[item.itemId]) {
      return NATIONAL_GRID_ITEM_MAP[item.itemId];
    }
    return NATIONAL_GRID_SUBGROUP_MAP[item.subgroup] || 'Other';
  }

  if (utilityId === 'nyseg' || utilityId === 'rge') {
    if (NYSEG_RGE_ITEM_MAP[item.itemId]) {
      return NYSEG_RGE_ITEM_MAP[item.itemId];
    }
    return NYSEG_RGE_SUBGROUP_MAP[item.subgroup] || 'Other [please describe]';
  }

  return item.subgroup;
}

const ROW_HEIGHT = 20;

function getStyles(colors: PdfColorPalette, theme: PdfTheme) {
  return StyleSheet.create({
    page: {
      fontFamily: 'Roboto',
      fontSize: 9,
      backgroundColor: colors.pageBg,
      position: 'relative',
    },

    // Background nodes — matches PageWrapper exactly
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

    // ── Header row: Title + Company | Logo + Details ──
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 40,
      paddingTop: 30,
      paddingBottom: 15,
      position: 'relative',
      zIndex: 1,
    },

    headerLeft: {},

    headerRight: {
      alignItems: 'flex-end',
    },

    estimateTitle: {
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

    // Estimate details — under logo, right-aligned
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

    // ── Bill to / Ship to — 50/50 ──
    addressRow: {
      flexDirection: 'row',
      marginHorizontal: 40,
      marginBottom: 15,
      gap: 8,
      position: 'relative',
      zIndex: 1,
    },

    addressBox: {
      flex: 1,
      backgroundColor: colors.headerBg,
      padding: 10,
      borderRadius: 6,
    },

    addressLabel: {
      fontFamily: 'Roboto',
      fontSize: 8,
      fontWeight: 700,
      color: colors.primary,
      marginBottom: 4,
      letterSpacing: 0.5,
    },

    addressText: {
      fontFamily: 'Roboto',
      fontSize: 8,
      color: colors.textLight,
      marginBottom: 1,
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
      fontSize: 8,
      fontWeight: 700,
      color: colors.primary,
      letterSpacing: 0.3,
    },

    tableRow: {
      flexDirection: 'row',
      minHeight: ROW_HEIGHT,
      paddingVertical: 4,
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
      fontSize: 8,
      color: colors.textLight,
    },

    tableCellBold: {
      fontFamily: 'Roboto',
      fontSize: 8,
      color: colors.white,
      fontWeight: 700,
    },

    // Column widths
    colProduct: { width: '35%' } as any,
    colDescription: { width: '25%' } as any,
    colQty: { width: '10%', textAlign: 'right' } as any,
    colRate: { width: '15%', textAlign: 'right' } as any,
    colAmount: { width: '15%', textAlign: 'right' } as any,

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

    // Incentive rows
    incentiveRow: {
      flexDirection: 'row',
      height: ROW_HEIGHT,
      paddingHorizontal: 10,
      alignItems: 'center',
      backgroundColor: theme === 'dark' ? 'rgba(75, 188, 136, 0.08)' : 'rgba(75, 188, 136, 0.12)',
      borderRadius: 4,
    },

    incentiveText: {
      fontFamily: 'Roboto',
      fontSize: 8,
      color: colors.primary,
      fontWeight: 700,
    },

    // Total row — dark grey/charcoal instead of green
    totalRow: {
      flexDirection: 'row',
      paddingVertical: 8,
      paddingHorizontal: 10,
      backgroundColor: theme === 'dark' ? '#2A2A2A' : '#3A3A3A',
      borderRadius: 6,
      marginTop: 4,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#444444' : '#555555',
    },

    totalCell: {
      fontFamily: 'Roboto',
      fontSize: 10,
      color: '#FFFFFF',
      fontWeight: 700,
    },

    // ── Acceptance — pinned to bottom ──
    acceptanceSection: {
      position: 'absolute',
      bottom: 35,
      left: 40,
      right: 40,
      flexDirection: 'row',
      gap: 60,
    },

    acceptanceColumn: {
      flex: 1,
    },

    acceptanceLabel: {
      fontFamily: 'Roboto',
      fontSize: 10,
      color: colors.textLight,
      fontWeight: 700,
      marginBottom: 28,
    },

    signatureLine: {
      borderBottomWidth: 1,
      borderBottomColor: colors.textMuted,
      height: 0,
    },
  });
}

interface EstimateLineItem {
  product: string;
  description: string;
  qty: string;
  rate: string;
  amount: number;
}

interface EstimateDocumentProps {
  proposal: Proposal;
}

// Helper to apply CSMR margin to a cost
function applyCSMRMargin(cost: number, costBasisPercent: number, marginPercent: number): number {
  const actualCost = cost * (costBasisPercent / 100);
  return actualCost / (1 - marginPercent / 100);
}

// Group and summarize line items by category with margins applied
function prepareEstimateLines(proposal: Proposal): EstimateLineItem[] {
  const lines: EstimateLineItem[] = [];

  // EVSE Equipment - each item on its own line with description from pricebook
  proposal.evseItems.forEach(item => {
    const product = getProductById(item.productId);
    lines.push({
      product: 'EVSE Equipment',
      description: product?.description || item.productId,
      qty: item.quantity.toString(),
      rate: formatCurrency(item.unitPrice),
      amount: item.totalPrice,
    });
  });

  // Group installation items by utility category (or subgroup if no utility mapping)
  const materialsByCategory: { [key: string]: number } = {};
  const laborByCategory: { [key: string]: number } = {};

  proposal.installationItems.forEach(item => {
    const category = getItemCategory(item, proposal.utilityId);

    if (item.totalMaterial > 0) {
      if (!materialsByCategory[category]) {
        materialsByCategory[category] = 0;
      }
      materialsByCategory[category] += item.totalMaterial;
    }

    if (item.totalLabor > 0) {
      if (!laborByCategory[category]) {
        laborByCategory[category] = 0;
      }
      laborByCategory[category] += item.totalLabor;
    }
  });

  const allCategories = new Set([...Object.keys(materialsByCategory), ...Object.keys(laborByCategory)]);

  Array.from(allCategories).sort().forEach(category => {
    const materialCost = materialsByCategory[category] || 0;
    const laborCost = laborByCategory[category] || 0;
    const totalPricebookCost = materialCost + laborCost;

    if (totalPricebookCost > 0) {
      const quotedPrice = applyCSMRMargin(
        totalPricebookCost,
        proposal.csmrCostBasisPercent,
        proposal.csmrMarginPercent
      );

      const laborHours = laborCost > 0 ? Math.round(laborCost / LABOR_RATE_PER_HOUR) : 0;
      const description = laborHours > 0 ? `Materials & Labor (${laborHours} hrs)` : 'Materials';

      lines.push({
        product: category,
        description: description,
        qty: '1',
        rate: formatCurrency(quotedPrice),
        amount: quotedPrice,
      });
    }
  });

  // Shipping (pass-through)
  if (proposal.shippingCost > 0) {
    lines.push({
      product: 'Shipping & Handling',
      description: 'Equipment delivery',
      qty: '1',
      rate: formatCurrency(proposal.shippingCost),
      amount: proposal.shippingCost,
    });
  }

  // Network Plan (pass-through)
  if (proposal.networkPlanCost > 0) {
    lines.push({
      product: `CSEV Network (${proposal.networkYears} Year)`,
      description: 'Network connectivity',
      qty: '1',
      rate: formatCurrency(proposal.networkPlanCost),
      amount: proposal.networkPlanCost,
    });
  }

  // Utility Allowance (pass-through)
  if (proposal.utilityAllowance > 0) {
    lines.push({
      product: 'Utility Make-Ready',
      description: 'Utility-side infrastructure',
      qty: '1',
      rate: formatCurrency(proposal.utilityAllowance),
      amount: proposal.utilityAllowance,
    });
  }

  return lines;
}

export function EstimateDocument({ proposal }: EstimateDocumentProps) {
  const theme: PdfTheme = proposal.pdfTheme || 'dark';
  const colors = getPdfColors(theme);
  const styles = getStyles(colors, theme);
  const logoSrc = theme === 'dark' ? LOGO_DARK_BASE64 : LOGO_LIGHT_BASE64;

  const lines = prepareEstimateLines(proposal);
  const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);
  const makeReadyIncentive = proposal.makeReadyIncentive || 0;
  const evseIncentive = proposal.nyseradaIncentive || 0;
  const netTotal = subtotal - makeReadyIncentive - evseIncentive;

  const estimateDate = proposal.preparedDate
    ? new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(proposal.preparedDate))
    : new Date().toLocaleDateString();

  const estimateNumber = generateProposalNumber();
  const projectTypeLabel = PROJECT_TYPES[proposal.projectType]?.label || proposal.projectType;

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Background nodes — matches Proposal pages */}
        <View style={styles.backgroundNodes}>
          <Image src={NODES_IMAGE_BASE64} style={styles.backgroundNodesImage} />
        </View>

        {/* Header — Title + Company Info | Logo + Estimate Details */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.estimateTitle}>Estimate</Text>
            <Text style={styles.companyName}>{COMPANY_INFO.legalName}</Text>
            <Text style={styles.companyInfo}>{COMPANY_INFO.address}</Text>
            <Text style={styles.companyInfo}>{COMPANY_INFO.city}, {COMPANY_INFO.state} {COMPANY_INFO.zip}</Text>
            <Text style={styles.companyInfo}>{COMPANY_INFO.email} | {COMPANY_INFO.phone}</Text>
          </View>
          <View style={styles.headerRight}>
            <Image src={logoSrc} style={styles.logo} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Estimate No.</Text>
              <Text style={styles.detailValue}>{estimateNumber}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{estimateDate}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Project Type</Text>
              <Text style={styles.detailValue}>{projectTypeLabel}</Text>
            </View>
          </View>
        </View>

        {/* Bill to | Ship to — 50/50 */}
        <View style={styles.addressRow}>
          <View style={styles.addressBox}>
            <Text style={styles.addressLabel}>BILL TO</Text>
            <Text style={styles.addressText}>{proposal.customerName || 'Customer Name'}</Text>
            <Text style={styles.addressText}>{proposal.customerAddress}</Text>
            <Text style={styles.addressText}>
              {[proposal.customerCity, proposal.customerState, proposal.customerZip].filter(Boolean).join(', ')}
            </Text>
          </View>
          <View style={styles.addressBox}>
            <Text style={styles.addressLabel}>SHIP TO</Text>
            <Text style={styles.addressText}>{proposal.customerName || 'Customer Name'}</Text>
            <Text style={styles.addressText}>{proposal.customerAddress}</Text>
            <Text style={styles.addressText}>
              {[proposal.customerCity, proposal.customerState, proposal.customerZip].filter(Boolean).join(', ')}
            </Text>
          </View>
        </View>

        {/* Line items table */}
        <View style={styles.table}>
          {/* Table header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colProduct]}>Product or Service</Text>
            <Text style={[styles.tableHeaderCell, styles.colDescription]}>Description</Text>
            <Text style={[styles.tableHeaderCell, styles.colQty]}>Qty</Text>
            <Text style={[styles.tableHeaderCell, styles.colRate]}>Rate</Text>
            <Text style={[styles.tableHeaderCell, styles.colAmount]}>Amount</Text>
          </View>

          {/* Line items */}
          {lines.map((item, index) => (
            <View key={index} style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : {}]}>
              <Text style={[styles.tableCellBold, styles.colProduct]}>{item.product}</Text>
              <Text style={[styles.tableCell, styles.colDescription]}>{item.description}</Text>
              <Text style={[styles.tableCell, styles.colQty]}>{item.qty}</Text>
              <Text style={[styles.tableCell, styles.colRate]}>{item.rate}</Text>
              <Text style={[styles.tableCellBold, styles.colAmount]}>{formatCurrency(item.amount)}</Text>
            </View>
          ))}

          {/* Subtotal */}
          <View style={styles.subtotalRow}>
            <Text style={[styles.tableCellBold, styles.colProduct]}>Subtotal</Text>
            <Text style={[styles.tableCell, styles.colDescription]}></Text>
            <Text style={[styles.tableCell, styles.colQty]}></Text>
            <Text style={[styles.tableCell, styles.colRate]}></Text>
            <Text style={[styles.tableCellBold, styles.colAmount]}>{formatCurrency(subtotal)}</Text>
          </View>

          {/* Incentives */}
          {makeReadyIncentive > 0 && (
            <View style={styles.incentiveRow}>
              <Text style={[styles.incentiveText, styles.colProduct]}>Make Ready Incentive</Text>
              <Text style={[styles.incentiveText, styles.colDescription]}>Utility rebate</Text>
              <Text style={[styles.incentiveText, styles.colQty]}></Text>
              <Text style={[styles.incentiveText, styles.colRate]}></Text>
              <Text style={[styles.incentiveText, styles.colAmount]}>-{formatCurrency(makeReadyIncentive)}</Text>
            </View>
          )}

          {evseIncentive > 0 && (
            <View style={styles.incentiveRow}>
              <Text style={[styles.incentiveText, styles.colProduct]}>EVSE Program Incentive</Text>
              <Text style={[styles.incentiveText, styles.colDescription]}>State grant/rebate</Text>
              <Text style={[styles.incentiveText, styles.colQty]}></Text>
              <Text style={[styles.incentiveText, styles.colRate]}></Text>
              <Text style={[styles.incentiveText, styles.colAmount]}>-{formatCurrency(evseIncentive)}</Text>
            </View>
          )}

          {/* Net Total */}
          <View style={styles.totalRow}>
            <Text style={[styles.totalCell, styles.colProduct]}>NET PROJECT COST</Text>
            <Text style={[styles.totalCell, styles.colDescription]}></Text>
            <Text style={[styles.totalCell, styles.colQty]}></Text>
            <Text style={[styles.totalCell, styles.colRate]}></Text>
            <Text style={[styles.totalCell, styles.colAmount]}>{formatCurrency(netTotal)}</Text>
          </View>
        </View>

        {/* Acceptance — pinned to bottom */}
        <View style={styles.acceptanceSection}>
          <View style={styles.acceptanceColumn}>
            <Text style={styles.acceptanceLabel}>Accepted Date</Text>
            <View style={styles.signatureLine} />
          </View>
          <View style={styles.acceptanceColumn}>
            <Text style={styles.acceptanceLabel}>Accepted By</Text>
            <View style={styles.signatureLine} />
          </View>
        </View>
      </Page>
    </Document>
  );
}
