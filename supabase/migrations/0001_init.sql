create table if not exists pain_points (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  title text not null,
  slug text not null unique,
  description text,
  category text,
  vote_count integer not null default 0,
  display_order integer not null default 0
);

alter table pain_points enable row level security;
drop policy if exists "pain_points_v1_read" on pain_points;
create policy "pain_points_v1_read" on pain_points for select using (true);
drop policy if exists "pain_points_v1_write" on pain_points;
create policy "pain_points_v1_write" on pain_points for all using (true) with check (true);

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  title text not null,
  slug text not null unique,
  body text,
  excerpt text,
  pain_point_id uuid references pain_points(id),
  status text not null default 'draft',
  published_at timestamptz,
  view_count integer not null default 0
);

alter table posts enable row level security;
drop policy if exists "posts_v1_read" on posts;
create policy "posts_v1_read" on posts for select using (true);
drop policy if exists "posts_v1_write" on posts;
create policy "posts_v1_write" on posts for all using (true) with check (true);

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  body text not null,
  submitter_name text,
  status text not null default 'pending',
  pain_point_id uuid references pain_points(id),
  ai_category text,
  ai_category_source text,
  ai_category_confidence numeric,
  ai_category_review_status text default 'unreviewed',
  ai_intensity_score numeric,
  ai_intensity_score_source text,
  ai_intensity_score_confidence numeric,
  ai_intensity_score_review_status text default 'unreviewed'
);

alter table submissions enable row level security;
drop policy if exists "submissions_v1_read" on submissions;
create policy "submissions_v1_read" on submissions for select using (true);
drop policy if exists "submissions_v1_write" on submissions;
create policy "submissions_v1_write" on submissions for all using (true) with check (true);

create table if not exists votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  pain_point_id uuid references pain_points(id),
  voter_fingerprint text
);

alter table votes enable row level security;
drop policy if exists "votes_v1_read" on votes;
create policy "votes_v1_read" on votes for select using (true);
drop policy if exists "votes_v1_write" on votes;
create policy "votes_v1_write" on votes for all using (true) with check (true);

create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  email text not null unique,
  first_name text,
  source_post_id uuid references posts(id),
  status text not null default 'active'
);

alter table subscribers enable row level security;
drop policy if exists "subscribers_v1_read" on subscribers;
create policy "subscribers_v1_read" on subscribers for select using (true);
drop policy if exists "subscribers_v1_write" on subscribers;
create policy "subscribers_v1_write" on subscribers for all using (true) with check (true);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  action text not null,
  target_table text,
  target_id uuid,
  old_value jsonb,
  new_value jsonb,
  risk_level text
);

alter table audit_logs enable row level security;
drop policy if exists "audit_logs_v1_read" on audit_logs;
create policy "audit_logs_v1_read" on audit_logs for select using (true);
drop policy if exists "audit_logs_v1_write" on audit_logs;
create policy "audit_logs_v1_write" on audit_logs for all using (true) with check (true);

insert into pain_points (title, slug, description, category, vote_count, display_order) values
  ('No Time for Myself', 'no-time-for-myself', 'Juggling career, home, and personal needs leaves little room to breathe, let alone grow.', 'time', 42, 1),
  ('Money Stress', 'money-stress', 'Earning well but still feeling financially stretched — savings feel impossible.', 'money', 38, 2),
  ('Constant Exhaustion', 'constant-exhaustion', 'Running on empty every day with no real recovery or rest.', 'energy', 51, 3),
  ('Lonely at the Top', 'lonely-at-the-top', 'Hard to find meaningful relationships that match where you are in life.', 'relationships', 29, 4),
  ('Lost Sense of Direction', 'lost-sense-of-direction', 'Achieving goals but still asking "is this actually what I want?" with no clear answer.', 'direction', 60, 5)
on conflict (slug) do nothing;

insert into posts (title, slug, body, excerpt, pain_point_id, status, published_at) values
  ('Why Career Women Lose Their Direction (And How to Find It)', 'why-career-women-lose-direction',
   'You built the career. You hit the milestones. And yet something feels hollow. This is one of the most common — and least talked about — struggles for women between 25 and 35. Direction is not a destination; it is a daily practice of asking honest questions about what you actually value...',
   'You built the career. You hit the milestones. And yet something feels hollow.',
   (select id from pain_points where slug = 'lost-sense-of-direction'), 'published', now() - interval '3 days'),
  ('5 Signs Your Exhaustion Is Emotional, Not Physical', '5-signs-emotional-exhaustion',
   'When rest does not restore you, the problem is rarely your sleep schedule. Emotional exhaustion accumulates silently — through unspoken resentments, unexpressed needs, and relentless performance. Here is how to tell the difference and what to do about it...',
   'When rest does not restore you, the problem is rarely your sleep schedule.',
   (select id from pain_points where slug = 'constant-exhaustion'), 'published', now() - interval '1 day'),
  ('The Real Reason You Feel Broke on a Good Salary', 'feel-broke-on-good-salary',
   'It is not the avocado toast. It is not poor discipline. For many career women, financial stress is rooted in invisible emotional spending patterns and a deeply held belief that money safety is someone else''s job...',
   'It is not the avocado toast. Financial stress often runs deeper than the numbers.',
   (select id from pain_points where slug = 'money-stress'), 'published', now() - interval '5 days')
on conflict (slug) do nothing;

insert into submissions (body, submitter_name, status, pain_point_id) values
  ('I work 10-hour days and still feel like I am falling behind. No time to cook, exercise, or even call my mum.', 'Anonymous', 'pending', (select id from pain_points where slug = 'no-time-for-myself')),
  ('I make decent money but I am always anxious about it. I do not even know what financial security would feel like.', 'Temi O.', 'pending', (select id from pain_points where slug = 'money-stress')),
  ('I have great friends but nobody really gets what it is like to be building something. I feel very alone in my ambitions.', 'Anonymous', 'pending', (select id from pain_points where slug = 'lonely-at-the-top'))
on conflict do nothing;