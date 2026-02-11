const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const PDF_DIR = path.join(__dirname, '..', 'components', 'pdf');

// Image definitions: source file → output ts file, export name, max dimensions
const images = [
  // Page 1 Hero Images (landscape ~16:10, 1600x1000 target)
  {
    src: 'level2-epc_Page_1_Hero_Image.jpg',
    out: 'heroLevel2.ts',
    exportName: 'HERO_LEVEL2_BASE64',
    maxWidth: 1600,
    maxHeight: 1000,
  },
  {
    src: 'mixed-epc_Page_1_Hero_Image.jpg',
    out: 'heroMixed.ts',
    exportName: 'HERO_MIXED_BASE64',
    maxWidth: 1600,
    maxHeight: 1000,
  },
  {
    src: 'site-host_Page_1_Hero_Image.jpg',
    out: 'heroSiteHost.ts',
    exportName: 'HERO_SITE_HOST_BASE64',
    maxWidth: 1600,
    maxHeight: 1000,
  },
  {
    src: 'distribution_Page_1_Hero_Image.jpg',
    out: 'heroDistribution.ts',
    exportName: 'HERO_DISTRIBUTION_BASE64',
    maxWidth: 1600,
    maxHeight: 1000,
  },
  {
    src: 'level3-epc_Page_1_Hero_Image.JPG',
    out: 'heroLevel3.ts',
    exportName: 'HERO_LEVEL3_BASE64',
    maxWidth: 1600,
    maxHeight: 1000,
  },

  // Page 2 Installation Images (portrait ~3:4, 600x800 target)
  {
    src: 'level2-epc_Page_2_Installation_Image.jpg',
    out: 'installationImageL2.ts',
    exportName: 'INSTALLATION_IMAGE_L2_BASE64',
    maxWidth: 600,
    maxHeight: 800,
  },
  {
    src: 'mixed-epc_Page_2_Installation_Image.jpg',
    out: 'installationImageMixed.ts',
    exportName: 'INSTALLATION_IMAGE_MIXED_BASE64',
    maxWidth: 600,
    maxHeight: 800,
  },
  {
    src: 'site-host_Page_2_Installation_Image.jpg',
    out: 'installationImageSiteHost.ts',
    exportName: 'INSTALLATION_IMAGE_SITE_HOST_BASE64',
    maxWidth: 600,
    maxHeight: 800,
  },
  {
    src: 'distribution_Page_2_Installation_Image.jpg',
    out: 'installationImageDistribution.ts',
    exportName: 'INSTALLATION_IMAGE_DISTRIBUTION_BASE64',
    maxWidth: 600,
    maxHeight: 800,
  },
  {
    src: 'level3-epc_Page_2_Installation_Image.JPG',
    out: 'installationImageL3.ts',
    exportName: 'INSTALLATION_IMAGE_L3_BASE64',
    maxWidth: 600,
    maxHeight: 800,
  },

  // Page 2 Station Images (tall portrait ~1:2, 500x1000 target)
  {
    src: 'level2-epc_Page_2_Station_Image.png',
    out: 'stationImageL2.ts',
    exportName: 'STATION_IMAGE_L2_BASE64',
    maxWidth: 500,
    maxHeight: 1000,
  },
  {
    src: 'Level_3_Page_2_Station_Image.png',
    out: 'stationImageL3.ts',
    exportName: 'STATION_IMAGE_L3_BASE64',
    maxWidth: 500,
    maxHeight: 1000,
  },
  {
    src: 'mixed-epc_Page_2_Station_Image.png',
    out: 'stationImageMixed.ts',
    exportName: 'STATION_IMAGE_MIXED_BASE64',
    maxWidth: 500,
    maxHeight: 1000,
  },
  {
    src: 'distribution_Page_2_Station_Image.png',
    out: 'stationImageDistribution.ts',
    exportName: 'STATION_IMAGE_DISTRIBUTION_BASE64',
    maxWidth: 500,
    maxHeight: 1000,
  },
  {
    src: 'site-host_Page_2_Station_Image.png',
    out: 'stationImageSiteHost.ts',
    exportName: 'STATION_IMAGE_SITE_HOST_BASE64',
    maxWidth: 500,
    maxHeight: 1000,
  },
];

async function convertImage(img) {
  const srcPath = path.join(PUBLIC_DIR, img.src);
  if (!fs.existsSync(srcPath)) {
    console.log(`SKIP: ${img.src} not found`);
    return;
  }

  const ext = path.extname(img.src).toLowerCase();
  const isPng = ext === '.png';
  const mimeType = isPng ? 'image/png' : 'image/jpeg';

  let pipeline = sharp(srcPath).resize(img.maxWidth, img.maxHeight, {
    fit: 'inside',
    withoutEnlargement: true,
  });

  let buffer;
  if (isPng) {
    buffer = await pipeline.png({ quality: 80 }).toBuffer();
  } else {
    buffer = await pipeline.jpeg({ quality: 80 }).toBuffer();
  }

  const base64 = buffer.toString('base64');
  const dataUrl = `data:${mimeType};base64,${base64}`;

  const tsContent = `export const ${img.exportName} = '${dataUrl}';\n`;
  const outPath = path.join(PDF_DIR, img.out);
  fs.writeFileSync(outPath, tsContent);

  const sizeKB = (tsContent.length / 1024).toFixed(1);
  console.log(`OK: ${img.src} → ${img.out} (${sizeKB} KB)`);
}

async function main() {
  for (const img of images) {
    await convertImage(img);
  }
  console.log('\nDone!');
}

main().catch(console.error);
