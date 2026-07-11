"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { writeAuditLog } from "@/lib/audit";

export async function toggleSubscriberStatus(id: string, currentStatus: "active" | "unsubscribed") {
  const nextStatus = currentStatus === "active" ? "unsubscribed" : "active";
  const supabase = await createClient();
  const { data: existing } = await supabase.from("subscribers").select("*").eq("id", id).single();

  const { data, error } = await supabase
    .from("subscribers")
    .update({ status: nextStatus })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await writeAuditLog(supabase, {
    action: nextStatus === "unsubscribed" ? "subscriber.unsubscribe" : "subscriber.resubscribe",
    target_table: "subscribers",
    target_id: id,
    old_value: existing,
    new_value: data,
    risk_level: "low",
  });

  revalidatePath("/admin/subscribers");
}
