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
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="label-mono text-[11px] text-fig/70">Reflections</p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-ink md:text-5xl">Posts</h1>
      <p className="mt-3 max-w-xl text-lg text-ink/60">
        Quiet, educational reads for women navigating the daily grind.
      </p>

      {posts.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-ink/15 p-12 text-center text-ink/50">
          No posts published yet.
        </div>
      ) : (
        <ul className="mt-10 space-y-5">
          {posts.map((post) => (
            <li
              key={post.id}
              className="rounded-2xl border border-ink/10 bg-white/70 p-6 backdrop-blur-sm transition-shadow hover:shadow-[0_8px_30px_-12px_rgba(47,38,51,0.15)]"
            >
              <Link href={`/posts/${post.slug}`} className="hover:text-fig">
                <h2 className="font-display text-2xl font-semibold text-ink">{post.title}</h2>
              </Link>
              {post.excerpt && <p className="mt-2 leading-relaxed text-ink/60">{post.excerpt}</p>}
              <div className="mt-4 flex items-center gap-3">
                {post.pain_points && (
                  <Link
                    href={`/pain-points`}
                    className="label-mono rounded-full bg-sage/15 px-2.5 py-0.5 text-[11px] text-olive hover:bg-sage/25"
                  >
                    {post.pain_points.title}
                  </Link>
                )}
                {post.published_at && (
                  <span className="label-mono text-[11px] text-ink/40">
                    {new Date(post.published_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
