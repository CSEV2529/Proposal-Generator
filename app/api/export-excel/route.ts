import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import {
  ExcelExportData,
  NATIONAL_GRID_CELL_MAP,
  NYSEG_RGE_CELL_MAP,
  NYSEG_RGE_EVSE_ROW,
  LABOR_RATE_PER_HOUR
} from '@/lib/excelExport';

// Templates are stored in the project's templates folder
const TEMPLATES_DIR = path.join(process.cwd(), 'templates');
const NATIONAL_GRID_FILE = path.join(TEMPLATES_DIR, 'National Grid Breakdown v2.xlsx');
const NYSEG_RGE_FILE = path.join(TEMPLATES_DIR, 'NYSEG & RG&E Breakdown.xlsx');

async function writeNationalGridExcel(data: ExcelExportData): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(NATIONAL_GRID_FILE);

  const sheet = workbook.getWorksheet('Make-Ready');
  if (!sheet) {
    throw new Error('Make-Ready sheet not found');
  }

  // Helper to set cell value (row is 1-indexed Excel row number)
  const setCell = (col: string, row: number, value: number | string) => {
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

    // Material row: D=qty (1), F=unit price
    if (mapping.materialRow !== undefined && costs.materialCost > 0) {
      setCell('D', mapping.materialRow + 1, 1); // Qty
      setCell('F', mapping.materialRow + 1, costs.materialCost); // Unit price
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

  // Determine which sheet to use based on charging level
  const sheetName = data.chargingLevel === 'dcfc' ? 'DCFC costs' : 'L2 costs';
  const sheet = workbook.getWorksheet(sheetName);
  if (!sheet) {
    throw new Error(`${sheetName} sheet not found`);
  }

  // Helper to set cell value (row is 1-indexed Excel row number)
  const setCell = (col: string, row: number, value: number | string) => {
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const exportData: ExcelExportData = body.exportData;

    if (!exportData) {
      return NextResponse.json({ error: 'No export data provided' }, { status: 400 });
    }

    let fileBuffer: Buffer;
    let fileName: string;

    if (exportData.utilityType === 'national-grid') {
      // Check if file exists
      if (!fs.existsSync(NATIONAL_GRID_FILE)) {
        return NextResponse.json({
          error: `National Grid template not found at ${NATIONAL_GRID_FILE}`
        }, { status: 404 });
      }
      fileBuffer = await writeNationalGridExcel(exportData);
      fileName = `National Grid Breakdown - ${exportData.customerName || 'Project'}.xlsx`;
    } else if (exportData.utilityType === 'nyseg-rge') {
      // Check if file exists
      if (!fs.existsSync(NYSEG_RGE_FILE)) {
        return NextResponse.json({
          error: `NYSEG/RG&E template not found at ${NYSEG_RGE_FILE}`
        }, { status: 404 });
      }
      fileBuffer = await writeNYSEGRGEExcel(exportData);
      fileName = `NYSEG RGE Breakdown - ${exportData.customerName || 'Project'}.xlsx`;
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
