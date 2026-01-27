import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { Proposal, InstallationItem } from '@/lib/types';
import { COMPANY_INFO, LABOR_RATE_PER_HOUR } from '@/lib/constants';
import { formatCurrency, generateProposalNumber } from '@/lib/calculations';
import { getProductById } from '@/lib/pricebook';

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
    // No utility mapping - use subgroup as category
    return item.subgroup;
  }

  if (utilityId === 'national-grid' || utilityId === 'national-grid-ma') {
    // Check item-specific mapping first
    if (NATIONAL_GRID_ITEM_MAP[item.itemId]) {
      return NATIONAL_GRID_ITEM_MAP[item.itemId];
    }
    return NATIONAL_GRID_SUBGROUP_MAP[item.subgroup] || 'Other';
  }

  if (utilityId === 'nyseg' || utilityId === 'rge') {
    // Check item-specific mapping first
    if (NYSEG_RGE_ITEM_MAP[item.itemId]) {
      return NYSEG_RGE_ITEM_MAP[item.itemId];
    }
    return NYSEG_RGE_SUBGROUP_MAP[item.subgroup] || 'Other [please describe]';
  }

  // Fallback to subgroup
  return item.subgroup;
}

const colors = {
  primary: '#45B7AA',
  primaryLight: '#E8F5F3',
  text: '#333333',
  textLight: '#666666',
  border: '#DDDDDD',
  borderDark: '#333333',
  white: '#FFFFFF',
  green: '#28a745',
};

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    backgroundColor: colors.white,
    paddingBottom: 80,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingTop: 30,
    paddingBottom: 20,
  },

  headerLeft: {
    flex: 1,
  },

  estimateTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    letterSpacing: 3,
  },

  companyName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },

  companyInfo: {
    fontSize: 9,
    color: colors.textLight,
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

  // Address section
  addressSection: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    marginHorizontal: 40,
    marginBottom: 20,
  },

  addressColumn: {
    flex: 1,
    padding: 15,
  },

  addressLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 6,
  },

  addressText: {
    fontSize: 9,
    color: colors.text,
    marginBottom: 2,
  },

  // Estimate details
  detailsSection: {
    marginHorizontal: 40,
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 15,
  },

  detailsTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },

  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },

  detailLabel: {
    fontSize: 9,
    color: colors.textLight,
    width: 90,
  },

  detailValue: {
    fontSize: 9,
    color: colors.text,
    fontWeight: 'bold',
  },

  // Table
  table: {
    marginHorizontal: 40,
  },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },

  tableHeaderCell: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.text,
  },

  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  tableRowAlt: {
    backgroundColor: '#FAFAFA',
  },

  tableCell: {
    fontSize: 9,
    color: colors.text,
  },

  tableCellBold: {
    fontSize: 9,
    color: colors.text,
    fontWeight: 'bold',
  },

  // Column widths
  colProduct: { width: '35%' },
  colDescription: { width: '25%' },
  colQty: { width: '10%', textAlign: 'right' },
  colRate: { width: '15%', textAlign: 'right' },
  colAmount: { width: '15%', textAlign: 'right' },

  // Subtotal row
  subtotalRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderTopWidth: 2,
    borderTopColor: colors.borderDark,
    marginTop: 5,
  },

  // Incentive rows
  incentiveRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#E8F5E9',
  },

  incentiveText: {
    fontSize: 9,
    color: colors.green,
  },

  // Total row
  totalRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: colors.primary,
    marginTop: 2,
  },

  totalCell: {
    fontSize: 11,
    color: colors.white,
    fontWeight: 'bold',
  },

  // Acceptance section
  acceptanceSection: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 15,
  },

  acceptanceColumn: {
    flex: 1,
    marginRight: 30,
  },

  acceptanceLabel: {
    fontSize: 9,
    color: colors.textLight,
    marginBottom: 5,
  },

  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: colors.text,
    height: 25,
  },
});

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

    // Sum materials by category (pricebook cost, margin will be applied to total)
    if (item.totalMaterial > 0) {
      if (!materialsByCategory[category]) {
        materialsByCategory[category] = 0;
      }
      materialsByCategory[category] += item.totalMaterial;
    }

    // Sum labor by category (pricebook cost, margin will be applied to total)
    if (item.totalLabor > 0) {
      if (!laborByCategory[category]) {
        laborByCategory[category] = 0;
      }
      laborByCategory[category] += item.totalLabor;
    }
  });

  // Get all unique categories and sort them
  const allCategories = new Set([...Object.keys(materialsByCategory), ...Object.keys(laborByCategory)]);

  // Add lines for each category (material + labor combined per category)
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

      // Calculate labor hours for display
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

  // Shipping (pass-through, no margin)
  if (proposal.shippingCost > 0) {
    lines.push({
      product: 'Shipping & Handling',
      description: 'Equipment delivery',
      qty: '1',
      rate: formatCurrency(proposal.shippingCost),
      amount: proposal.shippingCost,
    });
  }

  // Network Plan (pass-through, no margin)
  if (proposal.networkPlanCost > 0) {
    lines.push({
      product: `CSEV Network (${proposal.networkYears} Year)`,
      description: 'Network connectivity',
      qty: '1',
      rate: formatCurrency(proposal.networkPlanCost),
      amount: proposal.networkPlanCost,
    });
  }

  // Utility Allowance (pass-through, no margin)
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
  const lines = prepareEstimateLines(proposal);

  // Calculate subtotal from line items
  const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);

  // Incentives
  const makeReadyIncentive = proposal.makeReadyIncentive || 0;
  const evseIncentive = proposal.nyseradaIncentive || 0;

  // Net total
  const netTotal = subtotal - makeReadyIncentive - evseIncentive;

  // Format date
  const estimateDate = proposal.preparedDate
    ? new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(proposal.preparedDate))
    : new Date().toLocaleDateString();

  const estimateNumber = generateProposalNumber();

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.estimateTitle}>ESTIMATE</Text>
            <Text style={styles.companyName}>{COMPANY_INFO.legalName}</Text>
            <Text style={styles.companyInfo}>{COMPANY_INFO.address}</Text>
            <Text style={styles.companyInfo}>{COMPANY_INFO.city}, {COMPANY_INFO.state} {COMPANY_INFO.zip}</Text>
            <Text style={styles.companyInfo}>{COMPANY_INFO.email}</Text>
            <Text style={styles.companyInfo}>{COMPANY_INFO.phone}</Text>
          </View>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>
              <Text style={styles.logoCharge}>Charge</Text>
              <Text style={styles.logoSmart}>Smart EV</Text>
            </Text>
          </View>
        </View>

        {/* Bill to / Ship to */}
        <View style={styles.addressSection}>
          <View style={styles.addressColumn}>
            <Text style={styles.addressLabel}>Bill to</Text>
            <Text style={styles.addressText}>{proposal.customerName || 'Customer Name'}</Text>
            <Text style={styles.addressText}>{proposal.customerAddress}</Text>
            <Text style={styles.addressText}>
              {[proposal.customerCity, proposal.customerState, proposal.customerZip].filter(Boolean).join(', ')}
            </Text>
          </View>
          <View style={styles.addressColumn}>
            <Text style={styles.addressLabel}>Ship to</Text>
            <Text style={styles.addressText}>{proposal.customerName || 'Customer Name'}</Text>
            <Text style={styles.addressText}>{proposal.customerAddress}</Text>
            <Text style={styles.addressText}>
              {[proposal.customerCity, proposal.customerState, proposal.customerZip].filter(Boolean).join(', ')}
            </Text>
          </View>
        </View>

        {/* Estimate details */}
        <View style={styles.detailsSection}>
          <Text style={styles.detailsTitle}>Estimate details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Estimate no.:</Text>
            <Text style={styles.detailValue}>{estimateNumber}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Estimate date:</Text>
            <Text style={styles.detailValue}>{estimateDate}</Text>
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

        {/* Acceptance */}
        <View style={styles.acceptanceSection}>
          <View style={styles.acceptanceColumn}>
            <Text style={styles.acceptanceLabel}>Accepted date</Text>
            <View style={styles.signatureLine} />
          </View>
          <View style={styles.acceptanceColumn}>
            <Text style={styles.acceptanceLabel}>Accepted by</Text>
            <View style={styles.signatureLine} />
          </View>
        </View>
      </Page>
    </Document>
  );
}
