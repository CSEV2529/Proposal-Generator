export const COMPANY_INFO = {
  name: 'ChargeSmart EV',
  legalName: 'ChargeSmart EV LLC',
  tagline: 'Power That Moves You',
  website: 'www.chargesmartev.com',
  phone: '+1 (585) 943-9980',
  email: 'sal@chargesmartev.com',
  address: '5 Southside Dr, Suite 11-184',
  city: 'Clifton Park',
  state: 'NY',
  zip: '12065',
  fullAddress: '5 Southside Dr, Suite 11-184, Clifton Park, NY 12065',
};

export const LABOR_RATE_PER_HOUR = 125;

export const WHY_CSEV_CONTENT = {
  subtitle: 'The leading provider of EV solutions for...',

  targetMarkets: [
    { name: 'Multi-family/Apartments', col: 1, row: 1 },
    { name: 'Hotels/Hospitality', col: 2, row: 1 },
    { name: 'Retail/Shopping Plazas', col: 3, row: 1 },
    { name: 'Workplaces', col: 1, row: 2 },
    { name: 'Auto Dealerships', col: 2, row: 2 },
    { name: 'Municipalities', col: 3, row: 2 },
  ],

  whatWeOffer: [
    'Turnkey charging solutions',
    'Utilize potential incentives',
    'Easy-to-use driver app',
    'Cloud-based portal',
  ],

  missionTitle: "Our Company's Mission",
  missionParagraphs: [
    "At ChargeSmart EV, we're committed to pioneering the future of sustainable transportation. Through cutting-edge technology and unwavering dedication to customer satisfaction, we aim to empower individuals and communities to embrace clean energy and drive towards a greener tomorrow.",
    "Our team of professionals provides you with the most ideal charging solution for all your electric vehicle charging needs. Introducing ChargeSmart EV, the industry leader that is fully engaged in the electric car charging market. Our turnkey business solution exclusively focuses on installing electric car charging stations for customers in every industry. Let ChargeSmart EV handle the entire process, from start to finish, to provide you with everything you need to begin charging electric vehicles.",
    "Whether you're a hotel, dealership, workplace, small or large local business, multifamily property, or a municipality, we can help you reach new levels of success and provide a beneficial service to current and new customers, employees and tenants.",
  ],
};

export const RESPONSIBILITIES = {
  csev: [
    'Provide EVSE, Labor & Materials for Project',
    'Facilitate incentive applications (as req\'d)',
    'Project Management/Design',
    'Stamped Eng. Plans/Permits (as req\'d)',
    'Customer Support',
  ],
  customer: [
    'Provide Site Access through Activation',
    'Provide Utility Bill + Other Req\'d Docs',
    'Prompt Document Signing',
    'Atlas Required Data Reporting (Quarterly)',
    'CSEV Portal Training (30 minutes)',
  ],
};

// Legacy PAYMENT_OPTION_DETAILS removed — superseded by PAYMENT_OPTIONS_BY_PROJECT_TYPE

// ============================================
// Per-Project-Type Payment Option Configs
// ============================================

export interface PaymentOptionConfig {
  title: string;
  ownership: string;
  costPercentage: number;
  revenueShare: number;
  warrantyIncluded: string;
  warrantyValue?: number;
  descriptionBold: string;
  descriptionText: string;
  warrantyUpgrades: { name: string; cost: number; perStation: boolean; costLabel?: string }[];
}

