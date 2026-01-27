import React from 'react';
import { Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { Proposal } from '@/lib/types';
import { formatCurrency, calculateNetProjectCost } from '@/lib/calculations';
import { PAYMENT_OPTION_DETAILS, HOTEL_VALUE_PROPOSITION, FOOTNOTES } from '@/lib/constants';
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
    marginBottom: 10,
  },

  titleUnderline: {
    color: colors.primary,
  },

  introText: {
    fontSize: 9,
    color: colors.textMuted,
    lineHeight: 1.4,
    marginBottom: 15,
  },

  // Purchase Options header
  purchaseOptionsHeader: {
    backgroundColor: colors.slate700,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  purchaseOptionsHeaderText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  // Option box
  optionBox: {
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.slate800,
  },

  // Option left section (Option number and warranty)
  optionLeft: {
    width: 100,
    padding: 10,
    backgroundColor: colors.slate700,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },

  optionNumber: {
    backgroundColor: colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 8,
    borderRadius: 3,
  },

  optionNumberText: {
    color: colors.slate900,
    fontSize: 10,
    fontWeight: 'bold',
  },

  warrantyIncluded: {
    fontSize: 8,
    color: colors.textMuted,
    marginBottom: 3,
  },

  warrantyText: {
    fontSize: 9,
    color: colors.text,
    fontWeight: 'bold',
  },

  warrantyValue: {
    fontSize: 8,
    color: colors.primary,
    fontStyle: 'italic',
    marginTop: 5,
  },

  // Option middle section (cost and warranty upgrades)
  optionMiddle: {
    flex: 1,
    padding: 10,
  },

  costRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  costLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 10,
  },

  costValue: {
    backgroundColor: colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
  },

  costValueText: {
    color: colors.slate900,
    fontSize: 12,
    fontWeight: 'bold',
  },

  revShareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },

  revShareLabel: {
    fontSize: 9,
    color: colors.textLight,
    marginRight: 8,
  },

  revShareValue: {
    backgroundColor: colors.slate700,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.primary,
  },

  revShareValueText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: 'bold',
  },

  warrantyUpgradeTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },

  warrantyUpgradeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  checkbox: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: colors.textMuted,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },

  checkboxChecked: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.primary,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
  },

  checkmark: {
    color: colors.slate900,
    fontSize: 8,
  },

  warrantyUpgradeName: {
    fontSize: 8,
    color: colors.textLight,
    flex: 1,
  },

  warrantyUpgradeCost: {
    fontSize: 7,
    color: colors.primary,
    fontStyle: 'italic',
  },

  optOutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  optOutText: {
    fontSize: 8,
    color: colors.textMuted,
  },

  // Option right section (initial here)
  optionRight: {
    width: 80,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    backgroundColor: colors.slate700,
  },

  initialLine: {
    borderBottomWidth: 1,
    borderBottomColor: colors.textMuted,
    width: 60,
    marginBottom: 5,
  },

  initialText: {
    fontSize: 7,
    color: colors.textMuted,
    textAlign: 'center',
  },

  // Footnote
  footnote: {
    fontSize: 7,
    color: colors.textMuted,
    lineHeight: 1.4,
    marginTop: 10,
    marginBottom: 15,
  },

  // Hotel value section
  hotelSection: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.slate800,
  },

  hotelHeader: {
    backgroundColor: colors.slate700,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  hotelHeaderText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  hotelContent: {
    padding: 12,
  },

  hotelIntro: {
    fontSize: 9,
    color: colors.textLight,
    marginBottom: 8,
  },

  hotelIntroHighlight: {
    fontWeight: 'bold',
    color: colors.primary,
  },

  hotelPoint: {
    fontSize: 8,
    color: colors.textLight,
    marginBottom: 4,
    lineHeight: 1.4,
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

interface PaymentOptionsPageProps {
  proposal: Proposal;
}

export function PaymentOptionsPage({ proposal }: PaymentOptionsPageProps) {
  const netCost = calculateNetProjectCost(proposal);

  // Calculate costs for each option
  const option1Cost = netCost;
  const option2Cost = netCost * 0.5;
  const option3Cost = 0;

  const options = [
    {
      ...PAYMENT_OPTION_DETAILS.option1,
      cost: option1Cost,
      showCheckboxes: true,
    },
    {
      ...PAYMENT_OPTION_DETAILS.option2,
      cost: option2Cost,
      showCheckboxes: true,
    },
    {
      ...PAYMENT_OPTION_DETAILS.option3,
      cost: option3Cost,
      showCheckboxes: false,
    },
  ];

  return (
    <Page size="LETTER" style={styles.page}>
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>
          <Text style={styles.titleUnderline}>Payment Options</Text>
        </Text>

        <Text style={styles.introText}>
          Below you will see three payment options for you to choose from. Please take a look at the
          differing net amounts and how each impacts the Revenue Share amounts. The processing fees
          listed previously will come out of every transaction and cannot be removed or changed in any way.
        </Text>

        {/* Purchase Options Header */}
        <View style={styles.purchaseOptionsHeader}>
          <Text style={styles.purchaseOptionsHeaderText}>Purchase Options</Text>
        </View>

        {/* Option Boxes */}
        {options.map((option, index) => (
          <View key={index} style={styles.optionBox}>
            {/* Left - Option number and warranty */}
            <View style={styles.optionLeft}>
              <View style={styles.optionNumber}>
                <Text style={styles.optionNumberText}>{option.title}</Text>
              </View>
              <Text style={styles.warrantyIncluded}>Warranty Included:</Text>
              <Text style={styles.warrantyText}>{option.warrantyIncluded}</Text>
              {'warrantyValue' in option && option.warrantyValue && (
                <Text style={styles.warrantyValue}>
                  A ${formatCurrency(option.warrantyValue)} VALUE{'\n'}PER STATION
                </Text>
              )}
            </View>

            {/* Middle - Cost and warranty upgrades */}
            <View style={styles.optionMiddle}>
              <View style={[styles.costRow, { justifyContent: 'space-between' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.costLabel}>FINAL NET Cost:</Text>
                  <View style={styles.costValue}>
                    <Text style={styles.costValueText}>
                      {option.cost === 0 ? 'FREE' : formatCurrency(option.cost)}
                    </Text>
                  </View>
                </View>
                <View style={styles.revShareRow}>
                  <Text style={styles.revShareLabel}>Customer Rev Share:</Text>
                  <View style={styles.revShareValue}>
                    <Text style={styles.revShareValueText}>{option.revenueShare}%</Text>
                  </View>
                </View>
              </View>

              {option.showCheckboxes && option.warrantyUpgrades && option.warrantyUpgrades.length > 0 && (
                <>
                  <Text style={styles.warrantyUpgradeTitle}>Warranty Upgrade (MUST SELECT ONE):</Text>
                  {option.warrantyUpgrades.map((upgrade, uIndex) => (
                    <View key={uIndex} style={styles.warrantyUpgradeRow}>
                      <View style={styles.checkbox} />
                      <Text style={styles.warrantyUpgradeName}>{upgrade.name}</Text>
                      <Text style={styles.warrantyUpgradeCost}>
                        ADD {formatCurrency(upgrade.cost)} TO NET COST PER STATION
                      </Text>
                    </View>
                  ))}
                  <View style={styles.optOutRow}>
                    <View style={styles.checkbox} />
                    <Text style={styles.optOutText}>OPT OUT OF ALL ADDITIONAL WARRANTY COVERAGE</Text>
                  </View>
                </>
              )}
            </View>

            {/* Right - Initial here */}
            <View style={styles.optionRight}>
              <View style={styles.initialLine} />
              <Text style={styles.initialText}>INITIAL HERE{'\n'}TO SELECT{'\n'}THIS OPTION</Text>
            </View>
          </View>
        ))}

        {/* Footnote */}
        <Text style={styles.footnote}>{FOOTNOTES.revenueShare}</Text>

        {/* Hotel Value Section */}
        <View style={styles.hotelSection}>
          <View style={styles.hotelHeader}>
            <Text style={styles.hotelHeaderText}>{HOTEL_VALUE_PROPOSITION.title}</Text>
          </View>
          <View style={styles.hotelContent}>
            <Text style={styles.hotelIntro}>
              Hotels with EV chargers see an average of{' '}
              <Text style={styles.hotelIntroHighlight}>30+ extra bookings</Text> per month, and adding
              nearly $500K in property value
            </Text>
            {HOTEL_VALUE_PROPOSITION.points.map((point, index) => (
              <Text key={index} style={styles.hotelPoint}>
                {point}
              </Text>
            ))}
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
        <Text style={styles.footerRight}>05</Text>
      </View>
    </Page>
  );
}
