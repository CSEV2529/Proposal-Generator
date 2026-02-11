import React, { ReactNode } from 'react';
import { Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { PdfTheme } from './pdfTheme';
import { colors, DISCLAIMER_TEXT } from './styles';
import { NODES_IMAGE_BASE64 } from './nodesImage';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    backgroundColor: colors.pageBg,
    position: 'relative',
  },

  // Background nodes image overlay
  backgroundNodes: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    opacity: 0.075,
  },

  backgroundNodesImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  // Content area with padding to avoid footer overlap
  content: {
    padding: 40,
    paddingBottom: 90,
    position: 'relative',
    zIndex: 1,
  },

  contentWithDisclaimer: {
    padding: 40,
    paddingBottom: 130,
    position: 'relative',
    zIndex: 1,
  },

  // Disclaimer footer bar
  disclaimerFooter: {
    position: 'absolute',
    bottom: 45,
    left: 0,
    right: 0,
    backgroundColor: colors.panelBg,
    paddingVertical: 8,
    paddingHorizontal: 40,
    borderTopWidth: 1,
    borderTopColor: colors.primary,
  },

  disclaimerText: {
    fontSize: 7,
    color: colors.textMuted,
    lineHeight: 1.4,
  },

  // Page number footer
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 6,
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

interface PageWrapperProps {
  pageNumber: number;
  showDisclaimer?: boolean;
  showBackground?: boolean;
  children: ReactNode;
  theme?: PdfTheme;
}

export function PageWrapper({
  pageNumber,
  showDisclaimer = false,
  showBackground = true,
  children,
}: PageWrapperProps) {
  const pageNum = String(pageNumber).padStart(2, '0');

  return (
    <Page size="LETTER" style={styles.page}>
      {/* Background nodes image at 30% opacity */}
      {showBackground && (
        <View style={styles.backgroundNodes}>
          <Image src={NODES_IMAGE_BASE64} style={styles.backgroundNodesImage} />
        </View>
      )}

      {/* Main content */}
      <View style={showDisclaimer ? styles.contentWithDisclaimer : styles.content}>
        {children}
      </View>

      {/* Disclaimer bar (pages 3-6) */}
      {showDisclaimer && (
        <View style={styles.disclaimerFooter}>
          <Text style={styles.disclaimerText}>{DISCLAIMER_TEXT}</Text>
        </View>
      )}

      {/* Page number footer */}
      <View style={styles.footer}>
        <Text style={styles.footerLeft}>ChargeSmart EV Proposal</Text>
        <Text style={styles.footerRight}>{pageNum}</Text>
      </View>
    </Page>
  );
}
