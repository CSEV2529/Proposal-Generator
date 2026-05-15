#!/usr/bin/env node
'use strict';

const ExcelJS = require('exceljs');
const path = require('path');

// Monkey-patch to prevent table parse errors from crashing
try {
  const TableXform = require('exceljs/lib/xlsx/xform/table/table-xform');
  const origParseClose = TableXform.prototype.parseClose;
  TableXform.prototype.parseClose = function(name) {
    try { return origParseClose.call(this, name); } catch { return true; }
  };
} catch (e) {
  console.warn('  [WARN] Could not apply TableXform monkey-patch:', e.message);
}

const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');

const FILES = [
  'NY - National Grid EV (Breakdown).xlsx',
  'NY - NYSEG & RG&E (Breakdown).xlsx',
  'NY - Central Hudson EV MRP Project Cost (Breakdown).xlsx',
  'NY - PSEG Long Island - EVMakeReadyApp (Breakdown).xlsx',
  'MA - Eversource EV Estimate (Breakdown).xlsx',
  'MA - National Grid MA EV Make Ready Estimate (Breakdown).xlsx',
  'WA - Seattle City Light - TE Portfolio Contractor Cost Template (Breakdown).xlsx',
];

function sep(char = '─', len = 80) {
  return char.repeat(len);
}

