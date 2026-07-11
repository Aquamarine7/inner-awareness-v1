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
    <div className="max-w-2xl mx-auto px-6 py-12">
      {post.pain_points && (
        <Link
          href="/pain-points"
          className="inline-block text-xs uppercase tracking-wide text-rose-700 bg-rose-50 px-2 py-0.5 rounded hover:bg-rose-100"
        >
          {post.pain_points.title}
        </Link>
      )}
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900">{post.title}</h1>
      {post.published_at && (
        <p className="mt-2 text-sm text-stone-400">
          {new Date(post.published_at).toLocaleDateString()}
        </p>
      )}

      <div className="mt-8 prose prose-stone max-w-none whitespace-pre-wrap text-stone-700 leading-relaxed">
        {post.body}
      </div>

      <div className="mt-12 rounded-lg border border-rose-200 bg-rose-50 p-6">
        <h2 className="font-semibold text-rose-900">Want more like this?</h2>
        <p className="mt-1 text-sm text-rose-800">
          Get self-awareness resources for career women straight to your inbox.
        </p>
        <SubscribeForm postId={post.id} />
      </div>
    </div>
  );
}
