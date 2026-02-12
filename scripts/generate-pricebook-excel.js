/**
 * Generate PriceBook Excel from current hardcoded pricebook.ts data.
 * Run: node scripts/generate-pricebook-excel.js
 * Output: data/CSEV-PriceBook.xlsx
 */
const ExcelJS = require('exceljs');
const path = require('path');

async function generate() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'ChargeSmart EV';
  workbook.created = new Date();

  // ─── Sheet 1: EVSE Products ───
  const evseSheet = workbook.addWorksheet('EVSE Products', {
    properties: { tabColor: { argb: '4CBC88' } },
  });

  evseSheet.columns = [
    { header: 'ID', key: 'id', width: 30 },
    { header: 'Name', key: 'name', width: 60 },
    { header: 'Description', key: 'description', width: 70 },
    { header: 'Manufacturer', key: 'manufacturer', width: 15 },
    { header: 'Unit Price ($)', key: 'unitPrice', width: 15 },
    { header: 'CSEV Cost ($)', key: 'csevCost', width: 15 },
    { header: 'Annual Network Plan ($)', key: 'annualNetworkPlan', width: 22 },
    { header: 'Network Plan 1yr ($)', key: 'networkPlan1Year', width: 20 },
    { header: 'Network Plan 3yr ($)', key: 'networkPlan3Year', width: 20 },
    { header: 'Network Plan 5yr ($)', key: 'networkPlan5Year', width: 20 },
    { header: 'Network Cost 1yr ($)', key: 'networkCost1Year', width: 20 },
    { header: 'Network Cost 3yr ($)', key: 'networkCost3Year', width: 20 },
    { header: 'Network Cost 5yr ($)', key: 'networkCost5Year', width: 20 },
    { header: 'Shipping ($)', key: 'shippingCost', width: 15 },
    { header: 'Number of Plugs', key: 'numberOfPlugs', width: 17 },
    { header: 'Category', key: 'category', width: 15 },
    { header: 'Charging Level', key: 'chargingLevel', width: 15 },
    { header: 'Warranty: 5-Yr Parts ONLY ($)', key: 'warranty5YrParts', width: 24 },
    { header: 'Warranty: 3-Yr FULL P&L ($)', key: 'warranty3YrFull', width: 24 },
    { header: 'Warranty: 5-Yr FULL P&L ($)', key: 'warranty5YrFull', width: 24 },
    { header: 'Warranty: 10-Yr FULL P&L ($)', key: 'warranty10YrFull', width: 24 },
  ];

  // Style header row
  const evseHeaderRow = evseSheet.getRow(1);
  evseHeaderRow.font = { bold: true, color: { argb: 'FFFFFF' } };
  evseHeaderRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2D2D2D' } };
  evseHeaderRow.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  evseHeaderRow.height = 30;

  // EVSE data
  const evseProducts = [
    { id: 'csev-ac-dp-48a', name: 'MaxiCharger ACUltra - CSEV-AC-DP - 48A Output - Dual Port Pedestal with CMS', description: 'MaxiCharger ACUltra - CSEV-AC-DP - 48A Output - Dual Port Pedestal with CMS. Includes 3 Years of Parts Only Warranty', manufacturer: 'Autel', unitPrice: 5323, csevCost: 2750, annualNetworkPlan: 500, networkPlan1Year: 500, networkPlan3Year: 1500, networkPlan5Year: 2500, networkCost1Year: 300, networkCost3Year: 900, networkCost5Year: 1500, shippingCost: 350, numberOfPlugs: 2, category: 'charger', chargingLevel: 'level2', warranty5YrParts: 0, warranty3YrFull: 0, warranty5YrFull: 0, warranty10YrFull: 0 },
    { id: 'csev-ac-sp-48a-pedestal', name: 'MaxiCharger ACUltra - CSEV-AC-SP - 48A Output - Single Port Pedestal with CMS', description: 'MaxiCharger ACUltra - CSEV-AC-SP - 48A Output - Single Port Pedestal with CMS. Includes 3 Years of Parts Only Warranty', manufacturer: 'Autel', unitPrice: 4423, csevCost: 1580, annualNetworkPlan: 250, networkPlan1Year: 250, networkPlan3Year: 750, networkPlan5Year: 1250, networkCost1Year: 150, networkCost3Year: 450, networkCost5Year: 750, shippingCost: 350, numberOfPlugs: 1, category: 'charger', chargingLevel: 'level2', warranty5YrParts: 0, warranty3YrFull: 0, warranty5YrFull: 0, warranty10YrFull: 0 },
    { id: 'csev-ac-sp-48a-wall', name: 'MaxiCharger ACUltra - CSEV-AC-SP - 48A Output - Single Port Wall Mount', description: 'MaxiCharger ACUltra - CSEV-AC-SP - 48A Output - Single Port Wall Mount. Includes 3 Years of Parts Only Warranty', manufacturer: 'Autel', unitPrice: 3173, csevCost: 900, annualNetworkPlan: 250, networkPlan1Year: 250, networkPlan3Year: 750, networkPlan5Year: 1250, networkCost1Year: 150, networkCost3Year: 450, networkCost5Year: 750, shippingCost: 350, numberOfPlugs: 1, category: 'charger', chargingLevel: 'level2', warranty5YrParts: 0, warranty3YrFull: 0, warranty5YrFull: 0, warranty10YrFull: 0 },
    { id: 'csev-ac-dp-40a', name: 'MaxiCharger ACUltra - CSEV-AC-DP - 40A Output - Dual Port Pedestal with CMS', description: 'MaxiCharger ACUltra - CSEV-AC-DP - 40A Output - Dual Port Pedestal with CMS. Includes 3 Years of Parts Only Warranty', manufacturer: 'Autel', unitPrice: 5323, csevCost: 2750, annualNetworkPlan: 500, networkPlan1Year: 500, networkPlan3Year: 1500, networkPlan5Year: 2500, networkCost1Year: 300, networkCost3Year: 900, networkCost5Year: 1500, shippingCost: 350, numberOfPlugs: 2, category: 'charger', chargingLevel: 'level2', warranty5YrParts: 0, warranty3YrFull: 0, warranty5YrFull: 0, warranty10YrFull: 0 },
    { id: 'csev-ac-sp-40a-pedestal', name: 'MaxiCharger ACUltra - CSEV-AC-SP - 40A Output - Single Port Pedestal with CMS', description: 'MaxiCharger ACUltra - CSEV-AC-SP - 40A Output - Single Port Pedestal with CMS. Includes 3 Years of Parts Only Warranty', manufacturer: 'Autel', unitPrice: 4423, csevCost: 1580, annualNetworkPlan: 250, networkPlan1Year: 250, networkPlan3Year: 750, networkPlan5Year: 1250, networkCost1Year: 150, networkCost3Year: 450, networkCost5Year: 750, shippingCost: 350, numberOfPlugs: 1, category: 'charger', chargingLevel: 'level2', warranty5YrParts: 0, warranty3YrFull: 0, warranty5YrFull: 0, warranty10YrFull: 0 },
    { id: 'csev-ac-sp-40a-wall', name: 'MaxiCharger ACUltra - CSEV-AC-SP - 40A Output - Single Port Wall Mount', description: 'MaxiCharger ACUltra - CSEV-AC-SP - 40A Output - Single Port Wall Mount. Includes 3 Years of Parts Only Warranty', manufacturer: 'Autel', unitPrice: 3173, csevCost: 900, annualNetworkPlan: 250, networkPlan1Year: 250, networkPlan3Year: 750, networkPlan5Year: 1250, networkCost1Year: 150, networkCost3Year: 450, networkCost5Year: 750, shippingCost: 350, numberOfPlugs: 1, category: 'charger', chargingLevel: 'level2', warranty5YrParts: 0, warranty3YrFull: 0, warranty5YrFull: 0, warranty10YrFull: 0 },
    { id: 'csev-ac-dp-80a', name: 'MaxiCharger ACUltra - CSEV-AC-DP - 80A Output - Dual Port Pedestal with CMS', description: 'MaxiCharger ACUltra - CSEV-AC-DP - 80A Output - Dual Port Pedestal with CMS. Includes 3 Years of Parts Only Warranty', manufacturer: 'Autel', unitPrice: 5323, csevCost: 2750, annualNetworkPlan: 500, networkPlan1Year: 500, networkPlan3Year: 1500, networkPlan5Year: 2500, networkCost1Year: 300, networkCost3Year: 900, networkCost5Year: 1500, shippingCost: 350, numberOfPlugs: 2, category: 'charger', chargingLevel: 'level2', warranty5YrParts: 0, warranty3YrFull: 0, warranty5YrFull: 0, warranty10YrFull: 0 },
    { id: 'csev-ac-sp-80a-pedestal', name: 'MaxiCharger ACUltra - CSEV-AC-SP - 80A Output - Single Port Pedestal with CMS', description: 'MaxiCharger ACUltra - CSEV-AC-SP - 80A Output - Single Port Pedestal with CMS. Includes 3 Years of Parts Only Warranty', manufacturer: 'Autel', unitPrice: 4423, csevCost: 1580, annualNetworkPlan: 250, networkPlan1Year: 250, networkPlan3Year: 750, networkPlan5Year: 1250, networkCost1Year: 150, networkCost3Year: 450, networkCost5Year: 750, shippingCost: 350, numberOfPlugs: 1, category: 'charger', chargingLevel: 'level2', warranty5YrParts: 0, warranty3YrFull: 0, warranty5YrFull: 0, warranty10YrFull: 0 },
    { id: 'csev-ac-sp-80a-wall', name: 'MaxiCharger ACUltra - CSEV-AC-SP - 80A Output - Single Port Wall Mount', description: 'MaxiCharger ACUltra - CSEV-AC-SP - 80A Output - Single Port Wall Mount. Includes 3 Years of Parts Only Warranty', manufacturer: 'Autel', unitPrice: 3173, csevCost: 900, annualNetworkPlan: 250, networkPlan1Year: 250, networkPlan3Year: 750, networkPlan5Year: 1250, networkCost1Year: 150, networkCost3Year: 450, networkCost5Year: 750, shippingCost: 350, numberOfPlugs: 1, category: 'charger', chargingLevel: 'level2', warranty5YrParts: 0, warranty3YrFull: 0, warranty5YrFull: 0, warranty10YrFull: 0 },
    { id: 'csev-ac-dp-32a', name: 'MaxiCharger ACUltra - CSEV-AC-DP - 32A Output - Dual Port Pedestal with CMS', description: 'MaxiCharger ACUltra - CSEV-AC-DP - 32A Output - Dual Port Pedestal with CMS. Includes 3 Years of Parts Only Warranty', manufacturer: 'Autel', unitPrice: 5323, csevCost: 2750, annualNetworkPlan: 500, networkPlan1Year: 500, networkPlan3Year: 1500, networkPlan5Year: 2500, networkCost1Year: 300, networkCost3Year: 900, networkCost5Year: 1500, shippingCost: 350, numberOfPlugs: 2, category: 'charger', chargingLevel: 'level2', warranty5YrParts: 0, warranty3YrFull: 0, warranty5YrFull: 0, warranty10YrFull: 0 },
    { id: 'csev-ac-sp-32a-pedestal', name: 'MaxiCharger ACUltra - CSEV-AC-SP - 32A Output - Single Port Pedestal with CMS', description: 'MaxiCharger ACUltra - CSEV-AC-SP - 32A Output - Single Port Pedestal with CMS. Includes 3 Years of Parts Only Warranty', manufacturer: 'Autel', unitPrice: 4423, csevCost: 1580, annualNetworkPlan: 250, networkPlan1Year: 250, networkPlan3Year: 750, networkPlan5Year: 1250, networkCost1Year: 150, networkCost3Year: 450, networkCost5Year: 750, shippingCost: 350, numberOfPlugs: 1, category: 'charger', chargingLevel: 'level2', warranty5YrParts: 0, warranty3YrFull: 0, warranty5YrFull: 0, warranty10YrFull: 0 },
    { id: 'csev-ac-sp-32a-wall', name: 'MaxiCharger ACUltra - CSEV-AC-SP - 32A Output - Single Port Wall Mount', description: 'MaxiCharger ACUltra - CSEV-AC-SP - 32A Output - Single Port Wall Mount. Includes 3 Years of Parts Only Warranty', manufacturer: 'Autel', unitPrice: 3173, csevCost: 900, annualNetworkPlan: 250, networkPlan1Year: 250, networkPlan3Year: 750, networkPlan5Year: 1250, networkCost1Year: 150, networkCost3Year: 450, networkCost5Year: 750, shippingCost: 350, numberOfPlugs: 1, category: 'charger', chargingLevel: 'level2', warranty5YrParts: 0, warranty3YrFull: 0, warranty5YrFull: 0, warranty10YrFull: 0 },
    { id: 'csev-acpro-sp-50a-wall', name: 'MaxiCharger ACPro - CSEV-AC-SP - 50A Output - Single Port Wall Mount', description: 'MaxiCharger ACPro - CSEV-AC-SP - 50A Output - Single Port Wall Mount. Includes 3 Years of Parts Only Warranty', manufacturer: 'Autel', unitPrice: 2500, csevCost: 750, annualNetworkPlan: 250, networkPlan1Year: 250, networkPlan3Year: 750, networkPlan5Year: 1250, networkCost1Year: 150, networkCost3Year: 450, networkCost5Year: 750, shippingCost: 175, numberOfPlugs: 1, category: 'charger', chargingLevel: 'level2', warranty5YrParts: 0, warranty3YrFull: 0, warranty5YrFull: 0, warranty10YrFull: 0 },
    { id: 'csev-acpro-pedestal', name: 'MaxiCharger ACPro - Pedestal', description: 'Pedestal mount accessory for MaxiCharger ACPro', manufacturer: 'Autel', unitPrice: 1000, csevCost: 500, annualNetworkPlan: 0, networkPlan1Year: 0, networkPlan3Year: 0, networkPlan5Year: 0, networkCost1Year: 0, networkCost3Year: 0, networkCost5Year: 0, shippingCost: 0, numberOfPlugs: 0, category: 'accessory', chargingLevel: 'level2', warranty5YrParts: 0, warranty3YrFull: 0, warranty5YrFull: 0, warranty10YrFull: 0 },
    { id: 'csev-acultra-cable-mgmt', name: 'MaxiCharger ACUltra - Cable Management', description: 'Cable management accessory for MaxiCharger ACUltra', manufacturer: 'Autel', unitPrice: 1000, csevCost: 500, annualNetworkPlan: 0, networkPlan1Year: 0, networkPlan3Year: 0, networkPlan5Year: 0, networkCost1Year: 0, networkCost3Year: 0, networkCost5Year: 0, shippingCost: 0, numberOfPlugs: 0, category: 'accessory', chargingLevel: 'level2', warranty5YrParts: 0, warranty3YrFull: 0, warranty5YrFull: 0, warranty10YrFull: 0 },
    { id: 'csev-dcfc-60-ccs', name: 'CSEV MaxiCharger 60kW DC Fast - CCS/CCS - POS & CMS & Boost Cables', description: 'CSEV MaxiCharger 60kW DC Fast - CCS/CCS - POS & CMS & Boost Cables. Includes 2 Years of Parts Only Warranty', manufacturer: 'Autel', unitPrice: 48096, csevCost: 36072, annualNetworkPlan: 680, networkPlan1Year: 680, networkPlan3Year: 2040, networkPlan5Year: 3400, networkCost1Year: 480, networkCost3Year: 1440, networkCost5Year: 2400, shippingCost: 1250, numberOfPlugs: 2, category: 'charger', chargingLevel: 'dcfc', warranty5YrParts: 0, warranty3YrFull: 0, warranty5YrFull: 0, warranty10YrFull: 0 },
    { id: 'csev-dcfc-120-ccs', name: 'CSEV MaxiCharger 120kW DC Fast - CCS/CCS - POS & CMS & Boost Cables', description: 'CSEV MaxiCharger 120kW DC Fast - CCS/CCS - POS & CMS & Boost Cables. Includes 2 Years of Parts Only Warranty', manufacturer: 'Autel', unitPrice: 52128, csevCost: 39096, annualNetworkPlan: 680, networkPlan1Year: 680, networkPlan3Year: 2040, networkPlan5Year: 3400, networkCost1Year: 480, networkCost3Year: 1440, networkCost5Year: 2400, shippingCost: 1250, numberOfPlugs: 2, category: 'charger', chargingLevel: 'dcfc', warranty5YrParts: 0, warranty3YrFull: 0, warranty5YrFull: 0, warranty10YrFull: 0 },
    { id: 'csev-dcfc-180-ccs', name: 'CSEV MaxiCharger 180kW DC Fast - CCS/CCS - POS & CMS & Boost Cables', description: 'CSEV MaxiCharger 180kW DC Fast - CCS/CCS - POS & CMS & Boost Cables. Includes 2 Years of Parts Only Warranty', manufacturer: 'Autel', unitPrice: 64368, csevCost: 48276, annualNetworkPlan: 680, networkPlan1Year: 680, networkPlan3Year: 2040, networkPlan5Year: 3400, networkCost1Year: 480, networkCost3Year: 1440, networkCost5Year: 2400, shippingCost: 1250, numberOfPlugs: 2, category: 'charger', chargingLevel: 'dcfc', warranty5YrParts: 0, warranty3YrFull: 0, warranty5YrFull: 0, warranty10YrFull: 0 },
    { id: 'csev-dcfc-240-ccs', name: 'CSEV MaxiCharger 240kW DC Fast - CCS/CCS - POS & CMS & Boost Cables', description: 'CSEV MaxiCharger 240kW DC Fast - CCS/CCS - POS & CMS & Boost Cables. Includes 2 Years of Parts Only Warranty', manufacturer: 'Autel', unitPrice: 79200, csevCost: 59400, annualNetworkPlan: 680, networkPlan1Year: 680, networkPlan3Year: 2040, networkPlan5Year: 3400, networkCost1Year: 480, networkCost3Year: 1440, networkCost5Year: 2400, shippingCost: 1250, numberOfPlugs: 2, category: 'charger', chargingLevel: 'dcfc', warranty5YrParts: 0, warranty3YrFull: 0, warranty5YrFull: 0, warranty10YrFull: 0 },
    { id: 'csev-dcfc-60-nacs', name: 'CSEV MaxiCharger 60kW DC Fast - CCS/NACS - POS & CMS & Boost Cables', description: 'CSEV MaxiCharger 60kW DC Fast - CCS/NACS - POS & CMS & Boost Cables. Includes 2 Years of Parts Only Warranty', manufacturer: 'Autel', unitPrice: 48096, csevCost: 36072, annualNetworkPlan: 680, networkPlan1Year: 680, networkPlan3Year: 2040, networkPlan5Year: 3400, networkCost1Year: 480, networkCost3Year: 1440, networkCost5Year: 2400, shippingCost: 1250, numberOfPlugs: 2, category: 'charger', chargingLevel: 'dcfc', warranty5YrParts: 0, warranty3YrFull: 0, warranty5YrFull: 0, warranty10YrFull: 0 },
    { id: 'csev-dcfc-120-nacs', name: 'CSEV MaxiCharger 120kW DC Fast - CCS/NACS - POS & CMS & Boost Cables', description: 'CSEV MaxiCharger 120kW DC Fast - CCS/NACS - POS & CMS & Boost Cables. Includes 2 Years of Parts Only Warranty', manufacturer: 'Autel', unitPrice: 52128, csevCost: 39096, annualNetworkPlan: 680, networkPlan1Year: 680, networkPlan3Year: 2040, networkPlan5Year: 3400, networkCost1Year: 480, networkCost3Year: 1440, networkCost5Year: 2400, shippingCost: 1250, numberOfPlugs: 2, category: 'charger', chargingLevel: 'dcfc', warranty5YrParts: 0, warranty3YrFull: 0, warranty5YrFull: 0, warranty10YrFull: 0 },
    { id: 'csev-dcfc-180-nacs', name: 'CSEV MaxiCharger 180kW DC Fast - CCS/NACS - POS & CMS & Boost Cables', description: 'CSEV MaxiCharger 180kW DC Fast - CCS/NACS - POS & CMS & Boost Cables. Includes 2 Years of Parts Only Warranty', manufacturer: 'Autel', unitPrice: 64368, csevCost: 48276, annualNetworkPlan: 680, networkPlan1Year: 680, networkPlan3Year: 2040, networkPlan5Year: 3400, networkCost1Year: 480, networkCost3Year: 1440, networkCost5Year: 2400, shippingCost: 1250, numberOfPlugs: 2, category: 'charger', chargingLevel: 'dcfc', warranty5YrParts: 0, warranty3YrFull: 0, warranty5YrFull: 0, warranty10YrFull: 0 },
    { id: 'csev-dcfc-240-nacs', name: 'CSEV MaxiCharger 240kW DC Fast - CCS/NACS - POS & CMS & Boost Cables', description: 'CSEV MaxiCharger 240kW DC Fast - CCS/NACS - POS & CMS & Boost Cables. Includes 2 Years of Parts Only Warranty', manufacturer: 'Autel', unitPrice: 79200, csevCost: 59400, annualNetworkPlan: 680, networkPlan1Year: 680, networkPlan3Year: 2040, networkPlan5Year: 3400, networkCost1Year: 480, networkCost3Year: 1440, networkCost5Year: 2400, shippingCost: 1250, numberOfPlugs: 2, category: 'charger', chargingLevel: 'dcfc', warranty5YrParts: 0, warranty3YrFull: 0, warranty5YrFull: 0, warranty10YrFull: 0 },
    { id: 'csev-dchp-640-set4-ccs-nacs', name: 'Set of 4 - 640kW - CSEV DCHP 320kW - CCS/CCS & NACS/NACS - POS & CMS & Boost Cables', description: 'Set of 4 - CSEV DCHP 320kW - CCS/CCS & NACS/NACS - POS & CMS & Boost Cables. Includes 2 Years of Parts Only Warranty', manufacturer: 'Autel', unitPrice: 196933, csevCost: 147700, annualNetworkPlan: 1360, networkPlan1Year: 1360, networkPlan3Year: 4080, networkPlan5Year: 6800, networkCost1Year: 960, networkCost3Year: 2880, networkCost5Year: 4800, shippingCost: 1250, numberOfPlugs: 4, category: 'charger', chargingLevel: 'dcfc', warranty5YrParts: 0, warranty3YrFull: 0, warranty5YrFull: 0, warranty10YrFull: 0 },
    { id: 'csev-dchp-640-set4-ccs-ccs', name: 'Set of 4 - 640kW - CSEV DCHP 320kW - CCS/CCS & CCS/CCS - POS & CMS & Boost Cables', description: 'Set of 4 - CSEV DCHP 320kW - CCS/CCS & CCS/CCS - POS & CMS & Boost Cables. Includes 2 Years of Parts Only Warranty', manufacturer: 'Autel', unitPrice: 196933, csevCost: 147700, annualNetworkPlan: 1360, networkPlan1Year: 1360, networkPlan3Year: 4080, networkPlan5Year: 6800, networkCost1Year: 960, networkCost3Year: 2880, networkCost5Year: 4800, shippingCost: 1250, numberOfPlugs: 4, category: 'charger', chargingLevel: 'dcfc', warranty5YrParts: 0, warranty3YrFull: 0, warranty5YrFull: 0, warranty10YrFull: 0 },
    { id: 'csev-dchp-640-set4-nacs-nacs', name: 'Set of 4 - 640kW - CSEV DCHP 320kW - NACS/NACS & NACS/NACS - POS & CMS & Boost Cables', description: 'Set of 4 - CSEV DCHP 320kW - NACS/NACS & NACS/NACS - POS & CMS & Boost Cables. Includes 2 Years of Parts Only Warranty', manufacturer: 'Autel', unitPrice: 196933, csevCost: 147700, annualNetworkPlan: 1360, networkPlan1Year: 1360, networkPlan3Year: 4080, networkPlan5Year: 6800, networkCost1Year: 960, networkCost3Year: 2880, networkCost5Year: 4800, shippingCost: 1250, numberOfPlugs: 4, category: 'charger', chargingLevel: 'dcfc', warranty5YrParts: 0, warranty3YrFull: 0, warranty5YrFull: 0, warranty10YrFull: 0 },
    { id: 'csev-dchp-320-set2-ccs-ccs', name: 'Set of 2 - 320kW - CSEV DCHP 320kW - CCS/CCS - POS & CMS & Boost Cables', description: 'Set of 2 - CSEV DCHP 320kW - CCS/CCS - POS & CMS & Boost Cables. Includes 2 Years of Parts Only Warranty', manufacturer: 'Autel', unitPrice: 146667, csevCost: 110000, annualNetworkPlan: 680, networkPlan1Year: 680, networkPlan3Year: 2040, networkPlan5Year: 3400, networkCost1Year: 480, networkCost3Year: 1440, networkCost5Year: 2400, shippingCost: 1250, numberOfPlugs: 2, category: 'charger', chargingLevel: 'dcfc', warranty5YrParts: 0, warranty3YrFull: 0, warranty5YrFull: 0, warranty10YrFull: 0 },
    { id: 'csev-dchp-320-set2-ccs-nacs', name: 'Set of 2 - 320kW - CSEV DCHP 320kW - CCS/NACS - POS & CMS & Boost Cables', description: 'Set of 2 - CSEV DCHP 320kW - CCS/NACS - POS & CMS & Boost Cables. Includes 2 Years of Parts Only Warranty', manufacturer: 'Autel', unitPrice: 146667, csevCost: 110000, annualNetworkPlan: 680, networkPlan1Year: 680, networkPlan3Year: 2040, networkPlan5Year: 3400, networkCost1Year: 480, networkCost3Year: 1440, networkCost5Year: 2400, shippingCost: 1250, numberOfPlugs: 2, category: 'charger', chargingLevel: 'dcfc', warranty5YrParts: 0, warranty3YrFull: 0, warranty5YrFull: 0, warranty10YrFull: 0 },
    { id: 'csev-dchp-320-set2-nacs-nacs', name: 'Set of 2 - 320kW - CSEV DCHP 320kW - NACS/NACS - POS & CMS & Boost Cables', description: 'Set of 2 - CSEV DCHP 320kW - NACS/NACS - POS & CMS & Boost Cables. Includes 2 Years of Parts Only Warranty', manufacturer: 'Autel', unitPrice: 146667, csevCost: 110000, annualNetworkPlan: 680, networkPlan1Year: 680, networkPlan3Year: 2040, networkPlan5Year: 3400, networkCost1Year: 480, networkCost3Year: 1440, networkCost5Year: 2400, shippingCost: 1250, numberOfPlugs: 2, category: 'charger', chargingLevel: 'dcfc', warranty5YrParts: 0, warranty3YrFull: 0, warranty5YrFull: 0, warranty10YrFull: 0 },
  ];

  for (const product of evseProducts) {
    const row = evseSheet.addRow(product);
    // Format currency columns
    [5,6,7,8,9,10,11,12,13,14,18,19,20,21].forEach(col => {
      row.getCell(col).numFmt = '$#,##0';
    });
  }

  // Freeze header row
  evseSheet.views = [{ state: 'frozen', ySplit: 1 }];

  // ─── Sheet 2: Installation Services ───
  const installSheet = workbook.addWorksheet('Installation Services', {
    properties: { tabColor: { argb: '4CBC88' } },
  });

  installSheet.columns = [
    { header: 'ID', key: 'id', width: 25 },
    { header: 'Name', key: 'name', width: 55 },
    { header: 'Description', key: 'description', width: 55 },
    { header: 'Material Price ($)', key: 'materialPrice', width: 18 },
    { header: 'Labor Price ($)', key: 'laborPrice', width: 16 },
    { header: 'Unit', key: 'unit', width: 12 },
    { header: 'Subgroup', key: 'subgroup', width: 30 },
    { header: 'Notes', key: 'defaultNote', width: 30 },
  ];

  const installHeaderRow = installSheet.getRow(1);
  installHeaderRow.font = { bold: true, color: { argb: 'FFFFFF' } };
  installHeaderRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2D2D2D' } };
  installHeaderRow.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  installHeaderRow.height = 30;

  const installServices = [
    { id: 'service-200a-208v', name: 'New 200A 208V Service [Including Panel and CIAC]', description: 'Install new 200A Service [Including Panel and CIAC]', materialPrice: 1000, laborPrice: 5000, unit: 'each', subgroup: 'Panels/Switchgear - New Service', defaultNote: 'Includes Panel + CIAC' },
    { id: 'service-400a-208v', name: 'New 400A 208V Service [Including Panel and CIAC]', description: 'Install new 400A Service [Including Panel and CIAC]', materialPrice: 3500, laborPrice: 5000, unit: 'each', subgroup: 'Panels/Switchgear - New Service', defaultNote: 'Includes Panel + CIAC' },
    { id: 'service-600a-208v', name: 'New 600A 208V Service [Including Panel and CIAC]', description: 'Install new 600A Service [Including Panel and CIAC]', materialPrice: 12000, laborPrice: 5000, unit: 'each', subgroup: 'Panels/Switchgear - New Service', defaultNote: 'Includes Panel + CIAC' },
    { id: 'service-800a-208v', name: 'New 800A 208V Service [Including Panel and CIAC]', description: 'Install new 800A Service [Including Panel and CIAC]', materialPrice: 15000, laborPrice: 5000, unit: 'each', subgroup: 'Panels/Switchgear - New Service', defaultNote: 'Includes Panel + CIAC' },
    { id: 'service-1000a-208v', name: 'New 1000A 208V Service [Including Panel and CIAC]', description: 'Install new 1000A Service [Including Panel and CIAC]', materialPrice: 17500, laborPrice: 5000, unit: 'each', subgroup: 'Panels/Switchgear - New Service', defaultNote: 'Includes Panel + CIAC' },
    { id: 'service-1200a-208v', name: 'New 1200A 208V Service [Including Panel and CIAC]', description: 'Install new 1200A Service [Including Panel and CIAC]', materialPrice: 20000, laborPrice: 5000, unit: 'each', subgroup: 'Panels/Switchgear - New Service', defaultNote: 'Includes Panel + CIAC' },
    { id: 'service-1600a-208v', name: 'New 1600A 208V Service [Including Panel and CIAC]', description: 'Install new 1600A Service [Including Panel and CIAC]', materialPrice: 30000, laborPrice: 5000, unit: 'each', subgroup: 'Panels/Switchgear - New Service', defaultNote: 'Includes Panel + CIAC' },
    { id: 'service-2000a-208v', name: 'New 2000A 208V Service [Including Panel and CIAC]', description: 'Install new 2000A Service [Including Panel and CIAC]', materialPrice: 50000, laborPrice: 5000, unit: 'each', subgroup: 'Panels/Switchgear - New Service', defaultNote: 'Includes Panel + CIAC' },
    { id: 'service-200a-480v', name: 'New 200A 480V Service [Including Panel and CIAC]', description: 'Install new 200A Service [Including Panel and CIAC]', materialPrice: 16000, laborPrice: 15000, unit: 'each', subgroup: 'Panels/Switchgear - New Service', defaultNote: 'Includes Panel + CIAC' },
    { id: 'service-400a-480v', name: 'New 400A 480V Service [Including Panel and CIAC]', description: 'Install new 400A Service [Including Panel and CIAC]', materialPrice: 23500, laborPrice: 15000, unit: 'each', subgroup: 'Panels/Switchgear - New Service', defaultNote: 'Includes Panel + CIAC' },
    { id: 'service-600a-480v', name: 'New 600A 480V Service [Including Panel and CIAC]', description: 'Install new 600A Service [Including Panel and CIAC]', materialPrice: 25000, laborPrice: 15000, unit: 'each', subgroup: 'Panels/Switchgear - New Service', defaultNote: 'Includes Panel + CIAC' },
    { id: 'service-800a-480v', name: 'New 800A 480V Service [Including Panel and CIAC]', description: 'Install new 800A Service [Including Panel and CIAC]', materialPrice: 30000, laborPrice: 15000, unit: 'each', subgroup: 'Panels/Switchgear - New Service', defaultNote: 'Includes Panel + CIAC' },
    { id: 'service-1000a-480v', name: 'New 1000A 480V Service [Including Panel and CIAC]', description: 'Install new 1000A Service [Including Panel and CIAC]', materialPrice: 40000, laborPrice: 15000, unit: 'each', subgroup: 'Panels/Switchgear - New Service', defaultNote: 'Includes Panel + CIAC' },
    { id: 'service-1200a-480v', name: 'New 1200A 480V Service [Including Panel and CIAC]', description: 'Install new 1200A Service [Including Panel and CIAC]', materialPrice: 55000, laborPrice: 15000, unit: 'each', subgroup: 'Panels/Switchgear - New Service', defaultNote: 'Includes Panel + CIAC' },
    { id: 'service-1600a-480v', name: 'New 1600A 480V Service [Including Panel and CIAC]', description: 'Install new 1600A Service [Including Panel and CIAC]', materialPrice: 60000, laborPrice: 15000, unit: 'each', subgroup: 'Panels/Switchgear - New Service', defaultNote: 'Includes Panel + CIAC' },
    { id: 'service-2000a-480v', name: 'New 2000A 480V Service [Including Panel and CIAC]', description: 'Install new 2000A Service [Including Panel and CIAC]', materialPrice: 65000, laborPrice: 15000, unit: 'each', subgroup: 'Panels/Switchgear - New Service', defaultNote: 'Includes Panel + CIAC' },
    { id: 'breaker-40a-2p', name: '40A 2P Breaker', description: 'Install 40A breakers', materialPrice: 50, laborPrice: 100, unit: 'each', subgroup: 'Breakers', defaultNote: '' },
    { id: 'breaker-50a-2p', name: '50A 2P Breaker', description: 'Install 50A breakers', materialPrice: 75, laborPrice: 100, unit: 'each', subgroup: 'Breakers', defaultNote: '' },
    { id: 'breaker-60a-2p', name: '60A 2P Breaker', description: 'Install 60A breakers', materialPrice: 100, laborPrice: 100, unit: 'each', subgroup: 'Breakers', defaultNote: '' },
    { id: 'breaker-100a-2p', name: '100A 2P Breaker', description: 'Install 100A breakers', materialPrice: 100, laborPrice: 100, unit: 'each', subgroup: 'Breakers', defaultNote: '' },
    { id: 'breaker-200a-3p', name: '200A 3P Breaker', description: 'Install 200A breakers', materialPrice: 200, laborPrice: 100, unit: 'each', subgroup: 'Breakers', defaultNote: '' },
    { id: 'breaker-300a-3p', name: '300A 3P Breaker', description: 'Install 300A breakers', materialPrice: 300, laborPrice: 100, unit: 'each', subgroup: 'Breakers', defaultNote: '' },
    { id: 'breaker-400a-3p', name: '400A 3P Breaker', description: 'Install 400A breakers', materialPrice: 400, laborPrice: 100, unit: 'each', subgroup: 'Breakers', defaultNote: '' },
    { id: 'breaker-40a-iline', name: '40A I-Line Breaker (*SPECIAL ORDER*)', description: '*SPECIAL ORDER* Install 40A I-Line Breaker', materialPrice: 1000, laborPrice: 200, unit: 'each', subgroup: 'Breakers', defaultNote: '' },
    { id: 'breaker-50a-iline', name: '50A I-Line Breaker (*SPECIAL ORDER*)', description: '*SPECIAL ORDER* Install 50A I-Line Breaker', materialPrice: 1250, laborPrice: 200, unit: 'each', subgroup: 'Breakers', defaultNote: '' },
    { id: 'breaker-100a-iline', name: '100A I-Line Breaker (*SPECIAL ORDER*)', description: '*SPECIAL ORDER* Install 100A I-Line Breaker', materialPrice: 1500, laborPrice: 200, unit: 'each', subgroup: 'Breakers', defaultNote: '' },
    { id: 'breaker-200a-iline', name: '200A I-Line Breaker (*SPECIAL ORDER*)', description: '*SPECIAL ORDER* Install 200A I-Line Breaker', materialPrice: 2000, laborPrice: 200, unit: 'each', subgroup: 'Breakers', defaultNote: '' },
    { id: 'breaker-400a-iline', name: '400A I-Line Breaker (*SPECIAL ORDER*)', description: '*SPECIAL ORDER* Install 400A I-Line Breaker', materialPrice: 2500, laborPrice: 200, unit: 'each', subgroup: 'Breakers', defaultNote: '' },
    { id: 'panel-100a', name: '100A Panel Installation', description: 'Install a 100A panel', materialPrice: 500, laborPrice: 3500, unit: 'each', subgroup: 'Panels', defaultNote: '' },
    { id: 'panel-200a', name: '200A Panel Installation', description: 'Install a 200A panel', materialPrice: 1500, laborPrice: 3500, unit: 'each', subgroup: 'Panels', defaultNote: '' },
    { id: 'panel-400a', name: '400A Panel Installation', description: 'Install a 400A panel', materialPrice: 2500, laborPrice: 4000, unit: 'each', subgroup: 'Panels', defaultNote: '' },
    { id: 'panel-600a', name: '600A Panel Installation', description: 'Install a 600A panel', materialPrice: 3500, laborPrice: 5000, unit: 'each', subgroup: 'Panels', defaultNote: '' },
    { id: 'panel-800a', name: '800A Panel Installation', description: 'Install a 800A panel', materialPrice: 4950, laborPrice: 5000, unit: 'each', subgroup: 'Panels', defaultNote: '' },
    { id: 'transformer-75kva', name: '75kVa Transformer Installation', description: 'Install a 75kVA Transformer', materialPrice: 4500, laborPrice: 2500, unit: 'each', subgroup: 'Transformers', defaultNote: '' },
    { id: 'transformer-150kva', name: '150kVa Transformer Installation', description: 'Install a 150kVA Transformer', materialPrice: 6500, laborPrice: 2500, unit: 'each', subgroup: 'Transformers', defaultNote: '' },
    { id: 'transformer-pad', name: 'Transformer Pad', description: 'Install Pad / Vault for Transformer', materialPrice: 9000, laborPrice: 12500, unit: 'each', subgroup: 'Transformers', defaultNote: 'Includes Pad/Vault' },
    { id: 'conduit-40a-pvc-2in', name: '40A (Up to 2 Circuits) PVC Run 2"', description: 'Install 2" PVC conduit', materialPrice: 3, laborPrice: 4, unit: 'ft', subgroup: 'Conduit', defaultNote: '' },
    { id: 'conduit-40a-emt-2in', name: '40A (Up to 2 Circuits) EMT Run 2"', description: 'Install 2" EMT conduit', materialPrice: 4, laborPrice: 5, unit: 'ft', subgroup: 'Conduit', defaultNote: '' },
    { id: 'conduit-50a-pvc-2in', name: '50A (Up to 2 Circuits) PVC Run 2"', description: 'Install 2" PVC conduit', materialPrice: 3, laborPrice: 4, unit: 'ft', subgroup: 'Conduit', defaultNote: '' },
    { id: 'conduit-50a-emt-2in', name: '50A (Up to 2 Circuits) EMT Run 2"', description: 'Install 2" EMT conduit', materialPrice: 4, laborPrice: 5, unit: 'ft', subgroup: 'Conduit', defaultNote: '' },
    { id: 'conduit-60a-pvc-2in', name: '60A (Up to 2 Circuits) PVC Run 2"', description: 'Install 2" PVC conduit', materialPrice: 3, laborPrice: 4, unit: 'ft', subgroup: 'Conduit', defaultNote: '' },
    { id: 'conduit-60a-emt-2in', name: '60A (Up to 2 Circuits) EMT Run 2"', description: 'Install 2" EMT conduit', materialPrice: 4, laborPrice: 5, unit: 'ft', subgroup: 'Conduit', defaultNote: '' },
    { id: 'conduit-100a-pvc-2in', name: '100A (Up to 2 Circuits) PVC Run 2"', description: 'Install 2" PVC conduit', materialPrice: 6, laborPrice: 5, unit: 'ft', subgroup: 'Conduit', defaultNote: '' },
    { id: 'conduit-100a-emt-2in', name: '100A (Up to 2 Circuits) EMT Run 2"', description: 'Install 2" EMT conduit', materialPrice: 6, laborPrice: 5, unit: 'ft', subgroup: 'Conduit', defaultNote: '' },
    { id: 'conduit-200a-pvc-3in', name: '200A (Up to 2 Circuits) PVC Run 3"', description: 'Install 3" PVC conduit', materialPrice: 14, laborPrice: 6, unit: 'ft', subgroup: 'Conduit', defaultNote: '' },
    { id: 'conduit-200a-emt-3in', name: '200A (Up to 2 Circuits) EMT Run 3"', description: 'Install 3" EMT conduit', materialPrice: 14, laborPrice: 6, unit: 'ft', subgroup: 'Conduit', defaultNote: '' },
    { id: 'conduit-pvc-3in', name: 'Install 3" PVC Conduit', description: 'Install 3" PVC conduit', materialPrice: 14, laborPrice: 6, unit: 'ft', subgroup: 'Conduit', defaultNote: '' },
    { id: 'conduit-pvc-4in', name: 'Install 4" PVC Conduit', description: 'Install 4" PVC conduit', materialPrice: 16, laborPrice: 7, unit: 'ft', subgroup: 'Conduit', defaultNote: '' },
    { id: 'conduit-fittings', name: 'Conduit Fittings - Per Conduit Run', description: 'Provide and install conduit fittings', materialPrice: 125, laborPrice: 125, unit: 'circuit', subgroup: 'Conduit', defaultNote: '' },
    { id: 'hand-hole', name: 'Hand Hole / Quazite Box', description: "Install hand hole in grass, 1 per 200'", materialPrice: 100, laborPrice: 50, unit: 'each', subgroup: 'Conduit', defaultNote: "1 per 200'" },
    { id: 'wire-40a', name: '40A Wire Run (1 Circuit)', description: 'Install 40A wire through conduit', materialPrice: 1, laborPrice: 1, unit: 'ft', subgroup: 'Cables', defaultNote: '' },
    { id: 'wire-50a', name: '50A Wire Run (1 Circuit)', description: 'Install 50A wire through conduit', materialPrice: 2, laborPrice: 2, unit: 'ft', subgroup: 'Cables', defaultNote: '' },
    { id: 'wire-60a', name: '60A Wire Run (1 Circuit)', description: 'Install 60A wire through conduit', materialPrice: 2, laborPrice: 2, unit: 'ft', subgroup: 'Cables', defaultNote: '' },
    { id: 'wire-100a', name: '100A Wire Run (1 Circuit)', description: 'Install 100A wire through conduit', materialPrice: 3, laborPrice: 2, unit: 'ft', subgroup: 'Cables', defaultNote: '' },
    { id: 'wire-200a', name: '200A Wire Run (1 Circuit)', description: 'Install 200A wire through conduit', materialPrice: 7, laborPrice: 3, unit: 'ft', subgroup: 'Cables', defaultNote: '' },
    { id: 'wire-300a', name: '300A Wire Run (1 Circuit)', description: 'Install 300A wire through conduit', materialPrice: 9, laborPrice: 4, unit: 'ft', subgroup: 'Cables', defaultNote: '' },
    { id: 'wire-400a', name: '400A Wire Run (1 Circuit)', description: 'Install 400A wire through conduit', materialPrice: 12, laborPrice: 5, unit: 'ft', subgroup: 'Cables', defaultNote: '' },
    { id: 'wire-aluminum-200a', name: 'Aluminum Wire - 200A Run', description: 'Install Aluminum Cabling', materialPrice: 6, laborPrice: 3, unit: 'ft', subgroup: 'Cables', defaultNote: '' },
    { id: 'wire-aluminum-400a', name: 'Aluminum Wire - 400A Run', description: 'Install Aluminum Cabling', materialPrice: 8, laborPrice: 3, unit: 'ft', subgroup: 'Cables', defaultNote: '' },
    { id: 'mount-station-l2', name: 'Mount Station (Level 2)', description: 'Mount L2 EVSE equipment to corresponding base', materialPrice: 100, laborPrice: 200, unit: 'each', subgroup: 'Cables', defaultNote: '' },
    { id: 'mount-station-l3', name: 'Mount Station (Level 3)', description: 'Mount L3 EVSE equipment to corresponding base', materialPrice: 100, laborPrice: 1250, unit: 'each', subgroup: 'Cables', defaultNote: '' },
    { id: 'terminate-station', name: 'Terminate Station', description: 'Terminate EVSE equipment', materialPrice: 100, laborPrice: 100, unit: 'each', subgroup: 'Cables', defaultNote: '' },
    { id: 'activation', name: 'Activation', description: 'Activate EVSE equipment after installation', materialPrice: 0, laborPrice: 100, unit: 'each', subgroup: 'Cables', defaultNote: '' },
    { id: 'trenching-grass', name: 'Trenching and Repair - Grass', description: 'Trench and repair in grass (feet)', materialPrice: 0, laborPrice: 12.5, unit: 'ft', subgroup: 'Trenching', defaultNote: '' },
    { id: 'trenching-asphalt', name: 'Trenching and Repair - Asphalt', description: 'Trench and repair in asphalt (feet)', materialPrice: 0, laborPrice: 30, unit: 'ft', subgroup: 'Trenching', defaultNote: '' },
    { id: 'trenching-concrete', name: 'Trenching and Repair - Concrete', description: 'Trench and repair in concrete (feet)', materialPrice: 0, laborPrice: 30, unit: 'ft', subgroup: 'Trenching', defaultNote: '' },
    { id: 'underground-boring', name: 'Underground Boring', description: 'Underground Boring', materialPrice: 0, laborPrice: 50, unit: 'ft', subgroup: 'Trenching', defaultNote: '' },
    { id: 'concrete-l2-footing', name: 'Level 2 EVSE - Concrete Footing', description: 'Install concrete pads for mounting of EVSE equipment', materialPrice: 500, laborPrice: 300, unit: 'each', subgroup: 'Civil - Bases', defaultNote: '' },
    { id: 'concrete-dcfc-footing', name: 'DCFC EVSE - Concrete Footing', description: 'Install DCFC concrete pads for mounting of EVSE equipment', materialPrice: 500, laborPrice: 1000, unit: 'each', subgroup: 'Civil - Bases', defaultNote: '' },
    { id: 'concrete-service-pad', name: 'Service Pad - Concrete Base', description: 'Install concrete pads for mounting of Service Equipment', materialPrice: 500, laborPrice: 750, unit: 'each', subgroup: 'Civil - Bases', defaultNote: '' },
    { id: 'bollard-bolt-on', name: 'Protective Bollards (Bolt On)', description: 'Install bolt-on protective bollards where necessary', materialPrice: 150, laborPrice: 150, unit: 'each', subgroup: 'Civil - Bases', defaultNote: '' },
    { id: 'bollard-4in-steel', name: 'Protective 4" Steel Bollards (Poured Concrete)', description: 'Install 4" Steel concrete poured protective bollards where necessary', materialPrice: 100, laborPrice: 900, unit: 'each', subgroup: 'Civil - Bases', defaultNote: '' },
    { id: 'bollard-6in-steel', name: 'Protective 6" Steel Bollards (Poured Concrete)', description: 'Install 6" Steel concrete poured protective bollards where necessary', materialPrice: 100, laborPrice: 900, unit: 'each', subgroup: 'Civil - Bases', defaultNote: '' },
    { id: 'tire-stop', name: 'Tire Stop', description: 'Install tire stop where necessary', materialPrice: 100, laborPrice: 100, unit: 'each', subgroup: 'Civil - Bases', defaultNote: '' },
    { id: 'permit-fee', name: 'Permit Fee', description: 'Apply for permits for this installation', materialPrice: 1000, laborPrice: 1000, unit: 'project', subgroup: 'Permits', defaultNote: '' },
    { id: 'design-fee', name: 'Design Fee', description: 'Manage the design work necessary for this project', materialPrice: 1000, laborPrice: 1000, unit: 'project', subgroup: 'Design', defaultNote: '' },
    { id: 'project-management', name: 'Project Management Fee', description: 'Manage project from initial site visit through installation', materialPrice: 2500, laborPrice: 2500, unit: 'project', subgroup: 'Design', defaultNote: '' },
    { id: 'engineering-site', name: 'Stamped Engineering Plans - Site Plans', description: 'Generate stamped engineering site plans', materialPrice: 0, laborPrice: 3000, unit: 'project', subgroup: 'Design', defaultNote: '' },
    { id: 'engineering-full', name: 'Stamped Engineering Plans - Site Plans & Electrical', description: 'Generate stamped engineering site plans & electrical plans', materialPrice: 0, laborPrice: 5500, unit: 'project', subgroup: 'Design', defaultNote: '' },
    { id: 'ada-striping', name: 'ADA Access Aisle Striping', description: 'ADA access aisle striping', materialPrice: 0, laborPrice: 300, unit: 'each', subgroup: 'Striping', defaultNote: '' },
    { id: 'striping-spot', name: 'Striping (per spot)', description: 'Parking spot striping', materialPrice: 0, laborPrice: 100, unit: 'each', subgroup: 'Striping', defaultNote: '' },
    { id: 'ev-stencil', name: 'EV Charging Stencil', description: 'EV charging stencil', materialPrice: 0, laborPrice: 50, unit: 'each', subgroup: 'Striping', defaultNote: '' },
  ];

  for (const service of installServices) {
    const row = installSheet.addRow(service);
    [4,5].forEach(col => {
      row.getCell(col).numFmt = '$#,##0.00';
    });
  }

  installSheet.views = [{ state: 'frozen', ySplit: 1 }];

  // ─── Save ───
  const outputPath = path.join(__dirname, '..', 'data', 'CSEV-PriceBook.xlsx');
  await workbook.xlsx.writeFile(outputPath);
  console.log(`PriceBook generated: ${outputPath}`);
  console.log(`  EVSE Products: ${evseProducts.length} items`);
  console.log(`  Installation Services: ${installServices.length} items`);
}

generate().catch(console.error);
