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
    <h2 className="font-display text-xl font-semibold text-ink">{painPoint.title}</h2>
  );

  return (
    <div className="flex items-start gap-4 rounded-2xl border border-ink/10 bg-white/70 p-5 backdrop-blur-sm transition-shadow hover:shadow-[0_8px_30px_-12px_rgba(47,38,51,0.15)]">
      <button
        onClick={handleUpvote}
        disabled={voting}
        aria-label={`Upvote ${painPoint.title}`}
        className={`flex min-w-[64px] flex-col items-center justify-center rounded-xl border px-3 py-2 transition-colors ${
          voted
            ? "border-fig/30 bg-fig/10 text-fig"
            : "border-ink/15 text-ink/60 hover:border-fig/40 hover:text-fig"
        } disabled:opacity-60`}
      >
        <span className="text-lg leading-none">▲</span>
        <span className="label-mono mt-1 text-sm">{voteCount}</span>
      </button>

      <div className="flex-1">
        {topPostSlug ? (
          <Link href={`/posts/${topPostSlug}`} className="hover:text-fig">
            {titleContent}
          </Link>
        ) : (
          titleContent
        )}
        {painPoint.description && (
          <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{painPoint.description}</p>
        )}
        <div className="mt-3 flex items-center gap-2">
          {painPoint.category && (
            <span className="label-mono rounded-full bg-sage/15 px-2.5 py-0.5 text-[11px] text-olive">
              {CATEGORY_LABEL[painPoint.category] ?? painPoint.category}
            </span>
          )}
          {errorMsg && <span className="text-xs text-red-600">{errorMsg}</span>}
        </div>
      </div>
    </div>
  );
}
