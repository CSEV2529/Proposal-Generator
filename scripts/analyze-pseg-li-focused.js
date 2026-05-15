const ExcelJS = require('exceljs');
const path = require('path');

// Focus on sheets that are relevant for data entry / export
const TARGET_SHEETS = [
  'Customer Information',
  'Development',
  'Site Information',
  'EV Supply Equipment',
  'Make Ready Costs',
];

async function analyzeTemplate() {
  const workbook = new ExcelJS.Workbook();
  const filePath = path.join(__dirname, '..', 'templates', 'NY - PSEG Long Island - EVMakeReadyApp (Breakdown).xlsx');

  await workbook.xlsx.readFile(filePath);

  console.log('=== ALL SHEET NAMES ===');
  workbook.worksheets.forEach((ws, i) => console.log(`  [${i}] "${ws.name}"`));
  console.log('');

  for (const worksheet of workbook.worksheets) {
    if (!TARGET_SHEETS.includes(worksheet.name)) continue;

    console.log(`\n${'='.repeat(70)}`);
    console.log(`SHEET: "${worksheet.name}"`);
    console.log(`${'='.repeat(70)}`);

    // Merged cells
    const merges = worksheet.model.merges;
    if (merges && merges.length > 0) {
      console.log('\n--- MERGED CELLS ---');
      merges.forEach(m => console.log(`  ${m}`));
    } else {
      console.log('\n--- MERGED CELLS: none ---');
    }

    // Extend scan to row 80 for Customer Information, 60 for others
    const maxRow = 80;
    // Extend cols to P for wider sheets
    const colLetters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P'];

    console.log(`\n--- ROWS 1-${maxRow}, COLS A-P ---`);

    for (let rowNum = 1; rowNum <= maxRow; rowNum++) {
      const rowOutput = [];

      for (const col of colLetters) {
        const cell = worksheet.getCell(`${col}${rowNum}`);
        const val = cell.value;

        if (val === null || val === undefined || val === '') continue;

        let display = '';
        if (val && typeof val === 'object') {
          if (val.formula !== undefined) {
            const result = val.result !== undefined ? ` [result: ${JSON.stringify(val.result)}]` : '';
            display = `FORMULA(=${val.formula})${result}`;
          } else if (val.sharedFormula !== undefined) {
            const result = val.result !== undefined ? ` [result: ${JSON.stringify(val.result)}]` : '';
            display = `SHARED_FORMULA(=${val.sharedFormula})${result}`;
          } else if (val.richText !== undefined) {
            display = `"${val.richText.map(rt => rt.text).join('')}"`;
          } else if (val instanceof Date) {
            display = `DATE(${val.toISOString()})`;
          } else {
            display = `OBJ(${JSON.stringify(val)})`;
          }
        } else {
          display = JSON.stringify(val);
        }

        rowOutput.push(`  ${col}${rowNum}: ${display}`);
      }

      if (rowOutput.length > 0) {
        console.log(`\nRow ${rowNum}:`);
        rowOutput.forEach(r => console.log(r));
      }
    }
  }

  console.log('\n\n=== DONE ===');
}

analyzeTemplate().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