// ── Level 2 EPC ──
const LEVEL2_EPC_OPTIONS: PaymentOptionConfig[] = [
  {
    title: 'Option 1',
    ownership: 'CUSTOMER OWNED',
    costPercentage: 100,
    revenueShare: 100,
    warrantyIncluded: 'L2: 3-Year Parts ONLY',
    descriptionBold: 'Option 1 - Customer Owns and Operates Chargers. All Utility Costs, Parts, Labor, Operations, and Maintenance are Customer Responsibility.',
    descriptionText: '',
    warrantyUpgrades: [
      { name: '5-Year Parts ONLY', cost: 5000, perStation: true },
      { name: '3-Year FULL Parts & Labor', cost: 10000, perStation: true },
      { name: '5-Year FULL Parts & Labor', cost: 20000, perStation: true },
    ],
  },
  {
    title: 'Option 2',
    ownership: 'CUSTOMER OWNED',
    costPercentage: 50,
    revenueShare: 90,
    warrantyIncluded: 'L2: 3-Year Parts ONLY',
    descriptionBold: 'Option 2 - Customer Owns and Operates Chargers. All Utility Costs, Parts, Labor, Operations, and Maintenance are Customer Responsibility.',
    descriptionText: '',
    warrantyUpgrades: [
      { name: '5-Year Parts ONLY', cost: 5000, perStation: true },
      { name: '3-Year FULL Parts & Labor', cost: 10000, perStation: true },
      { name: '5-Year FULL Parts & Labor', cost: 20000, perStation: true },
    ],
  },
  {
    title: 'Option 3',
    ownership: 'CUSTOMER OWNED',
    costPercentage: 0,
    revenueShare: 75,
    warrantyIncluded: 'L2: 3-Year Parts ONLY',
    descriptionBold: 'Option 3 - Customer Owns and Operates Chargers. All Utility Costs, Parts, Labor, Operations, and Maintenance are Customer Responsibility.',
    descriptionText: '',
    warrantyUpgrades: [
      { name: '5-Year Parts ONLY', cost: 5000, perStation: true },
      { name: '3-Year FULL Parts & Labor', cost: 10000, perStation: true },
      { name: '5-Year FULL Parts & Labor', cost: 20000, perStation: true },
    ],
  },
];

// ── Level 3 EPC ──
const LEVEL3_EPC_OPTIONS: PaymentOptionConfig[] = [
  {
    title: 'Option 1',
    ownership: 'CUSTOMER OWNED',
    costPercentage: 100,
    revenueShare: 100,
    warrantyIncluded: 'DCFC: 2-Yr Parts ONLY',
    descriptionBold: 'Option 1 - Customer Owns and Operates Chargers. All Utility Costs, Parts, Labor, Operations, and Maintenance are Customer Responsibility.',
    descriptionText: '',
    warrantyUpgrades: [
      { name: '5-Year Parts ONLY', cost: 10000, perStation: true },
      { name: '3-Year FULL Parts & Labor', cost: 20000, perStation: true },
      { name: '5-Year FULL Parts & Labor', cost: 40000, perStation: true },
    ],
  },
  {
    title: 'Option 2',
    ownership: 'CUSTOMER OWNED',
    costPercentage: 50,
    revenueShare: 90,
    warrantyIncluded: 'DCFC: 2-Yr Parts ONLY',
    descriptionBold: 'Option 2 - Customer Owns and Operates Chargers. All Utility Costs, Parts, Labor, Operations, and Maintenance are Customer Responsibility.',
    descriptionText: '',
    warrantyUpgrades: [
      { name: '5-Year Parts ONLY', cost: 10000, perStation: true },
      { name: '3-Year FULL Parts & Labor', cost: 20000, perStation: true },
      { name: '5-Year FULL Parts & Labor', cost: 40000, perStation: true },
    ],
  },
  {
    title: 'Option 3',
    ownership: 'CUSTOMER OWNED',
    costPercentage: 0,
    revenueShare: 75,
    warrantyIncluded: 'DCFC: 2-Yr Parts ONLY',
    descriptionBold: 'Option 3 - Customer Owns and Operates Chargers. All Utility Costs, Parts, Labor, Operations, and Maintenance are Customer Responsibility.',
    descriptionText: '',
    warrantyUpgrades: [
      { name: '5-Year Parts ONLY', cost: 10000, perStation: true },
      { name: '3-Year FULL Parts & Labor', cost: 20000, perStation: true },
      { name: '5-Year FULL Parts & Labor', cost: 40000, perStation: true },
    ],
  },
];

