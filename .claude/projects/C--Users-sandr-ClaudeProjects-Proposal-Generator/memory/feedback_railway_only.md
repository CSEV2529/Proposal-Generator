---
name: Dev workflow - localhost then push to Railway
description: Develop and test on localhost (dev server). Push to Railway only when changes are ready. Don't push after every small change.
type: feedback
---

Use localhost for development and testing. Push to Railway only when the user says it's ready or a batch of changes is complete.

**Why:** Waiting for Railway builds after every change is too slow. Localhost with Next.js hot-reload gives instant feedback. Railway is for production — push periodically, not after every edit.

**How to apply:**
- Keep the dev server running (start it at the beginning of sessions)
- Tell the user to test on localhost for iterating
- Only commit + push to `myrepo dev-alex` when the user says to push, or when a logical batch of work is done
- Railway auto-deploys from `myrepo/dev-alex` on `csev-alex/CSEVProposalTool`
- Never push to `origin/main` (Netlify/Supabase still live for other users)
