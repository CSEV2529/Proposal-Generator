# Proposal Generator (ChargeSmart EV)

A Next.js web application for generating professional EV charging station proposals with PDF export, Excel utility breakdowns, and project management.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS (custom dark theme, CSEV branding)
- @react-pdf/renderer for PDF generation
- React Context (`ProposalContext`) for state management via `useReducer`
- Supabase (Postgres + auth) for project storage
- ExcelJS for Excel template exports
- Deployed on Netlify
- Dev port: 3000

## Commands

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Production build
- `npm run lint` - Run ESLint

## Project Structure

```
app/
├── page.tsx                  # Main proposal builder (multi-section form + sidebar)
├── layout.tsx                # Root layout with ProposalProvider
├── login/page.tsx            # Supabase email/password auth
├── projects/page.tsx         # Project list with search, status badges, edit/delete
└── api/export-excel/route.ts # Excel export endpoint (ExcelJS reads template, fills cells)

components/
├── forms/
│   ├── CustomerInfoForm.tsx      # Name, address, city, state, zip, date, project/access/location type
│   ├── EVSEForm.tsx              # Add EVSE from pricebook, quantity, price override, notes
│   ├── InstallationScopeForm.tsx # Add installation items (materials + labor), subgroups, quantities
│   ├── FinancialForm.tsx         # Margins, cost basis, incentives, network years, utility allowance
│   ├── SiteMapForm.tsx           # Image upload (base64 dataURL)
│   └── TemplateSelector.tsx      # State → Utility → Scope template (auto-populates items)
├── pdf/
│   ├── ProposalDocument.tsx      # 6-page customer proposal
│   ├── EstimateDocument.tsx      # Installer estimate (itemized costs)
│   ├── BudgetDocument.tsx        # Internal budget (not for distribution)
│   ├── CoverPage.tsx             # Hero image, project type, customer, date
│   ├── WhyCSEVPage.tsx           # Mission, target markets, location-specific value props
│   ├── ScopeOfWorkPage.tsx       # EVSE list, installation items, responsibilities
│   ├── FinancialSummaryPage.tsx  # Cost breakdown, incentives, net cost
│   ├── PaymentOptionsPage.tsx    # 3 options (100%, 50%, 0% upfront)
│   ├── SiteMapPage.tsx           # Embedded site map image
│   ├── PageWrapper.tsx           # Consistent header/footer/styling
│   ├── styles.ts, pdfTheme.ts   # PDF styling constants
│   ├── fonts.ts, fontData.ts    # Base64 font data
│   └── logo/image .ts files     # Base64 encoded images (logoDark, logoLight, heroLevel2, nodesImage)
└── ui/
    ├── Button.tsx   # Variants: primary, secondary, outline, ghost, danger
    ├── Input.tsx    # Styled input with label
    ├── Select.tsx   # Styled select dropdown
    └── Card.tsx     # Card container + StatsCard

context/
└── ProposalContext.tsx  # useReducer-based state management
    # Actions: SET_CUSTOMER_INFO, SET_PROJECT_TYPE, ADD/UPDATE/REMOVE_EVSE_ITEM,
    # ADD/UPDATE/REMOVE_INSTALLATION_ITEM, SET_PRICING_SETTINGS, SET_FINANCIAL,
    # SET_NETWORK_YEARS, SET_INCENTIVES, SET_TERMS, SET_SITE_MAP, RECALCULATE_ALL,
    # RESET_PROPOSAL, LOAD_PROPOSAL, SET_PROJECT_STATE, SET_UTILITY, APPLY_SCOPE_TEMPLATE
    # Auto-recalculates financials after every state change

lib/
├── types.ts              # Core types: Proposal (60+ fields), EVSEItem, InstallationItem,
│                         #   PricebookProduct, InstallationService, PaymentOption, PaymentOptionAnalysis
│                         #   ProjectType: level2-epc, level3-epc, mixed-epc, site-host, distribution
│                         #   ChargingLevel: level2, dcfc, both | AccessType: private, public
│                         #   LocationType: apartments, commercial, dealership, hospitality, municipalities, retail
├── constants.ts          # COMPANY_INFO, LABOR_RATE ($125/hr), WHY_CSEV_CONTENT,
│                         #   RESPONSIBILITIES, PAYMENT_OPTION_DETAILS, LOCATION_VALUE_PROPS,
│                         #   INCENTIVE_LABEL_DEFAULTS, FOOTNOTES, COVER_PAGE_TITLES
├── pricebook.ts          # 27 EVSE SKUs (Autel L2 + DCFC 60-320kW), 2 accessories,
│                         #   90+ installation services grouped by subgroup:
│                         #   New Service, Breakers, Panels, Transformers, Conduit,
│                         #   Cables, Trenching, Civil-Bases, Permits, Design, Striping
│                         #   Each product: unitPrice, csevCost, networkPlan1/3/5Year, shippingCost, numberOfPlugs
│                         #   Helpers: getSubgroups(), getServicesBySubgroup(), getProductById()
├── calculations.ts       # EVSE: actualCost, quotedPrice (cost / (1 - margin%)), ports, network, shipping
│                         #   Sales tax: only EPC + Site Host (not distribution)
│                         #   CSMR: pricebookTotal, actualCost (×costBasis%), quotedPrice (÷(1-margin%))
│                         #   Project: grossCost, netCost, grossProfit, grossMargin%
│                         #   Payment option analysis: revenue/profit/margin per option
│                         #   Format helpers: formatCurrency(), formatDate(), generateProposalNumber()
├── templates.ts          # 50 US states, 200+ utilities mapped to states
│                         #   7 scope templates: 4/6/8/10 Banger L2 (new/existing service),
│                         #   4/8 Banger 320kW DCFC
│                         #   Helpers: getAllStates(), getUtilitiesByState(), getScopeTemplateById()
├── supabase.ts           # Lazy client init, SSR dummy client, isSupabaseConfigured() guard
├── projectStorage.ts     # CRUD: getProjects(), getProject(id), createProject(), updateProject(),
│                         #   deleteProject(), searchProjects() — all use Supabase `projects` table
├── excelExport.ts        # National Grid: 14 cost categories → Make-Ready sheet cell mappings
│                         #   NYSEG/RG&E: 10 categories → L2/DCFC sheet cell mappings
│                         #   Markup: costBasis × marginMultiplier
└── utilityBreakdown.ts   # generateNationalGridBreakdown(), generateNYSEGRGEBreakdown()

templates/
├── National Grid Breakdown v2.xlsx    # Excel template with formulas
└── NYSEG & RG&E Breakdown.xlsx        # Separate L2/DCFC sheets
```

