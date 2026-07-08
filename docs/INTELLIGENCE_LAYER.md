# Intelligence Layer — Inner Awareness v1

## Messy Input
Visitor submits free-text: *"I work 10-hour days and still feel like I am falling behind. No time to cook, exercise, or even call my mum."*

## Auto-Structure (Sprint 3)
```json
{
  "submission_id": "uuid",
  "raw_body": "I work 10-hour days...",
  "ai_category": "time",
  "ai_category_source": "gpt-4o / prompt-v1",
  "ai_category_confidence": 0.91,
  "ai_category_review_status": "unreviewed",
  "ai_intensity_score": 0.82,
  "ai_intensity_score_source": "gpt-4o / prompt-v1",
  "ai_intensity_score_confidence": 0.78,
  "ai_intensity_score_review_status": "unreviewed"
}
```

## Events to Track
- New submission created
- Vote cast on a pain point
- Post published or viewed
- Subscriber email captured

## Scoring Rules (rule-based first, AI on top)
1. **Vote weight:** each vote = 1 point
2. **Intensity boost:** `ai_intensity_score × 0.5` added to rank only after owner accepts AI tag
3. **Recency decay:** votes older than 30 days count 0.5×
4. **Leaderboard rank** = `(vote_count × 1) + (intensity_boost) − recency_decay`

## What Gets Ranked
- Pain points ordered by weighted score on the public board
- Submissions sorted by intensity score in the owner review queue

## v1 vs Later
- **v1:** rule-based vote count only; AI fields stored but not yet computed
- **Sprint 3:** AI tagging on submit; owner review queue with accept/override
- **Later:** trend detection over time; personalised pain-point match for logged-in members
