import { createClient } from "@/lib/supabase/server";
import type { Subscriber } from "@/lib/types";
import SubscriberRow from "./SubscriberRow";
import NewsletterComposer from "./NewsletterComposer";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

export default async function AdminSubscribersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();
  const { data, error, count } = await supabase
    .from("subscribers")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to load subscribers: ${error.message}`);
  }

  const subscribers = (data ?? []) as Subscriber[];
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-lg font-semibold text-stone-900">
          Subscribers <span className="text-stone-400 font-normal">({total})</span>
        </h2>

        {subscribers.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-stone-300 p-10 text-center text-stone-500">
            No subscribers yet.
          </div>
        ) : (
          <>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left text-stone-500 border-b border-stone-200">
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((s) => (
                    <SubscriberRow key={s.id} subscriber={s} />
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="mt-4 flex items-center gap-3 text-sm">
                {page > 1 && (
                  <a href={`/admin/subscribers?page=${page - 1}`} className="text-rose-900 hover:underline">
                    ← Previous
                  </a>
                )}
                <span className="text-stone-400">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <a href={`/admin/subscribers?page=${page + 1}`} className="text-rose-900 hover:underline">
                    Next →
                  </a>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <NewsletterComposer />
    </div>
  );
}
