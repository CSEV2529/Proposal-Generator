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
  warrantyUpgrades: { name: string; cost: number; perStation: boolean }[];
}

// ── Level 2 EPC ──
const LEVEL2_EPC_OPTIONS: PaymentOptionConfig[] = [
  {
    title: 'Option 1',
    ownership: 'CUSTOMER OWNED',
    costPercentage: 100,
    revenueShare: 100,
    warrantyIncluded: '3-Year Parts ONLY',
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
    warrantyIncluded: '3-Year Parts ONLY',
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
    warrantyIncluded: '3-Year Parts ONLY',
    descriptionBold: 'Option 3 - Customer Owns and Operates Chargers. All Utility Costs, Parts, Labor, Operations, and Maintenance are Customer Responsibility.',
    descriptionText: '',
    warrantyUpgrades: [
      { name: '5-Year Parts ONLY', cost: 5000, perStation: true },
      { name: '3-Year FULL Parts & Labor', cost: 10000, perStation: true },
      { name: '5-Year FULL Parts & Labor', cost: 20000, perStation: true },
    ],
  },
];

// ── Level 3 EPC ── (placeholder — uses same as L2 until customized)
const LEVEL3_EPC_OPTIONS: PaymentOptionConfig[] = [...LEVEL2_EPC_OPTIONS];

// ── Mixed EPC ── (placeholder — uses same as L2 until customized)
const MIXED_EPC_OPTIONS: PaymentOptionConfig[] = [...LEVEL2_EPC_OPTIONS];

// ── Site Host ── (placeholder — uses same as L2 until customized)
const SITE_HOST_OPTIONS: PaymentOptionConfig[] = [...LEVEL2_EPC_OPTIONS];

// ── Distribution ── (placeholder — uses same as L2 until customized)
const DISTRIBUTION_OPTIONS: PaymentOptionConfig[] = [...LEVEL2_EPC_OPTIONS];

