import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import {
  ExcelExportData,
  NATIONAL_GRID_CELL_MAP,
  NYSEG_RGE_CELL_MAP,
  NYSEG_RGE_EVSE_ROW,
  CENTRAL_HUDSON_CELL_MAP,
  CENTRAL_HUDSON_EVSE_ROW,
  CENTRAL_HUDSON_INSTALLATION_ROW,
  CENTRAL_HUDSON_NETWORKING_ROW,
  CENTRAL_HUDSON_FREIGHT_ROW,
  EVERSOURCE_MA_CELL_MAP,
  EVERSOURCE_MA_HARDWARE1_ROW,
  EVERSOURCE_MA_HARDWARE2_ROW,
  EVERSOURCE_MA_FREIGHT_ROW,
  EVERSOURCE_MA_NETWORKING_ROW,
  NATIONAL_GRID_MA_CELL_MAP,
  NATIONAL_GRID_MA_HARDWARE1_ROW,
  NATIONAL_GRID_MA_HARDWARE2_ROW,
  NATIONAL_GRID_MA_FREIGHT_ROW,
  NATIONAL_GRID_MA_NETWORKING_ROW,
  SEATTLE_MATERIAL_CELL_MAP,
  SEATTLE_LABOR_CELL_MAP,
  SEATTLE_NETWORKING_ROW,
  LABOR_RATE_PER_HOUR
} from '@/lib/excelExport';

// Monkey-patch ExcelJS TableXform to handle table/filter features in MA templates
// Must run before any workbook.xlsx.readFile calls
try {
  const TableXform = require('exceljs/lib/xlsx/xform/table/table-xform');
  const origParseClose = TableXform.prototype.parseClose;
  TableXform.prototype.parseClose = function(name: string) {
    try { return origParseClose.call(this, name); } catch { return true; }
  };
} catch {
  // Silently ignore if the internal module path changes
}

// Templates are stored in the project's templates folder
const TEMPLATES_DIR = path.join(process.cwd(), 'templates');
const NATIONAL_GRID_FILE = path.join(TEMPLATES_DIR, 'National Grid NY Breakdown v2.xlsx');
const NYSEG_RGE_FILE = path.join(TEMPLATES_DIR, 'NYSEG & RG&E Breakdown.xlsx');
const CENTRAL_HUDSON_FILE = path.join(TEMPLATES_DIR, 'Central Hudson EV MRP Project Cost.xlsx');
const EVERSOURCE_MA_FILE = path.join(TEMPLATES_DIR, 'Eversource_MA_EV_Estimate (2).xlsx');
const NATIONAL_GRID_MA_FILE = path.join(TEMPLATES_DIR, 'National Grid MA EV Make Ready Estimate 2-28-25 (2).xlsx');
const SEATTLE_CITY_LIGHT_FILE = path.join(TEMPLATES_DIR, 'TE Portfolio Contractor Cost Template - 20251112 (Seattle City Light).xlsx');

