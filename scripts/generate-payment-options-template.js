/**
 * Generate Payment Options Template Excel for filling in per-project-type data.
 * Run: node scripts/generate-payment-options-template.js
 * Output: data/Payment-Options-Template.xlsx
 */
const ExcelJS = require('exceljs');
const path = require('path');

const PROJECT_TYPES = ['level2-epc', 'level3-epc', 'mixed-epc', 'site-host', 'level2-site-host', 'distribution'];
const PROJECT_TYPE_LABELS = {
  'level2-epc': 'Level 2 EPC',
  'level3-epc': 'Level 3 EPC',
  'mixed-epc': 'Mixed EPC',
  'site-host': 'Site Host',
  'level2-site-host': 'Level 2 EPC / Site Host',
  'distribution': 'Distribution',
};

const LOCATION_TYPES = ['apartments', 'commercial', 'dealership', 'hospitality', 'municipalities', 'retail'];
const LOCATION_TYPE_LABELS = {
  'apartments': 'Apartments / Multi Unit Dwelling',
  'commercial': 'Commercial / Workspace',
  'dealership': 'Dealership',
  'hospitality': 'Hospitality / Hotels',
  'municipalities': 'Municipalities / Public Destinations',
  'retail': 'Retail / Restaurant',
};

// Current default payment options (NJ Lease template)
const DEFAULT_OPTIONS = [
  {
    option: 'Option 1',
    title: 'Option 1',
    ownership: 'CUSTOMER OWNED',
    costPercentage: 100,
    revenueShare: 100,
    warrantyIncluded: '3-Year Parts ONLY',
    warrantyValue: '',
    descBold: 'Option 1 - Customer Owns and Operates Chargers. All Utility Costs, Parts, Labor, Operations, and Maintenance are Customer Responsibility.',
    descText: '',
    warrantyUpgrades: '5-Year Parts ONLY ($5,000/stn); 3-Year FULL Parts & Labor ($10,000/stn); 5-Year FULL Parts & Labor ($20,000/stn)',
  },
  {
    option: 'Option 2',
    title: 'Option 2',
    ownership: 'CUSTOMER OWNED',
    costPercentage: 50,
    revenueShare: 75,
    warrantyIncluded: '3-Year Parts ONLY',
    warrantyValue: '',
    descBold: 'Option 2 - Customer Owns Chargers. All Utility Costs are Customer Responsibility.',
    descText: 'CSEV to Manage Operation and Maintenance of Chargers with 5 Year Full Service Warranty Included.',
    warrantyUpgrades: '5-Year Parts ONLY ($5,000/stn); 3-Year FULL Parts & Labor ($10,000/stn); 5-Year FULL Parts & Labor ($20,000/stn)',
  },
  {
    option: 'Option 3',
    title: 'Option 3',
    ownership: 'LEASE AGREEMENT - CSEV OWNED',
    costPercentage: 0,
    revenueShare: 50,
    warrantyIncluded: '5-Year FULL Parts & Labor',
    warrantyValue: 20000,
    descBold: 'Option 3 - CSEV Owns and Operates Chargers for 10 Years.',
    descText: 'All Utility Costs, Parts, Labor, Operations and Maintenance is Included.',
    warrantyUpgrades: '',
  },
];

