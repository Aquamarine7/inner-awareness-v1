import { createClient } from "@/lib/supabase/server";
import type { PainPoint } from "@/lib/types";
import PostForm from "../PostForm";
import { createPost } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("pain_points").select("id, title").order("title");
  const painPoints = (data ?? []) as Pick<PainPoint, "id" | "title">[];

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-ink">New Post</h2>
      <PostForm painPoints={painPoints} action={createPost} />
    </div>
  );
}
