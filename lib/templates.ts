// Templates for auto-populating EVSE and Installation items based on Scope of Work
// State -> Utility -> Scope of Work hierarchy

export interface EVSETemplateItem {
  productId: string;      // Must match a product ID from pricebook.ts
  quantity: number;
  notes?: string;
}

export interface InstallationTemplateItem {
  serviceId: string;      // Must match a service ID from pricebook.ts
  quantity: number;
}

export interface ScopeOfWorkTemplate {
  id: string;
  name: string;           // Display name, e.g., "10 Banger New Service"
  description?: string;
  evseItems: EVSETemplateItem[];
  installationItems: InstallationTemplateItem[];
}

export interface State {
  id: string;
  name: string;
  abbreviation: string;
}

export interface Utility {
  id: string;
  name: string;
  stateId: string;
}

// ============================================
// STATES
// ============================================

export const states: State[] = [
  { id: 'al', name: 'Alabama', abbreviation: 'AL' },
  { id: 'ak', name: 'Alaska', abbreviation: 'AK' },
  { id: 'az', name: 'Arizona', abbreviation: 'AZ' },
  { id: 'ar', name: 'Arkansas', abbreviation: 'AR' },
  { id: 'ca', name: 'California', abbreviation: 'CA' },
  { id: 'co', name: 'Colorado', abbreviation: 'CO' },
  { id: 'ct', name: 'Connecticut', abbreviation: 'CT' },
  { id: 'de', name: 'Delaware', abbreviation: 'DE' },
  { id: 'fl', name: 'Florida', abbreviation: 'FL' },
  { id: 'ga', name: 'Georgia', abbreviation: 'GA' },
  { id: 'hi', name: 'Hawaii', abbreviation: 'HI' },
  { id: 'id', name: 'Idaho', abbreviation: 'ID' },
  { id: 'il', name: 'Illinois', abbreviation: 'IL' },
  { id: 'in', name: 'Indiana', abbreviation: 'IN' },
  { id: 'ia', name: 'Iowa', abbreviation: 'IA' },
  { id: 'ks', name: 'Kansas', abbreviation: 'KS' },
  { id: 'ky', name: 'Kentucky', abbreviation: 'KY' },
  { id: 'la', name: 'Louisiana', abbreviation: 'LA' },
  { id: 'me', name: 'Maine', abbreviation: 'ME' },
  { id: 'md', name: 'Maryland', abbreviation: 'MD' },
  { id: 'ma', name: 'Massachusetts', abbreviation: 'MA' },
  { id: 'mi', name: 'Michigan', abbreviation: 'MI' },
  { id: 'mn', name: 'Minnesota', abbreviation: 'MN' },
  { id: 'ms', name: 'Mississippi', abbreviation: 'MS' },
  { id: 'mo', name: 'Missouri', abbreviation: 'MO' },
  { id: 'mt', name: 'Montana', abbreviation: 'MT' },
  { id: 'ne', name: 'Nebraska', abbreviation: 'NE' },
  { id: 'nv', name: 'Nevada', abbreviation: 'NV' },
  { id: 'nh', name: 'New Hampshire', abbreviation: 'NH' },
  { id: 'nj', name: 'New Jersey', abbreviation: 'NJ' },
  { id: 'nm', name: 'New Mexico', abbreviation: 'NM' },
  { id: 'ny', name: 'New York', abbreviation: 'NY' },
  { id: 'nc', name: 'North Carolina', abbreviation: 'NC' },
  { id: 'nd', name: 'North Dakota', abbreviation: 'ND' },
  { id: 'oh', name: 'Ohio', abbreviation: 'OH' },
  { id: 'ok', name: 'Oklahoma', abbreviation: 'OK' },
  { id: 'or', name: 'Oregon', abbreviation: 'OR' },
  { id: 'pa', name: 'Pennsylvania', abbreviation: 'PA' },
  { id: 'ri', name: 'Rhode Island', abbreviation: 'RI' },
  { id: 'sc', name: 'South Carolina', abbreviation: 'SC' },
  { id: 'sd', name: 'South Dakota', abbreviation: 'SD' },
  { id: 'tn', name: 'Tennessee', abbreviation: 'TN' },
  { id: 'tx', name: 'Texas', abbreviation: 'TX' },
  { id: 'ut', name: 'Utah', abbreviation: 'UT' },
  { id: 'vt', name: 'Vermont', abbreviation: 'VT' },
  { id: 'va', name: 'Virginia', abbreviation: 'VA' },
  { id: 'wa', name: 'Washington', abbreviation: 'WA' },
  { id: 'wv', name: 'West Virginia', abbreviation: 'WV' },
  { id: 'wi', name: 'Wisconsin', abbreviation: 'WI' },
  { id: 'wy', name: 'Wyoming', abbreviation: 'WY' },
];

