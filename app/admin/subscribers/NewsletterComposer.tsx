"use client";

import { useState } from "react";

export default function NewsletterComposer() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  return (
    <div>
      <h2 className="text-lg font-semibold text-stone-900">Newsletter Draft</h2>
      <p className="mt-1 text-sm text-stone-500">
        Compose and preview a newsletter. Sending isn&apos;t wired up yet — this is a draft &amp; preview
        tool only.
      </p>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div>
            <label htmlFor="nl-subject" className="block text-sm font-medium text-stone-700">Subject</label>
            <input
              id="nl-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
              placeholder="This week's reflection..."
            />
          </div>
          <div>
            <label htmlFor="nl-body" className="block text-sm font-medium text-stone-700">Body</label>
            <textarea
              id="nl-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm font-mono"
              placeholder="Write your newsletter body here..."
            />
          </div>
        </div>

        <div className="rounded-lg border border-stone-200 bg-white overflow-hidden">
          <div className="border-b border-stone-200 bg-stone-50 px-4 py-2 text-xs uppercase tracking-wide text-stone-400">
            Preview
          </div>
          <div className="p-5">
            <p className="font-semibold text-stone-900">{subject || "(no subject yet)"}</p>
            <div className="mt-3 whitespace-pre-wrap text-sm text-stone-700 leading-relaxed">
              {body || "(no body yet)"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