// Current default value props
const VALUE_PROPS = {
  hospitality: {
    title: 'Turn Charging into Check-Ins',
    intro: 'Hotels with EV chargers see an average of 30+ extra bookings per month, and adding nearly $500K in property value',
    points: [
      "30+ Monthly Books - at $150/room that's $4,500 in added monthly revenue",
      "Boosted RevPAR - 48% of EV drivers won't stay at a hotel without EV charging",
      "$52k Annual NOI Boost - drives long-term value at an 11% cap rate (~$475K)",
      "Every 100kWh charged generates about $600 in additional room bookings",
    ],
  },
  apartments: {
    title: 'Charge Up Your Portfolio',
    intro: 'Multi-family properties with EV chargers attract higher-quality tenants and command premium rents',
    points: [
      "Attract eco-conscious tenants willing to pay 5-10% more in monthly rent",
      "Reduce turnover - 73% of EV drivers say charging availability impacts their housing decisions",
      "Increase property value by $50-100K+ per building with installed EV infrastructure",
      "Future-proof your property as EV adoption grows to 50%+ of new car sales",
    ],
  },
  commercial: {
    title: 'Power Your Workplace Forward',
    intro: 'Workplace charging is the #2 most common charging location',
    points: [
      "Employee retention - 67% consider workplace charging a top benefit",
      "Attract new talent with forward-thinking, sustainable amenities",
      "Low cost-per-use with Level 2 charging during long workday dwell times",
      "Eligible for federal tax credits and state incentives",
    ],
  },
  dealership: {
    title: 'Sell More EVs, Service More Customers',
    intro: 'Dealerships with on-site EV charging see higher EV sales conversion',
    points: [
      "Demonstrate EV charging to buyers on-site",
      "Service department revenue from EV maintenance",
      "Attract EV owners from competing brands",
      "Meet manufacturer EV-readiness requirements",
    ],
  },
  municipalities: {
    title: 'Lead the Charge for Your Community',
    intro: 'Public EV infrastructure demonstrates environmental leadership',
    points: [
      "Demonstrate environmental leadership",
      "Attract visitors and economic activity",
      "Generate revenue from public charging fees",
      "Access federal, state, and utility incentives",
    ],
  },
  retail: {
    title: 'Drive Foot Traffic & Dwell Time',
    intro: 'Retail locations with EV charging see increased foot traffic',
    points: [
      "EV drivers spend 50% more time at locations with charging",
      "Attract the growing EV demographic",
      "Differentiate from competitors",
      "Eligible for federal tax credits and state incentives",
    ],
  },
};

const headerStyle = {
  font: { bold: true, color: { argb: 'FFFFFF' }, size: 11 },
  fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '2D2D2D' } },
  alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
  border: {
    bottom: { style: 'thin', color: { argb: '4CBC88' } },
  },
};

