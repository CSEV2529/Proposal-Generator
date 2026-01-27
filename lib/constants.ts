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

export const PAYMENT_OPTION_DETAILS = {
  option1: {
    title: 'Option 1',
    costPercentage: 100,
    revenueShare: 100,
    warrantyIncluded: '3-Year Parts ONLY',
    warrantyUpgrades: [
      { name: '5-Year Parts ONLY', cost: 5000, perStation: true },
      { name: '3-Year FULL Parts & Labor', cost: 10000, perStation: true },
      { name: '5-Year FULL Parts & Labor', cost: 20000, perStation: true },
    ],
  },
  option2: {
    title: 'Option 2',
    costPercentage: 50,
    revenueShare: 75,
    warrantyIncluded: '3-Year Parts ONLY',
    warrantyUpgrades: [
      { name: '5-Year Parts ONLY', cost: 5000, perStation: true },
      { name: '3-Year FULL Parts & Labor', cost: 10000, perStation: true },
      { name: '5-Year FULL Parts & Labor', cost: 20000, perStation: true },
    ],
  },
  option3: {
    title: 'Option 3',
    costPercentage: 0,
    revenueShare: 50,
    warrantyIncluded: '5-Year FULL Parts & Labor',
    warrantyValue: 20000,
    warrantyUpgrades: [], // No upgrades needed - already has full warranty
  },
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

export const ADDITIONAL_TERMS = {
  processingFees: '$0.49 per transaction + 9% standard processing',
  networkFeesResponsibility: 'CSEV Years 1-5; then Customer Years 6+ after Renewal',
  utilityBillsResponsibility: 'Customer',
};

export const PROJECT_TYPES = {
  level2: {
    label: 'Level 2 Charging Stations',
    description: 'AC charging, typically 7-19 kW, ideal for destination charging',
  },
  dcfc: {
    label: 'DC Fast Charging',
    description: 'DC charging, 50-350 kW, for rapid charging needs',
  },
};

export const STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

// Footnote texts from template
export const FOOTNOTES = {
  networkPlan: '* Customer will be required to provide usage data on a quarterly and annual basis for a minimum of 5 years to receive Make-Ready Incentive. Networking EV stations is encouraged to assist with this ongoing requirement. Non-networked stations will not be able to appear online or charge fees for station use.',
  paymentOptions: '** Payment options available',
  revenueShare: 'All revenue share amounts are based on Net Revenue. Net Revenue is defined as gross charging amount minus all sales tax and processing fees. Standard fees previously listed apply to ALL transactions processed for EV chargers on our Network. Additional fees may apply (e.g., roaming). All projects come with a 30-day "workmanship" basic parts and labor warranty. Please see Full Warranty Terms & Conditions for what\'s covered, not covered and excluded from each warranty option.',
};
