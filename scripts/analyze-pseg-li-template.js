const ExcelJS = require('exceljs');
const path = require('path');

async function analyzeTemplate() {
  const workbook = new ExcelJS.Workbook();
  const filePath = path.join(__dirname, '..', 'templates', 'NY - PSEG Long Island - EVMakeReadyApp (Breakdown).xlsx');

  await workbook.xlsx.readFile(filePath);

  console.log('=== SHEET NAMES ===');
  const sheetNames = workbook.worksheets.map(ws => ws.name);
  sheetNames.forEach((name, i) => console.log(`  [${i}] ${name}`));
  console.log('');

  for (const worksheet of workbook.worksheets) {
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

    console.log('\n--- ROWS 1-40, COLS A-L ---');

    const colLetters = ['A','B','C','D','E','F','G','H','I','J','K','L'];

    for (let rowNum = 1; rowNum <= 40; rowNum++) {
      const row = worksheet.getRow(rowNum);
      let rowHasContent = false;
      const rowOutput = [];

      for (const col of colLetters) {
        const cell = worksheet.getCell(`${col}${rowNum}`);
        const val = cell.value;

        if (val === null || val === undefined || val === '') continue;

        rowHasContent = true;
        let display = '';

        if (val && typeof val === 'object') {
          if (val.formula !== undefined) {
            const result = val.result !== undefined ? ` [result: ${val.result}]` : '';
            display = `FORMULA(=${val.formula})${result}`;
          } else if (val.sharedFormula !== undefined) {
            const result = val.result !== undefined ? ` [result: ${val.result}]` : '';
            display = `SHARED_FORMULA(=${val.sharedFormula})${result}`;
          } else if (val.richText !== undefined) {
            display = `RICH_TEXT("${val.richText.map(rt => rt.text).join('')}")`;
          } else if (val instanceof Date) {
            display = `DATE(${val.toISOString()})`;
          } else {
            display = `OBJECT(${JSON.stringify(val)})`;
          }
        } else {
          display = JSON.stringify(val);
        }

        rowOutput.push(`  ${col}${rowNum}: ${display}`);
      }

      if (rowHasContent) {
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
