import type { PainPoint } from "@/lib/types";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const INTENSITY_WEIGHT = 0.5;

type VoteRow = { pain_point_id: string; created_at: string };
type AcceptedIntensityRow = { pain_point_id: string; ai_intensity_score: number };

/**
 * rank = (vote weight, recency-decayed) + (avg accepted AI intensity x 0.5)
 * Seed vote_count has no per-vote history, so it's treated as a full-weight
 * baseline; only votes cast through the app (which do have created_at) decay.
 */
export function computeLeaderboardScores(
  painPoints: PainPoint[],
  votes: VoteRow[],
  acceptedIntensities: AcceptedIntensityRow[],
): Map<string, number> {
  const now = Date.now();

  const votesByPainPoint = new Map<string, VoteRow[]>();
  for (const vote of votes) {
    const list = votesByPainPoint.get(vote.pain_point_id) ?? [];
    list.push(vote);
    votesByPainPoint.set(vote.pain_point_id, list);
  }

  const intensitiesByPainPoint = new Map<string, number[]>();
  for (const row of acceptedIntensities) {
    const list = intensitiesByPainPoint.get(row.pain_point_id) ?? [];
    list.push(row.ai_intensity_score);
    intensitiesByPainPoint.set(row.pain_point_id, list);
  }

  const scores = new Map<string, number>();
  for (const pp of painPoints) {
    const realVotes = votesByPainPoint.get(pp.id) ?? [];
    const weightedRealVotes = realVotes.reduce((sum, v) => {
      const age = now - new Date(v.created_at).getTime();
      return sum + (age > THIRTY_DAYS_MS ? 0.5 : 1);
    }, 0);
    const seedBaseline = Math.max(0, pp.vote_count - realVotes.length);
    const voteScore = seedBaseline + weightedRealVotes;

    const intensities = intensitiesByPainPoint.get(pp.id) ?? [];
    const avgIntensity =
      intensities.length > 0 ? intensities.reduce((a, b) => a + b, 0) / intensities.length : 0;
    const intensityBoost = avgIntensity * INTENSITY_WEIGHT;

    scores.set(pp.id, voteScore + intensityBoost);
  }

  return scores;
}
