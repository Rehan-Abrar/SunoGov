"use client";

import { useState, useRef } from "react";
import { startSpeechRecognition } from "../lib/speech";
import { classifyIssue } from "../lib/api";
import type { ClassificationResult } from "../lib/types";

interface InputPanelProps {
  onResult?: (result: ClassificationResult) => void;
}

export default function InputPanel({ onResult }: InputPanelProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSubmit() {
    if (!text.trim() && !imagePreview) return;
    setLoading(true);
    try {
      const result = await classifyIssue(text, "");
      onResult?.(result);
    } catch (err) {
      console.error("Classification failed:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleVoice(lang: "en-PK" | "ur-PK") {
    startSpeechRecognition(lang, (transcript) => {
      setText((prev) => (prev ? prev + " " + transcript : transcript));
    });
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <section className="rounded-lg border bg-white p-4 shadow-sm space-y-3">
      <textarea
        className="w-full rounded border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        rows={3}
        placeholder="Describe your complaint (English, Urdu, or Roman Urdu)…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {imagePreview && (
        <div className="relative inline-block">
          <img
            src={imagePreview}
            alt="Uploaded"
            className="h-24 rounded border object-cover"
          />
          <button
            className="absolute -right-2 -top-2 rounded-full bg-red-500 px-2 text-xs text-white"
            onClick={() => setImagePreview(null)}
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Classifying…" : "Submit"}
        </button>

        <button
          onClick={() => handleVoice("en-PK")}
          className="rounded border px-3 py-2 text-sm hover:bg-gray-50"
        >
          🎤 English
        </button>

        <button
          onClick={() => handleVoice("ur-PK")}
          className="rounded border px-3 py-2 text-sm hover:bg-gray-50"
        >
          🎤 اردو
        </button>

        <button
          onClick={() => fileRef.current?.click()}
          className="rounded border px-3 py-2 text-sm hover:bg-gray-50"
        >
          📷 Image
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>
    </section>
  );
}
