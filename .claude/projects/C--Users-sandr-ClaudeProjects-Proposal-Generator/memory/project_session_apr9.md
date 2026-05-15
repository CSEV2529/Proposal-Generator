---
name: Session progress Apr 9 2026
description: Major updates completed - admin system, 7 Excel exports (PSEG LI added), corruption fixes, cents toggle, PDF fix, Railway deploy
type: project
---

Completed on 2026-04-09:

1. **PDF font bug fix**: EstimateDocument and BudgetDocument were missing `import './fonts'` — downloads only worked after downloading Proposal first
2. **Admin user invite system**: /admin page, create/delete users, role management, forced password change on first login, JWT carries role+mustChangePassword
3. **Railway deployment**: App deployed from `myrepo/dev-alex` (csev-alex/CSEVProposalTool). Postgres + custom JWT auth (no Supabase). Next.js upgraded to 14.2.35 for security.
4. **7 Excel breakdown exports**: National Grid NY, NYSEG/RG&E, Central Hudson NY, PSEG Long Island NY, Eversource MA, National Grid MA, Seattle City Light WA.
5. **Excel corruption fix**: `cleanWorkbook()` in route.ts strips defined names, conditional formatting (x14 extLst), and tables after every readFile. CfRuleXform monkey-patch for PSEG LI. All 7 templates open without corruption warnings.
6. **Template renaming**: All templates renamed to `State - Utility (Breakdown).xlsx` convention.
7. **Eversource MA mapping refinements**: Grass trenching→row 14 (non-continuously paved), asphalt→row 13. Bollards/concrete footings/hand holes split from Civil-Bases. Conduit fittings: costs included but not footage. Exact totals (no rounding gaps). Item descriptions in Specify notes column. ChargeSmart EV installer info.
8. **Cents toggle**: Button above stats cards toggles cents display across sidebar + FinancialForm.
9. **Stat card sizing**: Reduced font clamp so Gross/Net Cost values don't get cut off.

**Why:** Building out the proposal tool for multi-state utility support and production use on Railway.

**How to apply:** When working on Excel exports, each utility has its own cell mapping, category mapping, and prepare/write functions in excelExport.ts and route.ts. All write functions must call `cleanWorkbook(workbook)` right after readFile. MA templates also need `convertStructuredRefsAndRemoveTables()`. NJ PSEG/JCP&L PDF template exists but isn't wired yet — next priority.