## Supabase Schema

**Table: `projects`**
- `id` UUID PK, `user_id` UUID FK → auth.users, `name` TEXT, `customer_name` TEXT
- `project_data` JSONB (serialized Proposal object), `status` TEXT (draft/sent/accepted/completed)
- `created_at`, `updated_at` TIMESTAMPTZ (auto-trigger on update)
- RLS: authenticated users can CRUD all projects
- Indexes on user_id, status, customer_name

## Financial System

- **EVSE margin**: default 50%, formula: `cost / (1 - margin%)`
- **CSMR cost basis**: default 100% + margin default 40%
- **Sales tax**: applies to EPC + Site Host only (not distribution)
- **Network plans**: 1/3/5 year options with cost vs. price
- **Incentives**: Make Ready, NYSERDA
- **Payment options**: 3 tiers (100%, 50%, 0% upfront) with profitability analysis

## Branding / Tailwind

- Primary: `csev-green` (#4CBC88), `csev-green-dark` (#3da876), `csev-green-light` (#6dd4a5)
- Dark theme: `csev-slate-900` (#1a1a1a) → `csev-slate-600` (#505050)
- Text: `csev-text-primary` (#e8e8e8), `csev-text-secondary` (#888888)
- UI: `csev-panel`, `csev-elevated`, `csev-hover`, `csev-border`
- Shadows: `shadow-glow`, `shadow-card`, `shadow-card-hover`
- Animations: `animate-pulse-glow`, `animate-fade-in`
- Fonts: `font-heading`, `font-body` (CSS vars, falls back to system-ui)

## Important Notes

- PDF components use dynamic imports with `ssr: false` to avoid hydration issues
- `next.config.js` disables canvas alias for @react-pdf/renderer compatibility
- Default proposal has test data pre-filled (Best Western Inn & Suites, Rochester, NY)
- Excel export is conditional — only shows for National Grid or NYSEG/RG&E utility selections
- Project save/load via URL query param `?project={id}`
- Auth allows local dev without login (Supabase optional in dev)
