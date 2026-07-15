import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { tagSubmission } from "@/lib/ai/tagSubmission";

export async function POST(request: NextRequest) {
  let body: { body?: string; submitter_name?: string | null };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const text = body.body?.trim();
  if (!text) {
    return NextResponse.json({ error: "body is required" }, { status: 400 });
  }

  // Tag first, then insert once. The public RLS policy allows anon INSERT
  // (including the ai_* columns), but Sprint 4 locked UPDATE to the owner —
  // so an insert-then-update would have the tag write-back silently rejected.
  const tag = await tagSubmission(text);

  const row: Record<string, unknown> = {
    body: text,
    submitter_name: body.submitter_name ?? null,
    status: "pending",
  };
  if (tag) {
    row.ai_category = tag.category;
    row.ai_category_source = tag.source;
    row.ai_category_confidence = tag.category_confidence;
    row.ai_category_review_status = "unreviewed";
    row.ai_intensity_score = tag.intensity_score;
    row.ai_intensity_score_source = tag.source;
    row.ai_intensity_score_confidence = tag.intensity_confidence;
    row.ai_intensity_score_review_status = "unreviewed";
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("submissions").insert(row).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