// ── Mixed EPC ── (placeholder — uses same as L2 until customized)
const MIXED_EPC_OPTIONS: PaymentOptionConfig[] = [
  {
    title: 'Option 1',
    ownership: 'CUSTOMER OWNED',
    costPercentage: 100,
    revenueShare: 100,
    warrantyIncluded: 'L2: 3-Year Parts ONLY;DCFC: 2-Yr Parts ONLY',
    descriptionBold: 'Option 1 - Customer Owns and Operates Chargers. All Utility Costs, Parts, Labor, Operations, and Maintenance are Customer Responsibility.',
    descriptionText: '',
    warrantyUpgrades: [
      { name: '5-Year Parts ONLY', cost: 5000, perStation: true, costLabel: 'ADD $5,000 TO NET COST PER L2 STATION / $10,000 TO NET COST PER DCFC STATION' },
      { name: '3-Year FULL Parts & Labor', cost: 10000, perStation: true, costLabel: 'ADD $10,000 TO NET COST PER L2 STATION / $20,000 TO NET COST PER DCFC STATION' },
      { name: '5-Year FULL Parts & Labor', cost: 20000, perStation: true, costLabel: 'ADD $20,000 TO NET COST PER L2 STATION / $40,000 TO NET COST PER DCFC STATION' },
    ],
  },
  {
    title: 'Option 2',
    ownership: 'CUSTOMER OWNED',
    costPercentage: 50,
    revenueShare: 90,
    warrantyIncluded: 'L2: 3-Year Parts ONLY;DCFC: 2-Yr Parts ONLY',
    descriptionBold: 'Option 2 - Customer Owns and Operates Chargers. All Utility Costs, Parts, Labor, Operations, and Maintenance are Customer Responsibility.',
    descriptionText: '',
    warrantyUpgrades: [
      { name: '5-Year Parts ONLY', cost: 5000, perStation: true, costLabel: 'ADD $5,000 TO NET COST PER L2 STATION / $10,000 TO NET COST PER DCFC STATION' },
      { name: '3-Year FULL Parts & Labor', cost: 10000, perStation: true, costLabel: 'ADD $10,000 TO NET COST PER L2 STATION / $20,000 TO NET COST PER DCFC STATION' },
      { name: '5-Year FULL Parts & Labor', cost: 20000, perStation: true, costLabel: 'ADD $20,000 TO NET COST PER L2 STATION / $40,000 TO NET COST PER DCFC STATION' },
    ],
  },
  {
    title: 'Option 3',
    ownership: 'CUSTOMER OWNED',
    costPercentage: 0,
    revenueShare: 75,
    warrantyIncluded: 'L2: 3-Year Parts ONLY;DCFC: 2-Yr Parts ONLY',
    descriptionBold: 'Option 3 - Customer Owns and Operates Chargers. All Utility Costs, Parts, Labor, Operations, and Maintenance are Customer Responsibility.',
    descriptionText: '',
    warrantyUpgrades: [
      { name: '5-Year Parts ONLY', cost: 5000, perStation: true, costLabel: 'ADD $5,000 TO NET COST PER L2 STATION / $10,000 TO NET COST PER DCFC STATION' },
      { name: '3-Year FULL Parts & Labor', cost: 10000, perStation: true, costLabel: 'ADD $10,000 TO NET COST PER L2 STATION / $20,000 TO NET COST PER DCFC STATION' },
      { name: '5-Year FULL Parts & Labor', cost: 20000, perStation: true, costLabel: 'ADD $20,000 TO NET COST PER L2 STATION / $40,000 TO NET COST PER DCFC STATION' },
    ],
  },
];

// ── Site Host ── (Option 1 enabled by default; Options 2 & 3 off by default for site-host)
const SITE_HOST_OPTIONS: PaymentOptionConfig[] = [
  {
    title: 'Option 1',
    ownership: 'CSEV OWNED\nLEASE AGREEMENT',
    costPercentage: 0,
    revenueShare: 10,
    warrantyIncluded: '10-Year FULL Parts & Labor',
    warrantyValue: 20000,
    descriptionBold: 'Option 1 - CSEV Owns and Operates Chargers for 10 Years.',
    descriptionText: 'All Utility Costs, Parts, Labor, Operations and Maintenance are Included.',
    warrantyUpgrades: [],
  },
  {
    title: 'Option 2',
    ownership: 'CSEV OWNED\nLEASE AGREEMENT',
    costPercentage: 0,
    revenueShare: 10,
    warrantyIncluded: '10-Year FULL Parts & Labor',
    warrantyValue: 20000,
    descriptionBold: 'Option 2 - CSEV Owns and Operates Chargers for 10 Years.',
    descriptionText: 'All Utility Costs, Parts, Labor, Operations and Maintenance are Included.',
    warrantyUpgrades: [],
  },
  {
    title: 'Option 3',
    ownership: 'CSEV OWNED\nLEASE AGREEMENT',
    costPercentage: 0,
    revenueShare: 10,
    warrantyIncluded: '10-Year FULL Parts & Labor',
    warrantyValue: 20000,
    descriptionBold: 'Option 3 - CSEV Owns and Operates Chargers for 10 Years.',
    descriptionText: 'All Utility Costs, Parts, Labor, Operations and Maintenance are Included.',
    warrantyUpgrades: [],
  },
];

