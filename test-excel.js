const ExcelJS = require('exceljs');
const path = require('path');

async function test() {
  const file = path.join(__dirname, 'templates', 'NYSEG & RG&E Breakdown.xlsx');

  // Test 1: readFile WITHOUT clearing definedNames
  console.log('--- Test 1: readFile, no definedNames clear ---');
  const wb1 = new ExcelJS.Workbook();
  await wb1.xlsx.readFile(file);
  const s1 = wb1.getWorksheet('L2 costs');
  s1.getCell('C5').value = 'TEST CUSTOMER';
  s1.getCell('E25').value = 12345;
  const buf1 = await wb1.xlsx.writeBuffer();
  // Read it back
  const wb1b = new ExcelJS.Workbook();
  await wb1b.xlsx.load(Buffer.from(buf1));
  const s1b = wb1b.getWorksheet('L2 costs');
  console.log('C5:', s1b.getCell('C5').value);
  console.log('E25:', s1b.getCell('E25').value);
  console.log('definedNames:', wb1.definedNames.model);

  // Test 2: readFile WITH clearing definedNames
  console.log('\n--- Test 2: readFile, definedNames.model = [] ---');
  const wb2 = new ExcelJS.Workbook();
  await wb2.xlsx.readFile(file);
  wb2.definedNames.model = [];
  const s2 = wb2.getWorksheet('L2 costs');
  s2.getCell('C5').value = 'TEST CUSTOMER 2';
  s2.getCell('E25').value = 67890;
  const buf2 = await wb2.xlsx.writeBuffer();
  const wb2b = new ExcelJS.Workbook();
  await wb2b.xlsx.load(Buffer.from(buf2));
  const s2b = wb2b.getWorksheet('L2 costs');
  console.log('C5:', s2b.getCell('C5').value);
  console.log('E25:', s2b.getCell('E25').value);

  // Test 3: readFile, remove specific bad names only
  console.log('\n--- Test 3: readFile, selective name removal ---');
  const wb3 = new ExcelJS.Workbook();
  await wb3.xlsx.readFile(file);
  console.log('Defined names before:', JSON.stringify(wb3.definedNames.model));
  // Try removing names individually
  const names = wb3.definedNames.model || [];
  console.log('Name count:', names.length);
  names.forEach((n, i) => console.log(`  [${i}]`, JSON.stringify(n)));
}

test().catch(console.error);
