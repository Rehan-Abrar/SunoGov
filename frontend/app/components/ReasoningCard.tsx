import type { ClassificationResult } from "../lib/types";

interface ReasoningCardProps {
  result?: ClassificationResult | null;
}

export default function ReasoningCard({ result }: ReasoningCardProps) {
  if (!result) return null;

  const confidencePercent = Math.round(result.confidence * 100);

  return (
    <section className="rounded-lg border bg-white p-4 shadow-sm space-y-2">
      <h2 className="text-lg font-semibold">Classification Result</h2>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-500">Issue:</span>{" "}
          <span className="font-medium">{result.issue_id}</span>
        </div>
        <div>
          <span className="text-gray-500">City:</span>{" "}
          <span className="font-medium">{result.city || "—"}</span>
        </div>
        <div>
          <span className="text-gray-500">Department:</span>{" "}
          <span className="font-medium">{result.department.name}</span>
        </div>
        <div>
          <span className="text-gray-500">Confidence:</span>{" "}
          <span className="font-medium">{confidencePercent}%</span>
        </div>
      </div>

      {result.department.reason && (
        <p className="text-sm text-gray-600">{result.department.reason}</p>
      )}
    </section>
  );
}
