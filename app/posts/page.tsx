import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { PostWithPainPoint } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*, pain_points(id, title, slug)")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load posts: ${error.message}`);
  }

  const posts = (data ?? []) as unknown as PostWithPainPoint[];

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-stone-900">Posts</h1>
      <p className="mt-2 text-stone-600">Educational reads for career women navigating the daily grind.</p>

      {posts.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-stone-300 p-10 text-center text-stone-500">
          No posts published yet.
        </div>
      ) : (
        <ul className="mt-8 space-y-6">
          {posts.map((post) => (
            <li key={post.id} className="rounded-lg border border-stone-200 bg-white p-6">
              <Link href={`/posts/${post.slug}`} className="hover:underline">
                <h2 className="text-xl font-semibold text-stone-900">{post.title}</h2>
              </Link>
              {post.excerpt && <p className="mt-2 text-stone-600">{post.excerpt}</p>}
              <div className="mt-3 flex items-center gap-3 text-xs text-stone-400">
                {post.pain_points && (
                  <Link
                    href={`/pain-points`}
                    className="uppercase tracking-wide text-rose-700 bg-rose-50 px-2 py-0.5 rounded hover:bg-rose-100"
                  >
                    {post.pain_points.title}
                  </Link>
                )}
                {post.published_at && (
                  <span>{new Date(post.published_at).toLocaleDateString()}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
