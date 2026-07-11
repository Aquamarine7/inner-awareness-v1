export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12 animate-pulse">
      <div className="h-5 w-24 rounded bg-ink/10" />
      <div className="mt-4 h-9 w-3/4 rounded bg-ink/10" />
      <div className="mt-8 space-y-3">
        <div className="h-4 w-full rounded bg-ink/[0.06]" />
        <div className="h-4 w-full rounded bg-ink/[0.06]" />
        <div className="h-4 w-2/3 rounded bg-ink/[0.06]" />
      </div>
    </div>
  );
}