async function writeNationalGridExcel(data: ExcelExportData): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(NATIONAL_GRID_FILE);
  workbook.calcProperties.fullCalcOnLoad = true;
  // Clear defined names — ExcelJS corrupts them on re-save
  workbook.definedNames.model = [];

  const sheet = workbook.getWorksheet('Make-Ready');
  if (!sheet) {
    throw new Error('Make-Ready sheet not found');
  }

  // Helper to set cell value (row is 1-indexed Excel row number)
  // Guards against undefined/NaN/Infinity which corrupt OOXML
  const setCell = (col: string, row: number, value: number | string) => {
    if (value === undefined || value === null) return;
    if (typeof value === 'number' && (!isFinite(value) || isNaN(value))) return;
    const cell = sheet.getCell(`${col}${row}`);
    cell.value = value;
  };

  // Write project info (using 1-indexed rows)
  setCell('B', 4, 'ChargeSmart EV'); // Approved Contractor
  setCell('B', 5, data.customerName); // Site Host Name
  setCell('B', 6, data.siteAddress); // Street
  setCell('B', 7, data.siteCity); // City
  setCell('B', 8, data.siteState); // State
  setCell('B', 9, data.siteZip); // Zip
  setCell('B', 12, data.numPlugs); // # plugs
  setCell('B', 13, data.numStations); // # stations
  if (data.trenchingFeet && data.trenchingFeet > 0) {
    setCell('B', 16, data.trenchingFeet); // Ft of trenching
  }

  // Write category data
  // Note: Column G has formulas (D*F), so only write to D and F
  // Labor rate is ALWAYS $125/hr
  Object.entries(data.categories).forEach(([category, costs]) => {
    const mapping = NATIONAL_GRID_CELL_MAP[category];
    if (!mapping) return;

    // Special handling for Professional Services - combine material + labor into one labor line
    if (category === 'Professional Services') {
      if (mapping.laborRow !== undefined && (costs.laborCost > 0 || costs.materialCost > 0)) {
        const totalCost = costs.laborCost + costs.materialCost;
        const hours = Math.round((totalCost / LABOR_RATE_PER_HOUR) * 10) / 10;
        setCell('D', mapping.laborRow + 1, hours); // Qty (hours) = total / $125
        setCell('F', mapping.laborRow + 1, LABOR_RATE_PER_HOUR); // Always $125/hr
      }
      return; // Skip normal processing for Professional Services
    }

    // Labor row: D=hours, F=rate ($125)
    // Note: NATIONAL_GRID_CELL_MAP uses 0-indexed rows, so add 1
    if (mapping.laborRow !== undefined && costs.laborCost > 0) {
      const hours = Math.round((costs.laborCost / LABOR_RATE_PER_HOUR) * 10) / 10;
      setCell('D', mapping.laborRow + 1, hours); // Qty (hours)
      setCell('F', mapping.laborRow + 1, LABOR_RATE_PER_HOUR); // Always $125/hr
      // G is calculated by formula
    }

    // Material row: D=qty, F=unit price
    if (mapping.materialRow !== undefined && costs.materialCost > 0) {
      const qty = costs.quantity > 0 ? costs.quantity : 1;
      const unitPrice = costs.quantity > 0 ? costs.materialCost / costs.quantity : costs.materialCost;
      setCell('D', mapping.materialRow + 1, qty);
      setCell('F', mapping.materialRow + 1, Math.round(unitPrice * 100) / 100);
      // G is calculated by formula
    }

    // Fees row (for Permits): D=qty, F=amount
    if (mapping.feesRow !== undefined && costs.materialCost > 0) {
      setCell('D', mapping.feesRow + 1, 1);
      setCell('F', mapping.feesRow + 1, costs.materialCost);
      // G is calculated by formula
    }
  });

  // Write EVSE info (Row 66)
  // Note: G66 has a formula (D*F), so don't overwrite it
  if (data.evsePartNumber) {
    setCell('C', 66, data.evsePartNumber); // Part Number
  }
  if (data.evseQuantity && data.evseQuantity > 0) {
    setCell('D', 66, data.evseQuantity); // Quantity
  }
  if (data.evseUnitPrice && data.evseUnitPrice > 0) {
    setCell('F', 66, data.evseUnitPrice); // Unit Price
  }
  // G66 is calculated by formula

  // Write Network Plan info (Row 67)
  // Note: G67 has a formula (D*F), so don't overwrite it
  setCell('C', 67, 'ChargeSmart EV'); // Always "ChargeSmart EV"
  if (data.networkPlanQty && data.networkPlanQty > 0) {
    setCell('D', 67, data.networkPlanQty); // Quantity of plans
  }
  if (data.networkPlanUnitPrice && data.networkPlanUnitPrice > 0) {
    setCell('F', 67, data.networkPlanUnitPrice); // Price per plan
  }
  // G67 is calculated by formula

  // Write Shipping info (Row 70)
  // Note: G70 has a formula (D*F), so don't overwrite it
  if (data.shippingCost && data.shippingCost > 0) {
    setCell('D', 70, 1); // Quantity = 1
    setCell('F', 70, data.shippingCost); // Shipping cost
  }
  // G70 is calculated by formula

  // Return buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

