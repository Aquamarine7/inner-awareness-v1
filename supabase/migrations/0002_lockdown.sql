-- Sprint 4: Lock It Down
-- Single-owner app: any authenticated session IS the owner, so writes are
-- gated on auth.uid() is not null rather than matching a specific user_id
-- (visitor-created rows like submissions/votes have no owner at creation).

-- Posts: public reads only see published; owner (any authenticated session)
-- can read drafts and write.
drop policy if exists "posts_v1_read" on posts;
drop policy if exists "posts_v1_write" on posts;

create policy "posts_read_published_or_owner" on posts
  for select using (status = 'published' or auth.uid() is not null);

create policy "posts_owner_write" on posts
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

-- Submissions: visitors can still insert (the /submit form); only the
-- owner can review (update) or delete.
drop policy if exists "submissions_v1_write" on submissions;

create policy "submissions_public_insert" on submissions
  for insert with check (true);

create policy "submissions_owner_update" on submissions
  for update using (auth.uid() is not null) with check (auth.uid() is not null);

create policy "submissions_owner_delete" on submissions
  for delete using (auth.uid() is not null);

-- Subscribers: capture stays open (email capture form); only the owner can
-- read the list back (captured emails should not be publicly queryable).
drop policy if exists "subscribers_v1_read" on subscribers;

create policy "subscribers_owner_read" on subscribers
  for select using (auth.uid() is not null);

-- Audit logs: owner-only insert and read; no update/delete policy at all,
-- so rows are immutable/append-only once RLS is enforced.
drop policy if exists "audit_logs_v1_read" on audit_logs;
drop policy if exists "audit_logs_v1_write" on audit_logs;

create policy "audit_logs_owner_insert" on audit_logs
  for insert with check (auth.uid() is not null);

create policy "audit_logs_owner_read" on audit_logs
  for select using (auth.uid() is not null);

-- pain_points and votes are intentionally left open (public upvotes, no
-- login wall) per SECURITY.md and TASKS.md Sprint 4 scope.

-- Backfill existing posts to the owner account so they remain editable.
update posts set user_id = 'c9f39119-46d0-456d-8f19-5d1e6593b3b6' where user_id is null;
