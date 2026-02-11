export type PdfTheme = 'light' | 'dark';

export interface PdfColorPalette {
  // Primary accent
  primary: string;
  primaryDark: string;

  // Backgrounds
  pageBg: string;
  panelBg: string;
  headerBg: string;
  elevatedBg: string;

  // Text
  text: string;
  textLight: string;
  textMuted: string;
  textOnPrimary: string;

  // Borders
  border: string;
  borderLight: string;

  // High contrast text (white on dark, black on light) — used for titles, bold rows
  white: string;
}

const darkPalette: PdfColorPalette = {
  primary: '#4CBC88',
  primaryDark: '#3da876',

  pageBg: '#1a1a1a',
  panelBg: '#242424',
  headerBg: '#2e2e2e',
  elevatedBg: '#333333',

  text: '#e8e8e8',
  textLight: '#c0c0c0',
  textMuted: '#888888',
  textOnPrimary: '#1a1a1a',

  border: '#3a3a3a',
  borderLight: '#505050',

  white: '#FFFFFF',
};

const lightPalette: PdfColorPalette = {
  primary: '#4CBC88',
  primaryDark: '#3da876',

  pageBg: '#FFFFFF',
  panelBg: '#F6F8FA',
  headerBg: '#F0F2F5',
  elevatedBg: '#E8ECF0',

  text: '#1F2328',
  textLight: '#424A53',
  textMuted: '#6E7781',
  textOnPrimary: '#FFFFFF',

  border: '#D0D7DE',
  borderLight: '#E0E6EB',

  white: '#1F2328',
};

export function getPdfColors(theme: PdfTheme = 'dark'): PdfColorPalette {
  return theme === 'dark' ? darkPalette : lightPalette;
}
