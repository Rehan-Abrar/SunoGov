"use client";

import type { ClassificationResult } from "../lib/types";

interface PDFExportProps {
  result?: ClassificationResult | null;
}

export default function PDFExport({ result }: PDFExportProps) {
  if (!result) return null;

  function handleDownload() {
    if (!result) return;
    const content = [
      `Issue: ${result.issue_id}`,
      `City: ${result.city}`,
      `Department: ${result.department.name}`,
      "",
      "--- English Complaint ---",
      result.complaint_en,
      "",
      "--- شکایت (اردو) ---",
      result.complaint_ur,
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `complaint-${result.issue_id}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleDownload}
      className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
    >
      📄 Download Complaint
    </button>
  );
}
