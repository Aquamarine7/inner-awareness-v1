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
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-stone-900">Thank you for sharing.</h1>
        <p className="mt-3 text-stone-600">
          Your pain point has been submitted for review. We read every one.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 rounded-md border border-stone-300 px-4 py-2 text-sm hover:bg-stone-100"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-stone-900">Share Your Pain Point</h1>
      <p className="mt-2 text-stone-600">
        What's the struggle nobody's naming out loud? Tell us in your own words.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="submitterName" className="block text-sm font-medium text-stone-700">
            Your name (optional)
          </label>
          <input
            id="submitterName"
            type="text"
            value={submitterName}
            onChange={(e) => setSubmitterName(e.target.value)}
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
            placeholder="Anonymous is fine"
          />
        </div>
        <div>
          <label htmlFor="body" className="block text-sm font-medium text-stone-700">
            What's going on?
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
            placeholder="I work 10-hour days and still feel like I'm falling behind..."
          />
          {validationError && <p className="mt-1 text-xs text-red-600">{validationError}</p>}
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-md bg-rose-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-rose-800 disabled:opacity-60"
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