// ── Distribution ── (placeholder — uses same as L2 until customized)
const DISTRIBUTION_OPTIONS: PaymentOptionConfig[] = [...LEVEL2_EPC_OPTIONS];

// ── Level 2 EPC / Site Host ──
const LEVEL2_SITE_HOST_OPTIONS: PaymentOptionConfig[] = [
  {
    title: 'Option 1',
    ownership: 'CUSTOMER OWNED',
    costPercentage: 100,
    revenueShare: 100,
    warrantyIncluded: 'L2: 3-Year Parts ONLY',
    descriptionBold: 'Option 1 - Customer Owns and Operates Chargers. All Utility Costs, Parts, Labor, Operations, and Maintenance are Customer Responsibility.',
    descriptionText: '',
    warrantyUpgrades: [
      { name: '5-Year Parts ONLY', cost: 5000, perStation: true },
      { name: '3-Year FULL Parts & Labor', cost: 10000, perStation: true },
      { name: '5-Year FULL Parts & Labor', cost: 20000, perStation: true },
    ],
  },
  {
    title: 'Option 2',
    ownership: 'CUSTOMER OWNED',
    costPercentage: 50,
    revenueShare: 90,
    warrantyIncluded: 'L2: 3-Year Parts ONLY',
    descriptionBold: 'Option 2 - Customer Owns and Operates Chargers. All Utility Costs, Parts, Labor, Operations, and Maintenance are Customer Responsibility.',
    descriptionText: '',
    warrantyUpgrades: [
      { name: '5-Year Parts ONLY', cost: 5000, perStation: true },
      { name: '3-Year FULL Parts & Labor', cost: 10000, perStation: true },
      { name: '5-Year FULL Parts & Labor', cost: 20000, perStation: true },
    ],
  },
  {
    title: 'Option 3',
    ownership: 'CSEV OWNED\nLEASE AGREEMENT',
    costPercentage: 0,
    revenueShare: 10,
    warrantyIncluded: 'L2: 10-Year FULL Parts & Labor',
    warrantyValue: 20000,
    descriptionBold: 'Option 3 - CSEV Owns and Operates Chargers for 10 Years.',
    descriptionText: 'All Utility Costs, Parts, Labor, Operations and Maintenance are Included.',
    warrantyUpgrades: [],
  },
];

export const PAYMENT_OPTIONS_BY_PROJECT_TYPE: Record<ProjectType, PaymentOptionConfig[]> = {
  'level2-epc': LEVEL2_EPC_OPTIONS,
  'level3-epc': LEVEL3_EPC_OPTIONS,
  'mixed-epc': MIXED_EPC_OPTIONS,
  'site-host': SITE_HOST_OPTIONS,
  'level2-site-host': LEVEL2_SITE_HOST_OPTIONS,
  'distribution': DISTRIBUTION_OPTIONS,
};

