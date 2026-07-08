import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  let body: { email?: string; first_name?: string | null; source_post_id?: string | null };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("subscribers").insert({
    email,
    first_name: body.first_name ?? null,
    source_post_id: body.source_post_id ?? null,
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "You're already on the list." }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
