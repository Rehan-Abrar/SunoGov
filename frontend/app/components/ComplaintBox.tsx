"use client";

import { useState } from "react";
import type { ClassificationResult } from "../lib/types";

interface ComplaintBoxProps {
  result?: ClassificationResult | null;
}

export default function ComplaintBox({ result }: ComplaintBoxProps) {
  const [tab, setTab] = useState<"english" | "urdu">("english");

  if (!result) return null;

  const content = tab === "english" ? result.complaint_en : result.complaint_ur;

  function handleCopy() {
    navigator.clipboard.writeText(content);
  }

  return (
    <section className="rounded-lg border bg-white p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Your Complaint</h2>
        <button
          onClick={handleCopy}
          className="rounded border px-3 py-1 text-xs hover:bg-gray-50"
        >
          📋 Copy
        </button>
      </div>

      <div className="flex gap-1">
        <button
          onClick={() => setTab("english")}
          className={`rounded-t px-3 py-1 text-sm ${
            tab === "english"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          English
        </button>
        <button
          onClick={() => setTab("urdu")}
          className={`rounded-t px-3 py-1 text-sm ${
            tab === "urdu"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          اردو
        </button>
      </div>

      <div
        className={`rounded border bg-gray-50 p-3 text-sm whitespace-pre-wrap ${
          tab === "urdu" ? "urdu-text" : ""
        }`}
      >
        {content || "No complaint text available."}
      </div>
    </section>
  );
}
