import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <h1 className="font-display text-3xl font-semibold text-ink">Page not found</h1>
      <p className="mt-2 text-ink/60">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/pain-points" className="mt-6 inline-block text-fig hover:underline">
        Back to Pain Points
      </Link>
    </div>
  );
}
