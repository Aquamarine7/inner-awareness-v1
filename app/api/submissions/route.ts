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

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("submissions")
    .insert({
      body: text,
      submitter_name: body.submitter_name ?? null,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const tag = await tagSubmission(text);
  if (tag) {
    const { data: tagged } = await supabase
      .from("submissions")
      .update({
        ai_category: tag.category,
        ai_category_source: tag.source,
        ai_category_confidence: tag.category_confidence,
        ai_category_review_status: "unreviewed",
        ai_intensity_score: tag.intensity_score,
        ai_intensity_score_source: tag.source,
        ai_intensity_score_confidence: tag.intensity_confidence,
        ai_intensity_score_review_status: "unreviewed",
      })
      .eq("id", data.id)
      .select()
      .single();
    if (tagged) {
      return NextResponse.json(tagged, { status: 201 });
    }
  }

  return NextResponse.json(data, { status: 201 });
}
