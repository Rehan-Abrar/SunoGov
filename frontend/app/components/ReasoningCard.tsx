"use client";

import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface ReasoningCardProps {
  issueDisplay?: string;
  department?: string;
  reason?: string;
  confidence?: number;
  city?: string;
}

export default function ReasoningCard({
  issueDisplay,
  department,
  reason,
  confidence = 0,
  city,
}: ReasoningCardProps) {
  if (!issueDisplay || !department) return null;

  const confidencePercent = Math.round(confidence * 100);

  const badgeBg =
    confidence >= 0.8
      ? "color-mix(in srgb, var(--color-success) 12%, transparent)"
      : confidence >= 0.5
      ? "color-mix(in srgb, var(--color-warning) 12%, transparent)"
      : "color-mix(in srgb, var(--color-error) 12%, transparent)";

  const badgeColor =
    confidence >= 0.8
      ? "var(--color-success)"
      : confidence >= 0.5
      ? "var(--color-warning)"
      : "var(--color-error)";

  const ConfidenceIcon =
    confidence >= 0.8 ? CheckCircle : confidence >= 0.5 ? AlertCircle : XCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl p-6 backdrop-blur-xl"
      style={{
        background: "color-mix(in srgb, var(--color-surface) 80%, transparent)",
        border: "1px solid var(--color-rule)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3
            className="text-lg font-semibold"
            style={{ color: "var(--color-ink)" }}
          >
            {issueDisplay}
          </h3>
          <p className="mt-1 text-sm" style={{ color: "var(--color-ink-3)" }}>
            {department}
            {city && (
              <span style={{ color: "var(--color-ink-4)" }}> · {city}</span>
            )}
          </p>
        </div>

        <div
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium"
          style={{ background: badgeBg, color: badgeColor }}
        >
          <ConfidenceIcon className="h-4 w-4" />
          <span>{confidencePercent}%</span>
        </div>
      </div>

      {reason && (
        <p
          className="mt-4 border-t pt-4 text-sm italic"
          style={{
            color: "var(--color-ink-3)",
            borderColor: "var(--color-rule)",
          }}
        >
          {reason}
        </p>
      )}
    </motion.div>
  );
}
