"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-center">
      <p className="text-stone-700">Something went wrong, please try again.</p>
      <button
        onClick={reset}
        className="mt-4 rounded-md border border-stone-300 px-4 py-2 text-sm hover:bg-stone-100"
      >
        Retry
      </button>
    </div>
  );
}
