"use client";

import { useState, useTransition } from "react";
import type { PainPoint, Submission } from "@/lib/types";
import { approveSubmission, rejectSubmission } from "./actions";

const STATUS_STYLE: Record<Submission["status"], string> = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-green-50 text-green-700",
  rejected: "bg-stone-100 text-stone-500",
};

export default function SubmissionRow({
  submission,
  painPoints,
}: {
  submission: Submission;
  painPoints: Pick<PainPoint, "id" | "title">[];
}) {
  const [painPointId, setPainPointId] = useState(submission.pain_point_id ?? "");
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handleApprove() {
    setErrorMsg(null);
    startTransition(async () => {
      try {
        await approveSubmission(submission.id, painPointId || null);
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : "Failed to approve.");
      }
    });
  }

  function handleReject() {
    setErrorMsg(null);
    startTransition(async () => {
      try {
        await rejectSubmission(submission.id);
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : "Failed to reject.");
      }
    });
  }

  return (
    <li className="rounded-lg border border-stone-200 bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-stone-900">
          {submission.submitter_name || "Anonymous"}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded uppercase tracking-wide ${STATUS_STYLE[submission.status]}`}>
          {submission.status}
        </span>
      </div>
      <p className="mt-2 text-stone-700 text-sm">{submission.body}</p>

      {submission.status === "pending" && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <select
            value={painPointId}
            onChange={(e) => setPainPointId(e.target.value)}
            className="rounded-md border border-stone-300 px-2 py-1.5 text-sm bg-white"
          >
            <option value="">Link to pain point (optional)</option>
            {painPoints.map((pp) => (
              <option key={pp.id} value={pp.id}>{pp.title}</option>
            ))}
          </select>
          <button
            onClick={handleApprove}
            disabled={isPending}
            className="rounded-md bg-rose-900 text-white px-3 py-1.5 text-sm font-medium hover:bg-rose-800 disabled:opacity-60"
          >
            {isPending ? "Working…" : "Approve"}
          </button>
          <button
            onClick={handleReject}
            disabled={isPending}
            className="rounded-md border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-100 disabled:opacity-60"
          >
            Reject
          </button>
        </div>
      )}
      {errorMsg && <p className="mt-2 text-xs text-red-600">{errorMsg}</p>}
    </li>
  );
}
