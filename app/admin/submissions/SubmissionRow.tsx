"use client";

import { useState, useTransition } from "react";
import type { PainPoint, Submission } from "@/lib/types";
import { approveSubmission, rejectSubmission, acceptAiTag, overrideAiTag } from "./actions";

const STATUS_STYLE: Record<Submission["status"], string> = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-green-50 text-green-700",
  rejected: "bg-ink/[0.06] text-ink/50",
};

const CATEGORIES = ["time", "money", "energy", "relationships", "direction"];

export default function SubmissionRow({
  submission,
  painPoints,
}: {
  submission: Submission;
  painPoints: Pick<PainPoint, "id" | "title">[];
}) {
  const [painPointId, setPainPointId] = useState(submission.pain_point_id ?? "");
  const [overrideCategory, setOverrideCategory] = useState(submission.ai_category ?? CATEGORIES[0]);
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

  function handleAcceptAiTag() {
    setErrorMsg(null);
    startTransition(async () => {
      try {
        await acceptAiTag(submission.id);
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : "Failed to accept tag.");
      }
    });
  }

  function handleOverrideAiTag() {
    setErrorMsg(null);
    startTransition(async () => {
      try {
        await overrideAiTag(submission.id, overrideCategory);
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : "Failed to override tag.");
      }
    });
  }

  const hasAiTag = !!submission.ai_category;
  const isUnreviewed = submission.ai_category_review_status === "unreviewed";

  return (
    <li
      className={`rounded-lg border bg-white p-5 ${
        hasAiTag && isUnreviewed ? "border-amber-300 ring-1 ring-amber-200" : "border-ink/10"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-ink">
          {submission.submitter_name || "Anonymous"}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded uppercase tracking-wide ${STATUS_STYLE[submission.status]}`}>
          {submission.status}
        </span>
      </div>
      <p className="mt-2 text-ink/70 text-sm">{submission.body}</p>

      {hasAiTag && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded bg-ink/[0.06] px-2 py-0.5 text-ink/60">
            AI: {submission.ai_category}
            {submission.ai_category_confidence != null &&
              ` (${Math.round(submission.ai_category_confidence * 100)}%)`}
          </span>
          {submission.ai_intensity_score != null && (
            <span className="rounded bg-ink/[0.06] px-2 py-0.5 text-ink/60">
              Intensity: {Math.round(submission.ai_intensity_score * 100)}%
            </span>
          )}
          <span
            className={`rounded px-2 py-0.5 uppercase tracking-wide ${
              submission.ai_category_review_status === "unreviewed"
                ? "bg-amber-100 text-amber-800"
                : "bg-ink/[0.06] text-ink/50"
            }`}
          >
            {submission.ai_category_review_status}
          </span>
        </div>
      )}

      {hasAiTag && isUnreviewed && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            onClick={handleAcceptAiTag}
            disabled={isPending}
            className="rounded-md border border-amber-300 bg-amber-50 text-amber-800 px-3 py-1 text-xs font-medium hover:bg-amber-100 disabled:opacity-60"
          >
            Accept AI tag
          </button>
          <select
            value={overrideCategory}
            onChange={(e) => setOverrideCategory(e.target.value)}
            className="rounded-md border border-ink/15 px-2 py-1 text-xs bg-white"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button
            onClick={handleOverrideAiTag}
            disabled={isPending}
            className="rounded-md border border-ink/15 px-3 py-1 text-xs hover:bg-iris/10 disabled:opacity-60"
          >
            Override
          </button>
        </div>
      )}

      {submission.status === "pending" && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <select
            value={painPointId}
            onChange={(e) => setPainPointId(e.target.value)}
            className="rounded-md border border-ink/15 px-2 py-1.5 text-sm bg-white"
          >
            <option value="">Link to pain point (optional)</option>
            {painPoints.map((pp) => (
              <option key={pp.id} value={pp.id}>{pp.title}</option>
            ))}
          </select>
          <button
            onClick={handleApprove}
            disabled={isPending}
            className="rounded-lg bg-fig px-3 py-1.5 text-sm font-medium text-paper transition-colors hover:bg-fig/90 disabled:opacity-60"
          >
            {isPending ? "Working…" : "Approve"}
          </button>
          <button
            onClick={handleReject}
            disabled={isPending}
            className="rounded-md border border-ink/15 px-3 py-1.5 text-sm hover:bg-iris/10 disabled:opacity-60"
          >
            Reject
          </button>
        </div>
      )}
      {errorMsg && <p className="mt-2 text-xs text-red-600">{errorMsg}</p>}
    </li>
  );
}
