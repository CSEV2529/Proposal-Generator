import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { Proposal } from '@/lib/types';
import { formatCurrency, formatCurrencyWithCents, calculateNetProjectCost, calculatePaymentOptionCostWithOverride, getEffectivePaymentOptionEnabled, calculateWarrantyTotals } from '@/lib/calculations';
import { getPaymentOptions, getValuePropForContext, FOOTNOTES, WarrantyTier } from '@/lib/constants';
import { getPdfColors, PdfColorPalette, PdfTheme } from './pdfTheme';
import { PageWrapper } from './PageWrapper';

function getStyles(colors: PdfColorPalette) {
  return StyleSheet.create({
    // Title — Orbitron 28px, matches pages 2-6
    title: {
      fontFamily: 'Orbitron',
      fontSize: 28,
      fontWeight: 700,
      color: colors.white,
      marginBottom: 8,
    },

    introText: {
      fontFamily: 'Roboto',
      fontSize: 8,
      color: colors.textMuted,
      lineHeight: 1.4,
      marginBottom: 10,
    },

    // Purchase Options header bar
    purchaseOptionsHeader: {
      flexDirection: 'row',
      backgroundColor: colors.headerBg,
      paddingVertical: 5,
      paddingHorizontal: 15,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
      borderRadius: 6,
      marginBottom: 6,
    },

    purchaseOptionsHeaderText: {
      fontFamily: 'Roboto',
      color: colors.primary,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 0.5,
    },

    // ── Option Box ──
    optionBox: {
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: 5,
      backgroundColor: colors.panelBg,
    },

    // Left panel — option name, ownership, warranty
    optionLeft: {
      width: 95,
      paddingVertical: 5,
      paddingHorizontal: 8,
      backgroundColor: colors.headerBg,
      borderRightWidth: 1,
      borderRightColor: colors.border,
      borderTopLeftRadius: 3,
      borderBottomLeftRadius: 3,
    },

    optionTitle: {
      fontFamily: 'Roboto',
      fontSize: 10,
      fontWeight: 700,
      color: colors.white,
      marginBottom: 2,
    },

    ownershipBadge: {
      backgroundColor: '#555555',
      borderRadius: 3,
      borderWidth: 2,
      borderColor: '#6a6a6a',
      paddingVertical: 2,
      paddingHorizontal: 4,
      marginTop: 4,
      marginBottom: 6,
      alignItems: 'center',
    },

    optionOwnership: {
      fontFamily: 'Roboto',
      fontSize: 8,
      fontWeight: 700,
      color: '#FFFFFF',
      textAlign: 'center',
    },

    warrantyLabel: {
      fontFamily: 'Roboto',
      fontSize: 7,
      color: colors.textMuted,
      marginBottom: 2,
    },

    warrantyCheckRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 3,
    },

    checkboxFilled: {
      width: 7,
      height: 7,
      minWidth: 7,
      minHeight: 7,
      backgroundColor: colors.primary,
      marginRight: 3,
      marginTop: 1,
      borderRadius: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    checkmark: {
      fontFamily: 'Roboto',
      fontSize: 5.5,
      color: colors.pageBg,
      fontWeight: 700,
    },

    warrantyText: {
      fontFamily: 'Roboto',
      fontSize: 6.5,
      color: colors.text,
      fontWeight: 500,
      flex: 1,
    },

    // Middle section — cost, rev share, warranty upgrades or description
    optionMiddle: {
      flex: 1,
      paddingVertical: 5,
      paddingHorizontal: 8,
    },

    costRevRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 6,
    },

    costGroup: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    costLabel: {
      fontFamily: 'Roboto',
      fontSize: 9,
      fontWeight: 700,
      color: colors.text,
      marginRight: 6,
    },

    costBadge: {
      backgroundColor: colors.panelBg,
      borderWidth: 2,
      borderColor: colors.white,
      paddingVertical: 3,
      paddingHorizontal: 10,
      borderRadius: 3,
      width: 90,
      alignItems: 'center',
    },

    costBadgeText: {
      fontFamily: 'Roboto',
      fontSize: 9,
      fontWeight: 700,
      color: colors.white,
    },

    revShareGroup: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    revShareLabel: {
      fontFamily: 'Roboto',
      fontSize: 8,
      color: colors.textLight,
      marginRight: 6,
    },

    revShareBadge: {
      backgroundColor: colors.primary,
      paddingVertical: 3,
      borderRadius: 3,
      borderWidth: 2,
      borderColor: colors.primaryDark,
      width: 48,
      alignItems: 'center',
    },

    revShareBadgeText: {
      fontFamily: 'Roboto',
      fontSize: 10,
      fontWeight: 700,
      color: '#FFFFFF',
    },

    // Warranty upgrade checkboxes (Option 1 & 2)
    warrantyUpgradeTitle: {
      fontFamily: 'Roboto',
      fontSize: 8,
      fontWeight: 700,
      color: colors.primary,
      marginBottom: 4,
    },

    warrantyUpgradeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 3,
    },

    checkbox: {
      width: 9,
      height: 9,
      borderWidth: 1,
      borderColor: colors.textMuted,
      marginRight: 5,
      borderRadius: 2,
    },

    upgradeName: {
      fontFamily: 'Roboto',
      fontSize: 7,
      color: colors.textLight,
    },

    upgradeCostInline: {
      fontFamily: 'Roboto',
      fontSize: 7,
      color: colors.textLight,
      fontWeight: 700,
    },

    // Description text for Options 2 & 3
    optionDescBold: {
      fontFamily: 'Roboto',
      fontSize: 7.5,
      fontWeight: 700,
      color: colors.primary,
      marginBottom: 4,
      lineHeight: 1.4,
    },

    optionDescText: {
      fontFamily: 'Roboto',
      fontSize: 7.5,
      color: colors.textLight,
      fontWeight: 500,
      lineHeight: 1.4,
    },

    // Right panel — initial here (bottom-aligned)
    optionRight: {
      width: 65,
      padding: 6,
      justifyContent: 'flex-end',
      alignItems: 'center',
      borderLeftWidth: 1,
      borderLeftColor: colors.primaryDark,
      backgroundColor: colors.primary,
      paddingBottom: 8,
      borderTopRightRadius: 3,
      borderBottomRightRadius: 3,
    },

    initialLine: {
      borderBottomWidth: 1,
      borderBottomColor: '#ffffff',
      width: 50,
      marginBottom: 4,
    },

    initialText: {
      fontFamily: 'Roboto',
      fontSize: 6,
      color: '#ffffff',
      textAlign: 'center',
      fontWeight: 700,
      letterSpacing: 0.3,
    },

    // Footnote
    footnote: {
      fontFamily: 'Roboto',
      fontSize: 6,
      color: colors.textMuted,
      lineHeight: 1.4,
      marginTop: 4,
      marginBottom: 8,
    },

    // Value proposition section
    valuePropHeader: {
      flexDirection: 'row',
      backgroundColor: colors.headerBg,
      paddingVertical: 5,
      paddingHorizontal: 15,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
      borderRadius: 6,
    },

    valuePropHeaderText: {
      fontFamily: 'Roboto',
      color: colors.primary,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 0.5,
    },

    valuePropContent: {
      paddingHorizontal: 15,
      paddingTop: 4,
    },

    valuePropPoint: {
      fontFamily: 'Roboto',
      fontSize: 8,
      color: colors.textLight,
      paddingVertical: 3,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      lineHeight: 1.4,
    },

    valuePropPointLast: {
      fontFamily: 'Roboto',
      fontSize: 8,
      color: colors.textLight,
      paddingVertical: 3,
      borderBottomWidth: 0,
      lineHeight: 1.4,
    },
  });
}

