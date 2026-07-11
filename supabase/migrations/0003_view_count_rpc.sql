-- posts writes are now owner-only (Sprint 4 lockdown), but anonymous
-- visitors still need to increment view_count on a published post detail
-- view. A narrow SECURITY DEFINER function lets anon do just that,
-- without granting broader write access to posts.
create or replace function increment_post_view(post_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update posts
  set view_count = view_count + 1
  where id = post_id and status = 'published';
end;
$$;

grant execute on function increment_post_view(uuid) to anon, authenticated;
