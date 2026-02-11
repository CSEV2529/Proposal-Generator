import { StyleSheet } from '@react-pdf/renderer';
import { PdfTheme, getPdfColors } from './pdfTheme';

// Default theme colors (dark) for backward compatibility
export const colors = getPdfColors('dark');

// Theme-aware color getter
export function getColors(theme: PdfTheme = 'dark') {
  return getPdfColors(theme);
}

// Common styles used across pages
export const commonStyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    backgroundColor: colors.pageBg,
    position: 'relative',
  },

  // Page title in stylized format
  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
    fontFamily: 'Helvetica',
  },

  // Green section header bar
  sectionHeader: {
    backgroundColor: colors.headerBg,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginBottom: 0,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },

  sectionHeaderText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  // Green accent bar on left
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.primary,
  },

  // Table styles
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.headerBg,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },

  tableHeaderCell: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: 'bold',
  },

  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.panelBg,
  },

  tableRowAlt: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.elevatedBg,
  },

  tableCell: {
    fontSize: 10,
    color: colors.text,
  },

  // Footer disclaimer
  footerDisclaimer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    backgroundColor: colors.panelBg,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderTopWidth: 1,
    borderTopColor: colors.primary,
  },

  footerDisclaimerText: {
    fontSize: 7,
    color: colors.textMuted,
    lineHeight: 1.4,
  },

  // Page number footer
  pageFooter: {
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

  pageFooterLeft: {
    fontSize: 9,
    color: colors.textMuted,
  },

  pageFooterRight: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },

  // Signature lines
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: colors.textMuted,
    marginBottom: 5,
    height: 25,
  },

  signatureLabel: {
    fontSize: 9,
    color: colors.textLight,
    marginBottom: 12,
  },

  // Dark theme card panel
  card: {
    backgroundColor: colors.panelBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
  },

  // Card with green accent
  cardAccent: {
    backgroundColor: colors.panelBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    padding: 16,
    marginBottom: 12,
  },
});

// Shared text to be reused
export const DISCLAIMER_TEXT =
  "Customer understands they are responsible for all usage, electricity and demand charges that their utility provider may charge " +
  "them, and that utility bill(s) will remain in their name, paid by the Customer. Term for Network Agreement is a minimum of 5 Years, " +
  "and will be outlined in a full Network Agreement that must be signed before proceeding with project.";

export const SOW_DISCLAIMER_TEXT =
  "Proposed Scope of Work (SOW) is an initial estimate based solely on satellite imagery and/or in-person site visit. " +
  "No guarantees are made about power availability or final SOW/quantities based on this quote.";
