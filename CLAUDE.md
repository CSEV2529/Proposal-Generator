# Proposal Generator (ChargeSmart EV)

A Next.js web application for generating professional EV charging station proposals with PDF export.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- @react-pdf/renderer for PDF generation
- React Context for state management

## Commands

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Production build
- `npm run lint` - Run ESLint

## Project Structure

- `/app` - Next.js app router pages
- `/components/forms` - Form components (CustomerInfo, EVSE, InstallationScope, Financial, SiteMap)
- `/components/pdf` - PDF document components for proposal generation
- `/components/ui` - Reusable UI components (Button, Input, Select, Card)
- `/context` - React Context (ProposalContext for state management)
- `/lib` - Utilities, types, constants, pricebook data, calculations

## Key Features

- Customer information entry
- EVSE equipment selection from pricebook with price override
- Installation scope builder (materials and labor)
- Automatic cost calculations
- Incentive tracking (Make Ready, NYSERDA)
- Site map image upload
- 6-page PDF proposal generation

## Notes

- PDF components use dynamic imports with `ssr: false` to avoid hydration issues
- Custom Tailwind colors: `csev-green`, `csev-green-dark`, `csev-green-light`
