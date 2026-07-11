export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="h-9 w-48 rounded bg-ink/10 animate-pulse" />
      <div className="mt-2 h-5 w-96 max-w-full rounded bg-ink/[0.06] animate-pulse" />
      <div className="mt-8 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-24 rounded-lg border border-ink/10 bg-ink/[0.06] animate-pulse" />
        ))}
      </div>
    </div>
  );
}
