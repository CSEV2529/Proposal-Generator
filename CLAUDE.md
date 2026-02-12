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
│                         #   ProjectType: level2-epc, level3-epc, mixed-epc, site-host, level2-site-host, distribution
│                         #   ChargingLevel: level2, dcfc, both | AccessType: private, public
│                         #   LocationType: apartments, commercial, dealership, hospitality, municipalities, retail
├── constants.ts          # COMPANY_INFO, LABOR_RATE ($125/hr), WHY_CSEV_CONTENT,
│                         #   RESPONSIBILITIES, LOCATION_VALUE_PROPS,
│                         #   INCENTIVE_LABEL_DEFAULTS, FOOTNOTES, COVER_PAGE_TITLES
│                         #   PaymentOptionConfig[], PAYMENT_OPTIONS_BY_PROJECT_TYPE (per-project-type arrays)
│                         #   getPaymentOptions(), getValuePropForContext(), getAdditionalTerms()
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
- **Payment options**: Per-project-type PaymentOptionConfig[] arrays in constants.ts
  - Each project type owns 1-3 options with independent cost%, rev share%, warranty, descriptions
  - Per-proposal overrides: paymentOptionCostPercentOverrides, paymentOptionRevShareOverrides, paymentOptionCostOverrides (dollar)
  - paymentOptionEnabled[] controls PDF output; all options always visible in webapp
  - Option 1 always enabled by default; Site Host Options 2+ off by default
  - Profitability: Customer Discount = (1 - costPercent/100) * grossProjectCost
  - costLabel on warrantyUpgrades for custom display text (used by mixed-epc dual pricing)
  - Warranty text splits on `;` in PDF for multi-level display (L2/DCFC)

## Branding / Tailwind

