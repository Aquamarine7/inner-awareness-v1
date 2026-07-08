# Data Model — Inner Awareness v1

## pain_points
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | owner scope (set at lock-down) |
| title | text | e.g. "Lost Sense of Direction" |
| slug | text unique | URL key |
| description | text | 1–2 sentence summary |
| category | text | time / money / energy / relationships / direction |
| vote_count | integer | denormalised for fast reads |
| display_order | integer | manual sort by owner |
| created_at | timestamptz | |

## posts
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| title | text | |
| slug | text unique | |
| body | text | full markdown/rich text |
| excerpt | text | |
| pain_point_id | uuid FK → pain_points | |
| status | text | draft / published |
| published_at | timestamptz | |
| view_count | integer | |
| created_at | timestamptz | |

## submissions
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| body | text | visitor's words |
| submitter_name | text | optional |
| status | text | pending / approved / rejected |
| pain_point_id | uuid FK → pain_points | assigned by owner or AI |
| ai_category | text | **AI field** |
| ai_category_source | text | model + prompt version |
| ai_category_confidence | numeric | 0–1 |
| ai_category_review_status | text | unreviewed / accepted / overridden |
| ai_intensity_score | numeric | **AI field** 0–1 |
| ai_intensity_score_source | text | |
| ai_intensity_score_confidence | numeric | |
| ai_intensity_score_review_status | text | unreviewed / accepted / overridden |
| created_at | timestamptz | |

## votes
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| pain_point_id | uuid FK → pain_points | |
| voter_fingerprint | text | browser fingerprint to limit duplicate votes |
| created_at | timestamptz | |

## subscribers
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| email | text unique | |
| first_name | text | |
| source_post_id | uuid FK → posts | which post triggered signup |
| status | text | active / unsubscribed |
| created_at | timestamptz | |

## audit_logs
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | actor |
| action | text | e.g. post.publish, submission.approve |
| target_table | text | |
| target_id | uuid | |
| old_value | jsonb | |
| new_value | jsonb | |
| risk_level | text | low / medium / high / critical |
| created_at | timestamptz | |

## RLS
- All tables: permissive v1 policies (select + all open) for demo.
- Lock-down sprint replaces write policies with `auth.uid() = user_id` for owner tables.