async function writeNYSEGRGEExcel(data: ExcelExportData): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(NYSEG_RGE_FILE);
  workbook.calcProperties.fullCalcOnLoad = true;
  // Clear defined names — ExcelJS corrupts them on re-save
  workbook.definedNames.model = [];

  // Determine which sheet to use based on charging level
  const sheetName = data.chargingLevel === 'dcfc' ? 'DCFC costs' : 'L2 costs';
  const sheet = workbook.getWorksheet(sheetName);
  if (!sheet) {
    throw new Error(`${sheetName} sheet not found`);
  }

  // Set the active sheet so Excel opens to it by default
  (workbook as unknown as { views: Array<{ activeTab: number }> }).views = [{ activeTab: workbook.worksheets.indexOf(sheet) }];

  // Helper to set cell value (row is 1-indexed Excel row number)
  // Guards against undefined/NaN/Infinity which corrupt OOXML
  const setCell = (col: string, row: number, value: number | string) => {
    if (value === undefined || value === null) return;
    if (typeof value === 'number' && (!isFinite(value) || isNaN(value))) return;
    const cell = sheet.getCell(`${col}${row}`);
    cell.value = value;
  };

  // Write project info
  setCell('C', 5, data.customerName); // Site/Application Name
  setCell('C', 6, `${data.siteAddress}, ${data.siteCity}, ${data.siteState} ${data.siteZip}`); // Site Address
  setCell('G', 6, data.numPlugs); // # of L2 plugs

  // Write category data
  // Columns: E=Material, F=Labor (Total in G is a formula)
  Object.entries(data.categories).forEach(([category, costs]) => {
    const row = NYSEG_RGE_CELL_MAP[category];
    if (row === undefined) return;

    if (costs.materialCost > 0 || costs.laborCost > 0) {
      setCell('E', row, costs.materialCost); // Material
      setCell('F', row, costs.laborCost); // Labor
    }
  });

  // Write EVSE info
  if (data.evseModel) {
    setCell('D', NYSEG_RGE_EVSE_ROW, data.evseModel); // Charger Model
  }
  if (data.evsePrice && data.evsePrice > 0) {
    setCell('E', NYSEG_RGE_EVSE_ROW, data.evsePrice); // EVSE Price
  }

  // Write Shipping and Network
  setCell('D', 47, 'Shipping and Network');
  if (data.shippingAndNetworkCost && data.shippingAndNetworkCost > 0) {
    setCell('E', 47, data.shippingAndNetworkCost);
  }

  // Write quantities for Trenching, Conduit, Cables
  if (data.trenchingQty && data.trenchingQty > 0) {
    setCell('G', 13, data.trenchingQty);
  }
  if (data.conduitQty && data.conduitQty > 0) {
    setCell('G', 15, data.conduitQty);
  }
  if (data.cablesQty && data.cablesQty > 0) {
    setCell('G', 17, data.cablesQty);
  }

  // Return buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

