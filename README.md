# Inner Awareness

A self-awareness platform for career women (25–35): a public pain-point board they
can vote on and add to, educational posts published by the owner, and an admin area
for reviewing submissions and growing a subscriber list. AI auto-tags each submission;
the board ranks by a weighted score.

**Live:** https://inner-awareness-v1.vercel.app

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, Server Actions, React 19) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (CSS-first, `@theme` in `app/globals.css`) |
| Fonts | Cormorant Garamond / Inter / Space Mono via `next/font` |
| Database + Auth | Supabase (Postgres + RLS + email auth) |
| AI | OpenAI `gpt-4o-mini`, server-side only |
| Deploy | Vercel (auto-deploys from `main`) |

## Core objects

`pain_points` · `posts` · `submissions` · `votes` · `subscribers` · `audit_logs`
(schema + seed in `supabase/migrations/0001_init.sql`; see `docs/DATA_MODEL.md`).

## The main flow

Visitor upvotes a pain point (persists) → reads a post → submits their own struggle
→ it's AI-tagged and lands in the owner's queue → owner approves it and publishes a
linked post → it goes live. Public pages need no login; only the owner can manage content.

## Local development

```bash
npm install
vercel link           # link to the Vercel project (one-time)
vercel env pull .env.local
npm run dev           # http://localhost:3000
```

`.env.local` needs (all pulled from Vercel): `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `OPENAI_API_KEY`. No service-role key is used —
the app relies on the anon key + RLS.

> On Windows without Node on PATH for spawned processes, `dev.cmd` wraps `npm run dev`
> with PATH set; `.claude/launch.json` points the preview at it. Both are git-ignored.

## Database & migrations

Migrations live in `supabase/migrations/` and are applied with the Supabase CLI:

```bash
export SUPABASE_ACCESS_TOKEN=<personal access token>
npx supabase link --project-ref pkcfazyyxntmkdtfqpbq
npx supabase db push
```

- `0001_init.sql` — tables, open v1 RLS, seed data
- `0002_lockdown.sql` — owner-only writes for posts/submission-review/audit; public
  reads/inserts kept for the board, votes, submissions, and email capture
- `0003_view_count_rpc.sql` — `increment_post_view` (SECURITY DEFINER) so anonymous
  post views can still bump `view_count` after lockdown

## Deploy

Deploy by git only — `git push` to `main`; Vercel builds and deploys. Never
`vercel deploy` with local files (it desyncs git). Commit every change.

## Owner / admin

`/admin/*` is gated behind Supabase email auth (redirects to `/login`). The owner
account is `sterlingmeds@live.com`; change the password anytime at `/admin/settings`.
Admin covers posts (CRUD), the submission review queue (approve/reject + accept/override
AI tags), subscribers, and a newsletter draft-and-preview tool.

## Project layout

```
app/
  page.tsx, pain-points/     public board + upvote engine
  posts/                     list + detail (+ email capture)
  submit/                    visitor submission form
  admin/                     owner area (posts, submissions, subscribers, settings)
  api/                       votes, submissions, subscribers route handlers
  Sidebar.tsx, BrandMark.tsx layout chrome
lib/                         supabase clients, types, audit, ai tagging, leaderboard
public/brand/                logo + symbol assets (SVG + PNG)
scripts/                     make-logo.mjs (brand assets), verify.mjs (E2E checks)
docs/                        PRD, architecture, data model, sprints, test plan
```

## Scripts

- `npm run dev` / `npm run build` / `npm run typecheck` / `npm run lint`
- `node scripts/make-logo.mjs` — regenerate brand assets into `public/brand/`
- `SUPA_PAT=<token> node scripts/verify.mjs` — run the end-to-end success-scenario
  checks against production (creates and then removes its own test data)

## Status

All five sprints in `docs/TASKS.md` are built, deployed, and verified end-to-end
(13/13 checks in `scripts/verify.mjs`). The visual system follows the Know Thyself /
Marine Vitality brand (Iris Garden palette, Cormorant/Inter/Space Mono).
