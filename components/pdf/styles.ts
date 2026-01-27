import { StyleSheet } from '@react-pdf/renderer';

// ChargeSmart Dark Theme Colors
export const colors = {
  // Primary accent colors
  primary: '#4ade80', // ChargeSmart green
  primaryDark: '#22c55e', // Darker green
  headerGreen: '#4ade80', // Header bar green
  accentGreen: '#4ade80', // Green accent bar (replaces yellow)

  // Dark backgrounds
  slate900: '#0f172a', // Darkest background
  slate800: '#1e293b', // Card/panel background
  slate700: '#334155', // Lighter panels
  panel: '#1a202c', // Card panels

  // Text colors
  text: '#f8fafc', // Primary text (light)
  textLight: '#e2e8f0', // Secondary text
  textMuted: '#94a3b8', // Muted text
  textDark: '#1e293b', // Dark text for light backgrounds

  // Borders
  border: '#334155',
  borderLight: '#475569',

  // Legacy support
  background: '#0f172a',
  backgroundLight: '#1e293b',
  white: '#FFFFFF',
  darkBox: '#1e293b',
  footerBg: '#1e293b', // Dark footer
};

// Common styles used across pages
export const commonStyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    backgroundColor: colors.slate900,
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
    backgroundColor: colors.slate700,
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
    backgroundColor: colors.accentGreen,
  },

  // Table styles
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.slate700,
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
    backgroundColor: colors.slate800,
  },

  tableRowAlt: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.panel,
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
    backgroundColor: colors.slate800,
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
    backgroundColor: colors.slate800,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
  },

  // Card with green accent
  cardAccent: {
    backgroundColor: colors.slate800,
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
