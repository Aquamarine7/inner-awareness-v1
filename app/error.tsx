"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-center">
      <p className="text-ink/70">Something went wrong, please try again.</p>
      <button
        onClick={reset}
        className="mt-4 rounded-md border border-ink/15 px-4 py-2 text-sm hover:bg-iris/10"
      >
        Retry
      </button>
    </div>
  );
}
