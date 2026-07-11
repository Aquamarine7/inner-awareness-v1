export default function Loading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-40 rounded bg-ink/10" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 rounded-lg bg-ink/[0.06]" />
      ))}
    </div>
  );
}
