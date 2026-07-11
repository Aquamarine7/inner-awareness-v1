import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";
import DeletePostButton from "./DeletePostButton";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load posts: ${error.message}`);
  }

  const posts = (data ?? []) as Post[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold text-ink">Posts</h2>
        <Link
          href="/admin/posts/new"
          className="rounded-lg bg-fig px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-fig/90"
        >
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-ink/15 p-10 text-center text-ink/50">
          No posts — create your first one.
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="label-mono border-b border-ink/10 text-left text-[11px] text-ink/40">
                <th className="py-2 pr-4 font-normal">Title</th>
                <th className="py-2 pr-4 font-normal">Status</th>
                <th className="py-2 pr-4 font-normal">Views</th>
                <th className="py-2 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-ink/[0.07]">
                  <td className="py-3 pr-4 font-medium text-ink whitespace-nowrap">{post.title}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`label-mono rounded-full px-2.5 py-0.5 text-[11px] whitespace-nowrap ${
                        post.status === "published"
                          ? "bg-sage/15 text-olive"
                          : "bg-ink/[0.06] text-ink/50"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-ink/60">{post.view_count}</td>
                  <td className="py-3 pr-4 text-right space-x-3 whitespace-nowrap">
                    <Link href={`/admin/posts/${post.id}/edit`} className="text-fig hover:underline">
                      Edit
                    </Link>
                    <DeletePostButton id={post.id} title={post.title} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