async function writeCentralHudsonExcel(data: ExcelExportData): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(CENTRAL_HUDSON_FILE);
  workbook.calcProperties.fullCalcOnLoad = true;
  workbook.definedNames.model = [];

  const sheet = workbook.getWorksheet('Sheet1');
  if (!sheet) {
    throw new Error('Sheet1 not found in Central Hudson template');
  }

  const setCell = (col: string, row: number, value: number | string) => {
    if (value === undefined || value === null) return;
    if (typeof value === 'number' && (!isFinite(value) || isNaN(value))) return;
    const cell = sheet.getCell(`${col}${row}`);
    cell.value = value;
  };

  // Write project info
  setCell('C', 10, data.customerName); // Participant Name
  setCell('C', 12, data.customerName); // Premise Company
  setCell('C', 13, `${data.siteAddress}, ${data.siteCity}, ${data.siteState} ${data.siteZip}`); // Premise Address
  // C15 = "ChargeSmartEV" already filled in template
  setCell('C', 19, data.chargingLevel === 'dcfc' ? 'DCFC' : 'Level 2'); // Charger Level
  setCell('C', 20, data.numPlugs); // Total Plugs

  // Write cost categories: D=Material Total, E=Labor Total, F=D+E formula
  Object.entries(data.categories).forEach(([category, costs]) => {
    const row = CENTRAL_HUDSON_CELL_MAP[category];
    if (row === undefined) return;

    if (costs.materialCost > 0 || costs.laborCost > 0) {
      setCell('D', row, costs.materialCost); // Material Total
      setCell('E', row, costs.laborCost); // Labor Total
      // F is calculated by formula
    }
  });

  // Write ineligible costs (column D only)
  if (data.evsePrice && data.evsePrice > 0) {
    setCell('D', CENTRAL_HUDSON_EVSE_ROW, data.evsePrice); // Chargers price
  }

  // Station Installation = total of all category costs (material + labor)
  let totalInstallation = 0;
  Object.values(data.categories).forEach(cat => {
    totalInstallation += cat.laborCost + cat.materialCost;
  });
  if (totalInstallation > 0) {
    setCell('D', CENTRAL_HUDSON_INSTALLATION_ROW, totalInstallation);
  }

  if (data.networkPlanTotal && data.networkPlanTotal > 0) {
    setCell('D', CENTRAL_HUDSON_NETWORKING_ROW, data.networkPlanTotal); // Networking
  }
  if (data.shippingCost && data.shippingCost > 0) {
    setCell('D', CENTRAL_HUDSON_FREIGHT_ROW, data.shippingCost); // Freight
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

async function writeEversourceMAExcel(data: ExcelExportData): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(EVERSOURCE_MA_FILE);
  workbook.calcProperties.fullCalcOnLoad = true;
  workbook.definedNames.model = [];

  const sheet = workbook.getWorksheet('Estimate');
  if (!sheet) {
    throw new Error('Estimate sheet not found in Eversource MA template');
  }

  const setCell = (col: string, row: number, value: number | string) => {
    if (value === undefined || value === null) return;
    if (typeof value === 'number' && (!isFinite(value) || isNaN(value))) return;
    const cell = sheet.getCell(`${col}${row}`);
    cell.value = value;
  };

  // Write project info
  setCell('C', 4, data.siteAddress); // Street address
  setCell('C', 5, `${data.siteCity}, ${data.siteState} ${data.siteZip}`); // City/State/Zip

  // Write cost categories
  // G=material total, H=labor total (J=total is formula G+H)
  // For rows with qty breakdown: E=qty, F=unit price, G=formula E*F
  Object.entries(data.categories).forEach(([category, costs]) => {
    const row = EVERSOURCE_MA_CELL_MAP[category];
    if (row === undefined) return;

    if (costs.materialCost > 0 || costs.laborCost > 0) {
      // For quantity-based rows (trenching, conduit, bollards, handholes), write E=qty, F=unit price
      const qtyRows = ['Trenching continuously paved', 'Trenching non-continuously paved',
        'Conduit underground', 'Conduit above ground', 'Protective Bollards', 'Handholes/Manholes'];
      if (qtyRows.includes(category) && costs.quantity > 0) {
        setCell('E', row, costs.quantity); // Qty
        setCell('F', row, Math.round((costs.materialCost / costs.quantity) * 100) / 100); // Unit price
        // G is formula E*F
      } else if (costs.materialCost > 0) {
        setCell('G', row, costs.materialCost); // Material Total
      }
      if (costs.laborCost > 0) {
        setCell('H', row, costs.laborCost); // Labor Total
      }
    }
  });

  // Write EVSE info
  if (data.evseQuantity && data.evseQuantity > 0 && data.evseUnitPrice) {
    setCell('E', EVERSOURCE_MA_HARDWARE1_ROW, data.evseQuantity); // Qty
    setCell('F', EVERSOURCE_MA_HARDWARE1_ROW, data.evseUnitPrice); // Unit price
    // G is formula E*F
  }
  // Hardware #2 left empty (second EVSE model if needed)

  if (data.shippingCost && data.shippingCost > 0) {
    setCell('G', EVERSOURCE_MA_FREIGHT_ROW, data.shippingCost); // Freight total
  }
  if (data.networkPlanTotal && data.networkPlanTotal > 0) {
    setCell('G', EVERSOURCE_MA_NETWORKING_ROW, data.networkPlanTotal); // Networking total
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

async function writeNationalGridMAExcel(data: ExcelExportData): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(NATIONAL_GRID_MA_FILE);
  workbook.calcProperties.fullCalcOnLoad = true;
  workbook.definedNames.model = [];

  const sheet = workbook.getWorksheet('Estimate');
  if (!sheet) {
    throw new Error('Estimate sheet not found in National Grid MA template');
  }

  const setCell = (col: string, row: number, value: number | string) => {
    if (value === undefined || value === null) return;
    if (typeof value === 'number' && (!isFinite(value) || isNaN(value))) return;
    const cell = sheet.getCell(`${col}${row}`);
    cell.value = value;
  };

  // Write project info
  setCell('C', 4, data.siteAddress); // Street address
  setCell('C', 5, `${data.siteCity}, ${data.siteState} ${data.siteZip}`); // City/State/Zip
  setCell('C', 6, data.numPlugs); // Number of ports
  setCell('C', 7, data.numStations); // Number of stations

  // Write cost categories
  // D=qty, E=material total, F=labor total (G=total is formula E+F)
  Object.entries(data.categories).forEach(([category, costs]) => {
    const row = NATIONAL_GRID_MA_CELL_MAP[category];
    if (row === undefined) return;

    if (costs.materialCost > 0 || costs.laborCost > 0) {
      // For quantity-based rows (trenching, conduit, bollards, handholes), write D=qty
      const qtyRows = ['Trenching continuously paved', 'Trenching non-continuously paved',
        'Conduit & Cable', 'Protective Bollards', 'Handholes/Manholes'];
      if (qtyRows.includes(category) && costs.quantity > 0) {
        setCell('D', row, costs.quantity); // Qty
      }
      if (costs.materialCost > 0) {
        setCell('E', row, costs.materialCost); // Material Total
      }
      if (costs.laborCost > 0) {
        setCell('F', row, costs.laborCost); // Labor Total
      }
      // G is formula E+F
    }
  });

  // Write EVSE info (column E)
  if (data.evsePrice && data.evsePrice > 0) {
    setCell('E', NATIONAL_GRID_MA_HARDWARE1_ROW, data.evsePrice); // Hardware #1 total
  }
  // Hardware #2 left empty

  if (data.shippingCost && data.shippingCost > 0) {
    setCell('E', NATIONAL_GRID_MA_FREIGHT_ROW, data.shippingCost); // Freight
  }
  if (data.networkPlanTotal && data.networkPlanTotal > 0) {
    setCell('E', NATIONAL_GRID_MA_NETWORKING_ROW, data.networkPlanTotal); // Networking
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

async function writeSeattleCityLightExcel(data: ExcelExportData): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(SEATTLE_CITY_LIGHT_FILE);
  workbook.calcProperties.fullCalcOnLoad = true;
  workbook.definedNames.model = [];

  const sheet = workbook.getWorksheet('Cost Template');
  if (!sheet) {
    throw new Error('Cost Template sheet not found in Seattle City Light template');
  }

  const setCell = (col: string, row: number, value: number | string) => {
    if (value === undefined || value === null) return;
    if (typeof value === 'number' && (!isFinite(value) || isNaN(value))) return;
    const cell = sheet.getCell(`${col}${row}`);
    cell.value = value;
  };

  // Write project info
  setCell('C', 12, data.customerName); // Site Name
  setCell('C', 13, `${data.siteAddress}, ${data.siteCity}, ${data.siteState} ${data.siteZip}`); // Site Address
  if (data.evseModel) {
    setCell('C', 22, data.evseModel); // Charger make/model
  }
  setCell('C', 23, data.numStations); // Total chargers
  setCell('C', 24, data.numPlugs); // Total ports

  // Write material rows: F=qty, G=unit cost, H=total (formula F*G)
  Object.entries(data.categories).forEach(([category, costs]) => {
    const materialRow = SEATTLE_MATERIAL_CELL_MAP[category];
    if (materialRow !== undefined && costs.materialCost > 0) {
      const qty = costs.quantity > 0 ? costs.quantity : 1;
      const unitCost = costs.quantity > 0 ? costs.materialCost / costs.quantity : costs.materialCost;
      setCell('F', materialRow, qty);
      setCell('G', materialRow, Math.round(unitCost * 100) / 100);
      // H is formula F*G
    }

    // Write labor rows: F=hours, G=hourly rate ($125), H=total (formula F*G)
    const laborRow = SEATTLE_LABOR_CELL_MAP[category];
    if (laborRow !== undefined && costs.laborCost > 0) {
      const hours = Math.round((costs.laborCost / LABOR_RATE_PER_HOUR) * 10) / 10;
      setCell('F', laborRow, hours);
      setCell('G', laborRow, LABOR_RATE_PER_HOUR);
      // H is formula F*G
    }
  });

  // Write EVSE info (Chargers/Outlets material row)
  if (data.evseQuantity && data.evseQuantity > 0 && data.evseUnitPrice) {
    setCell('F', SEATTLE_MATERIAL_CELL_MAP['Chargers/Outlets'], data.evseQuantity);
    setCell('G', SEATTLE_MATERIAL_CELL_MAP['Chargers/Outlets'], data.evseUnitPrice);
  }

  // Write Freight
  if (data.shippingCost && data.shippingCost > 0) {
    setCell('F', SEATTLE_MATERIAL_CELL_MAP['Freight'], 1);
    setCell('G', SEATTLE_MATERIAL_CELL_MAP['Freight'], data.shippingCost);
  }

  // Write Networking/Cloud (first year)
  if (data.networkPlanTotal && data.networkPlanTotal > 0) {
    setCell('F', SEATTLE_NETWORKING_ROW, 1);
    setCell('G', SEATTLE_NETWORKING_ROW, data.networkPlanTotal);
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const exportData: ExcelExportData = body.exportData;

    if (!exportData) {
      return NextResponse.json({ error: 'No export data provided' }, { status: 400 });
    }

    // Build filename: CustomerName-City ST-UtilityName Breakdown-MM.DD.YYYY.xlsx
    const buildExcelFileName = (utilityLabel: string) => {
      const name = exportData.customerName || 'Customer';
      const city = exportData.siteCity || '';
      const state = exportData.siteState || '';
      const cityState = [city, state].filter(Boolean).join(' ');
      const now = new Date();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const yyyy = now.getFullYear();
      const date = `${mm}.${dd}.${yyyy}`;
      const parts = [name, cityState, `${utilityLabel} Breakdown`, date].filter(Boolean);
      return parts.join('-').replace(/[/\\:*?"<>|]/g, '') + '.xlsx';
    };

    let fileBuffer: Buffer;
    let fileName: string;

    if (exportData.utilityType === 'national-grid') {
      if (!fs.existsSync(NATIONAL_GRID_FILE)) {
        return NextResponse.json({
          error: `National Grid template not found at ${NATIONAL_GRID_FILE}`
        }, { status: 404 });
      }
      fileBuffer = await writeNationalGridExcel(exportData);
      fileName = buildExcelFileName(exportData.utilityLabel || 'National Grid');
    } else if (exportData.utilityType === 'nyseg-rge') {
      if (!fs.existsSync(NYSEG_RGE_FILE)) {
        return NextResponse.json({
          error: `NYSEG/RG&E template not found at ${NYSEG_RGE_FILE}`
        }, { status: 404 });
      }
      fileBuffer = await writeNYSEGRGEExcel(exportData);
      fileName = buildExcelFileName(exportData.utilityLabel || 'NYSEG-RGE');
    } else if (exportData.utilityType === 'central-hudson') {
      if (!fs.existsSync(CENTRAL_HUDSON_FILE)) {
        return NextResponse.json({
          error: `Central Hudson template not found at ${CENTRAL_HUDSON_FILE}`
        }, { status: 404 });
      }
      fileBuffer = await writeCentralHudsonExcel(exportData);
      fileName = buildExcelFileName(exportData.utilityLabel || 'Central Hudson');
    } else if (exportData.utilityType === 'eversource-ma') {
      if (!fs.existsSync(EVERSOURCE_MA_FILE)) {
        return NextResponse.json({
          error: `Eversource MA template not found at ${EVERSOURCE_MA_FILE}`
        }, { status: 404 });
      }
      fileBuffer = await writeEversourceMAExcel(exportData);
      fileName = buildExcelFileName(exportData.utilityLabel || 'Eversource');
    } else if (exportData.utilityType === 'national-grid-ma') {
      if (!fs.existsSync(NATIONAL_GRID_MA_FILE)) {
        return NextResponse.json({
          error: `National Grid MA template not found at ${NATIONAL_GRID_MA_FILE}`
        }, { status: 404 });
      }
      fileBuffer = await writeNationalGridMAExcel(exportData);
      fileName = buildExcelFileName(exportData.utilityLabel || 'National Grid');
    } else if (exportData.utilityType === 'seattle-city-light') {
      if (!fs.existsSync(SEATTLE_CITY_LIGHT_FILE)) {
        return NextResponse.json({
          error: `Seattle City Light template not found at ${SEATTLE_CITY_LIGHT_FILE}`
        }, { status: 404 });
      }
      fileBuffer = await writeSeattleCityLightExcel(exportData);
      fileName = buildExcelFileName(exportData.utilityLabel || 'Seattle City Light');
    } else {
      return NextResponse.json({ error: 'Unknown utility type' }, { status: 400 });
    }

    // Return the file as a download
    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });

  } catch (error) {
    console.error('Excel export error:', error);
    return NextResponse.json({
      error: 'Failed to export Excel file',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
