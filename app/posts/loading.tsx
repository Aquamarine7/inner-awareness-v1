export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="h-9 w-32 rounded bg-ink/10 animate-pulse" />
      <div className="mt-8 space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-lg border border-ink/10 bg-ink/[0.06] animate-pulse" />
        ))}
      </div>
    </div>
  );
}
