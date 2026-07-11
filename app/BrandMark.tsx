export default function BrandMark({ className }: { className?: string }) {
  // A quiet reflection symbol: an outer crescent embracing an inner crescent —
  // self-observation and emotional cycles, without spiritual cliché.
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="12.5" stroke="currentColor" strokeWidth="1.25" opacity="0.4" />
      <path
        d="M22.5 7.5a11 11 0 1 0 0 17 8.5 8.5 0 0 1 0-17z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}
