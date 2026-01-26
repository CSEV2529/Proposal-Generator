import { PricebookProduct, InstallationService } from './types';

export const pricebookProducts: PricebookProduct[] = [
  // Level 2 Chargers
  {
    id: 'csev-48a-dual',
    name: 'CSEV-48A Dual Port Pedestal',
    description: 'Commercial dual-port Level 2 EV charger, 48A per port',
    unitPrice: 5500,
    category: 'charger',
    projectType: 'level2',
  },
  {
    id: 'csev-48a-single',
    name: 'CSEV-48A Single Port Pedestal',
    description: 'Commercial single-port Level 2 EV charger, 48A',
    unitPrice: 3500,
    category: 'charger',
    projectType: 'level2',
  },
  {
    id: 'csev-32a-dual',
    name: 'CSEV-32A Dual Port Wall Mount',
    description: 'Wall-mounted dual-port Level 2 EV charger, 32A per port',
    unitPrice: 3200,
    category: 'charger',
    projectType: 'level2',
  },
  {
    id: 'csev-32a-single',
    name: 'CSEV-32A Single Port Wall Mount',
    description: 'Wall-mounted single-port Level 2 EV charger, 32A',
    unitPrice: 1800,
    category: 'charger',
    projectType: 'level2',
  },
  // DC Fast Chargers
  {
    id: 'csev-dcfc-60',
    name: 'CSEV DCFC 60kW',
    description: 'DC Fast Charger, 60kW output',
    unitPrice: 35000,
    category: 'charger',
    projectType: 'dcfc',
  },
  {
    id: 'csev-dcfc-120',
    name: 'CSEV DCFC 120kW',
    description: 'DC Fast Charger, 120kW output',
    unitPrice: 55000,
    category: 'charger',
    projectType: 'dcfc',
  },
  {
    id: 'csev-dcfc-180',
    name: 'CSEV DCFC 180kW',
    description: 'DC Fast Charger, 180kW output',
    unitPrice: 75000,
    category: 'charger',
    projectType: 'dcfc',
  },
  // Accessories
  {
    id: 'ev-sign-standard',
    name: 'EV Parking Sign - Standard',
    description: 'Standard EV parking signage',
    unitPrice: 75,
    category: 'accessory',
    projectType: 'both',
  },
  {
    id: 'ev-sign-ada',
    name: 'EV Parking Sign - ADA Compliant',
    description: 'ADA compliant EV parking signage with accessibility features',
    unitPrice: 125,
    category: 'accessory',
    projectType: 'both',
  },
  {
    id: 'cable-management',
    name: 'Cable Management System',
    description: 'Retractable cable management for neat cable storage',
    unitPrice: 350,
    category: 'accessory',
    projectType: 'both',
  },
];

export const installationServices: InstallationService[] = [
  // Material Items
  {
    id: 'service-panel',
    name: 'New Service Panel',
    description: '200A electrical service panel installation',
    unitPrice: 3500,
    category: 'material',
    unit: 'each',
  },
  {
    id: 'breaker-60a',
    name: '60A Circuit Breaker',
    description: '60A circuit breaker for Level 2 charger',
    unitPrice: 150,
    category: 'material',
    unit: 'each',
  },
  {
    id: 'breaker-100a',
    name: '100A Circuit Breaker',
    description: '100A circuit breaker for DCFC',
    unitPrice: 350,
    category: 'material',
    unit: 'each',
  },
  {
    id: 'conduit-2in',
    name: '2" Conduit',
    description: '2" electrical conduit',
    unitPrice: 25,
    category: 'material',
    unit: 'ft',
  },
  {
    id: 'conduit-3in',
    name: '3" Conduit',
    description: '3" electrical conduit for DCFC',
    unitPrice: 45,
    category: 'material',
    unit: 'ft',
  },
  {
    id: 'wire-6awg',
    name: '#6 AWG Wire',
    description: '#6 AWG copper wire for Level 2',
    unitPrice: 8,
    category: 'material',
    unit: 'ft',
  },
  {
    id: 'wire-2awg',
    name: '#2 AWG Wire',
    description: '#2 AWG copper wire for higher amperage',
    unitPrice: 15,
    category: 'material',
    unit: 'ft',
  },
  {
    id: 'concrete-footer',
    name: 'Concrete Footer/Pad',
    description: 'Concrete foundation for pedestal charger',
    unitPrice: 1200,
    category: 'material',
    unit: 'each',
  },
  {
    id: 'bollard',
    name: 'Protective Bollard',
    description: 'Steel bollard for charger protection',
    unitPrice: 450,
    category: 'material',
    unit: 'each',
  },
  // Labor Items
  {
    id: 'trenching',
    name: 'Trenching',
    description: 'Underground trenching for conduit',
    unitPrice: 85,
    category: 'labor',
    unit: 'ft',
  },
  {
    id: 'boring',
    name: 'Directional Boring',
    description: 'Directional boring under pavement',
    unitPrice: 150,
    category: 'labor',
    unit: 'ft',
  },
  {
    id: 'mount-terminate',
    name: 'Mount, Terminate & Activate',
    description: 'Charger mounting, wiring termination, and network activation',
    unitPrice: 1500,
    category: 'labor',
    unit: 'each',
  },
  {
    id: 'permits',
    name: 'Permits & Inspections',
    description: 'Electrical permits and inspection coordination',
    unitPrice: 1500,
    category: 'labor',
    unit: 'project',
  },
  {
    id: 'project-management',
    name: 'Project Management',
    description: 'Project coordination and management',
    unitPrice: 2500,
    category: 'labor',
    unit: 'project',
  },
  {
    id: 'utility-coordination',
    name: 'Utility Coordination',
    description: 'Coordination with local utility for service upgrades',
    unitPrice: 1000,
    category: 'labor',
    unit: 'project',
  },
  {
    id: 'concrete-repair',
    name: 'Concrete/Asphalt Repair',
    description: 'Surface restoration after trenching',
    unitPrice: 75,
    category: 'labor',
    unit: 'sq ft',
  },
];

export function getProductById(id: string): PricebookProduct | undefined {
  return pricebookProducts.find(p => p.id === id);
}

export function getInstallationServiceById(id: string): InstallationService | undefined {
  return installationServices.find(s => s.id === id);
}

export function getProductsByProjectType(projectType: 'level2' | 'dcfc'): PricebookProduct[] {
  return pricebookProducts.filter(
    p => p.projectType === projectType || p.projectType === 'both'
  );
}
