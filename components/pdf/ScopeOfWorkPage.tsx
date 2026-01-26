import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { Proposal } from '@/lib/types';
import { formatCurrency } from '@/lib/calculations';
import { RESPONSIBILITIES, COMPANY_INFO } from '@/lib/constants';
import { colors } from './styles';

const scopeStyles = StyleSheet.create({
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
    backgroundColor: colors.background,
    padding: 6,
  },
  table: {
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableHeaderCell: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 9,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  tableRowAlt: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: '#FAFAFA',
  },
  colItem: {
    flex: 3,
  },
  colQty: {
    width: 50,
    textAlign: 'center',
  },
  colPrice: {
    width: 70,
    textAlign: 'right',
  },
  colNotes: {
    flex: 2,
  },
  tableCell: {
    fontSize: 8,
    color: colors.text,
  },
  tableCellBold: {
    fontSize: 8,
    color: colors.text,
    fontWeight: 'bold',
  },
  totalRow: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
  },
  responsibilitiesSection: {
    marginTop: 15,
  },
  responsibilitiesGrid: {
    flexDirection: 'row',
    gap: 15,
  },
  responsibilityCol: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
  },
  responsibilityTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  responsibilityItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bullet: {
    width: 12,
    fontSize: 8,
    color: colors.primary,
  },
  responsibilityText: {
    flex: 1,
    fontSize: 8,
    color: colors.text,
    lineHeight: 1.4,
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

interface ScopeOfWorkPageProps {
  proposal: Proposal;
}

export function ScopeOfWorkPage({ proposal }: ScopeOfWorkPageProps) {
  const materialItems = proposal.installationItems.filter(
    i => i.category === 'material'
  );
  const laborItems = proposal.installationItems.filter(i => i.category === 'labor');

  return (
    <Page size="LETTER" style={scopeStyles.page}>
      <View style={scopeStyles.header}>
        <Text style={scopeStyles.headerText}>{COMPANY_INFO.name}</Text>
      </View>

      <Text style={scopeStyles.title}>Proposed Scope of Work</Text>

      {/* EVSE Section */}
      <Text style={scopeStyles.sectionTitle}>EVSE Equipment</Text>
      <View style={scopeStyles.table}>
        <View style={scopeStyles.tableHeader}>
          <Text style={[scopeStyles.tableHeaderCell, scopeStyles.colItem]}>
            Equipment
          </Text>
          <Text style={[scopeStyles.tableHeaderCell, scopeStyles.colQty]}>Qty</Text>
          <Text style={[scopeStyles.tableHeaderCell, scopeStyles.colPrice]}>
            Unit Price
          </Text>
          <Text style={[scopeStyles.tableHeaderCell, scopeStyles.colPrice]}>Total</Text>
          <Text style={[scopeStyles.tableHeaderCell, scopeStyles.colNotes]}>Notes</Text>
        </View>

        {proposal.evseItems.length === 0 ? (
          <View style={scopeStyles.tableRow}>
            <Text style={[scopeStyles.tableCell, { fontStyle: 'italic' }]}>
              No equipment specified
            </Text>
          </View>
        ) : (
          proposal.evseItems.map((item, index) => (
            <View
              key={item.id}
              style={index % 2 === 0 ? scopeStyles.tableRow : scopeStyles.tableRowAlt}
            >
              <Text style={[scopeStyles.tableCell, scopeStyles.colItem]}>
                {item.name}
              </Text>
              <Text style={[scopeStyles.tableCell, scopeStyles.colQty]}>
                {item.quantity}
              </Text>
              <Text style={[scopeStyles.tableCell, scopeStyles.colPrice]}>
                {formatCurrency(item.unitPrice)}
              </Text>
              <Text style={[scopeStyles.tableCellBold, scopeStyles.colPrice]}>
                {formatCurrency(item.totalPrice)}
              </Text>
              <Text style={[scopeStyles.tableCell, scopeStyles.colNotes]}>
                {item.notes || '-'}
              </Text>
            </View>
          ))
        )}

        <View style={scopeStyles.totalRow}>
          <Text style={[scopeStyles.tableCellBold, scopeStyles.colItem]}>
            EVSE Total
          </Text>
          <Text style={[scopeStyles.tableCell, scopeStyles.colQty]}></Text>
          <Text style={[scopeStyles.tableCell, scopeStyles.colPrice]}></Text>
          <Text style={[scopeStyles.tableCellBold, scopeStyles.colPrice]}>
            {formatCurrency(proposal.evseCost)}
          </Text>
          <Text style={[scopeStyles.tableCell, scopeStyles.colNotes]}></Text>
        </View>
      </View>

      {/* Installation - Materials */}
      <Text style={scopeStyles.sectionTitle}>Installation - Materials</Text>
      <View style={scopeStyles.table}>
        <View style={scopeStyles.tableHeader}>
          <Text style={[scopeStyles.tableHeaderCell, { flex: 4 }]}>Item</Text>
          <Text style={[scopeStyles.tableHeaderCell, scopeStyles.colQty]}>Qty</Text>
          <Text style={[scopeStyles.tableHeaderCell, scopeStyles.colPrice]}>
            Unit Price
          </Text>
          <Text style={[scopeStyles.tableHeaderCell, scopeStyles.colPrice]}>Total</Text>
        </View>

        {materialItems.length === 0 ? (
          <View style={scopeStyles.tableRow}>
            <Text style={[scopeStyles.tableCell, { fontStyle: 'italic' }]}>
              No materials specified
            </Text>
          </View>
        ) : (
          materialItems.map((item, index) => (
            <View
              key={item.id}
              style={index % 2 === 0 ? scopeStyles.tableRow : scopeStyles.tableRowAlt}
            >
              <Text style={[scopeStyles.tableCell, { flex: 4 }]}>{item.name}</Text>
              <Text style={[scopeStyles.tableCell, scopeStyles.colQty]}>
                {item.quantity}
              </Text>
              <Text style={[scopeStyles.tableCell, scopeStyles.colPrice]}>
                {formatCurrency(item.unitPrice)}
              </Text>
              <Text style={[scopeStyles.tableCellBold, scopeStyles.colPrice]}>
                {formatCurrency(item.totalPrice)}
              </Text>
            </View>
          ))
        )}

        <View style={scopeStyles.totalRow}>
          <Text style={[scopeStyles.tableCellBold, { flex: 4 }]}>Material Total</Text>
          <Text style={[scopeStyles.tableCell, scopeStyles.colQty]}></Text>
          <Text style={[scopeStyles.tableCell, scopeStyles.colPrice]}></Text>
          <Text style={[scopeStyles.tableCellBold, scopeStyles.colPrice]}>
            {formatCurrency(proposal.materialCost)}
          </Text>
        </View>
      </View>

      {/* Installation - Labor */}
      <Text style={scopeStyles.sectionTitle}>Installation - Labor</Text>
      <View style={scopeStyles.table}>
        <View style={scopeStyles.tableHeader}>
          <Text style={[scopeStyles.tableHeaderCell, { flex: 4 }]}>Service</Text>
          <Text style={[scopeStyles.tableHeaderCell, scopeStyles.colQty]}>Qty</Text>
          <Text style={[scopeStyles.tableHeaderCell, scopeStyles.colPrice]}>
            Unit Price
          </Text>
          <Text style={[scopeStyles.tableHeaderCell, scopeStyles.colPrice]}>Total</Text>
        </View>

        {laborItems.length === 0 ? (
          <View style={scopeStyles.tableRow}>
            <Text style={[scopeStyles.tableCell, { fontStyle: 'italic' }]}>
              No labor specified
            </Text>
          </View>
        ) : (
          laborItems.map((item, index) => (
            <View
              key={item.id}
              style={index % 2 === 0 ? scopeStyles.tableRow : scopeStyles.tableRowAlt}
            >
              <Text style={[scopeStyles.tableCell, { flex: 4 }]}>{item.name}</Text>
              <Text style={[scopeStyles.tableCell, scopeStyles.colQty]}>
                {item.quantity}
              </Text>
              <Text style={[scopeStyles.tableCell, scopeStyles.colPrice]}>
                {formatCurrency(item.unitPrice)}
              </Text>
              <Text style={[scopeStyles.tableCellBold, scopeStyles.colPrice]}>
                {formatCurrency(item.totalPrice)}
              </Text>
            </View>
          ))
        )}

        <View style={scopeStyles.totalRow}>
          <Text style={[scopeStyles.tableCellBold, { flex: 4 }]}>Labor Total</Text>
          <Text style={[scopeStyles.tableCell, scopeStyles.colQty]}></Text>
          <Text style={[scopeStyles.tableCell, scopeStyles.colPrice]}></Text>
          <Text style={[scopeStyles.tableCellBold, scopeStyles.colPrice]}>
            {formatCurrency(proposal.laborCost)}
          </Text>
        </View>
      </View>

      {/* Responsibilities */}
      <View style={scopeStyles.responsibilitiesSection}>
        <Text style={scopeStyles.sectionTitle}>Responsibilities</Text>
        <View style={scopeStyles.responsibilitiesGrid}>
          <View style={scopeStyles.responsibilityCol}>
            <Text style={scopeStyles.responsibilityTitle}>ChargeSmart EV</Text>
            {RESPONSIBILITIES.csev.map((item, index) => (
              <View key={index} style={scopeStyles.responsibilityItem}>
                <Text style={scopeStyles.bullet}>•</Text>
                <Text style={scopeStyles.responsibilityText}>{item}</Text>
              </View>
            ))}
          </View>
          <View style={scopeStyles.responsibilityCol}>
            <Text style={scopeStyles.responsibilityTitle}>Customer</Text>
            {RESPONSIBILITIES.customer.map((item, index) => (
              <View key={index} style={scopeStyles.responsibilityItem}>
                <Text style={scopeStyles.bullet}>•</Text>
                <Text style={scopeStyles.responsibilityText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <Text style={scopeStyles.footer}>Page 3 of 6</Text>
    </Page>
  );
}
