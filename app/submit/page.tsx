"use client";

import { useState, type FormEvent } from "react";

export default function SubmitPage() {
  const [body, setBody] = useState("");
  const [submitterName, setSubmitterName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!body.trim()) {
      setValidationError("Tell us a little about what you're struggling with.");
      return;
    }
    setValidationError(null);
    setStatus("loading");
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, submitter_name: submitterName || null }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("done");
      setBody("");
      setSubmitterName("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold text-ink">Thank you for sharing.</h1>
        <p className="mt-3 text-ink/60">
          Your pain point has been submitted for review. We read every one.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 rounded-lg border border-ink/15 px-4 py-2 text-sm text-ink/70 hover:bg-iris/10 hover:text-fig"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <p className="label-mono text-[11px] text-fig/70">Your words</p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-ink md:text-5xl">Share Your Pain Point</h1>
      <p className="mt-3 text-lg text-ink/60">
        What&apos;s the struggle nobody&apos;s naming out loud? Tell us in your own words.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="submitterName" className="block text-sm font-medium text-ink/70">
            Your name (optional)
          </label>
          <input
            id="submitterName"
            type="text"
            value={submitterName}
            onChange={(e) => setSubmitterName(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-ink/15 bg-white/80 px-3 py-2 text-sm outline-none focus:border-fig/40"
            placeholder="Anonymous is fine"
          />
        </div>
        <div>
          <label htmlFor="body" className="block text-sm font-medium text-ink/70">
            What&apos;s going on?
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            className="mt-1.5 w-full rounded-lg border border-ink/15 bg-white/80 px-3 py-2 text-sm leading-relaxed outline-none focus:border-fig/40"
            placeholder="I work 10-hour days and still feel like I'm falling behind..."
          />
          {validationError && <p className="mt-1 text-xs text-red-600">{validationError}</p>}
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-lg bg-fig px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-fig/90 disabled:opacity-60"
        >
          {status === "loading" ? "Submitting…" : "Submit"}
        </button>
        {status === "error" && (
          <p className="text-sm text-red-600">Something went wrong, please try again.</p>
        )}
      </form>
    </div>
  );
}
