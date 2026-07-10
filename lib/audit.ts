import type { SupabaseClient } from "@supabase/supabase-js";
import type { RiskLevel } from "@/lib/types";

export async function writeAuditLog(
  supabase: SupabaseClient,
  entry: {
    action: string;
    target_table: string;
    target_id: string;
    old_value?: unknown;
    new_value?: unknown;
    risk_level: RiskLevel;
  },
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("audit_logs").insert({
    action: entry.action,
    target_table: entry.target_table,
    target_id: entry.target_id,
    old_value: entry.old_value ?? null,
    new_value: entry.new_value ?? null,
    risk_level: entry.risk_level,
    user_id: user?.id ?? null,
  });
  if (error) {
    console.error("Failed to write audit log", entry.action, error.message);
  }
}
