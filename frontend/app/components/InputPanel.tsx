"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Image, Send, Loader2, X } from "lucide-react";
import { startSpeechRecognition } from "../lib/speech";

interface InputPanelProps {
  onSubmit: (text: string, imageUrl?: string) => void;
  isLoading?: boolean;
}

export default function InputPanel({ onSubmit, isLoading = false }: InputPanelProps) {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleSubmit() {
    if (!text.trim() && !imagePreview) return;
    onSubmit(text, imagePreview || undefined);
  }

  function handleVoice(lang: "en-PK" | "ur-PK") {
    setIsRecording(true);
    startSpeechRecognition(lang, (transcript) => {
      setText((prev) => (prev ? prev + " " + transcript : transcript));
      setIsRecording(false);
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-6"
    >
      <textarea
        className="w-full min-h-[120px] bg-transparent border-0 resize-none text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none text-base leading-relaxed"
        placeholder="Describe your civic issue... (English, Urdu, or Roman Urdu)"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            handleSubmit();
          }
        }}
      />

      <AnimatePresence>
        {imagePreview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative inline-block mt-3"
          >
            <img
              src={imagePreview}
              alt="Uploaded"
              className="h-24 rounded-xl border border-neutral-200 dark:border-neutral-700 object-cover"
            />
            <button
              onClick={() => setImagePreview(null)}
              className="absolute -right-2 -top-2 w-6 h-6 rounded-full bg-error text-white flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleVoice("en-PK")}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? "bg-accent-primary text-white animate-pulse"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            }`}
            title="Record in English"
          >
            <Mic className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleVoice("ur-PK")}
            className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center transition-colors"
            title="Record in Urdu"
          >
            <span className="text-sm font-urdu">اردو</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileRef.current?.click()}
            className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center transition-colors"
            title="Upload image"
          >
            <Image className="w-5 h-5" />
          </motion.button>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={isLoading || (!text.trim() && !imagePreview)}
          className="px-8 py-3 rounded-full bg-accent-primary hover:bg-accent-hover text-white font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Classifying...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
