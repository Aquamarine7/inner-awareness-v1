"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
      return;
    }
    router.push("/admin/posts");
    router.refresh();
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-20">
      <h1 className="text-2xl font-bold tracking-tight text-stone-900">Owner Login</h1>
      <p className="mt-2 text-sm text-stone-600">Sign in to manage posts and submissions.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-stone-700">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-stone-700">Password</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
          />
        </div>
        {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-md bg-rose-900 text-white px-4 py-2.5 text-sm font-medium hover:bg-rose-800 disabled:opacity-60"
        >
          {status === "loading" ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
