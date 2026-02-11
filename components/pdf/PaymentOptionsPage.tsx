import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { Proposal } from '@/lib/types';
import { formatCurrency, calculateNetProjectCost } from '@/lib/calculations';
import { getPaymentOptions, getLocationValueProp, FOOTNOTES } from '@/lib/constants';
import { PdfTheme } from './pdfTheme';
import { colors } from './styles';
import { PageWrapper } from './PageWrapper';

const styles = StyleSheet.create({
  // Title
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },

  titleAccent: {
    color: colors.primary,
  },

  introText: {
    fontSize: 8,
    color: colors.textMuted,
    lineHeight: 1.4,
    marginBottom: 12,
  },

  // Purchase Options header
  purchaseOptionsHeader: {
    backgroundColor: colors.headerBg,
    paddingVertical: 6,
    paddingHorizontal: 15,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  purchaseOptionsHeaderText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  // Option box
  optionBox: {
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
    flexDirection: 'row',
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: colors.panelBg,
  },

  // Option left section
  optionLeft: {
    width: 90,
    padding: 8,
    backgroundColor: colors.headerBg,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },

  optionNumber: {
    backgroundColor: colors.primary,
    paddingVertical: 3,
    paddingHorizontal: 6,
    marginBottom: 6,
    borderRadius: 3,
  },

  optionNumberText: {
    color: colors.pageBg,
    fontSize: 9,
    fontWeight: 'bold',
  },

  warrantyIncluded: {
    fontSize: 7,
    color: colors.textMuted,
    marginBottom: 2,
  },

  warrantyText: {
    fontSize: 8,
    color: colors.text,
    fontWeight: 'bold',
  },

  warrantyValue: {
    fontSize: 7,
    color: colors.primary,
    fontStyle: 'italic',
    marginTop: 4,
  },

  // Option middle section
  optionMiddle: {
    flex: 1,
    padding: 8,
  },

  costRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    justifyContent: 'space-between',
  },

  costLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 8,
  },

  costValue: {
    backgroundColor: colors.primary,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 4,
  },

  costValueText: {
    color: colors.pageBg,
    fontSize: 10,
    fontWeight: 'bold',
  },

  revShareRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  revShareLabel: {
    fontSize: 8,
    color: colors.textLight,
    marginRight: 6,
  },

  revShareValue: {
    backgroundColor: colors.headerBg,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.primary,
  },

  revShareValueText: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: 'bold',
  },

  warrantyUpgradeTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },

  warrantyUpgradeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },

  checkbox: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: colors.textMuted,
    marginRight: 6,
    borderRadius: 2,
  },

  warrantyUpgradeName: {
    fontSize: 7,
    color: colors.textLight,
    flex: 1,
  },

  warrantyUpgradeCost: {
    fontSize: 6,
    color: colors.primary,
    fontStyle: 'italic',
  },

  optOutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },

  optOutText: {
    fontSize: 7,
    color: colors.textMuted,
  },

  // Option right section (initial here)
  optionRight: {
    width: 70,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    backgroundColor: colors.headerBg,
  },

  initialLine: {
    borderBottomWidth: 1,
    borderBottomColor: colors.textMuted,
    width: 50,
    marginBottom: 4,
  },

  initialText: {
    fontSize: 6,
    color: colors.textMuted,
    textAlign: 'center',
  },

  // Footnote
  footnote: {
    fontSize: 6,
    color: colors.textMuted,
    lineHeight: 1.4,
    marginTop: 6,
    marginBottom: 10,
  },

  // Value proposition section
  valuePropSection: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: colors.panelBg,
  },

  valuePropHeader: {
    backgroundColor: colors.headerBg,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  valuePropHeaderText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  valuePropContent: {
    padding: 10,
  },

  valuePropIntro: {
    fontSize: 8,
    color: colors.textLight,
    marginBottom: 6,
  },

  valuePropIntroHighlight: {
    fontWeight: 'bold',
    color: colors.primary,
  },

  valuePropPoint: {
    fontSize: 7,
    color: colors.textLight,
    marginBottom: 3,
    lineHeight: 1.4,
  },
});

interface PaymentOptionsPageProps {
  proposal: Proposal;
  theme?: PdfTheme;
}

export function PaymentOptionsPage({ proposal }: PaymentOptionsPageProps) {
  const netCost = calculateNetProjectCost(proposal);
  const paymentConfig = getPaymentOptions(proposal.projectType);

  // Calculate costs for each option
  const options = [
    {
      ...paymentConfig.option1,
      cost: netCost,
      showCheckboxes: true,
    },
    {
      ...paymentConfig.option2,
      cost: netCost * 0.5,
      showCheckboxes: true,
    },
    {
      ...paymentConfig.option3,
      cost: 0,
      showCheckboxes: false,
    },
  ];

  // Get location-specific value proposition (may be null)
  const valueProp = getLocationValueProp(proposal.locationType, proposal.projectType);

  return (
    <PageWrapper pageNumber={5} showDisclaimer={true}>
      {/* Title */}
      <Text style={styles.title}>
        <Text style={styles.titleAccent}>Payment Options</Text>
      </Text>

      <Text style={styles.introText}>
        Below you will see three payment options for you to choose from. Please take a look at the
        differing net amounts and how each impacts the Revenue Share amounts. The processing fees
        listed previously will come out of every transaction and cannot be removed or changed in any way.
      </Text>

      {/* Purchase Options Header */}
      <View style={styles.purchaseOptionsHeader} wrap={false}>
        <Text style={styles.purchaseOptionsHeaderText}>Purchase Options</Text>
      </View>

      {/* Option Boxes */}
      {options.map((option, index) => (
        <View key={index} style={styles.optionBox} wrap={false}>
          {/* Left - Option number and warranty */}
          <View style={styles.optionLeft}>
            <View style={styles.optionNumber}>
              <Text style={styles.optionNumberText}>{option.title}</Text>
            </View>
            <Text style={styles.warrantyIncluded}>Warranty Included:</Text>
            <Text style={styles.warrantyText}>{option.warrantyIncluded}</Text>
            {'warrantyValue' in option && option.warrantyValue && (
              <Text style={styles.warrantyValue}>
                A {formatCurrency(option.warrantyValue)} VALUE{'\n'}PER STATION
              </Text>
            )}
          </View>

          {/* Middle - Cost and warranty upgrades */}
          <View style={styles.optionMiddle}>
            <View style={styles.costRow}>
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

      {/* Conditional Value Proposition Section */}
      {valueProp && (
        <View style={styles.valuePropSection} wrap={false}>
          <View style={styles.valuePropHeader}>
            <Text style={styles.valuePropHeaderText}>{valueProp.title}</Text>
          </View>
          <View style={styles.valuePropContent}>
            <Text style={styles.valuePropIntro}>{valueProp.intro}</Text>
            {valueProp.points.map((point, index) => (
              <Text key={index} style={styles.valuePropPoint}>
                • {point}
              </Text>
            ))}
          </View>
        </View>
      )}
    </PageWrapper>
  );
}
