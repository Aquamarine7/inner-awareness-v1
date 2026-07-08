# Security — Inner Awareness v1

## Secret Handling
- `SUPABASE_SERVICE_ROLE_KEY` and `OPENAI_API_KEY` live in Vercel environment variables only — never referenced in any client-side file.
- All AI calls go through `/api/*` server-side routes. The client never sees API keys.
- `SUPABASE_ANON_KEY` is public by design; RLS enforces data boundaries.

## Permission Model (v1 → lock-down)
| Phase | Reads | Writes |
|---|---|---|
| v1 demo | open (RLS `using (true)`) | open (RLS `with check (true)`) |
| Lock-down (Sprint 4) | public rows open; owner rows `auth.uid() = user_id` | owner only for posts, approvals, deletions |

- The lock-down sprint MUST run before any real subscriber emails or personal data are stored.
- Never mark the app "secure" until Sprint 4 RLS policies are live and tested.

## Approved-Tools Rule
- Agents may only call the five named tools in `AGENTIC_LAYER.md`.
- No `run_any`, `exec_sql`, or open-ended shell calls from agent context.
- Every tool call writes an `audit_log` row — non-negotiable.

## Audit Principle
- Every meaningful state change (publish, approve, delete, AI tag accepted) writes to `audit_logs`.
- `audit_logs` has no delete policy — rows are append-only in production.
- If a security, payment, or data-loss concern arises that is beyond the builder's experience: **stop and get a human specialist before proceeding.**
