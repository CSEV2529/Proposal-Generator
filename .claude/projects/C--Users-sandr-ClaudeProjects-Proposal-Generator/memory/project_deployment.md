---
name: Deployment setup - Railway vs Netlify
description: Railway deploys from csev-alex/CSEVProposalTool dev-alex branch. Netlify (old Supabase) deploys from CSEV2529/Proposal-Generator main. Never touch origin/main.
type: project
---

Two separate deployments exist and must stay isolated:

- **Railway (active)**: Deploys from `myrepo` remote (`csev-alex/CSEVProposalTool`) branch `dev-alex`. Uses Railway Postgres + custom JWT auth. This is where all new work goes.
- **Netlify (legacy, still live)**: Deploys from `origin` remote (`CSEV2529/Proposal-Generator`) branch `main`. Uses Supabase. Other users still depend on this.

**Why:** Other users are still on the old Netlify/Supabase version. Any push to `origin/main` could break their workflow.

**How to apply:** Always commit and push to `myrepo dev-alex`. Never push to `origin/main`. After changes, push so Railway auto-deploys, then the user tests on their Railway URL.
