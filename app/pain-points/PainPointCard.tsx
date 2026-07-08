"use client";

import { useState } from "react";
import Link from "next/link";
import type { PainPoint } from "@/lib/types";
import { getVoterFingerprint } from "@/lib/fingerprint";

const CATEGORY_LABEL: Record<string, string> = {
  time: "Time",
  money: "Money",
  energy: "Energy",
  relationships: "Relationships",
  direction: "Direction",
};

export default function PainPointCard({
  painPoint,
  topPostSlug,
}: {
  painPoint: PainPoint;
  topPostSlug: string | null;
}) {
  const [voteCount, setVoteCount] = useState(painPoint.vote_count);
  const [voting, setVoting] = useState(false);
  const [voted, setVoted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleUpvote() {
    if (voting) return;
    setVoting(true);
    setErrorMsg(null);
    const previousCount = voteCount;
    setVoteCount((c) => c + 1);
    setVoted(true);

    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pain_point_id: painPoint.id,
          voter_fingerprint: getVoterFingerprint(),
        }),
      });
      if (!res.ok) throw new Error("Vote failed");
      const json = await res.json();
      setVoteCount(json.vote_count);
    } catch {
      setVoteCount(previousCount);
      setVoted(false);
      setErrorMsg("Couldn't save your vote. Try again.");
    } finally {
      setVoting(false);
    }
  }

  const titleContent = (
    <h2 className="font-semibold text-lg text-stone-900">{painPoint.title}</h2>
  );

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5 flex items-start gap-4">
      <button
        onClick={handleUpvote}
        disabled={voting}
        aria-label={`Upvote ${painPoint.title}`}
        className={`flex flex-col items-center justify-center rounded-md border px-3 py-2 min-w-[64px] transition-colors ${
          voted
            ? "border-rose-300 bg-rose-50 text-rose-700"
            : "border-stone-200 text-stone-600 hover:border-rose-300 hover:text-rose-700"
        } disabled:opacity-60`}
      >
        <span className="text-lg leading-none">▲</span>
        <span className="text-sm font-medium mt-1">{voteCount}</span>
      </button>

      <div className="flex-1">
        {topPostSlug ? (
          <Link href={`/posts/${topPostSlug}`} className="hover:underline">
            {titleContent}
          </Link>
        ) : (
          titleContent
        )}
        {painPoint.description && (
          <p className="mt-1 text-sm text-stone-600">{painPoint.description}</p>
        )}
        <div className="mt-2 flex items-center gap-2">
          {painPoint.category && (
            <span className="text-xs uppercase tracking-wide text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
              {CATEGORY_LABEL[painPoint.category] ?? painPoint.category}
            </span>
          )}
          {errorMsg && <span className="text-xs text-red-600">{errorMsg}</span>}
        </div>
      </div>
    </div>
  );
}
