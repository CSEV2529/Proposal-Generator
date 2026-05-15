const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function test() {
  const file = path.join(__dirname, 'templates', 'NYSEG & RG&E Breakdown.xlsx');
  const outFile = path.join(require('os').homedir(), 'Desktop', 'TEST-NYSEG-Output.xlsx');

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(file);
  wb.calcProperties.fullCalcOnLoad = true;
  wb.definedNames.model = [];

  const sheet = wb.getWorksheet('L2 costs');
  sheet.getCell('C5').value = 'TEST CUSTOMER NAME';
  sheet.getCell('C6').value = '123 Main St, Rochester, NY 14623';
  sheet.getCell('G6').value = 10;
  sheet.getCell('E25').value = 5000;   // Panel material
  sheet.getCell('F25').value = 3000;   // Panel labor
  sheet.getCell('E29').value = 8000;   // Design material
  sheet.getCell('F29').value = 12000;  // Design labor
  sheet.getCell('D42').value = 'Test EVSE Model';
  sheet.getCell('E42').value = 27500;

  const buf = await wb.xlsx.writeBuffer();
  fs.writeFileSync(outFile, Buffer.from(buf));
  console.log('Saved to:', outFile);
}

test().catch(console.error);