// ── Level 2 EPC / Site Host ──
const LEVEL2_SITE_HOST_OPTIONS: PaymentOptionConfig[] = [
  {
    title: 'Option 1',
    ownership: 'CUSTOMER OWNED',
    costPercentage: 100,
    revenueShare: 100,
    warrantyIncluded: '3-Year Parts ONLY',
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
    ownership: 'LEASE AGREEMENT-\nCSEV OWNED',
    costPercentage: 0,
    revenueShare: 50,
    warrantyIncluded: '5-Year FULL Parts & Labor',
    warrantyValue: 20000,
    descriptionBold: 'Option 2 - CSEV Owns and Operates Chargers for 10 Years.',
    descriptionText: 'All Utility Costs, Parts, Labor, Operations and Maintenance is Included.',
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

export const HOTEL_VALUE_PROPOSITION = {
  title: 'Turn Charging into Check-Ins',
  intro: 'Hotels with EV chargers see an average of 30+ extra bookings per month, and adding nearly $500K in property value',
  points: [
    "30+ Monthly Books - at $150/room that's $4,500 in added monthly revenue, turning a small utility cost into $52.2k in annual profit",
    "Boosted RevPAR - 48% of EV drivers won't stay at a hotel without EV charging",
    "$52k Annual NOI Boost - drives long-term value at an 11% cap rate (~$475K)",
    "Every 100kWh charged generates about $600 in additional room bookings",
  ],
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
    { label: 'Party Responsible for Paying Network Fees', notes: 'ChargeSmart EV for Site Lease Agreements Only; Otherwise Customer Pays' },
    { label: 'Party Responsible for Paying Utility Bills', notes: 'ChargeSmart EV for Site Lease Agreements Only; Otherwise Customer Pays' },
  ],
  'level2-site-host': [
    { label: 'Processing Fees', notes: '$0.49 per transaction + 9% standard processing' },
    { label: 'Agreement Terms (Years)', notes: '10 Years Minimum (See Lease Agreement for Final Terms)' },
    { label: 'Recommended $/kWh', notes: '$0.40 / kWh' },
    { label: 'Party Responsible for Paying Network Fees', notes: 'ChargeSmart EV for Site Lease Agreements Only; Otherwise Customer Pays' },
    { label: 'Party Responsible for Paying Utility Bills', notes: 'ChargeSmart EV for Site Lease Agreements Only; Otherwise Customer Pays' },
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
    return 'CSEV Year 1; then Customer Years 2 and Beyond';
  }
  if (networkYears === 3) {
    return 'CSEV Years 1-3; then Customer Years 4 and Beyond';
  }
  return `CSEV Years 1-${networkYears}; then Customer Years ${networkYears + 1}+ after Renewal`;
}

// Helper to get terms for a project type with dynamic network fees
// Site Host has static network fees text; all others use dynamic years
export function getAdditionalTerms(projectType: string, networkYears: number = 5): Array<{ label: string; notes: string }> {
  const terms = [...(ADDITIONAL_TERMS_BY_PROJECT_TYPE[projectType] || ADDITIONAL_TERMS_BY_PROJECT_TYPE['level2-epc'])];

  // Site Host types already have their own static Network Fees row in the data
  // All other types get a dynamic Network Fees row inserted before Utility Bills
  if (projectType !== 'site-host' && projectType !== 'level2-site-host') {
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
    label: 'Apartments / Multi Unit Dwelling',
  },
  'commercial': {
    label: 'Commercial / Workspace',
  },
  'dealership': {
    label: 'Dealership',
  },
  'hospitality': {
    label: 'Hospitality / Hotels',
  },
  'municipalities': {
    label: 'Municipalities / Public Destinations',
  },
  'retail': {
    label: 'Retail / Restaurant',
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

// Location-specific value proposition sections (legacy — kept for backward compat)
export const LOCATION_VALUE_PROPS: Record<string, { title: string; intro: string; points: string[] }> = {
  'hospitality': {
    title: 'Turn Charging into Check-Ins',
    intro: 'Hotels with EV chargers see an average of 30+ extra bookings per month, and adding nearly $500K in property value',
    points: [
      "30+ Monthly Books - at $150/room that's $4,500 in added monthly revenue, turning a small utility cost into $52.2k in annual profit",
      "Boosted RevPAR - 48% of EV drivers won't stay at a hotel without EV charging",
      "$52k Annual NOI Boost - drives long-term value at an 11% cap rate (~$475K)",
      "Every 100kWh charged generates about $600 in additional room bookings",
    ],
  },
  'apartments': {
    title: 'Charge Up Your Portfolio',
    intro: 'Multi-family properties with EV chargers attract higher-quality tenants and command premium rents',
    points: [
      "Attract eco-conscious tenants willing to pay 5-10% more in monthly rent",
      "Reduce turnover - 73% of EV drivers say charging availability impacts their housing decisions",
      "Increase property value by $50-100K+ per building with installed EV infrastructure",
      "Future-proof your property as EV adoption grows to 50%+ of new car sales",
    ],
  },
};

// ============================================
// Value Propositions Matrix (LocationType × ProjectType)
// ============================================

export const VALUE_PROPS_MATRIX: Record<LocationType, Partial<Record<ProjectType, { title: string; intro: string; points: string[] } | null>>> = {
  'hospitality': {
    'level2-epc': {
      title: 'Turn Charging into Check-Ins',
      intro: 'Hotels with EV chargers see an average of 30+ extra bookings per month, and adding nearly $500K in property value',
      points: [
        "30+ Monthly Books - at $150/room that's $4,500 in added monthly revenue, turning a small utility cost into $52.2k in annual profit",
        "Boosted RevPAR - 48% of EV drivers won't stay at a hotel without EV charging",
        "$52k Annual NOI Boost - drives long-term value at an 11% cap rate (~$475K)",
        "Every 100kWh charged generates about $600 in additional room bookings",
      ],
    },
    'level3-epc': {
      title: 'Turn Charging into Check-Ins',
      intro: 'Hotels with EV chargers see an average of 30+ extra bookings per month, and adding nearly $500K in property value',
      points: [
        "30+ Monthly Books - at $150/room that's $4,500 in added monthly revenue, turning a small utility cost into $52.2k in annual profit",
        "Boosted RevPAR - 48% of EV drivers won't stay at a hotel without EV charging",
        "$52k Annual NOI Boost - drives long-term value at an 11% cap rate (~$475K)",
        "Every 100kWh charged generates about $600 in additional room bookings",
      ],
    },
    'mixed-epc': {
      title: 'Turn Charging into Check-Ins',
      intro: 'Hotels with EV chargers see an average of 30+ extra bookings per month, and adding nearly $500K in property value',
      points: [
        "30+ Monthly Books - at $150/room that's $4,500 in added monthly revenue, turning a small utility cost into $52.2k in annual profit",
        "Boosted RevPAR - 48% of EV drivers won't stay at a hotel without EV charging",
        "$52k Annual NOI Boost - drives long-term value at an 11% cap rate (~$475K)",
        "Every 100kWh charged generates about $600 in additional room bookings",
      ],
    },
    'site-host': {
      title: 'Turn Charging into Check-Ins',
      intro: 'Hotels with EV chargers see an average of 30+ extra bookings per month, and adding nearly $500K in property value',
      points: [
        "30+ Monthly Books - at $150/room that's $4,500 in added monthly revenue, turning a small utility cost into $52.2k in annual profit",
        "Boosted RevPAR - 48% of EV drivers won't stay at a hotel without EV charging",
        "$52k Annual NOI Boost - drives long-term value at an 11% cap rate (~$475K)",
        "Every 100kWh charged generates about $600 in additional room bookings",
      ],
    },
    'level2-site-host': {
      title: 'Turn Charging into Check-Ins',
      intro: 'Hotels with EV chargers see an average of 30+ extra bookings per month, and adding nearly $500K in property value',
      points: [
        "30+ Monthly Books - at $150/room that's $4,500 in added monthly revenue, turning a small utility cost into $52.2k in annual profit",
        "Boosted RevPAR - 48% of EV drivers won't stay at a hotel without EV charging",
        "$52k Annual NOI Boost - drives long-term value at an 11% cap rate (~$475K)",
        "Every 100kWh charged generates about $600 in additional room bookings",
      ],
    },
    'distribution': null,
  },
  'apartments': {
    'level2-epc': {
      title: 'Charge Up Your Portfolio',
      intro: 'Multi-family properties with EV chargers attract higher-quality tenants and command premium rents',
      points: [
        "Attract eco-conscious tenants willing to pay 5-10% more in monthly rent",
        "Reduce turnover - 73% of EV drivers say charging availability impacts their housing decisions",
        "Increase property value by $50-100K+ per building with installed EV infrastructure",
        "Future-proof your property as EV adoption grows to 50%+ of new car sales",
      ],
    },
    'level3-epc': {
      title: 'Charge Up Your Portfolio',
      intro: 'Multi-family properties with EV chargers attract higher-quality tenants and command premium rents',
      points: [
        "Attract eco-conscious tenants willing to pay 5-10% more in monthly rent",
        "Reduce turnover - 73% of EV drivers say charging availability impacts their housing decisions",
        "Increase property value by $50-100K+ per building with installed EV infrastructure",
        "Future-proof your property as EV adoption grows to 50%+ of new car sales",
      ],
    },
    'mixed-epc': {
      title: 'Charge Up Your Portfolio',
      intro: 'Multi-family properties with EV chargers attract higher-quality tenants and command premium rents',
      points: [
        "Attract eco-conscious tenants willing to pay 5-10% more in monthly rent",
        "Reduce turnover - 73% of EV drivers say charging availability impacts their housing decisions",
        "Increase property value by $50-100K+ per building with installed EV infrastructure",
        "Future-proof your property as EV adoption grows to 50%+ of new car sales",
      ],
    },
    'site-host': {
      title: 'Charge Up Your Portfolio',
      intro: 'Multi-family properties with EV chargers attract higher-quality tenants and command premium rents',
      points: [
        "Attract eco-conscious tenants willing to pay 5-10% more in monthly rent",
        "Reduce turnover - 73% of EV drivers say charging availability impacts their housing decisions",
        "Increase property value by $50-100K+ per building with installed EV infrastructure",
        "Future-proof your property as EV adoption grows to 50%+ of new car sales",
      ],
    },
    'level2-site-host': {
      title: 'Charge Up Your Portfolio',
      intro: 'Multi-family properties with EV chargers attract higher-quality tenants and command premium rents',
      points: [
        "Attract eco-conscious tenants willing to pay 5-10% more in monthly rent",
        "Reduce turnover - 73% of EV drivers say charging availability impacts their housing decisions",
        "Increase property value by $50-100K+ per building with installed EV infrastructure",
        "Future-proof your property as EV adoption grows to 50%+ of new car sales",
      ],
    },
    'distribution': null,
  },
  'commercial': {
    'level2-epc': {
      title: 'Power Your Workplace Forward',
      intro: 'Workplace charging is the #2 most common charging location — attract and retain top talent with EV amenities',
      points: [
        "Employee retention - 67% of EV drivers consider workplace charging a top benefit",
        "Attract new talent - EV charging signals a forward-thinking, sustainable employer",
        "Low cost-per-use with Level 2 charging during long workday dwell times",
        "Eligible for federal tax credits and state incentives to offset installation costs",
      ],
    },
    'level3-epc': {
      title: 'Power Your Workplace Forward',
      intro: 'Workplace charging is the #2 most common charging location — attract and retain top talent with EV amenities',
      points: [
        "Employee retention - 67% of EV drivers consider workplace charging a top benefit",
        "Attract new talent - EV charging signals a forward-thinking, sustainable employer",
        "DCFC enables fleet and visitor fast-charging alongside employee Level 2 stations",
        "Eligible for federal tax credits and state incentives to offset installation costs",
      ],
    },
    'mixed-epc': {
      title: 'Power Your Workplace Forward',
      intro: 'Workplace charging is the #2 most common charging location — attract and retain top talent with EV amenities',
      points: [
        "Employee retention - 67% of EV drivers consider workplace charging a top benefit",
        "Attract new talent - EV charging signals a forward-thinking, sustainable employer",
        "Mixed L2 + DCFC serves both long-dwell employees and quick-stop visitors",
        "Eligible for federal tax credits and state incentives to offset installation costs",
      ],
    },
    'site-host': {
      title: 'Power Your Workplace Forward',
      intro: 'Workplace charging is the #2 most common charging location — attract and retain top talent with EV amenities',
      points: [
        "Employee retention - 67% of EV drivers consider workplace charging a top benefit",
        "Zero upfront cost with site host model — CSEV handles everything",
        "Low cost-per-use with Level 2 charging during long workday dwell times",
        "Eligible for federal tax credits and state incentives to offset installation costs",
      ],
    },
    'level2-site-host': {
      title: 'Power Your Workplace Forward',
      intro: 'Workplace charging is the #2 most common charging location — attract and retain top talent with EV amenities',
      points: [
        "Employee retention - 67% of EV drivers consider workplace charging a top benefit",
        "Low cost-per-use with Level 2 charging during long workday dwell times",
        "Eligible for federal tax credits and state incentives to offset installation costs",
        "Flexible payment options including site host lease agreements",
      ],
    },
    'distribution': null,
  },
  'dealership': {
    'level2-epc': {
      title: 'Sell More EVs, Service More Customers',
      intro: 'Dealerships with on-site EV charging see higher EV sales conversion and increased service revenue',
      points: [
        "Demonstrate EV charging to buyers on-site — increases test drive-to-sale conversion",
        "Service department revenue from EV maintenance and charging during visits",
        "Attract EV owners from competing brands for service and future trade-ins",
        "Meet manufacturer EV-readiness requirements ahead of mandates",
      ],
    },
    'level3-epc': {
      title: 'Sell More EVs, Service More Customers',
      intro: 'Dealerships with on-site EV charging see higher EV sales conversion and increased service revenue',
      points: [
        "Demonstrate EV fast-charging to buyers on-site — increases test drive-to-sale conversion",
        "DCFC enables rapid top-offs for service customers and delivery prep",
        "Attract EV owners from competing brands for service and future trade-ins",
        "Meet manufacturer EV-readiness requirements ahead of mandates",
      ],
    },
    'mixed-epc': {
      title: 'Sell More EVs, Service More Customers',
      intro: 'Dealerships with on-site EV charging see higher EV sales conversion and increased service revenue',
      points: [
        "Demonstrate EV charging to buyers on-site — increases test drive-to-sale conversion",
        "L2 for lot inventory management, DCFC for rapid delivery prep and customer charging",
        "Attract EV owners from competing brands for service and future trade-ins",
        "Meet manufacturer EV-readiness requirements ahead of mandates",
      ],
    },
    'site-host': {
      title: 'Sell More EVs, Service More Customers',
      intro: 'Dealerships with on-site EV charging see higher EV sales conversion and increased service revenue',
      points: [
        "Demonstrate EV charging to buyers on-site — increases test drive-to-sale conversion",
        "Zero upfront cost with site host model — CSEV handles everything",
        "Attract EV owners from competing brands for service and future trade-ins",
        "Meet manufacturer EV-readiness requirements ahead of mandates",
      ],
    },
    'level2-site-host': {
      title: 'Sell More EVs, Service More Customers',
      intro: 'Dealerships with on-site EV charging see higher EV sales conversion and increased service revenue',
      points: [
        "Demonstrate EV charging to buyers on-site — increases test drive-to-sale conversion",
        "Service department revenue from EV maintenance and charging during visits",
        "Attract EV owners from competing brands for service and future trade-ins",
        "Meet manufacturer EV-readiness requirements ahead of mandates",
      ],
    },
    'distribution': null,
  },
  'municipalities': {
    'level2-epc': {
      title: 'Lead the Charge for Your Community',
      intro: 'Public EV infrastructure demonstrates environmental leadership and attracts economic development',
      points: [
        "Demonstrate environmental leadership and meet sustainability goals",
        "Attract visitors and economic activity to downtown and public spaces",
        "Generate revenue from public charging fees to offset utility costs",
        "Access federal, state, and utility incentives designed for public entities",
      ],
    },
    'level3-epc': {
      title: 'Lead the Charge for Your Community',
      intro: 'Public EV infrastructure demonstrates environmental leadership and attracts economic development',
      points: [
        "DCFC enables corridor charging that brings travelers into your community",
        "Demonstrate environmental leadership and meet sustainability goals",
        "Generate significant revenue from public fast-charging fees",
        "Access federal, state, and utility incentives designed for public entities",
      ],
    },
    'mixed-epc': {
      title: 'Lead the Charge for Your Community',
      intro: 'Public EV infrastructure demonstrates environmental leadership and attracts economic development',
      points: [
        "L2 for municipal lots and parks, DCFC for corridor and downtown locations",
        "Demonstrate environmental leadership and meet sustainability goals",
        "Generate revenue from public charging fees to offset utility costs",
        "Access federal, state, and utility incentives designed for public entities",
      ],
    },
    'site-host': {
      title: 'Lead the Charge for Your Community',
      intro: 'Public EV infrastructure demonstrates environmental leadership and attracts economic development',
      points: [
        "Zero upfront cost with site host model — CSEV handles everything",
        "Demonstrate environmental leadership and meet sustainability goals",
        "Generate revenue from public charging fees to offset utility costs",
        "Access federal, state, and utility incentives designed for public entities",
      ],
    },
    'level2-site-host': {
      title: 'Lead the Charge for Your Community',
      intro: 'Public EV infrastructure demonstrates environmental leadership and attracts economic development',
      points: [
        "Demonstrate environmental leadership and meet sustainability goals",
        "Attract visitors and economic activity to downtown and public spaces",
        "Generate revenue from public charging fees to offset utility costs",
        "Access federal, state, and utility incentives designed for public entities",
      ],
    },
    'distribution': null,
  },
  'retail': {
    'level2-epc': {
      title: 'Drive Foot Traffic & Dwell Time',
      intro: 'Retail locations with EV charging see increased foot traffic, longer visits, and higher average spend',
      points: [
        "EV drivers spend 50% more time at locations with charging — more time = more spending",
        "Attract the growing EV demographic with higher-than-average household income",
        "Differentiate from competitors and drive repeat visits",
        "Eligible for federal tax credits and state incentives to offset installation costs",
      ],
    },
    'level3-epc': {
      title: 'Drive Foot Traffic & Dwell Time',
      intro: 'Retail locations with EV charging see increased foot traffic, longer visits, and higher average spend',
      points: [
        "DCFC attracts highway travelers looking for a quick charge and a meal or shop",
        "Attract the growing EV demographic with higher-than-average household income",
        "Differentiate from competitors and drive repeat visits",
        "Eligible for federal tax credits and state incentives to offset installation costs",
      ],
    },
    'mixed-epc': {
      title: 'Drive Foot Traffic & Dwell Time',
      intro: 'Retail locations with EV charging see increased foot traffic, longer visits, and higher average spend',
      points: [
        "L2 for regular shoppers, DCFC for highway travelers stopping for a quick charge",
        "Attract the growing EV demographic with higher-than-average household income",
        "Differentiate from competitors and drive repeat visits",
        "Eligible for federal tax credits and state incentives to offset installation costs",
      ],
    },
    'site-host': {
      title: 'Drive Foot Traffic & Dwell Time',
      intro: 'Retail locations with EV charging see increased foot traffic, longer visits, and higher average spend',
      points: [
        "Zero upfront cost with site host model — CSEV handles everything",
        "Attract the growing EV demographic with higher-than-average household income",
        "Differentiate from competitors and drive repeat visits",
        "Eligible for federal tax credits and state incentives to offset installation costs",
      ],
    },
    'level2-site-host': {
      title: 'Drive Foot Traffic & Dwell Time',
      intro: 'Retail locations with EV charging see increased foot traffic, longer visits, and higher average spend',
      points: [
        "EV drivers spend 50% more time at locations with charging — more time = more spending",
        "Attract the growing EV demographic with higher-than-average household income",
        "Differentiate from competitors and drive repeat visits",
        "Eligible for federal tax credits and state incentives to offset installation costs",
      ],
    },
    'distribution': null,
  },
};

// Get value prop content based on location and project type (new matrix-based)
export function getValuePropForContext(
  locationType: LocationType,
  projectType: ProjectType
): { title: string; intro: string; points: string[] } | null {
  const locationProps = VALUE_PROPS_MATRIX[locationType];
  if (!locationProps) return null;
  const prop = locationProps[projectType];
  if (prop === null || prop === undefined) return null;
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