- Primary: `csev-green` (#4CBC88), `csev-green-dark` (#3da876), `csev-green-light` (#6dd4a5)
- Dark theme: `csev-slate-900` (#1a1a1a) → `csev-slate-600` (#505050)
- Text: `csev-text-primary` (#e8e8e8), `csev-text-secondary` (#888888)
- UI: `csev-panel`, `csev-elevated`, `csev-hover`, `csev-border`
- Shadows: `shadow-glow`, `shadow-card`, `shadow-card-hover`
- Animations: `animate-pulse-glow`, `animate-fade-in`
- Fonts: `font-heading`, `font-body` (CSS vars, falls back to system-ui)

## PDF Page Design (dev-alex branch)

### Fonts
- **Orbitron**: Display/title font (400, 700, 900 weights) — registered from base64 in `fonts.ts`
- **Roboto**: Body font (300, 400, 500, 700 weights) — registered from base64 in `fonts.ts`
- **Hyphenation disabled**: `Font.registerHyphenationCallback((word) => [word])` — words never split mid-word
- **IMPORTANT**: react-pdf does NOT support `textDecoration: 'underline'` or `fontStyle: 'italic'` (no italic fonts registered). Use `borderBottom` for underline effects.

### PageWrapper (`components/pdf/PageWrapper.tsx`)
- Wraps all pages 2-6 with consistent layout
- Props: `pageNumber`, `showDisclaimer`, `showBackground`, `disclaimerText`, `disclaimerBorder`
- Background: nodes image at 7.5% opacity
- Footer: green line + "ChargeSmart EV Proposal" left, page number right (Roboto)
- Disclaimer footer (absolute, bottom 45): default DISCLAIMER_TEXT, or custom text via `disclaimerText` prop
- `disclaimerBorder={false}` removes green line above disclaimer (used on Page 3)
- Content padding: 40 top, 50 bottom (no disclaimer) or 90 bottom (with disclaimer)

### Page 1 — CoverPage
- Hero image: 390px height
- Company name: fontWeight 700, address: fontWeight 500
- "PREPARED FOR:" label: Orbitron font
- Logo: paddingTop 20, paddingBottom 18
- flexGrow spacer pushes "Prepared On" toward bottom

### Page 2 — WhyCSEVPage
- Title: Orbitron 28px white, marginBottom 12
- Subtitle: Roboto 11px green, left-aligned
- Installation image (left 35%): height 242px, bottom-aligns with What We Offer box
- 2x3 market grid: boxes with green left border, 9.5px text
- "...and more": right-aligned, vertically centered between grid and offer section
- What We Offer: marginHorizontal 3 (aligns with grid edges), green left border
- Bottom section: fixed height 380px — Mission (left 60%) + Station image (right 40%)
- Mission: no background box, Roboto 10.5px, paddingTop 14
- Station image: height 370, bottom-aligned
- Images keyed by ProjectType — only level2-epc has images currently
- Image files: `installationImageL2.ts`, `stationImageL2.ts` (base64, resized to 600px via sharp)

### Page 3 — ScopeOfWorkPage
- Title: Orbitron 28px white, marginBottom 8
- Table header: green left border, Item/Quantity columns (no Notes column)
- EVSE section: fixed 4 slots (ROW_HEIGHT 15px each)
  - Max 3 user EVSE items + 1 auto-generated "EV Parking Signs" row
  - Webapp warns at 3 EVSE items (4th slot reserved for signs)
  - Unfilled slots render as empty space (no dashes)
- Installation Scope section: fixed 25 slots (ROW_HEIGHT 15px)
  - Webapp warns at 25 items, Add Item disables
  - "Delete All" button with confirmation dialog
  - `CLEAR_INSTALLATION_ITEMS` reducer action
  - Unfilled slots render as empty space
- Quantities formatted with comma separators via `formatQty()`
- `defaultNote` field on InstallationService/InstallationItem (populated in pricebook, not rendered in PDF)
- Responsibilities: side-by-side CSEV + Customer boxes with green header bars, items with bottom-border dividers (no bullets)
- SOW Disclaimer: shown via PageWrapper's disclaimer footer with `disclaimerBorder={false}` (no green line)
- Uses `showDisclaimer={true}` with custom `disclaimerText`

### react-pdf Gotchas
- `flex: 1` on content can cause page overflow — use fixed heights instead
- `gap` works in flex rows but can be unreliable
- Images need explicit width/height dimensions
- `textDecoration` and `fontStyle: 'italic'` not supported
- Fixed heights preferred for page-constrained layouts

## Pricebook Data

- **Source of truth**: Currently hardcoded in `lib/pricebook.ts`
- **Excel export**: `data/CSEV-PriceBook.xlsx` generated from current data (2 sheets: EVSE Products, Installation Services + Notes column)
- **Generator script**: `scripts/generate-pricebook-excel.js` — run `node scripts/generate-pricebook-excel.js`
- **Legacy import script**: `read-pricebook.js` — originally read from `PriceBook-2026.01.26-v2.xlsx`
- 29 EVSE products (L2 chargers, DCFC, DCHP sets, accessories)
- 82 installation services across 11 subgroups

## Webapp Layout (dev-alex branch)

- Header: `sticky top-0 z-40`
- Sidebar (right): `sticky top-[104px]` — calibrated to match header height + main padding
- Grid: no `items-start` (breaks sticky behavior)
- Stat values: `clamp(1.25rem, 4vw, 2rem)` with overflow hidden

## Important Notes

- PDF components use dynamic imports with `ssr: false` to avoid hydration issues
- `next.config.js` disables canvas alias for @react-pdf/renderer compatibility
- Default proposal has test data pre-filled (Best Western Inn & Suites, Rochester, NY)
- Excel export is conditional — only shows for National Grid or NYSEG/RG&E utility selections
- Project save/load via URL query param `?project={id}`
- Auth allows local dev without login (Supabase optional in dev)
- All PDF page titles use Orbitron 28px white with marginBottom 12 (consistent across pages 2-6)
- Each PDF page MUST fit on exactly 1 page — use fixed heights, not flex
