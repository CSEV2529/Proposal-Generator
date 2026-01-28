const ExcelJS = require('exceljs');

async function readFile() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('../PriceBook-2026.01.26-v2.xlsx');
  const sheet = workbook.getWorksheet('EVSE Price Book');
  if (sheet) {
    console.log('=== EVSE Price Book Full Data ===');
    sheet.eachRow((row, rowNumber) => {
      const getValue = (colNum) => {
        const cell = row.getCell(colNum);
        const val = cell.value;
        if (typeof val === 'object' && val && val.result !== undefined) return val.result;
        if (val === null || val === undefined) return '';
        return val;
      };

      const name = getValue(1);
      const csevCost = getValue(6);
      const numPlugs = getValue(10);
      const netPlan1 = getValue(11);
      const netPlan3 = getValue(12);
      const netPlan5 = getValue(13);
      const shipping = getValue(14);
      const netCost1 = getValue(15);
      const netCost3 = getValue(16);
      const netCost5 = getValue(17);

      console.log('Row ' + rowNumber + ':');
      console.log('  Name: ' + name);
      console.log('  CSEV Cost: ' + csevCost);
      console.log('  Plugs: ' + numPlugs);
      console.log('  Network Plans (charge): 1yr=' + netPlan1 + ', 3yr=' + netPlan3 + ', 5yr=' + netPlan5);
      console.log('  Network Costs (actual): 1yr=' + netCost1 + ', 3yr=' + netCost3 + ', 5yr=' + netCost5);
      console.log('  Shipping: ' + shipping);
      console.log('');
    });
  }
}

readFile().catch(console.error);
