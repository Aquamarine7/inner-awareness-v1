"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { PainPoint, Post } from "@/lib/types";

export default function PostForm({
  post,
  painPoints,
  action,
}: {
  post?: Post;
  painPoints: Pick<PainPoint, "id" | "title">[];
  action: (formData: FormData) => Promise<void>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setErrorMsg(null);
    startTransition(async () => {
      try {
        await action(formData);
        router.push("/admin/posts");
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <form action={handleSubmit} className="mt-6 space-y-4 max-w-2xl">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-stone-700">Title</label>
        <input
          id="title"
          name="title"
          required
          defaultValue={post?.title}
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-stone-700">
          Slug (leave blank to auto-generate)
        </label>
        <input
          id="slug"
          name="slug"
          defaultValue={post?.slug}
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="pain_point_id" className="block text-sm font-medium text-stone-700">Pain Point</label>
        <select
          id="pain_point_id"
          name="pain_point_id"
          defaultValue={post?.pain_point_id ?? ""}
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm bg-white"
        >
          <option value="">— None —</option>
          {painPoints.map((pp) => (
            <option key={pp.id} value={pp.id}>{pp.title}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-stone-700">Excerpt</label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          defaultValue={post?.excerpt ?? ""}
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="body" className="block text-sm font-medium text-stone-700">Body</label>
        <textarea
          id="body"
          name="body"
          required
          rows={12}
          defaultValue={post?.body ?? ""}
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm font-mono"
        />
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-stone-700">Status</label>
        <select
          id="status"
          name="status"
          defaultValue={post?.status ?? "draft"}
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm bg-white"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-rose-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-rose-800 disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
