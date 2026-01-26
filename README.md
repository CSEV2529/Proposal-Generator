# ChargeSmart EV Proposal Generator

A Next.js web application for generating professional EV charging station proposals.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- Customer information entry
- EVSE equipment selection from pricebook with price override capability
- Installation scope builder (materials and labor)
- Automatic cost calculations
- Incentive tracking (Make Ready, NYSERDA)
- Site map image upload
- PDF generation with 6 professional pages:
  1. Cover Page
  2. Why ChargeSmart EV
  3. Scope of Work
  4. Financial Summary
  5. Payment Options
  6. Site Map

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- @react-pdf/renderer
- React Hook Form + Zod
- Lucide React icons
