"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { writeAuditLog } from "@/lib/audit";
import { slugify } from "@/lib/slug";

function readPostFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const painPointId = String(formData.get("pain_point_id") ?? "") || null;
  const status = String(formData.get("status") ?? "draft") as "draft" | "published";

  return {
    title,
    slug: slugify(rawSlug || title),
    body,
    excerpt,
    pain_point_id: painPointId,
    status,
  };
}

export async function createPost(formData: FormData) {
  const fields = readPostFields(formData);
  if (!fields.title || !fields.slug) {
    throw new Error("Title is required.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("posts")
    .insert({
      title: fields.title,
      slug: fields.slug,
      body: fields.body,
      excerpt: fields.excerpt,
      pain_point_id: fields.pain_point_id,
      status: fields.status,
      published_at: fields.status === "published" ? new Date().toISOString() : null,
      user_id: user?.id ?? null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await writeAuditLog(supabase, {
    action: fields.status === "published" ? "post.publish" : "post.create",
    target_table: "posts",
    target_id: data.id,
    new_value: data,
    risk_level: fields.status === "published" ? "medium" : "low",
  });

  revalidatePath("/admin/posts");
  revalidatePath("/posts");
  revalidatePath("/pain-points");
}

export async function updatePost(id: string, formData: FormData) {
  const fields = readPostFields(formData);
  if (!fields.title || !fields.slug) {
    throw new Error("Title is required.");
  }

  const supabase = await createClient();
  const { data: existing } = await supabase.from("posts").select("*").eq("id", id).single();

  const wasPublished = existing?.status === "published";
  const willBePublished = fields.status === "published";

  const { data, error } = await supabase
    .from("posts")
    .update({
      title: fields.title,
      slug: fields.slug,
      body: fields.body,
      excerpt: fields.excerpt,
      pain_point_id: fields.pain_point_id,
      status: fields.status,
      published_at: willBePublished ? existing?.published_at ?? new Date().toISOString() : existing?.published_at ?? null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await writeAuditLog(supabase, {
    action: !wasPublished && willBePublished ? "post.publish" : "post.update",
    target_table: "posts",
    target_id: id,
    old_value: existing,
    new_value: data,
    risk_level: !wasPublished && willBePublished ? "medium" : "low",
  });

  revalidatePath("/admin/posts");
  revalidatePath("/posts");
  revalidatePath("/pain-points");
  revalidatePath(`/posts/${data.slug}`);
}

export async function deletePost(id: string) {
  const supabase = await createClient();
  const { data: existing } = await supabase.from("posts").select("*").eq("id", id).single();

  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }

  await writeAuditLog(supabase, {
    action: "post.delete",
    target_table: "posts",
    target_id: id,
    old_value: existing,
    risk_level: "medium",
  });

  revalidatePath("/admin/posts");
  revalidatePath("/posts");
  revalidatePath("/pain-points");
}
