# Architecture — Inner Awareness v1

## Stack
- **Frontend:** Next.js 14 (App Router) on Vercel
- **Database + Auth:** Supabase (Postgres + RLS + Auth)
- **Styling:** Tailwind CSS
- **AI (Sprint 3+):** OpenAI via server-side API route only

## What to Build Now vs Later
**Now:** Pain-point board, upvote engine, visitor submission form, owner post editor, post detail pages — all without a login wall.
**Later:** Owner auth, per-user RLS lockdown, AI auto-tagging, email newsletter, community profiles.

## Key User Action — Visitor Upvotes a Pain Point
1. Visitor opens `/pain-points` — Next.js server component fetches `pain_points` rows from Supabase.
2. Visitor clicks **Upvote** — client calls `/api/votes` (POST) with `pain_point_id` + browser fingerprint.
3. API route inserts a row into `votes`, then increments `pain_points.vote_count`.
4. Response returns the new count; UI updates optimistically and confirms on response.
5. On reload, the count is read directly from the DB — truth is always server-derived.

## Layer Plan
1. **Data first** — tables, constraints, RLS policies, seed rows.
2. **App logic** — CRUD API routes and server components; no AI dependency.
3. **Smart features** — AI tagging + scoring added in Sprint 3 on top of the working core.

## Why the Core Runs Without AI
Pain points, posts, votes, and submissions are all plain DB records. The AI layer only adds `ai_category` and `ai_intensity_score` fields — the board and submission queue work with or without them populated.
