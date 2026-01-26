import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { Proposal } from '@/lib/types';
import {
  formatCurrency,
  calculateNetProjectCost,
  paymentOptions,
  calculatePaymentOptionCost,
} from '@/lib/calculations';
import {
  COMPANY_INFO,
  PAYMENT_OPTION_DETAILS,
  HOTEL_VALUE_PROPOSITION,
} from '@/lib/constants';
import { colors } from './styles';

const payStyles = StyleSheet.create({
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
  optionsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  optionBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    overflow: 'hidden',
  },
  optionBoxHighlight: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 6,
    overflow: 'hidden',
  },
  optionHeader: {
    backgroundColor: colors.background,
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionHeaderHighlight: {
    backgroundColor: colors.primary,
    padding: 10,
    alignItems: 'center',
  },
  optionName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primaryDark,
  },
  optionNameWhite: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.white,
  },
  optionSubtitle: {
    fontSize: 8,
    color: colors.textLight,
    marginTop: 2,
  },
  optionSubtitleWhite: {
    fontSize: 8,
    color: colors.white,
    marginTop: 2,
    opacity: 0.9,
  },
  optionContent: {
    padding: 10,
  },
  optionPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primaryDark,
    textAlign: 'center',
    marginBottom: 8,
  },
  optionDetail: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'center',
  },
  optionCheck: {
    width: 14,
    fontSize: 10,
    color: colors.primary,
  },
  optionDetailText: {
    flex: 1,
    fontSize: 8,
    color: colors.text,
  },
  optionRevShare: {
    backgroundColor: colors.background,
    padding: 8,
    marginTop: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  revShareLabel: {
    fontSize: 7,
    color: colors.textLight,
  },
  revShareValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  warrantySection: {
    marginTop: 15,
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 4,
  },
  warrantyTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginBottom: 8,
  },
  warrantyText: {
    fontSize: 9,
    color: colors.text,
    lineHeight: 1.5,
  },
  valueSection: {
    marginTop: 20,
    padding: 15,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 6,
    backgroundColor: '#F0FFF4',
  },
  valueTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginBottom: 10,
    textAlign: 'center',
  },
  valueGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  valueItem: {
    width: '50%',
    flexDirection: 'row',
    marginBottom: 6,
    paddingRight: 10,
  },
  valueBullet: {
    width: 14,
    fontSize: 10,
    color: colors.primary,
  },
  valueText: {
    flex: 1,
    fontSize: 9,
    color: colors.text,
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

interface PaymentOptionsPageProps {
  proposal: Proposal;
}

export function PaymentOptionsPage({ proposal }: PaymentOptionsPageProps) {
  const netCost = calculateNetProjectCost(proposal);

  const optionDetails = [
    PAYMENT_OPTION_DETAILS.option1,
    PAYMENT_OPTION_DETAILS.option2,
    PAYMENT_OPTION_DETAILS.option3,
  ];

  return (
    <Page size="LETTER" style={payStyles.page}>
      <View style={payStyles.header}>
        <Text style={payStyles.headerText}>{COMPANY_INFO.name}</Text>
      </View>

      <Text style={payStyles.title}>Payment Options</Text>

      <View style={payStyles.optionsGrid}>
        {paymentOptions.map((option, index) => {
          const cost = calculatePaymentOptionCost(netCost, option);
          const details = optionDetails[index];
          const isHighlighted = index === 2; // Option 3 highlighted

          return (
            <View
              key={index}
              style={isHighlighted ? payStyles.optionBoxHighlight : payStyles.optionBox}
            >
              <View
                style={
                  isHighlighted
                    ? payStyles.optionHeaderHighlight
                    : payStyles.optionHeader
                }
              >
                <Text
                  style={isHighlighted ? payStyles.optionNameWhite : payStyles.optionName}
                >
                  {details.title}
                </Text>
                <Text
                  style={
                    isHighlighted
                      ? payStyles.optionSubtitleWhite
                      : payStyles.optionSubtitle
                  }
                >
                  {details.subtitle}
                </Text>
              </View>

              <View style={payStyles.optionContent}>
                <Text style={payStyles.optionPrice}>
                  {cost === 0 ? 'FREE' : formatCurrency(cost)}
                </Text>

                {details.highlights.map((highlight, hIndex) => (
                  <View key={hIndex} style={payStyles.optionDetail}>
                    <Text style={payStyles.optionCheck}>✓</Text>
                    <Text style={payStyles.optionDetailText}>{highlight}</Text>
                  </View>
                ))}

                <View style={payStyles.optionRevShare}>
                  <Text style={payStyles.revShareLabel}>Revenue Share</Text>
                  <Text style={payStyles.revShareValue}>{option.revenueShare}%</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      <View style={payStyles.warrantySection}>
        <Text style={payStyles.warrantyTitle}>Warranty Options</Text>
        <Text style={payStyles.warrantyText}>
          • Standard: 3-year parts warranty included with Options 1 & 2{'\n'}
          • Premium: 5-year full warranty included with Option 3{'\n'}
          • Upgrade Available: Extend any option to 5-year full warranty for an
          additional fee{'\n'}• Full warranty covers parts, labor, and software support
        </Text>
      </View>

      <View style={payStyles.valueSection}>
        <Text style={payStyles.valueTitle}>{HOTEL_VALUE_PROPOSITION.title}</Text>
        <View style={payStyles.valueGrid}>
          {HOTEL_VALUE_PROPOSITION.points.map((point, index) => (
            <View key={index} style={payStyles.valueItem}>
              <Text style={payStyles.valueBullet}>•</Text>
              <Text style={payStyles.valueText}>{point}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={payStyles.footer}>Page 5 of 6</Text>
    </Page>
  );
}
