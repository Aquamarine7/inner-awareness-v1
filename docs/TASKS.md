# Tasks & Sprints — Inner Awareness v1

## Sprint 1 — Database & Public Pain Point Board
**Goal:** App is viewable without login; seeded pain points and posts render correctly.

- [ ] Run migration SQL on Supabase (tables + seed data)
- [ ] `/pain-points` page: server-rendered list of pain points, vote counts, categories
- [ ] Upvote button: POST to `/api/votes`, increments `vote_count`, updates UI
- [ ] `/posts` page: list of published posts with excerpt and linked pain point
- [ ] `/posts/[slug]` detail page: full body, pain point tag, email capture form stub
- [ ] Loading skeleton, empty state ("No posts yet"), and error boundary on every page
- [ ] Confirm `SUPABASE_SERVICE_ROLE_KEY` not in any client bundle

**Definition of Done:** Deploy to Vercel preview. Visit `/pain-points` cold — 5 pain points render with vote counts. Click upvote on any — count increments and persists on reload. Visit `/posts` — 3 posts render. No login prompt appears.

---

## Sprint 2 — Submission Form + Owner Post Editor ✦ v1 functional
**Goal:** The end-to-end success scenario is fully usable.

- [ ] `/submit` page: visitor form → saves to `submissions` table
- [ ] `/admin/posts` page: table of all posts with Edit / Delete actions
- [ ] `/admin/posts/new` and `/admin/posts/[id]/edit`: rich text editor, pain_point selector, status toggle
- [ ] `/admin/submissions`: list of pending submissions; owner can approve (→ linked to pain_point) or reject
- [ ] All CRUD actions persist + UI refreshes without full page reload
- [ ] Empty states: "No submissions yet", "No posts — create your first one"
- [ ] Audit log row written on every publish, approve, reject

**Definition of Done:** Full success scenario (PRD) passes manually from a fresh browser. Every button persists to DB. Reload confirms data survived. No dead buttons.

---

## Sprint 3 — AI Tagging & Pain Point Leaderboard
**Goal:** Submissions are auto-tagged; leaderboard uses weighted score.

- [ ] Server action on submission insert calls `tag_submission` tool (OpenAI)
- [ ] Stores `ai_category`, `ai_category_confidence`, `ai_category_review_status` on submission row
- [ ] Owner review queue highlights unreviewed AI tags; accept / override in one click
- [ ] Accept/override writes audit_log with `risk_level = 'low'`
- [ ] Pain point board re-sorted by weighted score (vote_count + intensity boost)

**Definition of Done:** Submit a new pain point → row appears in admin queue with AI category populated and `review_status = 'unreviewed'`. Owner accepts → `review_status` updates to `'accepted'`. Leaderboard reorders accordingly.

---

## Sprint 4 — Lock It Down
**Goal:** Only the owner can write; visitors read only.

- [ ] Enable Supabase Auth; owner account created
- [ ] `/admin` protected: redirect to `/login` if no session
- [ ] Replace v1 write policies with `auth.uid() = user_id` for posts, submissions, audit_logs
- [ ] Public read policies remain open for pain_points, posts (published only), votes
- [ ] Rotate Supabase service role key after policy change
- [ ] Verify: unauthenticated POST to `/api/votes` still works; unauthenticated POST to `/api/posts` returns 401

**Definition of Done:** Incognito browser cannot create/edit/delete posts or approve submissions. Owner session can. Pain point board and post pages still load without login.

---

## Sprint 5 — Email Capture & Subscriber Dashboard
**Goal:** Owner can grow and view a subscriber list.

- [ ] Email capture form on post detail page → inserts into `subscribers` with `source_post_id`
- [ ] Duplicate email returns friendly message, not a 500
- [ ] `/admin/subscribers`: paginated list, status toggle (active / unsubscribed)
- [ ] Newsletter draft tool: compose subject + body, preview render (no send in v1)
- [ ] Post view_count increments on each detail page load

**Definition of Done:** Submit an email on a post page → row in subscribers table. Visit admin/subscribers → row appears. Duplicate submission shows "You're already on the list."

---

## Gantt (sprint → deliverable)
```
Sprint 1: DB schema, seed data, public board, upvote engine
Sprint 2: Submission form, post editor, admin queue [← v1 functional]
Sprint 3: AI tagging, leaderboard scoring, review queue
Sprint 4: Auth, RLS lockdown, route protection
Sprint 5: Email capture, subscriber list, view counts
```