async function generate() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'ChargeSmart EV';
  workbook.created = new Date();

  // ─── Sheet 1: Payment Options ───
  const optionsSheet = workbook.addWorksheet('Payment Options', {
    properties: { tabColor: { argb: '4CBC88' } },
  });

  optionsSheet.columns = [
    { header: 'Project Type', key: 'projectType', width: 18 },
    { header: 'Option', key: 'option', width: 12 },
    { header: 'Title', key: 'title', width: 14 },
    { header: 'Ownership', key: 'ownership', width: 28 },
    { header: 'Cost %', key: 'costPercentage', width: 10 },
    { header: 'Rev Share %', key: 'revenueShare', width: 12 },
    { header: 'Warranty Included', key: 'warrantyIncluded', width: 24 },
    { header: 'Warranty Value ($)', key: 'warrantyValue', width: 18 },
    { header: 'Description Bold', key: 'descBold', width: 60 },
    { header: 'Description Text', key: 'descText', width: 60 },
    { header: 'Warranty Upgrades', key: 'warrantyUpgrades', width: 60 },
  ];

  // Style header row
  optionsSheet.getRow(1).eachCell(cell => {
    Object.assign(cell, headerStyle);
  });
  optionsSheet.getRow(1).height = 30;

  // Add rows: 3 options × 5 project types = 15 rows
  for (const pt of PROJECT_TYPES) {
    for (const opt of DEFAULT_OPTIONS) {
      optionsSheet.addRow({
        projectType: PROJECT_TYPE_LABELS[pt],
        ...opt,
      });
    }
  }

  // Freeze header row
  optionsSheet.views = [{ state: 'frozen', ySplit: 1 }];

  // ─── Sheet 2: Value Propositions ───
  const vpSheet = workbook.addWorksheet('Value Propositions', {
    properties: { tabColor: { argb: '4CBC88' } },
  });

  vpSheet.columns = [
    { header: 'Location Type', key: 'locationType', width: 30 },
    { header: 'Project Type', key: 'projectType', width: 18 },
    { header: 'Title', key: 'title', width: 35 },
    { header: 'Intro', key: 'intro', width: 80 },
    { header: 'Point 1', key: 'point1', width: 60 },
    { header: 'Point 2', key: 'point2', width: 60 },
    { header: 'Point 3', key: 'point3', width: 60 },
    { header: 'Point 4', key: 'point4', width: 60 },
  ];

  vpSheet.getRow(1).eachCell(cell => {
    Object.assign(cell, headerStyle);
  });
  vpSheet.getRow(1).height = 30;

  // Add rows: 6 locations × 5 project types = 30 rows
  for (const loc of LOCATION_TYPES) {
    for (const pt of PROJECT_TYPES) {
      const vp = VALUE_PROPS[loc];
      if (pt === 'distribution') {
        vpSheet.addRow({
          locationType: LOCATION_TYPE_LABELS[loc],
          projectType: PROJECT_TYPE_LABELS[pt],
          title: '(none)',
          intro: 'Distribution projects do not show value propositions',
          point1: '', point2: '', point3: '', point4: '',
        });
      } else {
        vpSheet.addRow({
          locationType: LOCATION_TYPE_LABELS[loc],
          projectType: PROJECT_TYPE_LABELS[pt],
          title: vp.title,
          intro: vp.intro,
          point1: vp.points[0] || '',
          point2: vp.points[1] || '',
          point3: vp.points[2] || '',
          point4: vp.points[3] || '',
        });
      }
    }
  }

  vpSheet.views = [{ state: 'frozen', ySplit: 1 }];

  // ─── Sheet 3: Instructions ───
  const instrSheet = workbook.addWorksheet('Instructions', {
    properties: { tabColor: { argb: 'FFD700' } },
  });

  instrSheet.getColumn(1).width = 100;
  const instructions = [
    'Payment Options Template — Instructions',
    '',
    'SHEET 1: Payment Options',
    '  - 18 rows: 3 payment options × 6 project types',
    '  - Edit Cost %, Rev Share %, Warranty, Descriptions per project type',
    '  - Currently all project types use the same NJ Lease template defaults',
    '  - Fill in real values per project type as they become available',
    '',
    'SHEET 2: Value Propositions',
    '  - 36 rows: 6 location types × 6 project types',
    '  - Each row = the value proposition shown on PDF Page 5',
    '  - Distribution projects show no value prop (set Title to "(none)")',
    '  - Customize intro text and up to 4 bullet points per combination',
    '',
    'COLUMNS:',
    '  Cost % — Percentage of Net Project Cost the customer pays (100 = full, 0 = free)',
    '  Rev Share % — Customer revenue share percentage',
    '  Warranty Included — Warranty included with this option',
    '  Warranty Value ($) — Dollar value of included warranty (if applicable)',
    '  Description Bold — Bold text shown in the option box on the PDF',
    '  Description Text — Regular text shown below the bold text',
    '  Warranty Upgrades — Semicolon-separated list of upgrade options',
    '',
    'After filling in this template, the data can be imported into the app',
    'to replace the placeholder defaults in lib/constants.ts.',
  ];

  instructions.forEach((line, i) => {
    const row = instrSheet.addRow([line]);
    if (i === 0) {
      row.font = { bold: true, size: 14, color: { argb: '4CBC88' } };
    } else if (line.startsWith('SHEET') || line.startsWith('COLUMNS')) {
      row.font = { bold: true, size: 11 };
    }
  });

  // Write file
  const outputPath = path.join(__dirname, '..', 'data', 'Payment-Options-Template.xlsx');
  await workbook.xlsx.writeFile(outputPath);
  console.log(`Written to ${outputPath}`);
}

generate().catch(err => {
  console.error('Error generating template:', err);
  process.exit(1);
});
