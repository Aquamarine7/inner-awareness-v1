import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <h1 className="text-2xl font-bold text-stone-900">Page not found</h1>
      <p className="mt-2 text-stone-600">The page you're looking for doesn't exist.</p>
      <Link href="/pain-points" className="mt-6 inline-block text-rose-900 hover:underline">
        Back to Pain Points
      </Link>
    </div>
  );
}
