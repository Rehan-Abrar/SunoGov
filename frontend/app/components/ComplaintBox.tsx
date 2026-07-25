"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Download } from "lucide-react";

interface ComplaintBoxProps {
  complaintEn?: string;
  complaintUr?: string;
}

export default function ComplaintBox({
  complaintEn = "",
  complaintUr = "",
}: ComplaintBoxProps) {
  const [tab, setTab] = useState<"en" | "ur">("en");
  const [copied, setCopied] = useState(false);

  if (!complaintEn && !complaintUr) return null;

  const content = tab === "en" ? complaintEn : complaintUr;
  const isRTL = tab === "ur";

  function handleCopy() {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `complaint-${tab === "en" ? "en" : "ur"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl p-6 backdrop-blur-xl"
      style={{
        background: "color-mix(in srgb, var(--color-surface) 80%, transparent)",
        border: "1px solid var(--color-rule)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3
          className="text-lg font-semibold"
          style={{ color: "var(--color-ink)" }}
        >
          Your Complaint
        </h3>

        <div
          className="flex gap-1 rounded-full p-1"
          style={{ background: "var(--color-paper-3)" }}
        >
          <button
            onClick={() => setTab("en")}
            className="rounded-full px-4 py-1.5 text-sm font-medium transition-all"
            style={{
              background: tab === "en" ? "var(--color-surface)" : "transparent",
              color: tab === "en" ? "var(--color-ink)" : "var(--color-ink-3)",
              boxShadow: tab === "en" ? "var(--shadow-sm)" : "none",
            }}
          >
            English
          </button>
          <button
            onClick={() => setTab("ur")}
            className="rounded-full px-4 py-1.5 text-sm font-medium transition-all"
            style={{
              background: tab === "ur" ? "var(--color-surface)" : "transparent",
              color: tab === "ur" ? "var(--color-ink)" : "var(--color-ink-3)",
              boxShadow: tab === "ur" ? "var(--shadow-sm)" : "none",
            }}
          >
            اردو
          </button>
        </div>
      </div>

      <div className="relative">
        <pre
          dir={isRTL ? "rtl" : "ltr"}
          className={`whitespace-pre-wrap rounded-xl border p-4 leading-relaxed ${
            isRTL ? "font-urdu text-base" : "font-mono text-sm"
          }`}
          style={{
            background: "var(--color-paper-2)",
            borderColor: "var(--color-rule)",
            color: "var(--color-ink)",
            minHeight: "200px",
          }}
        >
          {content || "No complaint text available."}
        </pre>

        <button
          onClick={handleCopy}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-rule)",
            boxShadow: "var(--shadow-sm)",
          }}
          title="Copy to clipboard"
        >
          {copied ? (
            <Check className="h-4 w-4" style={{ color: "var(--color-success)" }} />
          ) : (
            <Copy className="h-4 w-4" style={{ color: "var(--color-ink-3)" }} />
          )}
        </button>
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={handleDownload}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3 font-medium transition-colors"
        style={{
          border: "1px solid var(--color-rule)",
          color: "var(--color-ink)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "var(--color-paper-3)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "transparent")
        }
      >
        <Download className="h-4 w-4" />
        <span>Download as Text</span>
      </motion.button>
    </motion.div>
  );
}