// Additional Terms by Project Type — update these when project types change
// Each entry is an array of { label, notes } rows displayed on Page 4
// Network Fees row is generated dynamically based on networkYears selection
export const ADDITIONAL_TERMS_BY_PROJECT_TYPE: Record<string, Array<{ label: string; notes: string }>> = {
  'level2-epc': [
    { label: 'Processing Fees', notes: '$0.49 per transaction + 9% standard processing' },
    { label: 'Agreement Terms (Years)', notes: '5 Years' },
    { label: 'Recommended $/kWh', notes: '$0.40 / kWh' },
    { label: 'Party Responsible for Paying Utility Bills', notes: 'Customer' },
  ],
  'level3-epc': [
    { label: 'Processing Fees', notes: '$0.49 per transaction + 9% standard processing' },
    { label: 'Agreement Terms (Years)', notes: '5 Years' },
    { label: 'Recommended $/kWh', notes: '$0.55 / kWh' },
    { label: 'Party Responsible for Paying Utility Bills', notes: 'Customer' },
  ],
  'mixed-epc': [
    { label: 'Processing Fees', notes: '$0.49 per transaction + 9% standard processing' },
    { label: 'Agreement Terms (Years)', notes: '5 Years' },
    { label: 'Recommended $/kWh', notes: '$0.40 / kWh for Level 2 units; $0.55 / kWh for DCFC units' },
    { label: 'Party Responsible for Paying Utility Bills', notes: 'Customer' },
  ],
  'site-host': [
    { label: 'Processing Fees', notes: '$0.49 per transaction + 9% standard processing' },
    { label: 'Agreement Terms (Years)', notes: '10 Years Minimum (See Lease Agreement for Final Terms)' },
    { label: 'Recommended $/kWh', notes: '$0.40 / kWh for Level 2 units; $0.55 / kWh for DCFC units' },
    { label: 'Party Responsible for Paying Network Fees', notes: 'ChargeSmart EV (See Lease Agreement for Final Terms)' },
    { label: 'Party Responsible for Paying Utility Bills', notes: 'ChargeSmart EV (See Lease Agreement for Final Terms)' },
  ],
  'level2-site-host': [
    { label: 'Processing Fees', notes: '$0.49 per transaction + 9% standard processing' },
    { label: 'Agreement Terms (Years)', notes: '5 Years for Customer Owned;\n10 Years Min. for CSEV Owned (See Lease Agreement for Final Terms)' },
    { label: 'Recommended $/kWh', notes: '$0.40 / kWh' },
    { label: 'Party Responsible for Paying Utility Bills', notes: 'Customer for Customer Owned;\nCSEV for CSEV Owned (See Lease Agreement for Final Terms)' },
  ],
  'distribution': [
    { label: 'Processing Fees', notes: '$0.49 per transaction + 9% standard processing' },
    { label: 'Agreement Terms (Years)', notes: '5 Years' },
    { label: 'Recommended $/kWh', notes: '$0.40 / kWh for Level 2 units; $0.55 / kWh for DCFC units' },
    { label: 'Party Responsible for Paying Utility Bills', notes: 'Customer' },
  ],
};

// Generate dynamic network fees text based on years selected
function getNetworkFeesText(networkYears: number): string {
  if (networkYears === 1) {
    return 'CSEV Year 1; Customer Years 2 and Beyond';
  }
  if (networkYears === 3) {
    return 'CSEV Years 1-3; Customer Years 4 and Beyond';
  }
  return `CSEV Years 1-${networkYears}; Customer Years ${networkYears + 1}+ after Renewal`;
}

// Helper to get terms for a project type with dynamic network fees
// Site Host has static network fees text; all others use dynamic years
export function getAdditionalTerms(projectType: string, networkYears: number = 5): Array<{ label: string; notes: string }> {
  const terms = [...(ADDITIONAL_TERMS_BY_PROJECT_TYPE[projectType] || ADDITIONAL_TERMS_BY_PROJECT_TYPE['level2-epc'])];

  // Site Host has static Network Fees in data; EPC types get dynamic years;
  // Level 2 Site Host gets hybrid (dynamic for Customer Owned + static for CSEV Owned)
  if (projectType === 'level2-site-host') {
    const utilityBillsIdx = terms.findIndex(t => t.label.includes('Utility Bills'));
    const networkFeesRow = {
      label: 'Party Responsible for Paying Network Fees',
      notes: `${getNetworkFeesText(networkYears)} for Cust Owned;\nCSEV for CSEV Owned (See Lease Agreement for Final Terms)`,
    };
    if (utilityBillsIdx >= 0) {
      terms.splice(utilityBillsIdx, 0, networkFeesRow);
    } else {
      terms.push(networkFeesRow);
    }
  } else if (projectType !== 'site-host') {
    const utilityBillsIdx = terms.findIndex(t => t.label.includes('Utility Bills'));
    const networkFeesRow = {
      label: 'Party Responsible for Paying Network Fees',
      notes: getNetworkFeesText(networkYears),
    };
    if (utilityBillsIdx >= 0) {
      terms.splice(utilityBillsIdx, 0, networkFeesRow);
    } else {
      terms.push(networkFeesRow);
    }
  }

  return terms;
}

export const PROJECT_TYPES = {
  'level2-epc': {
    label: 'Level 2 EPC',
    description: 'AC charging, typically 7-19 kW, ideal for destination charging',
  },
  'level3-epc': {
    label: 'Level 3 EPC',
    description: 'DC fast charging, 50-350 kW, for rapid charging needs',
  },
  'mixed-epc': {
    label: 'Mixed EPC',
    description: 'Combination of Level 2 and Level 3 charging',
  },
  'site-host': {
    label: 'Site Host',
    description: 'Site host agreement for charging infrastructure',
  },
  'level2-site-host': {
    label: 'Level 2 EPC / Site Host',
    description: 'Level 2 EPC with site host payment options',
  },
  'distribution': {
    label: 'Distribution',
    description: 'Equipment distribution only',
  },
};

