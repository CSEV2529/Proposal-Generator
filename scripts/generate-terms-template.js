const ExcelJS = require('exceljs');
const path = require('path');

async function generateTermsTemplate() {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Additional Terms');

  // Headers
  sheet.columns = [
    { header: 'Project Type', key: 'projectType', width: 20 },
    { header: 'Row Label', key: 'label', width: 45 },
    { header: 'Notes Value', key: 'notes', width: 60 },
  ];

  // Style headers
  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4CBC88' },
  };
  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

  // The 5 project types with the 5 standard term rows each
  const projectTypes = [
    'Level 2 EPC',
    'Level 3 EPC',
    'Mixed EPC',
    'Site Host',
    'Distribution',
  ];

  const termLabels = [
    'Processing Fees',
    'Agreement Term (Years)',
    'Recommended $/kWh',
    'Party Responsible for Paying Network Fees',
    'Party Responsible for Paying Utility Bills',
  ];

  // Pre-fill with current default values (from the existing NJ reference)
  const defaultNotes = {
    'Processing Fees': '$0.49 per transaction + 9% standard processing',
    'Agreement Term (Years)': '5 Years (for Site Host Option, See LEASE)',
    'Recommended $/kWh': '$0.40/kWh',
    'Party Responsible for Paying Network Fees': 'CSEV Years 1-5; then Customer Years 6+ after Renewal',
    'Party Responsible for Paying Utility Bills': 'Customer (for Site Host Option, See LEASE)',
  };

  for (const pt of projectTypes) {
    for (let i = 0; i < termLabels.length; i++) {
      const label = termLabels[i];
      sheet.addRow({
        projectType: i === 0 ? pt : '', // Only show project type on first row of group
        label: label,
        notes: defaultNotes[label] || '',
      });
    }
    // Add a blank separator row
    sheet.addRow({});
  }

  // Add alternating group colors for readability
  let rowIdx = 2;
  const groupColors = ['FFE8F5E9', 'FFE3F2FD', 'FFFFF3E0', 'FFFCE4EC', 'FFF3E5F5'];
  for (let g = 0; g < projectTypes.length; g++) {
    for (let r = 0; r < 5; r++) {
      const row = sheet.getRow(rowIdx);
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: groupColors[g] },
      };
      rowIdx++;
    }
    rowIdx++; // skip separator
  }

  // Instructions sheet
  const instrSheet = workbook.addWorksheet('Instructions');
  instrSheet.getColumn(1).width = 80;
  instrSheet.addRow(['ADDITIONAL TERMS TEMPLATE — Instructions']);
  instrSheet.addRow(['']);
  instrSheet.addRow(['Fill in the "Notes Value" column for each Project Type / Row Label combination.']);
  instrSheet.addRow(['Each Project Type has 5 rows (the standard term labels).']);
  instrSheet.addRow(['']);
  instrSheet.addRow(['Project Types:']);
  instrSheet.addRow(['  - Level 2 EPC: AC charging infrastructure projects']);
  instrSheet.addRow(['  - Level 3 EPC: DC fast charging projects']);
  instrSheet.addRow(['  - Mixed EPC: Combination L2 + DCFC projects']);
  instrSheet.addRow(['  - Site Host: Site host agreement (customer doesn\'t pay upfront)']);
  instrSheet.addRow(['  - Distribution: Equipment distribution only']);
  instrSheet.addRow(['']);
  instrSheet.addRow(['You can also add extra rows per project type if needed — just keep the Project Type column filled.']);
  instrSheet.addRow(['']);
  instrSheet.addRow(['When done, save this file and let me know. I\'ll wire it into the PDF output.']);
  instrSheet.getRow(1).font = { bold: true, size: 14 };

  const outputPath = path.join(__dirname, '..', 'data', 'Additional-Terms-Template.xlsx');
  await workbook.xlsx.writeFile(outputPath);
  console.log(`Template written to: ${outputPath}`);
}

generateTermsTemplate().catch(console.error);
