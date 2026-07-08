# Test Plan — Inner Awareness v1

## Success Scenario (manual, Sprint 2+)
1. Open `/pain-points` in an incognito browser — 5 pain points render with vote counts.
2. Click **Upvote** on "Lost Sense of Direction" — count increments immediately.
3. Hard-refresh — count is unchanged (DB persisted).
4. Click the pain point card → navigates to its top post.
5. Read the post; submit email in capture form → success message shown.
6. Navigate to `/submit` — fill in a pain point description, submit → success message shown.
7. Open `/admin/submissions` — new submission appears with status `pending`.
8. Owner clicks **Approve** → status updates to `approved`; audit_log row created.
9. Owner opens `/admin/posts/new`, writes a post linked to "Lost Sense of Direction", sets status `published`, saves.
10. Navigate to `/posts` — new post appears. Click into it — full body renders.

## Empty State Tests
- Delete all seed posts → `/posts` shows "No posts published yet."
- Delete all seed pain points → `/pain-points` shows "No pain points tracked yet."
- Visit `/admin/submissions` with no submissions → shows "No submissions yet."

## Error State Tests
- Submit empty pain point form → inline validation, no DB call.
- Submit duplicate subscriber email → friendly message: "You're already on the list."
- Kill Supabase connection (wrong URL) → error boundary renders "Something went wrong, please try again."
- Attempt POST to `/api/posts` without owner session (Sprint 4+) → 401 returned, no DB write.

## AI Tag Tests (Sprint 3)
- Submit free-text pain point → within 5 s, `ai_category` and `ai_category_confidence` populated on row.
- `ai_category_review_status` = `'unreviewed'` on insert.
- Owner accepts tag → `review_status` = `'accepted'`; audit_log row written with `action = 'submission.ai_tag_accepted'`.
- Owner overrides tag → `ai_category` updated to owner's choice; `review_status` = `'overridden'`.

## Security Checks (Sprint 4)
- Inspect client JS bundle — `SUPABASE_SERVICE_ROLE_KEY` and `OPENAI_API_KEY` must not appear.
- Unauthenticated browser: can read pain_points and published posts; cannot write to posts or submissions via direct Supabase SDK call (RLS blocks it).
