import { Font } from '@react-pdf/renderer';
import {
  FONT_ORBITRON_400,
  FONT_ORBITRON_700,
  FONT_ORBITRON_900,
  FONT_ROBOTO_300,
  FONT_ROBOTO_400,
  FONT_ROBOTO_500,
  FONT_ROBOTO_700,
} from './fontData';

// Register Orbitron (display/title font) and Roboto (body font)
// Using locally embedded base64 font data for reliable PDF generation

Font.register({
  family: 'Orbitron',
  fonts: [
    { src: FONT_ORBITRON_400, fontWeight: 400 },
    { src: FONT_ORBITRON_700, fontWeight: 700 },
    { src: FONT_ORBITRON_900, fontWeight: 900 },
  ],
});

Font.register({
  family: 'Roboto',
  fonts: [
    { src: FONT_ROBOTO_300, fontWeight: 300 },
    { src: FONT_ROBOTO_400, fontWeight: 400 },
    { src: FONT_ROBOTO_500, fontWeight: 500 },
    { src: FONT_ROBOTO_700, fontWeight: 700 },
  ],
});

// Disable hyphenation globally — words wrap whole, never split mid-word
Font.registerHyphenationCallback((word: string) => [word]);
