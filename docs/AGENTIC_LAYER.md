# Agentic Layer — Inner Awareness v1

## Risk Levels & Actions

### Low — Auto-execute (no approval needed)
- Auto-tag a new submission with category + intensity score
- Auto-increment `vote_count` on upvote
- Auto-set `published_at` when post status changes to `published`
- Write audit_log entry for every action

### Medium — Owner approves before executing
- Promote a submission to an official pain point entry
- Change a post from `draft` → `published`
- Override an AI-assigned category tag

### High — Owner explicitly confirms
- Send email to subscriber list (Sprint 5+)
- Bulk-reject or bulk-approve submissions

### Critical — Human only, no agent
- Delete a pain point (breaks FK references)
- Permanently delete a subscriber record
- Any action touching payment or legal data

## Named Tools (approved list)
- `tag_submission` — calls OpenAI, writes ai_* fields, sets review_status = 'unreviewed'
- `publish_post` — sets status + published_at, writes audit_log
- `approve_submission` — updates submission.status, optionally creates pain_point row
- `cast_vote` — inserts vote row, increments vote_count
- `capture_subscriber` — inserts subscriber row

## Audit Log Fields (per action)
`action`, `target_table`, `target_id`, `old_value`, `new_value`, `risk_level`, `user_id`, `created_at`

## v1 vs Later
- **v1:** `cast_vote` and `capture_subscriber` auto; all post/submission actions manual by owner
- **Sprint 3:** `tag_submission` added as low-risk auto action
- **Later:** draft newsletter tool (medium risk, owner approves before send)
