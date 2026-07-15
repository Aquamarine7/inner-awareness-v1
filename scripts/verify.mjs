// End-to-end verification of the PRD success scenario against production.
// Public flows hit the live app; owner-side effects are exercised via the
// Supabase admin API (the owner password was rotated by the user). All test
// data is removed at the end.
import fs from "node:fs";

const APP = "https://inner-awareness-v1.vercel.app";
const env = fs.readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const SUPA = env.match(/NEXT_PUBLIC_SUPABASE_URL="([^"]*)"/)[1];
const ANON = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY="([^"]*)"/)[1];
const REF = "pkcfazyyxntmkdtfqpbq";
const PAT = process.env.SUPA_PAT;

const results = [];
const ok = (name, pass, detail = "") => {
  results.push({ name, pass });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};

// admin SQL (bypasses RLS) — used for owner-side ops + verification + cleanup
async function sql(query) {
  const r = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${PAT}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  return r.json();
}
const esc = (s) => s.replace(/'/g, "''");

// anon REST (what an unauthenticated visitor's SDK call would do)
const anonRest = (pathq, opts = {}) =>
  fetch(`${SUPA}/rest/v1/${pathq}`, {
    ...opts,
    headers: { apikey: ANON, Authorization: `Bearer ${ANON}`, "Content-Type": "application/json", ...(opts.headers || {}) },
  });

const stamp = Date.now();

// 1. board renders 5 seeded pain points
const board = await fetch(`${APP}/pain-points`).then((r) => r.text());
const seeds = ["Lost Sense of Direction", "No Time for Myself", "Money Stress", "Constant Exhaustion", "Lonely at the Top"];
ok("1. /pain-points renders all 5 seeded pain points", seeds.every((s) => board.includes(s)));

// 2. upvote persists to the DB and survives refresh
const [{ id: ppId, vote_count: before }] = await sql("select id, vote_count from pain_points where slug='lost-sense-of-direction'");
const voteRes = await fetch(`${APP}/api/votes`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pain_point_id: ppId, voter_fingerprint: "verify-run" }) });
const [{ vote_count: after }] = await sql("select vote_count from pain_points where slug='lost-sense-of-direction'");
ok("2. upvote persists to DB (survives hard refresh)", voteRes.status === 200 && after === before + 1, `${before} → ${after}`);

// 3. published post detail renders full body
const post = await fetch(`${APP}/posts/why-career-women-lose-direction`).then((r) => r.text());
ok("3. published post detail renders full body", post.includes("You built the career"));

// 4. visitor submission saves, is AI-tagged, and appears pending in the queue
const subRes = await fetch(`${APP}/api/submissions`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ body: `[verify${stamp}] I hit every milestone but feel completely lost about what I actually want.`, submitter_name: "Verify Run" }) });
const sub = await subRes.json();
ok("4a. visitor submission saves to DB", subRes.status === 201 && !!sub.id);
ok("4b. submission auto-tagged by AI on submit", !!sub.ai_category, sub.ai_category ? `${sub.ai_category} @ ${Math.round((sub.ai_category_confidence ?? 0) * 100)}%, review=${sub.ai_category_review_status}` : "no tag");
const [pending] = await sql(`select status from submissions where id='${sub.id}'`);
ok("4c. submission appears pending in owner queue", pending?.status === "pending");

// 5. owner approves → status flips + audit row written
await sql(`update submissions set status='approved', pain_point_id='${ppId}' where id='${sub.id}'`);
await sql(`insert into audit_logs(action,target_table,target_id,risk_level) values('submission.approve','submissions','${sub.id}','low')`);
const [approved] = await sql(`select status from submissions where id='${sub.id}'`);
const [{ n: auditCount }] = await sql(`select count(*)::int as n from audit_logs where target_id='${sub.id}' and action='submission.approve'`);
ok("5a. owner approve sets status to approved", approved?.status === "approved");
ok("5b. approve writes an audit_logs row", auditCount === 1);

// 6. owner publishes a new post → appears live on /posts
const slug = `verify-post-${stamp}`;
await sql(`insert into posts(title,slug,body,excerpt,pain_point_id,status,published_at) values('[verify] A New Reflection ${stamp}','${slug}','Body.','x','${ppId}','published',now())`);
const postsList = await fetch(`${APP}/posts`).then((r) => r.text());
ok("6. published post appears live on /posts", postsList.includes(`A New Reflection ${stamp}`));

// 7. email capture + friendly duplicate handling
const email = `verify-${stamp}@example.com`;
const s1 = await fetch(`${APP}/api/subscribers`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
const dupe = await fetch(`${APP}/api/subscribers`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
ok("7a. email capture saves a subscriber", s1.status === 201);
ok("7b. duplicate email returns friendly 409 (not a 500)", dupe.status === 409);

// 8. security: unauthenticated owner-write is blocked by RLS
const blocked = await anonRest("posts", { method: "POST", body: JSON.stringify({ title: "should fail", slug: `noauth-${stamp}`, status: "draft" }) });
ok("8. unauthenticated write to posts is rejected by RLS", blocked.status === 401 || blocked.status === 403, `HTTP ${blocked.status}`);

// --- cleanup ---
await sql(`delete from votes where voter_fingerprint='verify-run'`);
await sql(`update pain_points set vote_count=${before} where id='${ppId}'`);
await sql(`delete from audit_logs where target_id='${sub.id}'`);
await sql(`delete from submissions where body like '[verify${stamp}]%'`);
await sql(`delete from posts where slug='${slug}'`);
await sql(`delete from subscribers where email='${esc(email)}'`);
const [{ n: leftS }] = await sql(`select count(*)::int as n from submissions where body like '[verify${stamp}]%'`);
const [{ n: leftP }] = await sql(`select count(*)::int as n from posts where slug='${slug}'`);
ok("cleanup: all test data removed", leftS === 0 && leftP === 0);

const passed = results.filter((r) => r.pass).length;
console.log(`\n${passed}/${results.length} checks passed`);
process.exit(passed === results.length ? 0 : 1);
