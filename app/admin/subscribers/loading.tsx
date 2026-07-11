export default function Loading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-40 rounded bg-stone-200" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-10 rounded bg-stone-100" />
      ))}
    </div>
  );
}
