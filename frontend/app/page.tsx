"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Moon, Sun, Mic, Image as ImageIcon, Send, Loader2, X } from "lucide-react";
import ReasoningCard from "./components/ReasoningCard";
import SubmissionHub from "./components/SubmissionHub";
import ComplaintBox from "./components/ComplaintBox";
import { startSpeechRecognition } from "./lib/speech";

// Mock data for demo
const mockResult = {
  issueDisplay: "Sewer Leakage",
  department: "WASA Lahore",
  reason: "WASA handles sewerage maintenance and drainage in Lahore",
  confidence: 0.97,
  city: "Lahore",
  channels: [
    {
      type: "portal" as const,
      label: "Official Portal",
      value: "https://crm.punjab.gov.pk/",
    },
    {
      type: "helpline" as const,
      label: "Helpline",
      value: "15",
    },
    {
      type: "app" as const,
      label: "Mobile App",
      value: "Pakistan Citizen Portal (PCP)",
    },
    {
      type: "email" as const,
      label: "Email",
      value: "complaints@wasalahore.gov.pk",
    },
    {
      type: "office" as const,
      label: "Head Office",
      value: "7-KM Multan Road, Lahore",
    },
    {
      type: "hours" as const,
      label: "Working Hours",
      value: "8:00 AM – 4:00 PM (Mon–Fri)",
    },
  ],
  complaintEn: `Subject: Complaint Regarding Sewer Leakage in Johar Town

Respected Sir/Madam,

I am a resident of Johar Town, Lahore and wish to report a serious issue related to sewer leakage. For the past three days, sewage water has been accumulating in our street, creating an unbearable stench and posing a health hazard to residents, especially children and elderly people.

The stagnant water has made the road impassable and is seeping into nearby homes. We fear this may lead to waterborne diseases if not addressed promptly.

I request WASA Lahore to kindly send a maintenance team to clear the blockage and repair any damaged pipes at the earliest. This is a matter of urgent public health concern.

Thank you for your attention.

Yours sincerely,
[Your Name]
[Your Contact Information]
Johar Town, Lahore`,

  complaintUr: `عنوان: جوہر ٹاؤن میں سیوریج کی شکایت

محترم جناب/مدام،

میں جوہر ٹاؤن، لاہور کا رہائشی ہوں اور سیوریج کے رساؤ سے متعلق ایک سنگین مسئلے کی اطلاع دینا چاہتا ہوں۔ پچھلے تین دنوں سے، ہماری گلی میں گندا پانی جمع ہو رہا ہے، جو ناقابل برداشت بدبو پیدا کر رہا ہے اور رہائشیوں، خاص طور پر بچوں اور بوڑھوں کے لیے صحت کا خطرہ بن گیا ہے۔

کھڑا پانی سڑک کو ناقابل عبور بنا چکا ہے اور قریبی گھروں میں داخل ہو رہا ہے۔ ہمیں خدشہ ہے کہ اگر جلد توجہ نہ دی گئی تو پانی سے پھیلنے والی بیماریاں پھوٹ سکتی ہیں۔

میں واسا لاہور سے درخواست کرتا ہوں کہ براہ کرم جلد از جلد ایک مینٹیننس ٹیم بھیجیں تاکہ بلاکج صاف کیا جا سکے اور کسی بھی نقصان زدہ پائپ کی مرمت کی جا سکے۔ یہ عوامی صحت کا ایک فوری معاملہ ہے۔

آپ کی توجہ کا شکریہ۔

آپ کا مخلص،
[آپ کا نام]
[آپ کی رابطہ معلومات]
جوہر ٹاؤن، لاہور`,
};

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit() {
    if (!text.trim() && !imagePreview) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowResults(true);
    }, 1200);
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
    <div className={darkMode ? "dark" : ""}>
      <div
        className="min-h-screen transition-colors duration-300"
        style={{ background: "var(--color-paper)", color: "var(--color-ink)" }}
      >
        {/* Top Bar */}
        <header
          className="sticky top-0 z-50 border-b backdrop-blur-xl"
          style={{
            height: "64px",
            background: "color-mix(in srgb, var(--color-paper) 80%, transparent)",
            borderColor: "var(--color-rule)",
          }}
        >
          <div className="mx-auto flex h-full max-w-3xl items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ background: "var(--color-accent)" }}
              >
                <span className="text-sm font-bold" style={{ color: "var(--color-accent-ink)" }}>
                  S
                </span>
              </div>
              <h1 className="text-lg font-semibold" style={{ color: "var(--color-ink)" }}>
                SunoGov
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                style={{ background: "var(--color-paper-3)" }}
                title="Search (⌘K)"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--color-paper-2)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "var(--color-paper-3)")
                }
              >
                <Search className="h-4 w-4" style={{ color: "var(--color-ink-3)" }} />
              </button>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                style={{ background: "var(--color-paper-3)" }}
                title="Toggle theme"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--color-paper-2)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "var(--color-paper-3)")
                }
              >
                {darkMode ? (
                  <Sun className="h-4 w-4" style={{ color: "var(--color-ink-3)" }} />
                ) : (
                  <Moon className="h-4 w-4" style={{ color: "var(--color-ink-3)" }} />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-3xl space-y-6 px-6 py-8">
          {/* Hero Section */}
          <AnimatePresence>
            {!showResults && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="mb-8 text-center"
              >
                <h2
                  className="text-3xl font-semibold tracking-tight"
                  style={{ color: "var(--color-ink)" }}
                >
                  Apni Baat, Sahi Jagah
                </h2>
                <p className="mt-2" style={{ color: "var(--color-ink-3)" }}>
                  Your Voice, Right Place — AI-powered civic complaint navigator
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl p-6 backdrop-blur-xl"
            style={{
              background: "color-mix(in srgb, var(--color-surface) 80%, transparent)",
              border: "1px solid var(--color-rule)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <textarea
              className="w-full resize-none bg-transparent text-base leading-relaxed focus:outline-none"
              style={{
                minHeight: "120px",
                color: "var(--color-ink)",
              }}
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
                  className="relative mt-3 inline-block"
                >
                  <img
                    src={imagePreview}
                    alt="Uploaded"
                    className="h-24 rounded-xl object-cover"
                    style={{ border: "1px solid var(--color-rule)" }}
                  />
                  <button
                    onClick={() => setImagePreview(null)}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full transition-colors"
                    style={{ background: "var(--color-error)", color: "white" }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div
              className="mt-4 flex items-center justify-between border-t pt-4"
              style={{ borderColor: "var(--color-rule)" }}
            >
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleVoice("en-PK")}
                  className="flex h-12 w-12 items-center justify-center rounded-full transition-colors"
                  style={{
                    background: isRecording ? "var(--color-accent)" : "var(--color-paper-3)",
                    color: isRecording ? "var(--color-accent-ink)" : "var(--color-ink-2)",
                  }}
                  title="Record in English"
                >
                  <Mic className="h-5 w-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleVoice("ur-PK")}
                  className="flex h-12 w-12 items-center justify-center rounded-full transition-colors"
                  style={{
                    background: "var(--color-paper-3)",
                    color: "var(--color-ink-2)",
                  }}
                  title="Record in Urdu"
                >
                  <span className="text-sm font-urdu">اردو</span>
                </motion.button>

                <label
                  className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full transition-colors"
                  style={{
                    background: "var(--color-paper-3)",
                    color: "var(--color-ink-2)",
                  }}
                  title="Upload image"
                >
                  <ImageIcon className="h-5 w-5" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isLoading || (!text.trim() && !imagePreview)}
                className="flex items-center gap-2 rounded-full px-8 py-3 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  background: "var(--color-accent)",
                  color: "var(--color-accent-ink)",
                  boxShadow: "var(--shadow-lg)",
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Classifying...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Results */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <ReasoningCard
                  issueDisplay={mockResult.issueDisplay}
                  department={mockResult.department}
                  reason={mockResult.reason}
                  confidence={mockResult.confidence}
                  city={mockResult.city}
                />

                <SubmissionHub channels={mockResult.channels} />

                <ComplaintBox
                  complaintEn={mockResult.complaintEn}
                  complaintUr={mockResult.complaintUr}
                />

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  onClick={() => {
                    setShowResults(false);
                    setText("");
                    setImagePreview(null);
                  }}
                  className="w-full rounded-full py-3 font-medium transition-colors"
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
                  File Another Complaint
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
