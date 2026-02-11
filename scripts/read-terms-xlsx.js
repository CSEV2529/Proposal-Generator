const ExcelJS = require('exceljs');
const path = require('path');

async function readTerms() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(path.join(__dirname, '..', 'public', 'Additional Terms Sections.xlsx'));

  for (const sheet of workbook.worksheets) {
    console.log(`\n=== SHEET: "${sheet.name}" ===`);
    sheet.eachRow({ includeEmpty: false }, (row, rowNum) => {
      const values = [];
      row.eachCell({ includeEmpty: true }, (cell, colNum) => {
        values.push(`[${colNum}] ${cell.value ?? ''}`);
      });
      console.log(`Row ${rowNum}: ${values.join(' | ')}`);
    });
  }
}

readTerms().catch(console.error);
