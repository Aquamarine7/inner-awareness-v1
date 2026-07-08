import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  let body: { pain_point_id?: string; voter_fingerprint?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { pain_point_id, voter_fingerprint } = body;
  if (!pain_point_id) {
    return NextResponse.json({ error: "pain_point_id is required" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: painPoint, error: fetchError } = await supabase
    .from("pain_points")
    .select("vote_count")
    .eq("id", pain_point_id)
    .single();

  if (fetchError || !painPoint) {
    return NextResponse.json({ error: "Pain point not found" }, { status: 404 });
  }

  const { error: voteError } = await supabase
    .from("votes")
    .insert({ pain_point_id, voter_fingerprint: voter_fingerprint ?? null });

  if (voteError) {
    return NextResponse.json({ error: voteError.message }, { status: 500 });
  }

  const newCount = painPoint.vote_count + 1;
  const { error: updateError } = await supabase
    .from("pain_points")
    .update({ vote_count: newCount })
    .eq("id", pain_point_id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ vote_count: newCount });
}
