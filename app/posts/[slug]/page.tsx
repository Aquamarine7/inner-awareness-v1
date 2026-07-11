import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { PostWithPainPoint } from "@/lib/types";
import SubscribeForm from "./SubscribeForm";

export const dynamic = "force-dynamic";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select("*, pain_points(id, title, slug)")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load post: ${error.message}`);
  }

  if (!data) {
    notFound();
  }

  const post = data as unknown as PostWithPainPoint;

  supabase.rpc("increment_post_view", { post_id: post.id }).then(() => {});

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      {post.pain_points && (
        <Link
          href="/pain-points"
          className="label-mono inline-block rounded-full bg-sage/15 px-2.5 py-0.5 text-[11px] text-olive hover:bg-sage/25"
        >
          {post.pain_points.title}
        </Link>
      )}
      <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
        {post.title}
      </h1>
      {post.published_at && (
        <p className="label-mono mt-3 text-[11px] text-ink/40">
          {new Date(post.published_at).toLocaleDateString()}
        </p>
      )}

      <div className="mt-8 whitespace-pre-wrap text-lg leading-relaxed text-ink/80">{post.body}</div>

      <div className="mt-14 rounded-2xl border border-iris/20 bg-iris/[0.07] p-7 backdrop-blur-sm">
        <h2 className="font-display text-2xl font-semibold text-fig">Want more like this?</h2>
        <p className="mt-1.5 text-sm text-ink/70">
          Gentle self-awareness resources, straight to your inbox.
        </p>
        <SubscribeForm postId={post.id} />
      </div>
    </div>
  );
}