export const LOCATION_TYPES = {
  'apartments': {
    label: 'Apartments / Multi Unit Dwellings (MUDs)',
  },
  'hospitality': {
    label: 'Hotel / Hospitality',
  },
  'dealership': {
    label: 'Auto Dealerships',
  },
  'retail': {
    label: 'Retail / Shopping Plazas',
  },
  'workplace': {
    label: 'Workplace / Restaurants',
  },
  'municipalities': {
    label: 'Municipalities / Public Destination',
  },
  'other': {
    label: 'All Other',
  },
};

export const STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

import type { ProjectType, LocationType } from './types';

// Cover page title mapping by project type
export const COVER_PAGE_TITLES: Record<ProjectType, string> = {
  'level2-epc': 'LEVEL 2 CHARGING STATIONS',
  'level3-epc': 'LEVEL 3 CHARGING STATIONS',
  'mixed-epc': 'LEVEL 2 & LEVEL 3 CHARGING STATIONS',
  'site-host': 'SITE HOST EV CHARGING',
  'level2-site-host': 'LEVEL 2 EPC / SITE HOST CHARGING',
  'distribution': 'EV EQUIPMENT DISTRIBUTION',
};

// Default incentive labels by utility
export const INCENTIVE_LABEL_DEFAULTS: Record<string, { makeReady: string; secondary: string }> = {
  // New York
  'national-grid': { makeReady: 'National Grid Make Ready Incentive', secondary: 'NYSERDA Charge Ready 2.0 Incentive' },
  'coned': { makeReady: 'Con Edison Make Ready Incentive', secondary: 'NYSERDA Charge Ready 2.0 Incentive' },
  'nyseg': { makeReady: 'NYSEG Make Ready Incentive', secondary: 'NYSERDA Charge Ready 2.0 Incentive' },
  'rge': { makeReady: 'RG&E Make Ready Incentive', secondary: 'NYSERDA Charge Ready 2.0 Incentive' },
  'oru': { makeReady: 'Orange & Rockland Make Ready Incentive', secondary: 'NYSERDA Charge Ready 2.0 Incentive' },
  'central-hudson': { makeReady: 'Central Hudson Make Ready Incentive', secondary: 'NYSERDA Charge Ready 2.0 Incentive' },
  // New Jersey
  'pseg': { makeReady: 'PSE&G CSMR Incentive', secondary: 'NJBPU Incentive' },
  'jcpl': { makeReady: 'JCP&L CSMR Incentive', secondary: 'NJBPU Incentive' },
  'ace': { makeReady: 'Atlantic City Electric CSMR Incentive', secondary: 'NJBPU Incentive' },
  // Fallback
  'default': { makeReady: 'Estimated Make Ready Incentive', secondary: 'Estimated Secondary Incentive' },
};

// Get incentive labels for a given utility
export function getIncentiveLabels(utilityId?: string): { makeReady: string; secondary: string } {
  if (utilityId && INCENTIVE_LABEL_DEFAULTS[utilityId]) {
    return INCENTIVE_LABEL_DEFAULTS[utilityId];
  }
  return INCENTIVE_LABEL_DEFAULTS['default'];
}

