"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminSettingsPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords don't match.");
      return;
    }

    setStatus("loading");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
      return;
    }

    setStatus("done");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-ink">Settings</h2>

      <div className="mt-6 max-w-sm">
        <h3 className="text-sm font-medium text-ink/70">Change Password</h3>
        <form onSubmit={handleSubmit} className="mt-3 space-y-3">
          <div>
            <label htmlFor="password" className="block text-sm text-ink/60">New password</label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-ink/15 bg-white/80 px-3 py-2 text-sm outline-none focus:border-fig/40"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm text-ink/60">Confirm new password</label>
            <input
              id="confirmPassword"
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-ink/15 bg-white/80 px-3 py-2 text-sm outline-none focus:border-fig/40"
            />
          </div>
          {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
          {status === "done" && <p className="text-sm text-sage">Password updated.</p>}
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-lg bg-fig px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-fig/90 disabled:opacity-60"
          >
            {status === "loading" ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
