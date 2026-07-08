import { createClient } from "@/lib/supabase/server";
import type { PainPoint, Submission } from "@/lib/types";
import SubmissionRow from "./SubmissionRow";

export const dynamic = "force-dynamic";

export default async function AdminSubmissionsPage() {
  const supabase = await createClient();
  const [{ data, error }, { data: painPointsData }] = await Promise.all([
    supabase.from("submissions").select("*").order("created_at", { ascending: false }),
    supabase.from("pain_points").select("id, title").order("title"),
  ]);

  if (error) {
    throw new Error(`Failed to load submissions: ${error.message}`);
  }

  const submissions = (data ?? []) as Submission[];
  const painPoints = (painPointsData ?? []) as Pick<PainPoint, "id" | "title">[];

  return (
    <div>
      <h2 className="text-lg font-semibold text-stone-900">Submissions</h2>

      {submissions.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-stone-300 p-10 text-center text-stone-500">
          No submissions yet.
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {submissions.map((s) => (
            <SubmissionRow key={s.id} submission={s} painPoints={painPoints} />
          ))}
        </ul>
      )}
    </div>
  );
}
