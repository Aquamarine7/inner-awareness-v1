"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { writeAuditLog } from "@/lib/audit";

export async function approveSubmission(id: string, painPointId: string | null) {
  const supabase = await createClient();
  const { data: existing } = await supabase.from("submissions").select("*").eq("id", id).single();

  const { data, error } = await supabase
    .from("submissions")
    .update({ status: "approved", pain_point_id: painPointId })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await writeAuditLog(supabase, {
    action: "submission.approve",
    target_table: "submissions",
    target_id: id,
    old_value: existing,
    new_value: data,
    risk_level: "low",
  });

  revalidatePath("/admin/submissions");
}

export async function rejectSubmission(id: string) {
  const supabase = await createClient();
  const { data: existing } = await supabase.from("submissions").select("*").eq("id", id).single();

  const { data, error } = await supabase
    .from("submissions")
    .update({ status: "rejected" })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await writeAuditLog(supabase, {
    action: "submission.reject",
    target_table: "submissions",
    target_id: id,
    old_value: existing,
    new_value: data,
    risk_level: "low",
  });

  revalidatePath("/admin/submissions");
}
