const ExcelJS = require('exceljs');
const path = require('path');

// Monkey-patch ExcelJS to handle table parsing gracefully
const TableXform = require('exceljs/lib/xlsx/xform/table/table-xform');
const origParseClose = TableXform.prototype.parseClose;
TableXform.prototype.parseClose = function(name) {
  try { return origParseClose.call(this, name); } catch { return true; }
};

const TEMPLATES_DIR = path.join(__dirname, 'templates');

const FILES = [
  'NY - National Grid EV (Breakdown).xlsx',
  'NY - NYSEG & RG&E (Breakdown).xlsx',
  'NY - Central Hudson EV MRP Project Cost (Breakdown).xlsx',
  'NY - PSEG Long Island - EVMakeReadyApp (Breakdown).xlsx',
  'MA - Eversource EV Estimate (Breakdown).xlsx',
  'MA - National Grid MA EV Make Ready Estimate (Breakdown).xlsx',
  'WA - Seattle City Light - TE Portfolio Contractor Cost Template (Breakdown).xlsx',
];

async function testFile(filename) {
  const filePath = path.join(TEMPLATES_DIR, filename);
  console.log(`\n${'='.repeat(70)}`);
  console.log(`FILE: ${filename}`);
  console.log('='.repeat(70));

  let workbook;

  // Step 1: Try reading
  try {
    workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    console.log(`  [READ]  SUCCESS — ${workbook.worksheets.length} sheet(s): ${workbook.worksheets.map(ws => `"${ws.name}"`).join(', ')}`);
  } catch (err) {
    console.log(`  [READ]  FAILED`);
    console.log(`  Error: ${err.message}`);
    console.log(`  Stack:\n${err.stack}`);
    return;
  }

  // Step 2: Clear tables to prevent write failures (MA templates)
  let tablesCleared = 0;
  for (const ws of workbook.worksheets) {
    if (ws.tables && typeof ws.tables === 'object') {
      const tableNames = Object.keys(ws.tables);
      if (tableNames.length > 0) {
        tablesCleared += tableNames.length;
        ws.tables = {};
      }
    }
  }
  if (tablesCleared > 0) {
    console.log(`  [PATCH] Cleared ${tablesCleared} table(s) before write`);
  }

  // Step 3: Try writing to buffer
  try {
    await workbook.xlsx.writeBuffer();
    console.log(`  [WRITE] SUCCESS — writeBuffer() completed OK`);
  } catch (err) {
    console.log(`  [WRITE] FAILED`);
    console.log(`  Error: ${err.message}`);
    console.log(`  Stack:\n${err.stack}`);
  }
}

async function main() {
  console.log('ExcelJS Template Compatibility Test');
  console.log(`ExcelJS version: ${require('exceljs/package.json').version}`);
  console.log(`Templates dir:   ${TEMPLATES_DIR}`);

  for (const file of FILES) {
    await testFile(file);
  }

  console.log(`\n${'='.repeat(70)}`);
  console.log('Done.');
}

main().catch(err => {
  console.error('Unexpected top-level error:', err);
  process.exit(1);
});