// ============================================
// UTILITIES (organized by state)
// ============================================

export const utilities: Utility[] = [
  // Alabama
  { id: 'alabama-power', name: 'Alabama Power', stateId: 'al' },

  // Alaska
  { id: 'alaska-electric', name: 'Alaska Electric Light & Power', stateId: 'ak' },
  { id: 'chugach-electric', name: 'Chugach Electric Association', stateId: 'ak' },

  // Arizona
  { id: 'aps', name: 'Arizona Public Service (APS)', stateId: 'az' },
  { id: 'tucson-electric', name: 'Tucson Electric Power', stateId: 'az' },
  { id: 'uns-electric', name: 'UNS Electric', stateId: 'az' },

  // Arkansas
  { id: 'entergy-arkansas', name: 'Entergy Arkansas', stateId: 'ar' },
  { id: 'empire-arkansas', name: 'Empire District Electric', stateId: 'ar' },
  { id: 'oge-arkansas', name: 'Oklahoma Gas & Electric', stateId: 'ar' },

  // California
  { id: 'pge', name: 'Pacific Gas & Electric (PG&E)', stateId: 'ca' },
  { id: 'sce', name: 'Southern California Edison', stateId: 'ca' },
  { id: 'sdge', name: 'San Diego Gas & Electric', stateId: 'ca' },
  { id: 'pacificorp-ca', name: 'PacifiCorp', stateId: 'ca' },
  { id: 'liberty-ca', name: 'Liberty Utilities', stateId: 'ca' },

  // Colorado
  { id: 'xcel-co', name: 'Xcel Energy (Public Service Co. of Colorado)', stateId: 'co' },
  { id: 'black-hills-co', name: 'Black Hills Energy', stateId: 'co' },

  // Connecticut
  { id: 'eversource-ct', name: 'Eversource Energy', stateId: 'ct' },
  { id: 'united-illuminating', name: 'United Illuminating', stateId: 'ct' },

  // Delaware
  { id: 'delmarva-de', name: 'Delmarva Power', stateId: 'de' },

  // Florida
  { id: 'fpl', name: 'Florida Power & Light', stateId: 'fl' },
  { id: 'duke-fl', name: 'Duke Energy Florida', stateId: 'fl' },
  { id: 'teco', name: 'Tampa Electric (TECO)', stateId: 'fl' },
  { id: 'fpu', name: 'Florida Public Utilities', stateId: 'fl' },
  { id: 'gulf-power', name: 'Gulf Power', stateId: 'fl' },

  // Georgia
  { id: 'georgia-power', name: 'Georgia Power', stateId: 'ga' },

  // Hawaii
  { id: 'heco', name: 'Hawaiian Electric Company (HECO)', stateId: 'hi' },
  { id: 'helco', name: 'Hawaii Electric Light (HELCO)', stateId: 'hi' },
  { id: 'meco', name: 'Maui Electric Company (MECO)', stateId: 'hi' },

  // Idaho
  { id: 'idaho-power', name: 'Idaho Power', stateId: 'id' },
  { id: 'avista-id', name: 'Avista Utilities', stateId: 'id' },
  { id: 'pacificorp-id', name: 'PacifiCorp (Rocky Mountain Power)', stateId: 'id' },

  // Illinois
  { id: 'comed', name: 'Commonwealth Edison (ComEd)', stateId: 'il' },
  { id: 'ameren-il', name: 'Ameren Illinois', stateId: 'il' },

  // Indiana
  { id: 'duke-in', name: 'Duke Energy Indiana', stateId: 'in' },
  { id: 'aep-in', name: 'Indiana Michigan Power (AEP)', stateId: 'in' },
  { id: 'nipsco', name: 'NIPSCO', stateId: 'in' },
  { id: 'centerpoint-in', name: 'CenterPoint Energy Indiana South', stateId: 'in' },
  { id: 'ipl', name: 'Indianapolis Power & Light', stateId: 'in' },

  // Iowa
  { id: 'midamerican-ia', name: 'MidAmerican Energy', stateId: 'ia' },
  { id: 'alliant-ia', name: 'Alliant Energy (Interstate Power & Light)', stateId: 'ia' },
  { id: 'black-hills-ia', name: 'Black Hills Energy', stateId: 'ia' },

  // Kansas
  { id: 'evergy-westar', name: 'Evergy (Westar Energy)', stateId: 'ks' },
  { id: 'evergy-kcpl-ks', name: 'Evergy (Kansas City Power & Light)', stateId: 'ks' },
  { id: 'empire-ks', name: 'Empire District Electric', stateId: 'ks' },

  // Kentucky
  { id: 'kentucky-utilities', name: 'Kentucky Utilities', stateId: 'ky' },
  { id: 'lge', name: 'Louisville Gas & Electric', stateId: 'ky' },
  { id: 'duke-ky', name: 'Duke Energy Kentucky', stateId: 'ky' },
  { id: 'kentucky-power', name: 'Kentucky Power (AEP)', stateId: 'ky' },

  // Louisiana
  { id: 'entergy-la', name: 'Entergy Louisiana', stateId: 'la' },
  { id: 'entergy-nola', name: 'Entergy New Orleans', stateId: 'la' },
  { id: 'swepco-la', name: 'SWEPCO', stateId: 'la' },
  { id: 'cleco', name: 'Cleco Power', stateId: 'la' },

  // Maine
  { id: 'versant', name: 'Versant Power', stateId: 'me' },
  { id: 'cmp', name: 'Central Maine Power', stateId: 'me' },

  // Maryland
  { id: 'bge', name: 'Baltimore Gas & Electric (BGE)', stateId: 'md' },
  { id: 'potomac-edison-md', name: 'Potomac Edison (FirstEnergy)', stateId: 'md' },
  { id: 'pepco-md', name: 'Pepco', stateId: 'md' },
  { id: 'delmarva-md', name: 'Delmarva Power', stateId: 'md' },

  // Massachusetts
  { id: 'eversource-ma', name: 'Eversource Energy', stateId: 'ma' },
  { id: 'national-grid-ma', name: 'National Grid', stateId: 'ma' },
  { id: 'unitil-ma', name: 'Unitil', stateId: 'ma' },

  // Michigan
  { id: 'dte', name: 'DTE Energy', stateId: 'mi' },
  { id: 'consumers-energy', name: 'Consumers Energy', stateId: 'mi' },
  { id: 'aep-mi', name: 'Indiana Michigan Power (AEP)', stateId: 'mi' },
  { id: 'uppco', name: 'Upper Peninsula Power Company', stateId: 'mi' },

  // Minnesota
  { id: 'xcel-mn', name: 'Xcel Energy (Northern States Power)', stateId: 'mn' },
  { id: 'minnesota-power', name: 'Minnesota Power (ALLETE)', stateId: 'mn' },
  { id: 'otter-tail-mn', name: 'Otter Tail Power', stateId: 'mn' },

  // Mississippi
  { id: 'entergy-ms', name: 'Entergy Mississippi', stateId: 'ms' },
  { id: 'mississippi-power', name: 'Mississippi Power', stateId: 'ms' },

  // Missouri
  { id: 'ameren-mo', name: 'Ameren Missouri', stateId: 'mo' },
  { id: 'evergy-mo', name: 'Evergy Metro (Kansas City)', stateId: 'mo' },
  { id: 'empire-mo', name: 'Empire District Electric', stateId: 'mo' },

  // Montana
  { id: 'northwestern-mt', name: 'NorthWestern Energy', stateId: 'mt' },
  { id: 'mdu-mt', name: 'Montana-Dakota Utilities', stateId: 'mt' },

  // Nebraska
  { id: 'public-power-ne', name: 'Public Power (No major IOUs)', stateId: 'ne' },

  // Nevada
  { id: 'nv-energy', name: 'NV Energy', stateId: 'nv' },

  // New Hampshire
  { id: 'eversource-nh', name: 'Eversource Energy', stateId: 'nh' },
  { id: 'unitil-nh', name: 'Unitil', stateId: 'nh' },
  { id: 'liberty-nh', name: 'Liberty Utilities', stateId: 'nh' },

  // New Jersey
  { id: 'pseg', name: 'PSE&G', stateId: 'nj' },
  { id: 'jcpl', name: 'Jersey Central Power & Light (FirstEnergy)', stateId: 'nj' },
  { id: 'ace', name: 'Atlantic City Electric', stateId: 'nj' },
  { id: 'rockland-nj', name: 'Rockland Electric', stateId: 'nj' },

  // New Mexico
  { id: 'pnm', name: 'Public Service Company of New Mexico (PNM)', stateId: 'nm' },
  { id: 'xcel-nm', name: 'Xcel Energy (Southwestern Public Service)', stateId: 'nm' },
  { id: 'el-paso-electric', name: 'El Paso Electric', stateId: 'nm' },

  // New York
  { id: 'coned', name: 'Con Edison', stateId: 'ny' },
  { id: 'national-grid', name: 'National Grid', stateId: 'ny' },
  { id: 'nyseg', name: 'NYSEG (Avangrid)', stateId: 'ny' },
  { id: 'rge', name: 'Rochester Gas & Electric (Avangrid)', stateId: 'ny' },
  { id: 'central-hudson', name: 'Central Hudson', stateId: 'ny' },
  { id: 'orange-rockland', name: 'Orange & Rockland', stateId: 'ny' },
  { id: 'pseg-li', name: 'PSEG Long Island', stateId: 'ny' },

  // North Carolina
  { id: 'duke-carolinas-nc', name: 'Duke Energy Carolinas', stateId: 'nc' },
  { id: 'duke-progress-nc', name: 'Duke Energy Progress', stateId: 'nc' },
  { id: 'dominion-nc', name: 'Dominion Energy North Carolina', stateId: 'nc' },

  // North Dakota
  { id: 'xcel-nd', name: 'Xcel Energy', stateId: 'nd' },
  { id: 'mdu-nd', name: 'Montana-Dakota Utilities', stateId: 'nd' },
  { id: 'otter-tail-nd', name: 'Otter Tail Power', stateId: 'nd' },

  // Ohio
  { id: 'aep-ohio', name: 'AEP Ohio', stateId: 'oh' },
  { id: 'duke-oh', name: 'Duke Energy Ohio', stateId: 'oh' },
  { id: 'firstenergy-oh', name: 'FirstEnergy (Ohio Edison, Cleveland Electric, Toledo Edison)', stateId: 'oh' },
  { id: 'aes-ohio', name: 'AES Ohio (Dayton Power & Light)', stateId: 'oh' },

  // Oklahoma
  { id: 'oge', name: 'Oklahoma Gas & Electric (OG&E)', stateId: 'ok' },
  { id: 'pso', name: 'Public Service Company of Oklahoma (AEP)', stateId: 'ok' },
  { id: 'empire-ok', name: 'Empire District Electric', stateId: 'ok' },

  // Oregon
  { id: 'pge-or', name: 'Portland General Electric', stateId: 'or' },
  { id: 'pacificorp-or', name: 'PacifiCorp', stateId: 'or' },
  { id: 'idaho-power-or', name: 'Idaho Power', stateId: 'or' },
  { id: 'avista-or', name: 'Avista Utilities', stateId: 'or' },

  // Pennsylvania
  { id: 'peco', name: 'PECO Energy', stateId: 'pa' },
  { id: 'ppl', name: 'PPL Electric', stateId: 'pa' },
  { id: 'duquesne', name: 'Duquesne Light', stateId: 'pa' },
  { id: 'firstenergy-pa', name: 'FirstEnergy (Met-Ed, Penelec, Penn Power, West Penn Power)', stateId: 'pa' },

  // Rhode Island
  { id: 'ri-energy', name: 'Rhode Island Energy (PPL)', stateId: 'ri' },

  // South Carolina
  { id: 'duke-carolinas-sc', name: 'Duke Energy Carolinas', stateId: 'sc' },
  { id: 'duke-progress-sc', name: 'Duke Energy Progress', stateId: 'sc' },
  { id: 'dominion-sc', name: 'Dominion Energy South Carolina', stateId: 'sc' },

  // South Dakota
  { id: 'xcel-sd', name: 'Xcel Energy', stateId: 'sd' },
  { id: 'mdu-sd', name: 'Montana-Dakota Utilities', stateId: 'sd' },
  { id: 'black-hills-sd', name: 'Black Hills Energy', stateId: 'sd' },
  { id: 'otter-tail-sd', name: 'Otter Tail Power', stateId: 'sd' },

  // Tennessee
  { id: 'kingsport-power', name: 'Kingsport Power (AEP)', stateId: 'tn' },

  // Texas
  { id: 'oncor', name: 'Oncor', stateId: 'tx' },
  { id: 'centerpoint-tx', name: 'CenterPoint Energy', stateId: 'tx' },
  { id: 'aep-tx', name: 'AEP Texas', stateId: 'tx' },
  { id: 'tnmp', name: 'Texas-New Mexico Power', stateId: 'tx' },
  { id: 'entergy-tx', name: 'Entergy Texas', stateId: 'tx' },
  { id: 'swepco-tx', name: 'Southwestern Electric Power (SWEPCO)', stateId: 'tx' },

  // Utah
  { id: 'pacificorp-ut', name: 'PacifiCorp (Rocky Mountain Power)', stateId: 'ut' },

  // Vermont
  { id: 'gmp', name: 'Green Mountain Power', stateId: 'vt' },
  { id: 'velco', name: 'Vermont Electric Power Company', stateId: 'vt' },

  // Virginia
  { id: 'dominion-va', name: 'Dominion Energy Virginia', stateId: 'va' },
  { id: 'appalachian-va', name: 'Appalachian Power (AEP)', stateId: 'va' },

  // Washington
  { id: 'pse', name: 'Puget Sound Energy', stateId: 'wa' },
  { id: 'avista-wa', name: 'Avista Utilities', stateId: 'wa' },
  { id: 'pacificorp-wa', name: 'PacifiCorp', stateId: 'wa' },

  // West Virginia
  { id: 'appalachian-wv', name: 'Appalachian Power (AEP)', stateId: 'wv' },
  { id: 'wheeling-power', name: 'Wheeling Power', stateId: 'wv' },
  { id: 'mon-power', name: 'Mon Power (FirstEnergy)', stateId: 'wv' },
  { id: 'potomac-edison-wv', name: 'Potomac Edison', stateId: 'wv' },

  // Wisconsin
  { id: 'we-energies', name: 'We Energies', stateId: 'wi' },
  { id: 'wps', name: 'Wisconsin Public Service', stateId: 'wi' },
  { id: 'alliant-wi', name: 'Alliant Energy (Wisconsin Power & Light)', stateId: 'wi' },
  { id: 'mge', name: 'Madison Gas & Electric', stateId: 'wi' },
  { id: 'xcel-wi', name: 'Xcel Energy', stateId: 'wi' },

  // Wyoming
  { id: 'pacificorp-wy', name: 'PacifiCorp (Rocky Mountain Power)', stateId: 'wy' },
  { id: 'black-hills-wy', name: 'Black Hills Energy', stateId: 'wy' },
  { id: 'cheyenne-light', name: 'Cheyenne Light, Fuel & Power', stateId: 'wy' },
];