// ============================================
// Industry Value Propositions — keyed by LocationType only
// Each entry: title (header), intro (one line), points (EXACTLY 4 lines — always 4, no more, no less)
// To update: edit the title/intro/points for each location type below
// The PDF renders exactly 4 point lines regardless — extra points are ignored, missing ones show blank
// ============================================
export const INDUSTRY_VALUE_PROPS: Record<LocationType, { title: string; intro: string; points: string[] }> = {
  'apartments': {
    title: 'Charge Up Your Residents',
    intro: '',
    points: [
      "Attract and retain high-value residents to your property",
      "Increase property value and offer the ability to charge higher rental pricing",
      "80% of EV charging happens where the driver lives, making easy charging access \"at home\" the single most important factor in EV ownership",
      " ",
    ],
  },
  'hospitality': {
    title: 'Powering Guest Stays',
    intro: '',
    points: [
      "30+ Monthly Bookings - at $150/room, that's $4,500+ in added monthly revenue",
      "Boost RevPAR - 48% of EV drivers won't stay at a hotel without EV charging",
      "$52k Annual NOI Boost - drives long-term value at an 11% cap rate (~$475K)",
      "Every 100 kWh charged generates about $600 in additional room bookings",
    ],
  },
  'dealership': {
    title: 'Accelerating EV Adoption',
    intro: '',
    points: [
      "Drive higher EV sales conversion by letting buyers experience fast, reliable charging before they leave the lot",
      "Keep service bays full — EV owners return for maintenance and top-offs, boosting per-visit revenue",
      "Future-proof your dealership with scalable infrastructure that grows alongside OEM electrification mandates",
      "Turn every charge session into brand exposure with custom-branded stations and on-screen dealership promotions",
    ],
  },
  'retail': {
    title: 'Charging Drives Commerce',
    intro: '',
    points: [
      "EV drivers spend 2x longer at locations with charging — more dwell time means higher average ticket sizes",
      "Capture the EV demographic — households with EVs earn 40% above median, driving premium spending",
      "Stand out from competing plazas and create a reason for repeat visits with reliable, branded charging",
      "Offset installation costs with federal tax credits, state incentives, and per-session charging revenue",
    ],
  },
  'workplace': {
    title: 'Energize Your Team',
    intro: '',
    points: [
      "Workplace charging is the #2 most-used charging location — employees rank it as a top retention benefit",
      "Signal innovation and sustainability to recruit top talent in a competitive hiring market",
      "Level 2 charging during 8-hour workdays delivers full charges at minimal electricity cost per employee",
      "Monetize unused parking with per-session fees or offer free charging as a tax-advantaged employee perk",
    ],
  },
  'municipalities': {
    title: 'Powering Public Progress',
    intro: '',
    points: [
      "Demonstrate environmental leadership and advance community sustainability goals with visible EV infrastructure",
      "Draw visitors, commuters, and economic activity to downtown corridors and public destinations",
      "Generate ongoing revenue from public charging fees to offset municipal utility and maintenance costs",
      "Maximize federal, state, and utility incentives specifically designed for public-sector EV deployments",
    ],
  },
  'other': {
    title: 'Benefits of Using ChargeSmart EV',
    intro: '',
    points: [
      "Turnkey EV charging solutions — we handle everything from site design and permitting to installation and activation",
      "Cloud-based monitoring portal and easy-to-use driver app with real-time station status and usage analytics",
      "Maximize available incentives — our team identifies and facilitates federal, state, and utility rebate applications",
      "Dedicated ongoing support with network management, maintenance coordination, and revenue optimization",
    ],
  },
};

// Get value prop content based on location type
export function getValuePropForContext(
  locationType: LocationType,
  _projectType?: ProjectType
): { title: string; intro: string; points: string[] } | null {
  const prop = INDUSTRY_VALUE_PROPS[locationType];
  if (!prop) return null;
  return prop;
}

// Legacy — kept for backward compat
export function getLocationValueProp(
  locationType: LocationType,
  projectType: ProjectType
): { title: string; intro: string; points: string[] } | null {
  return getValuePropForContext(locationType, projectType);
}

// Payment options by project type — returns array of configs (variable length per type)
export function getPaymentOptions(projectType: ProjectType): PaymentOptionConfig[] {
  return PAYMENT_OPTIONS_BY_PROJECT_TYPE[projectType] || PAYMENT_OPTIONS_BY_PROJECT_TYPE['level2-epc'];
}

// Footnote texts from template
export const FOOTNOTES = {
  networkPlan: '* Customer will be required to provide usage data on a quarterly and annual basis for a minimum of 5 years to receive Make-Ready Incentive. Networking EV stations is encouraged to assist with this ongoing requirement. Non-networked stations will not be able to appear online or charge fees for station use.',
  paymentOptions: '** Payment options available',
  revenueShare: 'All revenue share amounts are based on Net Revenue. Net Revenue is defined as gross charging amount minus all sales tax and processing fees. Standard fees previously listed apply to ALL transactions processed for EV chargers on our Network. Additional fees may apply (e.g., roaming). All projects come with a 30-day "workmanship" basic parts and labor warranty. Please see Full Warranty Terms & Conditions for what\'s covered, not covered and excluded from each warranty option.',
};
