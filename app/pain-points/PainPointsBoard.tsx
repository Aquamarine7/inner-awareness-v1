import { createClient } from "@/lib/supabase/server";
import type { PainPoint } from "@/lib/types";
import { computeLeaderboardScores } from "@/lib/leaderboard";
import PainPointCard from "./PainPointCard";

export default async function PainPointsBoard() {
  const supabase = await createClient();
  const [{ data, error }, { data: postsData }, { data: votesData }, { data: submissionsData }] =
    await Promise.all([
      supabase.from("pain_points").select("*"),
      supabase
        .from("posts")
        .select("slug, pain_point_id, published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false }),
      supabase.from("votes").select("pain_point_id, created_at"),
      supabase
        .from("submissions")
        .select("pain_point_id, ai_intensity_score")
        .eq("ai_intensity_score_review_status", "accepted")
        .not("pain_point_id", "is", null),
    ]);

  if (error) {
    throw new Error(`Failed to load pain points: ${error.message}`);
  }

  const painPoints = (data ?? []) as PainPoint[];

  const scores = computeLeaderboardScores(
    painPoints,
    (votesData ?? []).filter((v): v is { pain_point_id: string; created_at: string } => !!v.pain_point_id),
    (submissionsData ?? []).filter(
      (s): s is { pain_point_id: string; ai_intensity_score: number } =>
        !!s.pain_point_id && s.ai_intensity_score != null,
    ),
  );

  const rankedPainPoints = [...painPoints].sort(
    (a, b) => (scores.get(b.id) ?? 0) - (scores.get(a.id) ?? 0),
  );

  const topPostByPainPoint = new Map<string, string>();
  for (const post of postsData ?? []) {
    if (post.pain_point_id && !topPostByPainPoint.has(post.pain_point_id)) {
      topPostByPainPoint.set(post.pain_point_id, post.slug);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-stone-900">Pain Points</h1>
      <p className="mt-2 text-stone-600">
        The struggles career women 25–35 are naming most. Vote for what resonates.
      </p>

      {rankedPainPoints.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-stone-300 p-10 text-center text-stone-500">
          No pain points tracked yet.
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {rankedPainPoints.map((pp) => (
            <li key={pp.id}>
              <PainPointCard painPoint={pp} topPostSlug={topPostByPainPoint.get(pp.id) ?? null} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