async function diagnoseFile(filename) {
  const filePath = path.join(TEMPLATES_DIR, filename);
  console.log('\n' + sep('═'));
  console.log(`FILE: ${filename}`);
  console.log(sep('═'));

  const wb = new ExcelJS.Workbook();
  try {
    await wb.xlsx.readFile(filePath);
  } catch (err) {
    console.log(`  [ERROR] Failed to read file: ${err.message}`);
    return;
  }

  // 5. Sheet count and names
  const sheetNames = wb.worksheets.map(ws => ws.name);
  console.log(`\n[SHEETS] Count: ${sheetNames.length}`);
  sheetNames.forEach((name, i) => console.log(`  ${i + 1}. "${name}"`));

  // 4. Defined Names
  const definedNames = wb.definedNames;
  let dnEntries = [];
  if (definedNames) {
    // ExcelJS exposes definedNames as an object with a model or as a map-like structure
    if (typeof definedNames.model !== 'undefined') {
      dnEntries = definedNames.model || [];
    } else if (typeof definedNames._names !== 'undefined') {
      dnEntries = Object.entries(definedNames._names);
    } else if (typeof definedNames.getNames === 'function') {
      dnEntries = definedNames.getNames();
    } else {
      // Try iterating
      try {
        for (const name of Object.keys(definedNames)) {
          if (typeof definedNames[name] !== 'function') {
            dnEntries.push([name, definedNames[name]]);
          }
        }
      } catch {}
    }
  }

  // Try alternate access via workbook internals
  let rawDefinedNames = [];
  try {
    const dn = wb._definedNames || wb.definedNames;
    if (dn && dn._defined) {
      rawDefinedNames = Object.entries(dn._defined);
    } else if (dn && dn.model) {
      rawDefinedNames = Array.isArray(dn.model)
        ? dn.model.map(d => [d.name, d.value || d.ranges || ''])
        : Object.entries(dn.model);
    }
  } catch {}

  // Combine
  const allDN = rawDefinedNames.length > 0 ? rawDefinedNames : dnEntries;
  console.log(`\n[DEFINED NAMES] Count: ${allDN.length}`);
  if (allDN.length > 0) {
    allDN.slice(0, 50).forEach(entry => {
      if (Array.isArray(entry)) {
        console.log(`  "${entry[0]}" → ${JSON.stringify(entry[1])}`);
      } else if (entry && entry.name) {
        console.log(`  "${entry.name}" → ${entry.value || entry.ranges || JSON.stringify(entry)}`);
      }
    });
    if (allDN.length > 50) console.log(`  ... and ${allDN.length - 50} more`);
  } else {
    console.log('  (none found)');
  }

  // Per-sheet details
  for (const ws of wb.worksheets) {
    console.log(`\n  ${sep('-', 60)}`);
    console.log(`  SHEET: "${ws.name}"`);
    console.log(`  ${sep('-', 60)}`);

    // 1. Tables
    const tables = ws.tables || {};
    const tableEntries = Object.entries(tables);
    console.log(`\n  [TABLES] Count: ${tableEntries.length}`);
    if (tableEntries.length > 0) {
      tableEntries.forEach(([key, tableObj]) => {
        const t = tableObj.table || tableObj;
        const name = t.name || key;
        const ref = t.ref || t.tableRef || t.tableRange || '?';
        const cols = (t.columns || []).length;
        console.log(`    Table: "${name}"  ref: ${ref}  columns: ${cols}`);
        // Show column names
        if (t.columns && t.columns.length > 0) {
          t.columns.forEach(col => {
            console.log(`      col: "${col.name}" filterButton: ${col.filterButton}`);
          });
        }
        // Show any totalsRow config
        if (t.totalsRow) console.log(`      totalsRow: true`);
        if (t.showFirstColumn !== undefined) console.log(`      showFirstColumn: ${t.showFirstColumn}`);
        if (t.showLastColumn !== undefined) console.log(`      showLastColumn: ${t.showLastColumn}`);
        if (t.showRowStripes !== undefined) console.log(`      showRowStripes: ${t.showRowStripes}`);
        if (t.showColumnStripes !== undefined) console.log(`      showColumnStripes: ${t.showColumnStripes}`);
      });
    } else {
      console.log('    (none)');
    }

    // 2. Conditional Formatting
    const cfList = ws.conditionalFormattings || [];
    let cfCount = 0;
    let cfRules = [];
    if (Array.isArray(cfList)) {
      cfCount = cfList.length;
      cfRules = cfList;
    } else if (typeof cfList === 'object') {
      const entries = Object.entries(cfList);
      cfCount = entries.length;
      cfRules = entries.map(([ref, rules]) => ({ ref, rules }));
    }
    console.log(`\n  [CONDITIONAL FORMATTING] Rule count: ${cfCount}`);
    if (cfCount > 0) {
      const limit = Math.min(cfCount, 10);
      cfRules.slice(0, limit).forEach((entry, i) => {
        if (entry.ref !== undefined) {
          // Object form
          const rules = Array.isArray(entry.rules) ? entry.rules : [entry];
          console.log(`    CF[${i}] ref: ${entry.ref || entry.sqref || '?'}  rules: ${rules.length}`);
          rules.forEach(r => {
            console.log(`      type: "${r.type || r.cfvo || '?'}"  operator: "${r.operator || ''}"  priority: ${r.priority || ''}`);
          });
        } else {
          // Array entry
          console.log(`    CF[${i}] type: "${entry.type || '?'}"  ref/sqref: "${entry.ref || entry.sqref || '?'}"`);
        }
      });
      if (cfCount > 10) console.log(`    ... and ${cfCount - 10} more CF rules`);
    } else {
      console.log('    (none)');
    }

    // 3. Data Validations
    const dvMap = ws.dataValidations;
    let dvEntries = [];
    if (dvMap) {
      if (dvMap.model && Array.isArray(dvMap.model)) {
        dvEntries = dvMap.model;
      } else if (dvMap._validations) {
        dvEntries = Object.entries(dvMap._validations);
      } else if (typeof dvMap === 'object') {
        // Try iterating direct keys
        try {
          for (const [k, v] of Object.entries(dvMap)) {
            if (typeof v !== 'function' && k !== 'model') {
              dvEntries.push([k, v]);
            }
          }
        } catch {}
      }
    }
    // Also try model on the dvMap
    if (dvEntries.length === 0 && dvMap && dvMap.model) {
      const m = dvMap.model;
      if (Array.isArray(m)) dvEntries = m;
      else if (typeof m === 'object') dvEntries = Object.entries(m);
    }

    console.log(`\n  [DATA VALIDATIONS] Count: ${dvEntries.length}`);
    if (dvEntries.length > 0) {
      dvEntries.slice(0, 20).forEach((entry, i) => {
        if (Array.isArray(entry)) {
          const [ref, dv] = entry;
          console.log(`    DV[${i}] sqref: "${ref}"  type: "${dv.type || '?'}"  operator: "${dv.operator || ''}"`);
          if (dv.formulae) console.log(`      formulae: ${JSON.stringify(dv.formulae)}`);
          if (dv.showDropDown !== undefined) console.log(`      showDropDown: ${dv.showDropDown}`);
          if (dv.prompt) console.log(`      prompt: "${dv.prompt}"`);
          if (dv.error) console.log(`      error: "${dv.error}"`);
        } else if (entry && entry.sqref) {
          console.log(`    DV[${i}] sqref: "${entry.sqref}"  type: "${entry.type || '?'}"  operator: "${entry.operator || ''}"`);
          if (entry.formulae) console.log(`      formulae: ${JSON.stringify(entry.formulae)}`);
        } else {
          console.log(`    DV[${i}]: ${JSON.stringify(entry).slice(0, 200)}`);
        }
      });
      if (dvEntries.length > 20) console.log(`    ... and ${dvEntries.length - 20} more`);
    } else {
      console.log('    (none)');
    }

    // 6. Merged cells (count only)
    const merges = ws._merges || ws.mergeCells || {};
    let mergeCount = 0;
    if (typeof merges === 'object') {
      mergeCount = Object.keys(merges).length;
    } else if (Array.isArray(merges)) {
      mergeCount = merges.length;
    }
    // Also try via model
    if (mergeCount === 0 && ws.model && ws.model.merges) {
      mergeCount = ws.model.merges.length;
    }
    console.log(`\n  [MERGED CELLS] Count: ${mergeCount}`);
  }
}

async function main() {
  console.log('ExcelJS Template Diagnostic Report');
  console.log('Generated: ' + new Date().toISOString());
  console.log(`ExcelJS version: ${require('exceljs/package.json').version}`);

  for (const file of FILES) {
    await diagnoseFile(file);
  }

  console.log('\n' + sep('═'));
  console.log('DONE');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
