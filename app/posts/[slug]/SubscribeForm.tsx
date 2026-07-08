"use client";

import { useState, type FormEvent } from "react";

export default function SubscribeForm({ postId }: { postId: string }) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "duplicate" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, first_name: firstName || null, source_post_id: postId }),
      });
      const json = await res.json();
      if (res.status === 409) {
        setStatus("duplicate");
        return;
      }
      if (!res.ok) throw new Error(json.error ?? "Failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return <p className="mt-4 text-sm font-medium text-rose-900">You&apos;re in! Check your inbox soon.</p>;
  }
  if (status === "duplicate") {
    return <p className="mt-4 text-sm font-medium text-rose-900">You&apos;re already on the list.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-2">
      <input
        type="text"
        placeholder="First name (optional)"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="rounded-md border border-rose-200 px-3 py-2 text-sm bg-white flex-1"
      />
      <input
        type="email"
        required
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-md border border-rose-200 px-3 py-2 text-sm bg-white flex-1"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-md bg-rose-900 text-white px-4 py-2 text-sm font-medium hover:bg-rose-800 disabled:opacity-60"
      >
        {status === "loading" ? "Joining…" : "Subscribe"}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-600 sm:self-center">Something went wrong, please try again.</p>
      )}
    </form>
  );
}
