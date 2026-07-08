import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { PainPoint, Post } from "@/lib/types";
import PostForm from "../../PostForm";
import { updatePost } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: post }, { data: painPointsData }] = await Promise.all([
    supabase.from("posts").select("*").eq("id", id).maybeSingle(),
    supabase.from("pain_points").select("id, title").order("title"),
  ]);

  if (!post) {
    notFound();
  }

  const painPoints = (painPointsData ?? []) as Pick<PainPoint, "id" | "title">[];
  const updatePostWithId = updatePost.bind(null, id);

  return (
    <div>
      <h2 className="text-lg font-semibold text-stone-900">Edit Post</h2>
      <PostForm post={post as Post} painPoints={painPoints} action={updatePostWithId} />
    </div>
  );
}
