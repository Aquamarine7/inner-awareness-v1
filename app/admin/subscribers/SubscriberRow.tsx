"use client";

import { useTransition } from "react";
import type { Subscriber } from "@/lib/types";
import { toggleSubscriberStatus } from "./actions";

export default function SubscriberRow({ subscriber }: { subscriber: Subscriber }) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(() => {
      toggleSubscriberStatus(subscriber.id, subscriber.status);
    });
  }

  return (
    <tr className="border-b border-stone-100">
      <td className="py-3 pr-4 font-medium text-stone-900">{subscriber.email}</td>
      <td className="py-3 pr-4 text-stone-600">{subscriber.first_name || "—"}</td>
      <td className="py-3 pr-4">
        <span
          className={`text-xs px-2 py-0.5 rounded uppercase tracking-wide ${
            subscriber.status === "active" ? "bg-green-50 text-green-700" : "bg-stone-100 text-stone-500"
          }`}
        >
          {subscriber.status}
        </span>
      </td>
      <td className="py-3 pr-4 text-right">
        <button
          onClick={handleToggle}
          disabled={isPending}
          className="text-rose-900 hover:underline disabled:opacity-60"
        >
          {isPending ? "Working…" : subscriber.status === "active" ? "Unsubscribe" : "Resubscribe"}
        </button>
      </td>
    </tr>
  );
}
