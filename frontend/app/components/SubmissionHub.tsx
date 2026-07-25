import type { ClassificationResult } from "../lib/types";

interface SubmissionHubProps {
  result?: ClassificationResult | null;
}

export default function SubmissionHub({ result }: SubmissionHubProps) {
  if (!result) return null;

  const { channels } = result.department;

  if (channels.length === 0) return null;

  const icon: Record<string, string> = {
    portal: "🌐",
    app: "📱",
    helpline: "📞",
    email: "✉️",
    office: "🏢",
  };

  return (
    <section className="rounded-lg border bg-white p-4 shadow-sm space-y-3">
      <h2 className="text-lg font-semibold">How to Submit</h2>

      <ul className="space-y-2 text-sm">
        {channels.map((ch, i) => (
          <li key={i} className="flex items-start gap-2">
            <span>{icon[ch.type] ?? "•"}</span>
            <div>
              <span className="font-medium">{ch.label || ch.type}:</span>{" "}
              {ch.type === "portal" ? (
                <a
                  href={ch.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {ch.value}
                </a>
              ) : (
                <span>{ch.value}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