// ============================================
// SCOPE OF WORK TEMPLATES (independent of utility)
// ============================================

export const scopeTemplates: ScopeOfWorkTemplate[] = [
  {
    id: '10-banger-new-service',
    name: '10 Banger New Service',
    description: '10 port Level 2 installation with new 400A service',
    evseItems: [
      { productId: 'csev-ac-dp-48a', quantity: 5, notes: 'Dual port 48A' },
    ],
    installationItems: [
      { serviceId: 'service-400a-208v', quantity: 1 },
      { serviceId: 'breaker-60a-2p', quantity: 10 },
      { serviceId: 'conduit-60a-pvc-2in', quantity: 300 },
      { serviceId: 'conduit-fittings', quantity: 5 },
      { serviceId: 'wire-60a', quantity: 1800 },
      { serviceId: 'mount-station-l2', quantity: 5 },
      { serviceId: 'terminate-station', quantity: 5 },
      { serviceId: 'activation', quantity: 5 },
      { serviceId: 'trenching-grass', quantity: 100 },
      { serviceId: 'trenching-asphalt', quantity: 100 },
      { serviceId: 'concrete-l2-footing', quantity: 5 },
      { serviceId: 'bollard-bolt-on', quantity: 10 },
      { serviceId: 'permit-fee', quantity: 1 },
      { serviceId: 'design-fee', quantity: 1 },
      { serviceId: 'project-management', quantity: 1 },
      { serviceId: 'engineering-site', quantity: 1 },
    ],
  },
  {
    id: '8-banger-new-service',
    name: '8 Banger New Service',
    description: '8 port Level 2 installation with new 400A service',
    evseItems: [
      { productId: 'csev-ac-dp-48a', quantity: 4, notes: 'Dual port 48A' },
    ],
    installationItems: [
      { serviceId: 'service-400a-208v', quantity: 1 },
      { serviceId: 'breaker-60a-2p', quantity: 8 },
      { serviceId: 'conduit-60a-pvc-2in', quantity: 250 },
      { serviceId: 'conduit-fittings', quantity: 4 },
      { serviceId: 'wire-60a', quantity: 1500 },
      { serviceId: 'mount-station-l2', quantity: 4 },
      { serviceId: 'terminate-station', quantity: 4 },
      { serviceId: 'activation', quantity: 4 },
      { serviceId: 'trenching-grass', quantity: 75 },
      { serviceId: 'trenching-asphalt', quantity: 75 },
      { serviceId: 'concrete-l2-footing', quantity: 4 },
      { serviceId: 'bollard-bolt-on', quantity: 8 },
      { serviceId: 'permit-fee', quantity: 1 },
      { serviceId: 'design-fee', quantity: 1 },
      { serviceId: 'project-management', quantity: 1 },
      { serviceId: 'engineering-site', quantity: 1 },
    ],
  },
  {
    id: '4-banger-new-service',
    name: '4 Banger New Service',
    description: '4 port Level 2 installation with new 200A service',
    evseItems: [
      { productId: 'csev-ac-dp-48a', quantity: 2, notes: 'Dual port 48A' },
    ],
    installationItems: [
      { serviceId: 'service-200a-208v', quantity: 1 },
      { serviceId: 'breaker-60a-2p', quantity: 4 },
      { serviceId: 'conduit-60a-pvc-2in', quantity: 200 },
      { serviceId: 'conduit-fittings', quantity: 2 },
      { serviceId: 'wire-60a', quantity: 1200 },
      { serviceId: 'mount-station-l2', quantity: 2 },
      { serviceId: 'terminate-station', quantity: 2 },
      { serviceId: 'activation', quantity: 2 },
      { serviceId: 'trenching-grass', quantity: 50 },
      { serviceId: 'trenching-asphalt', quantity: 50 },
      { serviceId: 'concrete-l2-footing', quantity: 2 },
      { serviceId: 'bollard-bolt-on', quantity: 4 },
      { serviceId: 'permit-fee', quantity: 1 },
      { serviceId: 'design-fee', quantity: 1 },
      { serviceId: 'project-management', quantity: 1 },
      { serviceId: 'engineering-site', quantity: 1 },
    ],
  },
  {
    id: '4-banger-existing-service',
    name: '4 Banger Existing Service',
    description: '4 port Level 2 installation with existing service',
    evseItems: [
      { productId: 'csev-ac-dp-48a', quantity: 2, notes: 'Dual port 48A' },
    ],
    installationItems: [
      { serviceId: 'panel-200a', quantity: 1 },
      { serviceId: 'breaker-60a-2p', quantity: 4 },
      { serviceId: 'conduit-60a-pvc-2in', quantity: 150 },
      { serviceId: 'conduit-fittings', quantity: 2 },
      { serviceId: 'wire-60a', quantity: 900 },
      { serviceId: 'mount-station-l2', quantity: 2 },
      { serviceId: 'terminate-station', quantity: 2 },
      { serviceId: 'activation', quantity: 2 },
      { serviceId: 'trenching-grass', quantity: 50 },
      { serviceId: 'trenching-asphalt', quantity: 50 },
      { serviceId: 'concrete-l2-footing', quantity: 2 },
      { serviceId: 'bollard-bolt-on', quantity: 4 },
      { serviceId: 'permit-fee', quantity: 1 },
      { serviceId: 'design-fee', quantity: 1 },
      { serviceId: 'project-management', quantity: 1 },
      { serviceId: 'engineering-site', quantity: 1 },
    ],
  },
  {
    id: '6-banger-existing-service',
    name: '6 Banger Existing Service',
    description: '6 port Level 2 installation with existing service',
    evseItems: [
      { productId: 'csev-ac-dp-48a', quantity: 3, notes: 'Dual port 48A' },
    ],
    installationItems: [
      { serviceId: 'panel-200a', quantity: 1 },
      { serviceId: 'breaker-60a-2p', quantity: 6 },
      { serviceId: 'conduit-60a-pvc-2in', quantity: 200 },
      { serviceId: 'conduit-fittings', quantity: 3 },
      { serviceId: 'wire-60a', quantity: 1200 },
      { serviceId: 'mount-station-l2', quantity: 3 },
      { serviceId: 'terminate-station', quantity: 3 },
      { serviceId: 'activation', quantity: 3 },
      { serviceId: 'trenching-grass', quantity: 50 },
      { serviceId: 'trenching-asphalt', quantity: 50 },
      { serviceId: 'concrete-l2-footing', quantity: 3 },
      { serviceId: 'bollard-bolt-on', quantity: 6 },
      { serviceId: 'permit-fee', quantity: 1 },
      { serviceId: 'design-fee', quantity: 1 },
      { serviceId: 'project-management', quantity: 1 },
      { serviceId: 'engineering-site', quantity: 1 },
    ],
  },
  {
    id: '8-banger-320kw',
    name: '8 Banger 320kW',
    description: '8 port DCFC installation with 320kW chargers (2x Set of 4)',
    evseItems: [
      { productId: 'csev-dchp-640-set4-ccs-nacs', quantity: 2, notes: 'Set of 4 - 640kW (4 ports each)' },
    ],
    installationItems: [
      { serviceId: 'service-2000a-480v', quantity: 1 },
      { serviceId: 'breaker-400a-3p', quantity: 8 },
      { serviceId: 'conduit-pvc-4in', quantity: 500 },
      { serviceId: 'conduit-fittings', quantity: 8 },
      { serviceId: 'wire-400a', quantity: 2000 },
      { serviceId: 'mount-station-l3', quantity: 3 },
      { serviceId: 'terminate-station', quantity: 3 },
      { serviceId: 'activation', quantity: 3 },
      { serviceId: 'trenching-grass', quantity: 150 },
      { serviceId: 'trenching-asphalt', quantity: 50 },
      { serviceId: 'concrete-dcfc-footing', quantity: 3 },
      { serviceId: 'transformer-pad', quantity: 1 },
      { serviceId: 'bollard-4in-steel', quantity: 6 },
      { serviceId: 'bollard-6in-steel', quantity: 10 },
      { serviceId: 'permit-fee', quantity: 1 },
      { serviceId: 'design-fee', quantity: 1 },
      { serviceId: 'project-management', quantity: 1 },
      { serviceId: 'engineering-site', quantity: 1 },
      { serviceId: 'ada-striping', quantity: 1 },
      { serviceId: 'striping-spot', quantity: 8 },
      { serviceId: 'ev-stencil', quantity: 8 },
    ],
  },
  {
    id: '4-banger-320kw',
    name: '4 Banger 320kW',
    description: '4 port DCFC installation with 320kW charger (1x Set of 4)',
    evseItems: [
      { productId: 'csev-dchp-640-set4-ccs-nacs', quantity: 1, notes: 'Set of 4 - 640kW (4 ports)' },
    ],
    installationItems: [
      { serviceId: 'service-1200a-480v', quantity: 1 },
      { serviceId: 'breaker-400a-3p', quantity: 4 },
      { serviceId: 'conduit-pvc-4in', quantity: 300 },
      { serviceId: 'conduit-fittings', quantity: 4 },
      { serviceId: 'wire-400a', quantity: 1200 },
      { serviceId: 'mount-station-l3', quantity: 2 },
      { serviceId: 'terminate-station', quantity: 2 },
      { serviceId: 'activation', quantity: 2 },
      { serviceId: 'trenching-grass', quantity: 150 },
      { serviceId: 'trenching-asphalt', quantity: 50 },
      { serviceId: 'concrete-dcfc-footing', quantity: 2 },
      { serviceId: 'transformer-pad', quantity: 1 },
      { serviceId: 'bollard-4in-steel', quantity: 4 },
      { serviceId: 'bollard-6in-steel', quantity: 10 },
      { serviceId: 'permit-fee', quantity: 1 },
      { serviceId: 'design-fee', quantity: 1 },
      { serviceId: 'project-management', quantity: 1 },
      { serviceId: 'engineering-site', quantity: 1 },
      { serviceId: 'ada-striping', quantity: 1 },
      { serviceId: 'striping-spot', quantity: 4 },
      { serviceId: 'ev-stencil', quantity: 4 },
    ],
  },
  {
    id: 'nj-20-l2-station-sh',
    name: 'NJ (20) L2 Station SH',
    description: '20 port Level 2 Site Host installation in NJ',
    evseItems: [
      { productId: 'csev-ac-sp-48a-pedestal', quantity: 20, notes: 'MaxiCharger ACUltra Single Port 48A Pedestal' },
    ],
    installationItems: [
      { serviceId: 'service-200a-208v', quantity: 5 },
      { serviceId: 'breaker-60a-2p', quantity: 20 },
      { serviceId: 'conduit-60a-pvc-2in', quantity: 1000 },
      { serviceId: 'conduit-fittings', quantity: 20 },
      { serviceId: 'wire-60a', quantity: 3000 },
      { serviceId: 'mount-station-l2', quantity: 20 },
      { serviceId: 'terminate-station', quantity: 20 },
      { serviceId: 'activation', quantity: 20 },
      { serviceId: 'trenching-grass', quantity: 500 },
      { serviceId: 'trenching-asphalt', quantity: 100 },
      { serviceId: 'concrete-l2-footing', quantity: 20 },
      { serviceId: 'bollard-bolt-on', quantity: 40 },
      { serviceId: 'permit-fee', quantity: 1 },
      { serviceId: 'design-fee', quantity: 1 },
      { serviceId: 'project-management', quantity: 1 },
      { serviceId: 'engineering-site', quantity: 1 },
    ],
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getAllStates(): State[] {
  return states;
}

export function getStateById(id: string): State | undefined {
  return states.find(s => s.id === id);
}

export function getAllUtilities(): Utility[] {
  return utilities;
}

export function getUtilitiesByState(stateId: string): Utility[] {
  return utilities.filter(u => u.stateId === stateId);
}

export function getUtilityById(id: string): Utility | undefined {
  return utilities.find(u => u.id === id);
}

export function getAllScopeTemplates(): ScopeOfWorkTemplate[] {
  return scopeTemplates;
}

export function getScopeTemplateById(id: string): ScopeOfWorkTemplate | undefined {
  return scopeTemplates.find(s => s.id === id);
}
