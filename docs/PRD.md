# Product Requirements — Inner Awareness v1

## Problem
Career women aged 25–35 lack a focused, trusted space that names their real daily struggles and gives them practical self-awareness education. The most critical unmet need is **lost personal direction** — the feeling of achieving externally while drifting internally.

## Target User
Women 25–35 in professional careers. Not yet the platform's registered members — in v1 they are **visitors and voters**. The sole admin/publisher is the owner.

## Core Objects
| Object | What it is |
|---|---|
| `pain_point` | A named struggle (e.g. "Lost Sense of Direction") with vote count and category |
| `post` | An educational article published by the owner, linked to a pain point |
| `submission` | A visitor-submitted pain point description, pending owner review |
| `vote` | One upvote by a visitor on a pain point |
| `subscriber` | Email captured from a post page |
| `audit_log` | Record of every owner action |

## MVP Must-Haves (v1)
- [ ] Public pain-point board showing all 5 seeded pain points with live vote counts
- [ ] Upvote button persists to DB; count updates without page reload
- [ ] Visitor pain-point submission form saves to DB
- [ ] Owner can publish, edit, and delete posts from `/admin`
- [ ] Post detail page renders full content, linked pain point, and email capture
- [ ] All pages handle loading, empty, and error states
- [ ] No login wall on public pages; seed data visible on first load

## Non-Goals (v1)
- User accounts / profiles for visitors
- AI tagging (Sprint 3, not v1)
- Newsletter sending
- Paid membership

## Success Criteria
**End-to-end scenario:** A visitor lands on `/pain-points`, sees "Lost Sense of Direction" at the top, upvotes it (count increments in the DB), clicks through to a published post, reads the article, and submits their own pain point — which appears in the owner's admin submission queue. The owner logs in, reviews it, and publishes a new post. Every step persists to the database and survives a hard refresh.