interface PaymentOptionsPageProps {
  proposal: Proposal;
  theme?: PdfTheme;
}

export function PaymentOptionsPage({ proposal, theme }: PaymentOptionsPageProps) {
  const colors = getPdfColors(theme);
  const styles = getStyles(colors);
  const netCost = calculateNetProjectCost(proposal);
  const configEntries = getPaymentOptions(proposal.projectType);
  const warrantyTotals = calculateWarrantyTotals(proposal.evseItems);

  // Overrides from proposal (may be undefined)
  const costOverrides = proposal.paymentOptionCostOverrides || [];
  const costPercentOverrides = proposal.paymentOptionCostPercentOverrides || [];
  const revShareOverrides = proposal.paymentOptionRevShareOverrides || [];

  // Filter to only enabled options
  const enabledFlags = getEffectivePaymentOptionEnabled(proposal);
  const options = configEntries
    .map((cfg, i) => {
      const effectiveCostPercent = costPercentOverrides[i] ?? cfg.costPercentage;
      const effectiveRevShare = revShareOverrides[i] ?? cfg.revenueShare;
      return {
        ...cfg,
        costPercentage: effectiveCostPercent,
        revenueShare: effectiveRevShare,
        cost: calculatePaymentOptionCostWithOverride(netCost, effectiveCostPercent, costOverrides[i]),
        showCheckboxes: cfg.warrantyUpgrades.length > 0,
        enabled: enabledFlags[i] ?? true,
      };
    })
    .filter(opt => opt.enabled);

  const optionCountText = options.length === 1 ? 'one payment option' : options.length === 2 ? 'two payment options' : 'three payment options';

  // Get location × project type value proposition (may be null)
  const valueProp = getValuePropForContext(proposal.locationType, proposal.projectType);

  return (
    <PageWrapper pageNumber={5} showDisclaimer={true} disclaimerBorder={false} theme={theme}>
      {/* Title */}
      <Text style={styles.title}>Payment Options</Text>

      <Text style={styles.introText}>
        Below you will see {optionCountText} for you to choose from. Please take a look at the
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
          {/* Left — Option name, ownership, warranty */}
          <View style={styles.optionLeft}>
            <Text style={styles.optionTitle}>{option.title}</Text>
            <View style={styles.ownershipBadge}>
              <Text style={styles.optionOwnership}>{option.ownership}</Text>
            </View>

            <Text style={styles.warrantyLabel}>Warranty Included:</Text>
            {option.warrantyIncluded.split(';').map((part, wi) => (
              <View key={wi} style={styles.warrantyCheckRow}>
                <View style={styles.checkboxFilled}>
                  <Text style={styles.checkmark}>{'✓'}</Text>
                </View>
                <Text style={styles.warrantyText}>{part.trim()}</Text>
              </View>
            ))}
          </View>

          {/* Middle — Cost, Rev Share, upgrades/description */}
          <View style={styles.optionMiddle}>
            {/* Cost + Rev Share row */}
            <View style={styles.costRevRow}>
              <View style={styles.costGroup}>
                <Text style={styles.costLabel}>FINAL NET Cost:</Text>
                <View style={styles.costBadge}>
                  <Text style={styles.costBadgeText}>
                    {option.costPercentage === 0 ? 'FREE' : formatCurrencyWithCents(option.cost)}
                  </Text>
                </View>
              </View>
              <View style={styles.revShareGroup}>
                <Text style={styles.revShareLabel}>Customer Rev Share:</Text>
                <View style={styles.revShareBadge}>
                  <Text style={styles.revShareBadgeText}>{option.revenueShare}%</Text>
                </View>
              </View>
            </View>

            {/* Warranty Upgrades */}
            {option.showCheckboxes && option.warrantyUpgrades && option.warrantyUpgrades.length > 0 && (
              <>
                <Text style={styles.warrantyUpgradeTitle}>Warranty Upgrade (MUST SELECT ONE):</Text>
                {option.warrantyUpgrades.map((upgrade, uIndex) => {
                  const tierCost = upgrade.tier ? warrantyTotals[upgrade.tier as WarrantyTier] : 0;
                  return (
                    <View key={uIndex} style={styles.warrantyUpgradeRow}>
                      <View style={styles.checkbox} />
                      <Text style={styles.upgradeName}>
                        {upgrade.name}  <Text style={styles.upgradeCostInline}>— Add {formatCurrency(tierCost)} to FINAL NET Cost</Text>
                      </Text>
                    </View>
                  );
                })}
                <View style={styles.warrantyUpgradeRow}>
                  <View style={styles.checkbox} />
                  <Text style={styles.upgradeName}>OPT OUT OF ALL ADDITIONAL WARRANTY COVERAGE</Text>
                </View>
              </>
            )}

            {/* Description text */}
            <Text style={styles.optionDescBold}>{option.descriptionBold}</Text>
            {option.descriptionText ? (
              <Text style={styles.optionDescBold}>{option.descriptionText}</Text>
            ) : null}
          </View>

          {/* Right — Initial here */}
          <View style={styles.optionRight}>
            <View style={styles.initialLine} />
            <Text style={styles.initialText}>INITIAL HERE{'\n'}TO SELECT{'\n'}THIS OPTION</Text>
          </View>
        </View>
      ))}

      {/* Footnote */}
      <Text style={styles.footnote}>{FOOTNOTES.revenueShare}</Text>

      {/* Spacer pushes value prop to bottom of page */}
      <View style={{ flexGrow: 1 }} />

      {/* Value Proposition Section — anchored to bottom, fixed height: header + 4 lines */}
      <View style={{ height: 88, marginBottom: 8 }}>
        <View style={styles.valuePropHeader}>
          <Text style={styles.valuePropHeaderText}>{valueProp?.title || 'Industry Value Proposition'}</Text>
        </View>
        <View style={styles.valuePropContent}>
          {[0, 1, 2, 3].map((index) => (
            <Text key={index} style={index === 3 ? styles.valuePropPointLast : styles.valuePropPoint}>
              {valueProp?.points?.[index] || ' '}
            </Text>
          ))}
        </View>
      </View>
    </PageWrapper>
  );
}
