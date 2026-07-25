"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import {
  Scales,
  MagnifyingGlass,
  Sun,
  Moon,
  House,
  SquaresFour,
  Info,
  Microphone,
  Camera,
  PaperPlaneTilt,
  MapPin,
  Drop,
  Trash,
  Warning,
  CaretDown,
  ArrowRight,
  ArrowUpRight,
  X,
  Buildings,
  CheckCircle,
  Phone,
  EnvelopeSimple,
  Globe,
  Clock,
  Copy,
  Check,
  DownloadSimple,
  DeviceMobileCamera,
  FileText,
  CircleNotch,
  Prohibit,
  NotePencil,
  ArrowUp,
  Gauge,
} from "@phosphor-icons/react";
import { useTheme, useLang } from "@/app/providers";
import { classifyIssue } from "@/app/lib/api";
import { startSpeechRecognition } from "@/app/lib/speech";
import type { ClassifyResponse } from "@/app/lib/types";

// ── Types ─────────────────────────────────────────────────────────────────────

type Page = "home" | "results" | "about" | "dashboard" | "404";

// ── Translations ──────────────────────────────────────────────────────────────

const T = {
  en: {
    heroWords: ["Apni", "Baat,", "Sahi", "Jagah"],
    heroSub: "Describe your civic issue. We identify the right department and draft your complaint.",
    placeholder: "Describe your civic issue, e.g. broken streetlight, sewage overflow, road damage",
    submit: "Submit",
    recent: "Recent",
    fileNew: "File a new complaint",
    fileAnother: "File another complaint",
    cityPlaceholder: "City",
    clearSelection: "Clear selection",
    weeklyActivity: "Weekly activity",
    byDept: "By department",
    recentActivity: "Recent activity",
    dashTitle: "Dashboard",
    aboutTitle: "What is SunoGov?",
    aboutP1: "A civic complaint routing tool for Pakistani citizens. Describe any public service issue and SunoGov identifies the exact government department responsible, then helps you file a formal complaint in seconds.",
    aboutP2: "Built at the Qwen Pakistan AI Buildathon 2026. No accounts, no tracking. We route, we do not store.",
    howItWorks: "How it works",
    steps: [
      { title: "Describe", body: "Type or speak your issue in English or Urdu." },
      { title: "Classify", body: "AI identifies the responsible department instantly." },
      { title: "Submit", body: "Get a formal complaint with the right contacts." },
    ],
    coverageNote: "No accounts. No tracking. We route, we do not store.",
    yourComplaint: "Your complaint",
    howToSubmit: "How to submit",
    cmdHint: "Cmd+Enter",
  },
  ur: {
    heroWords: ["اپنی", "بات،", "صحیح", "جگہ"],
    heroSub: "اپنا شہری مسئلہ بیان کریں۔ ہم صحیح محکمہ تلاش کر کے آپ کی شکایت تیار کریں گے۔",
    placeholder: "اپنا شہری مسئلہ بیان کریں",
    submit: "جمع کریں",
    recent: "حالیہ",
    fileNew: "نئی شکایت درج کریں",
    fileAnother: "دوبارہ شکایت کریں",
    cityPlaceholder: "شہر",
    clearSelection: "انتخاب ہٹائیں",
    weeklyActivity: "ہفتہ وار سرگرمی",
    byDept: "محکمے کے مطابق",
    recentActivity: "حالیہ سرگرمی",
    dashTitle: "ڈیش بورڈ",
    aboutTitle: "سنوگو کیا ہے؟",
    aboutP1: "پاکستانی شہریوں کے لیے ایک شہری شکایت روٹنگ ٹول۔ کوئی بھی سرکاری مسئلہ بیان کریں اور سنوگو فوری طور پر ذمہ دار محکمہ تلاش کر کے آپ کی باقاعدہ شکایت تیار کرتا ہے۔",
    aboutP2: "قوین پاکستان AI بلڈاتھون 2026 میں تیار کیا گیا۔ کوئی اکاؤنٹ نہیں، کوئی ٹریکنگ نہیں۔ ہم روٹ کرتے ہیں، ذخیرہ نہیں کرتے۔",
    howItWorks: "یہ کیسے کام کرتا ہے",
    steps: [
      { title: "بیان کریں", body: "انگریزی یا اردو میں اپنا مسئلہ لکھیں یا بولیں۔" },
      { title: "درجہ بندی", body: "AI فوری طور پر ذمہ دار محکمہ شناخت کرتا ہے۔" },
      { title: "جمع کریں", body: "صحیح رابطوں کے ساتھ باقاعدہ شکایت حاصل کریں۔" },
    ],
    coverageNote: "کوئی اکاؤنٹ نہیں۔ کوئی ٹریکنگ نہیں۔ ہم روٹ کرتے ہیں، ذخیرہ نہیں کرتے۔",
    yourComplaint: "آپ کی شکایت",
    howToSubmit: "جمع کرنے کا طریقہ",
    cmdHint: "Cmd+Enter",
  },
} as const;

// Shared spring configs
const SPRING_SNAPPY = { type: "spring", stiffness: 500, damping: 35 } as const;
const SPRING_LIFT   = { type: "spring", stiffness: 300, damping: 30 } as const;
const SPRING_SMOOTH = { type: "spring", stiffness: 200, damping: 25 } as const;

// ── Routing Helper ────────────────────────────────────────────────────────────

function usePageFromPath(): [Page, (p: Page) => void] {
  const pathname = usePathname();
  const router = useRouter();

  const page = ((): Page => {
    if (pathname === "/results") return "results";
    if (pathname === "/about") return "about";
    if (pathname === "/dashboard") return "dashboard";
    if (pathname === "/404") return "404";
    return "home";
  })();

  const navigate = (p: Page) => {
    const path = p === "home" ? "/" : `/${p}`;
    router.push(path);
  };

  return [page, navigate];
}

// ── TopBar ────────────────────────────────────────────────────────────────────

function TopBar({
  onCmd,
  navigate,
  page,
}: {
  onCmd: () => void;
  navigate: (p: Page) => void;
  page: Page;
}) {
  const { theme, toggle } = useTheme();
  const { lang, toggle: toggleLang } = useLang();

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-20 sm:h-16 flex items-center px-6 sm:px-4 gap-3 sm:gap-3 bg-background/75 backdrop-blur-xl border-b border-border">
      <button
        onClick={() => navigate("home")}
        className="flex items-center gap-3 sm:gap-2 shrink-0 px-3 sm:px-2 h-14 sm:h-12 rounded-xl sm:rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        aria-label="SunoGov home"
      >
        <Scales weight="duotone" size={32} className="text-primary sm:hidden" />
        <Scales weight="duotone" size={28} className="text-primary hidden sm:block" />
        <span className="text-2xl sm:text-xl font-semibold tracking-[-0.015em] text-foreground">
          SunoGov
        </span>
      </button>

      <div className="hidden md:flex items-center gap-2 sm:gap-1.5 ml-4 sm:ml-3">
        {([["home", "Home"], ["dashboard", "Dashboard"], ["about", "About"]] as [Page, string][]).map(([p, label]) => (
          <motion.button
            key={p}
            onClick={() => navigate(p)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={SPRING_SNAPPY}
            className={`px-4 sm:px-3 h-12 sm:h-10 rounded-xl sm:rounded-lg text-base sm:text-lg font-medium transition-colors ${
              page === p ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </motion.button>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-2.5 sm:gap-2">
        <motion.button
          onClick={onCmd}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          transition={SPRING_SNAPPY}
          className="hidden sm:flex items-center gap-2 h-10 pl-3 pr-3 rounded-xl border border-border bg-muted/50 hover:bg-muted text-sm text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <MagnifyingGlass size={16} weight="bold" />
          <span>Search</span>
        </motion.button>
        <motion.button
          onClick={onCmd}
          aria-label="Search"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.88 }}
          transition={SPRING_SNAPPY}
          className="sm:hidden flex items-center justify-center w-12 h-12 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <MagnifyingGlass size={24} weight="bold" />
        </motion.button>

        {/* Language toggle */}
        <div className="relative flex items-center h-12 sm:h-10 rounded-xl sm:rounded-lg bg-muted/50 border border-border overflow-hidden">
          {(["en", "ur"] as ("en" | "ur")[]).map((l) => (
            <motion.button
              key={l}
              onClick={toggleLang}
              whileTap={{ scale: 0.93 }}
              transition={SPRING_SNAPPY}
              className={`relative px-4 sm:px-3 h-full text-sm sm:text-base font-semibold tracking-wide focus-visible:outline-none ${
                l === "ur" ? "font-['Noto_Nastaliq_Urdu',serif] text-base sm:text-lg" : ""
              } ${lang === l ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              {lang === l && (
                <motion.span
                  layoutId="lang-topbar-pill"
                  className="absolute inset-0 bg-primary/10"
                  transition={{ type: "spring", stiffness: 500, damping: 32 }}
                />
              )}
              <span className="relative z-10">{l === "en" ? "EN" : "اردو"}</span>
            </motion.button>
          ))}
        </div>

        <motion.button
          onClick={toggle}
          aria-label="Toggle theme"
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.88 }}
          transition={SPRING_SNAPPY}
          className="flex items-center justify-center w-12 h-12 sm:w-10 sm:h-10 rounded-xl sm:rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {theme === "dark" ? <Sun size={24} weight="bold" className="sm:hidden" /> : <Moon size={24} weight="bold" className="sm:hidden" />}
          {theme === "dark" ? <Sun size={20} weight="bold" className="hidden sm:block" /> : <Moon size={20} weight="bold" className="hidden sm:block" />}
        </motion.button>
      </div>
    </header>
  );
}

// ── Bottom Nav ─────────────────────────────────────────────────────────────────

function BottomNav({
  page,
  navigate,
}: {
  page: Page;
  navigate: (p: Page) => void;
}) {
  const tabs = [
    { id: "home" as Page, icon: House, label: "Home" },
    { id: "dashboard" as Page, icon: SquaresFour, label: "Dashboard" },
    { id: "about" as Page, icon: Info, label: "About" },
  ];

  return (
    <nav className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-50 h-16 px-5 rounded-2xl bg-background/85 backdrop-blur-xl border border-border shadow-lg shadow-black/10 dark:shadow-black/40 flex items-center gap-2">
      {tabs.map(({ id, icon: Icon, label }) => {
        const active = page === id;
        return (
          <motion.button
            key={id}
            onClick={() => navigate(id)}
            aria-label={label}
            whileHover={{ scale: active ? 1 : 1.08, y: -1 }}
            whileTap={{ scale: 0.88 }}
            transition={SPRING_SNAPPY}
            className={`relative flex flex-col items-center justify-center gap-1 w-20 h-12 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
              active ? "bg-muted" : "hover:bg-muted/50"
            }`}
          >
            <Icon
              size={20}
              weight={active ? "fill" : "regular"}
              className={`transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            />
            <span
              className={`text-[10px] font-medium tracking-wide transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
          </motion.button>
        );
      })}
    </nav>
  );
}

// ── Command Palette ────────────────────────────────────────────────────────────

const RECENT_COMPLAINTS = [
  {
    icon: Drop,
    label: "Broken water pipe causing road damage",
    dept: "WASA Lahore",
    city: "Lahore",
  },
  {
    icon: Warning,
    label: "Pothole on Main Boulevard near Liberty",
    dept: "LDA",
    city: "Lahore",
  },
  {
    icon: Trash,
    label: "Garbage not collected for three days",
    dept: "LWMC",
    city: "Lahore",
  },
];

function CommandPalette({
  open,
  onClose,
  navigate,
}: {
  open: boolean;
  onClose: () => void;
  navigate: (p: Page) => void;
}) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ("");
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-[2px]" />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[500px] bg-popover border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-2.5 px-3.5 h-11 border-b border-border">
              <MagnifyingGlass
                size={13}
                weight="bold"
                className="text-muted-foreground shrink-0"
              />
              <input
                ref={inputRef}
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search complaints, departments, cities"
                className="flex-1 bg-transparent border-0 outline-none text-[13px] text-foreground placeholder:text-muted-foreground"
                onKeyDown={(e) => e.key === "Escape" && onClose()}
              />
              <kbd className="text-[10px] text-muted-foreground bg-muted border border-border rounded px-1.5 py-0.5">
                Esc
              </kbd>
            </div>

            <div className="py-1.5">
              {!q ? (
                <>
                  <p className="px-3.5 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">
                    Recent complaints
                  </p>
                  {RECENT_COMPLAINTS.map((r, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ x: 6 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ ...SPRING_SNAPPY, delay: i * 0.04 }}
                      onClick={() => { onClose(); navigate("results"); }}
                      className="w-full flex items-center gap-0 px-3.5 py-2.5 hover:bg-muted/60 transition-colors text-left"
                    >
                      <span className="shrink-0 w-[52px] text-[10px] font-semibold tracking-[0.04em] text-primary font-['JetBrains_Mono',monospace] truncate">
                        {r.dept.split(" ")[0]}
                      </span>
                      <span className="w-px h-3 bg-border shrink-0 mx-3" />
                      <span className="flex-1 text-[13px] text-foreground truncate">
                        {r.label}
                      </span>
                      <span className="shrink-0 ml-3 text-[11px] text-muted-foreground">
                        {r.city}
                      </span>
                    </motion.button>
                  ))}
                </>
              ) : (
                <p className="px-3.5 py-6 text-[13px] text-muted-foreground text-center">
                  No results for{" "}
                  <span className="text-foreground font-medium">{q}</span>
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Confidence Badge ───────────────────────────────────────────────────────────

function ConfidenceBadge({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  if (score >= 0.8)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
        <CheckCircle size={10} weight="fill" />
        {pct}%
      </span>
    );
  if (score >= 0.5)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400">
        <Warning size={10} weight="fill" />
        {pct}%
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-500">
      <Prohibit size={10} weight="fill" />
      {pct}%
    </span>
  );
}

// ── Copy Button ───────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <motion.button
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.88 }}
      transition={SPRING_SNAPPY}
      onClick={copy}
      aria-label="Copy to clipboard"
      className="flex items-center gap-1 h-6 px-2 rounded-md text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span
            key="check"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            className="flex items-center gap-1 text-emerald-500"
          >
            <Check size={11} weight="bold" />
            Copied
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            className="flex items-center gap-1"
          >
            <Copy size={11} weight="regular" />
            Copy
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ── Home Page ─────────────────────────────────────────────────────────────────

const CITIES = [
  "Lahore", "Karachi", "Islamabad", "Rawalpindi",
  "Peshawar", "Quetta", "Multan", "Faisalabad",
];

function HomePage({
  navigate,
  onClassify,
}: {
  navigate: (p: Page) => void;
  onClassify: (result: ClassifyResponse) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { lang } = useLang();
  const t = T[lang];
  const isUrdu = lang === "ur";
  const [text, setText] = useState("");
  const [city, setCity] = useState("");
  const [cityOpen, setCityOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    if (!cityOpen) return;
    const handler = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setCityOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [cityOpen]);

  useEffect(() => {
    setTimeout(() => textRef.current?.focus(), 400);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".sg-hero-word", { opacity: 0, y: 30, stagger: 0.1, duration: 0.8 })
        .from(".sg-hero-sub", { opacity: 0, y: 15, duration: 0.6 }, "-=0.4")
        .from(".sg-input-panel", { opacity: 0, y: 20, duration: 0.6 }, "-=0.35")
        .from(".sg-recent-header", { opacity: 0, duration: 0.5 }, "-=0.2")
        .from(".sg-recent-item", { opacity: 0, x: -15, stagger: 0.1, duration: 0.5 }, "-=0.3");
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  };

  const handleSubmit = useCallback(async () => {
    if (!text.trim() && !imageBase64) { textRef.current?.focus(); return; }
    setLoading(true);
    setError(null);
    try {
      const result = await classifyIssue({
        text: text.trim(),
        image_base64: imageBase64,
        city_hint: city || null,
      });
      onClassify(result);
      navigate("results");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [text, imageBase64, city, onClassify, navigate]);

  const toggleRecording = useCallback((urdu: boolean) => {
    if (recording) {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      setRecording(false);
      return;
    }
    setRecording(true);
    setError(null);
    const lang = urdu ? "ur-PK" as const : "en-PK" as const;
    const handle = startSpeechRecognition(
      lang,
      (transcript) => {
        setText((prev) => (prev ? prev + " " + transcript : transcript));
        setRecording(false);
        recognitionRef.current = null;
      },
      (err) => {
        setRecording(false);
        recognitionRef.current = null;
        if (err !== "aborted") {
          setError("Voice input failed. Please try again or type your issue.");
        }
      }
    );
    recognitionRef.current = handle;
  }, [recording]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setImagePreview(dataUrl);
      const base64 = dataUrl.split(",")[1];
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div ref={containerRef} className="flex-1 flex flex-col items-center px-4 sm:px-6 pt-20 sm:pt-24 pb-28 md:pb-16">
      {/* Hero */}
      <div className="w-full max-w-2xl text-center mb-8 sm:mb-10">
        {isUrdu ? (
          <h1
            dir="rtl"
            className="sg-hero-word text-[38px] sm:text-[44px] md:text-[52px] font-semibold leading-[1.7] text-foreground font-['Noto_Nastaliq_Urdu',serif]"
          >
            <span>{t.heroWords[0]} {t.heroWords[1]} </span>
            <span className="text-primary">{t.heroWords[2]} {t.heroWords[3]}</span>
          </h1>
        ) : (
          <h1 className="text-[42px] sm:text-[48px] md:text-[56px] font-semibold tracking-[-0.03em] leading-[1.1] text-foreground flex flex-wrap justify-center gap-x-3">
            {t.heroWords.map((w, i) => (
              <span
                key={i}
                className={`sg-hero-word inline-block ${i >= 2 ? "text-primary" : ""}`}
              >
                {w}
              </span>
            ))}
          </h1>
        )}
        <p className={`sg-hero-sub mt-4 sm:mt-5 text-[15px] sm:text-[16px] md:text-[17px] text-muted-foreground leading-relaxed max-w-md mx-auto ${isUrdu ? "font-['Noto_Nastaliq_Urdu',serif] leading-[2]" : ""}`}>
          {t.heroSub}
        </p>
      </div>

      {/* Input Panel */}
      <div className="sg-input-panel w-full max-w-2xl">
        <div className="rounded-2xl sm:rounded-3xl bg-card border border-border shadow-sm transition-shadow focus-within:shadow-md">
          {/* Textarea */}
          <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3">
            <textarea
              ref={textRef}
              value={text}
              onChange={(e) => { setText(e.target.value); autoResize(e.target); }}
              dir={isUrdu ? "rtl" : "ltr"}
              placeholder={t.placeholder}
              className={`w-full min-h-[120px] sm:min-h-[140px] bg-transparent border-0 resize-none outline-none text-[15px] sm:text-[16px] text-foreground placeholder:text-muted-foreground leading-relaxed ${
                isUrdu ? "font-['Noto_Nastaliq_Urdu',serif] text-[17px] sm:text-[18px] leading-[2.2]" : ""
              }`}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleSubmit();
              }}
            />
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 sm:px-6 pb-2"
              >
                <p className="text-[13px] text-error flex items-center gap-2">
                  <Warning size={14} weight="fill" />
                  {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Image preview */}
          <AnimatePresence>
            {imagePreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 pb-2"
              >
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Uploaded issue"
                    className="h-20 w-auto rounded-xl object-cover border border-border"
                  />
                  <button
                    onClick={() => { setImagePreview(null); setImageBase64(null); }}
                    className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-5 h-5 rounded-full bg-foreground text-background shadow-sm"
                  >
                    <X size={10} weight="bold" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="border-t border-border" />

          {/* Toolbar */}
          <div className="flex items-center gap-2.5 sm:gap-2 px-4 sm:px-3 py-3.5 sm:py-3">
            {/* Voice - English */}
            <motion.button
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.85 }}
              transition={SPRING_SNAPPY}
              aria-label={recording ? "Stop recording" : "Record voice in English"}
              onClick={() => toggleRecording(false)}
              className={`relative flex items-center justify-center w-12 h-12 sm:w-10 sm:h-10 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                recording
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Microphone size={20} weight="fill" className="sm:hidden" />
              <Microphone size={18} weight="fill" className="hidden sm:block" />
              {recording && (
                <motion.span
                  className="absolute inset-0 rounded-full border border-primary"
                  animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                />
              )}
            </motion.button>

            {/* Urdu voice */}
            <motion.button
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.85 }}
              transition={SPRING_SNAPPY}
              aria-label="Record in Urdu"
              onClick={() => toggleRecording(true)}
              className="flex items-center justify-center w-12 h-12 sm:w-10 sm:h-10 rounded-full bg-muted text-muted-foreground transition-colors text-[13px] sm:text-[11px] font-['Noto_Nastaliq_Urdu',serif] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              اردو
            </motion.button>

            {/* Image upload */}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImage}
            />
            <motion.button
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.85 }}
              transition={SPRING_SNAPPY}
              aria-label="Upload image"
              onClick={() => fileRef.current?.click()}
              className="flex items-center justify-center w-12 h-12 sm:w-10 sm:h-10 rounded-full bg-muted text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <Camera size={20} weight="fill" className="sm:hidden" />
              <Camera size={18} weight="fill" className="hidden sm:block" />
            </motion.button>

            {/* City */}
            <div ref={cityRef} className="relative">
              <motion.button
                onClick={() => setCityOpen((v) => !v)}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.95 }}
                transition={SPRING_SNAPPY}
                className={`flex items-center gap-1.5 h-9 sm:h-8 px-3 sm:px-2.5 rounded-xl sm:rounded-lg text-[12px] sm:text-[11px] font-medium border transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                  cityOpen
                    ? "bg-muted border-border text-foreground"
                    : city
                    ? "bg-muted/60 border-border text-foreground"
                    : "bg-transparent border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                <MapPin size={12} weight="fill" className={city ? "text-primary" : "text-muted-foreground"} />
                <span>{city || t.cityPlaceholder}</span>
                <motion.span
                  animate={{ rotate: cityOpen ? 180 : 0 }}
                  transition={SPRING_SNAPPY}
                  className="flex items-center"
                >
                  <CaretDown size={10} weight="bold" />
                </motion.span>
              </motion.button>

              <AnimatePresence>
                {cityOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 480, damping: 30 }}
                    className="absolute bottom-full mb-1.5 left-0 z-50 w-44 rounded-xl bg-popover border border-border shadow-xl overflow-hidden py-1"
                  >
                    {city && (
                      <div className="px-1.5 pb-1 border-b border-border mb-1">
                        <motion.button
                          whileHover={{ x: 3 }}
                          transition={SPRING_SNAPPY}
                          onClick={() => { setCity(""); setCityOpen(false); }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-full text-[11px] text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors"
                        >
                          <X size={9} weight="bold" />
                          {t.clearSelection}
                        </motion.button>
                      </div>
                    )}
                    <div className="px-1.5 py-0.5">
                      {CITIES.map((c) => (
                        <motion.button
                          key={c}
                          whileHover={{ x: 3 }}
                          transition={SPRING_SNAPPY}
                          onClick={() => { setCity(c); setCityOpen(false); }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-full text-[11px] text-left transition-colors ${
                            city === c ? "bg-primary/10 text-primary" : "hover:bg-muted/70 text-foreground"
                          }`}
                        >
                          <span className={city === c ? "font-medium" : ""}>{c}</span>
                          {city === c && (
                            <Check size={10} weight="bold" className="text-primary shrink-0" />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="ml-auto flex items-center gap-2">
              {text.length > 0 && (
                <span className="hidden sm:block text-[10px] text-muted-foreground select-none">
                  {t.cmdHint}
                </span>
              )}
              <motion.button
                initial="rest"
                whileHover={!text.trim() && !imageBase64 || loading ? "rest" : "hover"}
                whileTap={{ scale: 0.94 }}
                transition={SPRING_SNAPPY}
                onClick={handleSubmit}
                disabled={(!text.trim() && !imageBase64) || loading}
                className="flex items-center gap-2.5 h-11 sm:h-9 pl-5 sm:pl-4 pr-3.5 sm:pr-3 rounded-full bg-primary text-primary-foreground text-[14px] sm:text-[13px] font-semibold shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-opacity focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {loading ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  >
                    <CircleNotch size={16} weight="bold" className="sm:hidden" />
                    <CircleNotch size={14} weight="bold" className="hidden sm:block" />
                  </motion.span>
                ) : (
                  <>
                    {t.submit}
                    <motion.span
                      variants={{ rest: { x: 0, rotate: 0 }, hover: { x: 2, rotate: 20 } }}
                      transition={SPRING_SNAPPY}
                      className="flex items-center"
                    >
                      <PaperPlaneTilt size={16} weight="fill" className="sm:hidden" />
                      <PaperPlaneTilt size={14} weight="fill" className="hidden sm:block" />
                    </motion.span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        <p className="mt-2.5 text-center text-[11px] text-muted-foreground">
          15 cities · 42 issue types · English and Urdu
        </p>
      </div>

      {/* Recent */}
      <div className="w-full max-w-2xl mt-8 sm:mt-10">
        <p className="sg-recent-header text-[11px] sm:text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-3 px-1">
          {t.recent}
        </p>
        <div className="divide-y divide-border">
          {RECENT_COMPLAINTS.map((r, i) => (
            <motion.button
              key={i}
              whileHover={{ x: 6 }}
              whileTap={{ scale: 0.99, x: 3 }}
              transition={SPRING_SNAPPY}
              onClick={() => navigate("results")}
              className="sg-recent-item w-full flex items-center gap-0 py-3 sm:py-2.5 hover:bg-muted/40 -mx-2 px-2 rounded-lg transition-colors text-left"
            >
              <span className="shrink-0 w-[60px] sm:w-[52px] text-[11px] sm:text-[10px] font-semibold tracking-[0.04em] text-primary font-['JetBrains_Mono',monospace] truncate">
                {r.dept.split(" ")[0]}
              </span>
              <span className="w-px h-3 bg-border shrink-0 mx-3" />
              <span className="flex-1 min-w-0 text-[14px] sm:text-[13px] text-foreground truncate">
                {r.label}
              </span>
              <span className="shrink-0 ml-3 text-[12px] sm:text-[11px] text-muted-foreground">
                {r.city}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Results Page ──────────────────────────────────────────────────────────────

interface Channel {
  type: string;
  icon: any;
  label: string;
  value: string;
  action: string | null;
  href: string | null;
}

function buildChannels(dept: ClassifyResponse["department"]): Channel[] {
  const channels: Channel[] = [];
  if (dept.portal) {
    channels.push({ type: "PORTAL", icon: Globe, label: "Online Portal", value: dept.portal.replace(/^https?:\/\//, ""), action: "open", href: dept.portal });
  }
  if (dept.helpline) {
    channels.push({ type: "HELPLINE", icon: Phone, label: "Helpline", value: dept.helpline, action: "call", href: `tel:${dept.helpline}` });
  }
  if (dept.emergency_helpline) {
    channels.push({ type: "EMERGENCY", icon: Phone, label: "Emergency", value: dept.emergency_helpline, action: "call", href: `tel:${dept.emergency_helpline}` });
  }
  if (dept.email) {
    channels.push({ type: "EMAIL", icon: EnvelopeSimple, label: "Email", value: dept.email, action: "email", href: `mailto:${dept.email}` });
  }
  if (dept.app) {
    channels.push({ type: "APP", icon: DeviceMobileCamera, label: "Mobile App", value: dept.app, action: "download", href: null });
  }
  if (dept.whatsapp) {
    channels.push({ type: "WHATSAPP", icon: Phone, label: "WhatsApp", value: dept.whatsapp, action: "open", href: `https://wa.me/${dept.whatsapp.replace(/\D/g, "")}` });
  }
  if (dept.office) {
    channels.push({ type: "OFFICE", icon: Buildings, label: "Head Office", value: dept.office, action: "copy", href: null });
  }
  if (dept.hours) {
    channels.push({ type: "HOURS", icon: Clock, label: "Office Hours", value: dept.hours, action: null, href: null });
  }
  return channels;
}

function ResultsPage({
  navigate,
  result,
}: {
  navigate: (p: Page) => void;
  result: ClassifyResponse | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { lang } = useLang();
  const t = T[lang];
  const [activeTab, setActiveTab] = useState<"en" | "ur">("en");
  const [copiedOffice, setCopiedOffice] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".sg-result-section", {
        opacity: 0,
        y: 25,
        stagger: 0.15,
        duration: 0.7,
        ease: "power4.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  if (!result) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-16 text-center">
        <p className="text-[16px] text-muted-foreground">No results yet. File a complaint first.</p>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("home")}
          className="mt-4 flex items-center gap-1.5 h-8 pl-4 pr-3 rounded-full bg-primary text-primary-foreground text-[13px] font-semibold hover:opacity-90 transition-opacity"
        >
          Go home
          <ArrowRight size={13} weight="bold" />
        </motion.button>
      </div>
    );
  }

  const channels = buildChannels(result.department);
  const complaintEn = result.complaint.english;
  const complaintUr = result.complaint.urdu;

  const copyOffice = (value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedOffice(true);
      setTimeout(() => setCopiedOffice(false), 2000);
    });
  };

  return (
    <div ref={containerRef} className="flex-1 flex flex-col items-center px-4 sm:px-6 pt-20 sm:pt-24 pb-28 md:pb-16 gap-4 sm:gap-5">
      <div className="w-full max-w-2xl space-y-4 sm:space-y-5">

        {/* ── Reasoning Card ───────────────────────────────────────── */}
        <div className="sg-result-section">
          <div className="rounded-3xl sm:rounded-3xl bg-card border border-border overflow-hidden">
            <div className="px-6 sm:px-6 pt-6 sm:pt-6 pb-5 sm:pb-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-[17px] sm:text-[17px] md:text-[18px] font-semibold text-foreground leading-snug">
                    {result.issue_display}
                  </h2>
                  <p className="text-[14px] sm:text-[14px] text-muted-foreground mt-2 flex items-center gap-2">
                    <Buildings size={14} weight="duotone" className="sm:hidden" />
                    <Buildings size={11} weight="duotone" className="hidden sm:block" />
                    {result.department.name}
                    <span className="opacity-30">·</span>
                    <MapPin size={14} weight="duotone" className="sm:hidden" />
                    <MapPin size={11} weight="duotone" className="hidden sm:block" />
                    {result.city}
                  </p>
                </div>
                <ConfidenceBadge score={result.confidence} />
              </div>
            </div>
            <div className="px-6 sm:px-6 py-5 sm:py-5 border-t border-border bg-muted/30">
              <p className="text-[14px] sm:text-[13.5px] text-muted-foreground leading-relaxed italic">
                {result.department.reason}
              </p>
            </div>
          </div>
        </div>

        {/* ── Submission Hub ────────────────────────────────────────── */}
        <div className="sg-result-section">
          <p className="text-[12px] sm:text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-3 sm:mb-2 px-1">
            {t.howToSubmit}
          </p>
          <div className="rounded-3xl sm:rounded-3xl bg-card border border-border overflow-hidden divide-y divide-border">
            {channels.map((ch, i) => (
              <motion.div
                key={i}
                whileHover={{ x: ch.action ? 4 : 0 }}
                transition={SPRING_SNAPPY}
                className="flex items-center gap-0 px-5 sm:px-5 py-4 sm:py-3 hover:bg-muted/30 transition-colors"
              >
                <span className="shrink-0 w-[65px] sm:w-[56px] text-[12px] sm:text-[10px] font-semibold tracking-[0.05em] text-primary font-['JetBrains_Mono',monospace]">
                  {ch.type}
                </span>
                <span className="w-px h-3 bg-border shrink-0 mx-3" />
                <span className="flex-1 min-w-0">
                  <span className="block text-[14px] sm:text-[12px] text-muted-foreground">{ch.label}</span>
                  <span className="block text-[15px] sm:text-[13px] text-foreground font-medium truncate mt-0.5">
                    {ch.value}
                  </span>
                </span>
                {ch.action === "open" && ch.href && (
                  <a
                    href={ch.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 flex items-center gap-1 h-6 px-2.5 rounded-full bg-primary text-primary-foreground text-[11px] font-semibold hover:opacity-90 transition-opacity"
                  >
                    Open
                    <ArrowUpRight size={10} weight="bold" />
                  </a>
                )}
                {ch.action === "call" && ch.href && (
                  <a
                    href={ch.href}
                    className="shrink-0 flex items-center gap-1 h-6 px-2.5 rounded-full border border-border text-[11px] font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <Phone size={10} weight="fill" />
                    Call
                  </a>
                )}
                {ch.action === "email" && ch.href && (
                  <a
                    href={ch.href}
                    className="shrink-0 flex items-center gap-1 h-6 px-2.5 rounded-full border border-border text-[11px] font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <EnvelopeSimple size={10} weight="fill" />
                    Email
                  </a>
                )}
                {ch.action === "download" && (
                  <button className="shrink-0 flex items-center gap-1 h-6 px-2.5 rounded-full border border-border text-[11px] font-medium text-foreground hover:bg-muted transition-colors">
                    <DownloadSimple size={10} weight="bold" />
                    Get
                  </button>
                )}
                {ch.action === "copy" && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => copyOffice(ch.value)}
                    className="shrink-0 flex items-center gap-1 h-6 px-2.5 rounded-full border border-border text-[11px] font-medium transition-colors hover:bg-muted"
                  >
                    {copiedOffice ? (
                      <Check size={10} weight="bold" className="text-emerald-500" />
                    ) : (
                      <Copy size={10} weight="regular" />
                    )}
                    {copiedOffice ? "Copied" : "Copy"}
                  </motion.button>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Complaint Box ─────────────────────────────────────────── */}
        <div className="sg-result-section">
          <div className="flex items-center justify-between mb-3 sm:mb-2 px-1">
            <p className="text-[12px] sm:text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em]">
              {t.yourComplaint}
            </p>
            <div className="flex items-center gap-0.5">
              {(["en", "ur"] as const).map((l) => (
                <motion.button
                  key={l}
                  whileHover={activeTab === l ? {} : { y: -1 }}
                  whileTap={{ scale: 0.93 }}
                  transition={SPRING_SNAPPY}
                  onClick={() => setActiveTab(l)}
                  className={`relative px-3.5 sm:px-2.5 h-8 sm:h-6 rounded-lg sm:rounded-md text-[13px] sm:text-[11px] font-medium focus-visible:outline-none ${
                    l === "ur" ? "font-['Noto_Nastaliq_Urdu',serif]" : ""
                  } ${
                    activeTab === l
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {activeTab === l && (
                    <motion.span
                      layoutId="lang-tab-pill-results"
                      className="absolute inset-0 rounded-lg sm:rounded-md bg-muted shadow-sm"
                      transition={{ type: "spring", stiffness: 500, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{l === "en" ? "English" : "اردو"}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl sm:rounded-3xl bg-card border border-border overflow-hidden">
            <div className="flex items-center justify-between px-5 sm:px-5 py-3.5 sm:py-2.5 border-b border-border">
              <div className="flex items-center gap-2">
                <FileText size={14} weight="duotone" className="text-muted-foreground sm:hidden" />
                <FileText size={12} weight="duotone" className="text-muted-foreground hidden sm:block" />
                <span className="text-[13px] sm:text-[11px] text-muted-foreground">
                  {activeTab === "en" ? "complaint-en.txt" : "complaint-ur.txt"}
                </span>
              </div>
              <CopyButton text={activeTab === "en" ? complaintEn : complaintUr} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="p-5 sm:p-5"
              >
                <pre
                  dir={activeTab === "ur" ? "rtl" : "ltr"}
                  className={`whitespace-pre-wrap text-[14px] sm:text-[12.5px] text-foreground leading-relaxed ${
                    activeTab === "ur"
                      ? "font-['Noto_Nastaliq_Urdu',serif] text-[16px] sm:text-[14px] leading-[2.1] text-right"
                      : "font-['JetBrains_Mono',monospace]"
                  }`}
                >
                  {activeTab === "en" ? complaintEn : complaintUr}
                </pre>
              </motion.div>
            </AnimatePresence>

            <div className="px-5 sm:px-5 py-4 sm:py-3 border-t border-border">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const content = activeTab === "en" ? complaintEn : complaintUr;
                  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `complaint-${activeTab}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="w-full flex items-center justify-center gap-2.5 h-10 sm:h-8 rounded-xl border border-border text-[14px] sm:text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <DownloadSimple size={16} weight="bold" className="sm:hidden" />
                <DownloadSimple size={13} weight="bold" className="hidden sm:block" />
                Download as .txt
              </motion.button>
            </div>
          </div>
        </div>

        {/* ── File another ──────────────────────────────────────────── */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={SPRING_SNAPPY}
          onClick={() => navigate("home")}
          className="sg-result-section w-full h-11 sm:h-9 rounded-full border border-border text-[14px] sm:text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-card transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {t.fileAnother}
        </motion.button>
      </div>
    </div>
  );
}

// ── About Page ────────────────────────────────────────────────────────────────

function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { lang } = useLang();
  const t = T[lang];
  const isUrdu = lang === "ur";
  const stepIcons = [Microphone, Buildings, PaperPlaneTilt];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".sg-about-title", { opacity: 0, y: 20, duration: 0.6 })
        .from(".sg-about-body", { opacity: 0, y: 12, duration: 0.55 }, "-=0.3")
        .from(".sg-step-card", { opacity: 0, y: 18, stagger: 0.1, duration: 0.5 }, "-=0.25")
        .from(".sg-stat", { opacity: 0, scale: 0.9, stagger: 0.08, duration: 0.45 }, "-=0.2");
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="flex-1 flex flex-col items-center px-4 sm:px-6 pt-20 sm:pt-24 pb-28 md:pb-16">
      <div className={`w-full max-w-2xl space-y-8 sm:space-y-10 ${isUrdu ? "font-['Noto_Nastaliq_Urdu',serif]" : ""}`}>
        <div>
          <h1 className="sg-about-title text-[28px] sm:text-[32px] md:text-[36px] font-semibold tracking-[-0.025em] text-foreground">
            {t.aboutTitle}
          </h1>
          <div className="sg-about-body mt-4 sm:mt-5 space-y-3">
            <p className="text-[15px] sm:text-[16px] text-muted-foreground leading-relaxed">
              {t.aboutP1}
            </p>
            <p className="text-[15px] sm:text-[16px] text-muted-foreground leading-relaxed">
              {t.aboutP2}
            </p>
          </div>
        </div>

        <div>
          <p className="text-[11px] sm:text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-3 sm:mb-2">
            {t.howItWorks}
          </p>
          <div className="divide-y divide-border">
            {t.steps.map((s, i) => {
              const Icon = stepIcons[i];
              return (
              <motion.div
                key={i}
                whileHover={{ x: 6 }}
                transition={SPRING_SNAPPY}
                className="sg-step-card flex items-start gap-5 sm:gap-6 py-6 sm:py-5 group cursor-default"
              >
                <motion.span
                  className="shrink-0 text-[48px] sm:text-[42px] font-semibold leading-none tracking-[-0.04em] select-none text-foreground/[0.06] group-hover:text-primary/25 transition-colors duration-200"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </motion.span>
                <div className="flex-1 pt-1.5 sm:pt-1">
                  <div className="flex items-center gap-2.5 sm:gap-2 mb-1.5 sm:mb-1">
                    <Icon size={14} weight="duotone" className="text-primary shrink-0 sm:hidden" />
                    <Icon size={13} weight="duotone" className="text-primary shrink-0 hidden sm:block" />
                    <p className="text-[14px] sm:text-[13px] font-semibold text-foreground">{s.title}</p>
                  </div>
                  <p className="text-[14px] sm:text-[13px] text-muted-foreground leading-relaxed">{s.body}</p>
                </div>
              </motion.div>
            );
            })}
          </div>
        </div>

        <div className="rounded-xl sm:rounded-2xl bg-card border border-border overflow-hidden">
          <div className="grid grid-cols-3 divide-x divide-border">
            {[["15", "Cities"], ["42", "Issue types"], ["2", "Languages"]].map(([n, l]) => (
              <div key={l} className="sg-stat text-center py-6 sm:py-5 px-3">
                <p className="text-[28px] sm:text-[24px] font-semibold text-foreground tracking-tight">{n}</p>
                <p className="text-[12px] sm:text-[11px] text-muted-foreground mt-1 sm:mt-0.5">{l}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-border px-5 sm:px-6 py-4 sm:py-3.5 bg-muted/30">
            <p className="text-[13px] sm:text-[12px] text-muted-foreground leading-relaxed text-center">
              {t.coverageNote}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 404 Page ──────────────────────────────────────────────────────────────────

function NotFoundPageComponent({ navigate }: { navigate: (p: Page) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".sg-404-el", {
        opacity: 0,
        y: 12,
        stagger: 0.1,
        duration: 0.5,
        ease: "power3.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col items-center justify-center px-4 pb-16 text-center"
    >
      <span className="sg-404-el text-[80px] font-semibold tracking-[-0.04em] leading-none text-foreground/[0.05] select-none">
        404
      </span>
      <h1 className="sg-404-el mt-2 text-[20px] font-semibold tracking-[-0.02em] text-foreground">
        Page not found
      </h1>
      <p className="sg-404-el mt-2 text-[14px] text-muted-foreground max-w-xs leading-relaxed">
        The page you are looking for does not exist.
      </p>
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={() => navigate("home")}
        className="sg-404-el mt-6 flex items-center gap-1.5 h-8 pl-4 pr-3 rounded-full bg-primary text-primary-foreground text-[13px] font-semibold hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        Go home
        <ArrowRight size={13} weight="bold" />
      </motion.button>
    </div>
  );
}

// ── Dashboard Page ────────────────────────────────────────────────────────────

const DEPT_BREAKDOWN = [
  { dept: "WASA", full: "Water & Sanitation", count: 4, pct: 0.8 },
  { dept: "LDA",  full: "Lahore Development Auth.", count: 3, pct: 0.6 },
  { dept: "LWMC", full: "Lahore Waste Management", count: 2, pct: 0.4 },
  { dept: "CDA",  full: "Capital Dev. Authority", count: 1, pct: 0.2 },
  { dept: "KMC",  full: "Karachi Metropolitan Corp.", count: 1, pct: 0.2 },
];

const WEEKLY_ACTIVITY = [
  { day: "Mon", count: 2 },
  { day: "Tue", count: 5 },
  { day: "Wed", count: 3 },
  { day: "Thu", count: 7 },
  { day: "Fri", count: 4 },
  { day: "Sat", count: 1 },
  { day: "Sun", count: 3 },
];

const ACTIVITY_FEED = [
  { label: "Broken water pipe causing road damage", dept: "WASA", city: "Lahore", status: "pending", ago: "2h ago" },
  { label: "Pothole on Main Boulevard near Liberty", dept: "LDA", city: "Lahore", status: "resolved", ago: "1d ago" },
  { label: "Garbage not collected for three days", dept: "LWMC", city: "Lahore", status: "pending", ago: "1d ago" },
  { label: "Street light out on Jail Road", dept: "LESCO", city: "Lahore", status: "resolved", ago: "3d ago" },
  { label: "Sewage overflow near Model Town", dept: "WASA", city: "Lahore", status: "pending", ago: "4d ago" },
];

function WeeklyLollipop() {
  const max = Math.max(...WEEKLY_ACTIVITY.map((d) => d.count));
  const trackH = 72;
  const peakDay = WEEKLY_ACTIVITY.reduce((a, b) => (a.count >= b.count ? a : b)).day;

  return (
    <div className="flex items-end gap-0">
      {WEEKLY_ACTIVITY.map((d, i) => {
        const pct = d.count / max;
        const stemH = Math.max(6, Math.round(pct * trackH));
        const isPeak = d.day === peakDay;

        return (
          <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 group cursor-default">
            <div className="h-4 flex items-end justify-center">
              <span
                className={`text-[9px] font-semibold font-['JetBrains_Mono',monospace] transition-all duration-150 ${
                  isPeak ? "text-primary opacity-100" : "text-muted-foreground opacity-0 group-hover:opacity-100"
                }`}
              >
                {d.count}
              </span>
            </div>

            <div className="relative flex flex-col items-center justify-end" style={{ height: trackH }}>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.18 + i * 0.06, type: "spring", stiffness: 480, damping: 22 }}
                className={`absolute z-10 rounded-full transition-colors duration-200 ${
                  isPeak
                    ? "bg-primary"
                    : "bg-border group-hover:bg-primary"
                }`}
                style={{ width: 5, height: 5, bottom: stemH - 2.5 }}
              />
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: stemH }}
                transition={{ delay: 0.12 + i * 0.06, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className={`w-px rounded-full transition-colors duration-200 ${
                  isPeak
                    ? "bg-primary"
                    : "bg-border group-hover:bg-primary/50"
                }`}
              />
            </div>

            <span
              className={`text-[9px] font-medium tracking-wide transition-colors duration-200 ${
                isPeak ? "text-primary" : "text-muted-foreground/50 group-hover:text-muted-foreground"
              }`}
            >
              {d.day}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function DashboardPage({ navigate }: { navigate: (p: Page) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { lang } = useLang();
  const t = T[lang];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".sg-dash-title", { opacity: 0, y: 15, duration: 0.5 })
        .from(".sg-dash-stat", { opacity: 0, y: 18, stagger: 0.1, duration: 0.55 }, "-=0.25")
        .from(".sg-dash-section", { opacity: 0, y: 20, stagger: 0.12, duration: 0.6 }, "-=0.3");
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const stats = [
    { icon: FileText, label: "Complaints filed", value: "12", sub: "+3 this week", color: "text-primary" },
    { icon: Buildings, label: "Departments reached", value: "8", sub: "across 5 cities", color: "text-foreground" },
    { icon: Gauge, label: "Avg. response", value: "2.4d", sub: "past 30 days", color: "text-foreground" },
    { icon: ArrowUp, label: "Resolution rate", value: "67%", sub: "8 of 12 resolved", color: "text-emerald-500 dark:text-emerald-400" },
  ];

  return (
    <div ref={containerRef} className="flex-1 flex flex-col items-center px-4 sm:px-6 pt-20 sm:pt-24 pb-28 md:pb-16">
      <div className="w-full max-w-2xl space-y-7 sm:space-y-8">

        {/* Header */}
        <div className="sg-dash-title flex items-baseline justify-between">
          <h1 className="text-[24px] sm:text-[26px] md:text-[28px] font-semibold tracking-[-0.025em] text-foreground">
            {t.dashTitle}
          </h1>
          <span className="text-[12px] sm:text-[11px] text-muted-foreground font-['JetBrains_Mono',monospace]">
            July 2026
          </span>
        </div>

        {/* Stats panel */}
        <div className="sg-dash-stat rounded-3xl sm:rounded-3xl bg-card border border-border overflow-hidden">
          <div className="grid grid-cols-2">
            {stats.map((s, i) => (
              <div
                key={i}
                className={`group p-6 sm:p-4 cursor-default hover:bg-muted/25 transition-colors duration-200 ${
                  i % 2 === 0 ? "border-r border-border" : ""
                } ${i < 2 ? "border-b border-border" : ""}`}
              >
                <div className="flex items-center justify-between mb-4 sm:mb-2.5">
                  <s.icon
                    size={16}
                    weight="duotone"
                    className="text-muted-foreground/60 group-hover:text-primary transition-colors duration-200 sm:hidden"
                  />
                  <s.icon
                    size={13}
                    weight="duotone"
                    className="text-muted-foreground/60 group-hover:text-primary transition-colors duration-200 hidden sm:block"
                  />
                  <span className="text-[11px] sm:text-[9px] font-medium text-muted-foreground/50 tracking-wide">{s.sub}</span>
                </div>
                <p className="text-[32px] sm:text-[24px] font-semibold tracking-tight leading-none text-foreground group-hover:text-primary transition-colors duration-200">
                  {s.value}
                </p>
                <p className="text-[13px] sm:text-[11px] text-muted-foreground mt-2.5 sm:mt-1.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly activity chart */}
        <div className="sg-dash-section">
          <p className="text-[12px] sm:text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-4 sm:mb-3">
            {t.weeklyActivity}
          </p>
          <div className="rounded-3xl sm:rounded-3xl bg-card border border-border px-6 sm:px-6 py-6 sm:py-4">
            <WeeklyLollipop />
          </div>
        </div>

        {/* Department breakdown */}
        <div className="sg-dash-section">
          <p className="text-[12px] sm:text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-3 sm:mb-2">
            {t.byDept}
          </p>
          <div className="rounded-3xl sm:rounded-3xl bg-card border border-border overflow-hidden divide-y divide-border">
            {DEPT_BREAKDOWN.map((d, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 5 }}
                transition={SPRING_SNAPPY}
                className="flex items-center gap-0 px-5 sm:px-5 py-4 sm:py-3 hover:bg-muted/30 transition-colors cursor-default"
              >
                <span className="shrink-0 w-[65px] sm:w-[52px] text-[12px] sm:text-[10px] font-semibold tracking-[0.04em] text-primary font-['JetBrains_Mono',monospace]">
                  {d.dept}
                </span>
                <span className="w-px h-3 bg-border shrink-0 mx-3" />
                <span className="flex-1 min-w-0">
                  <span className="block text-[14px] sm:text-[12px] text-muted-foreground truncate">{d.full}</span>
                  <div className="mt-2.5 sm:mt-1.5 h-2 sm:h-1 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${d.pct * 100}%` }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: "easeOut" }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                </span>
                <span className="shrink-0 ml-4 text-[14px] sm:text-[12px] font-semibold text-foreground font-['JetBrains_Mono',monospace]">
                  {d.count}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div className="sg-dash-section">
          <p className="text-[12px] sm:text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-3 sm:mb-2">
            {t.recentActivity}
          </p>
          <div className="divide-y divide-border">
            {ACTIVITY_FEED.map((a, i) => (
              <motion.button
                key={i}
                whileHover={{ x: 6 }}
                whileTap={{ scale: 0.99, x: 3 }}
                transition={SPRING_SNAPPY}
                onClick={() => navigate("results")}
                className="w-full flex items-center gap-0 py-3.5 sm:py-2.5 hover:bg-muted/40 -mx-2 px-2 rounded-lg transition-colors text-left"
              >
                <span className="shrink-0 w-[65px] sm:w-[52px] text-[12px] sm:text-[10px] font-semibold tracking-[0.04em] text-primary font-['JetBrains_Mono',monospace] truncate">
                  {a.dept}
                </span>
                <span className="w-px h-3 bg-border shrink-0 mx-3" />
                <span className="flex-1 min-w-0 text-[15px] sm:text-[13px] text-foreground truncate">
                  {a.label}
                </span>
                <span className="shrink-0 ml-3 flex items-center gap-1.5">
                  <span
                    className={`w-2.5 h-2.5 sm:w-1.5 sm:h-1.5 rounded-full shrink-0 ${
                      a.status === "resolved"
                        ? "bg-emerald-500"
                        : "bg-amber-400"
                    }`}
                  />
                  <span className="text-[13px] sm:text-[11px] text-muted-foreground hidden sm:block">{a.ago}</span>
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Quick action */}
        <div className="sg-dash-section">
          <motion.button
            initial="rest"
            whileHover="hover"
            whileTap={{ scale: 0.97 }}
            transition={SPRING_SNAPPY}
            onClick={() => navigate("home")}
            className="w-full flex items-center justify-center gap-2.5 h-12 sm:h-9 rounded-full bg-primary text-primary-foreground text-[15px] sm:text-[13px] font-semibold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <motion.span
              variants={{ rest: { y: 0, rotate: 0 }, hover: { y: -2, rotate: -20 } }}
              transition={SPRING_SNAPPY}
              className="flex items-center"
            >
              <NotePencil size={18} weight="fill" className="sm:hidden" />
              <NotePencil size={14} weight="fill" className="hidden sm:block" />
            </motion.span>
            {t.fileNew}
          </motion.button>
        </div>

      </div>
    </div>
  );
}

// ── Root App ──────────────────────────────────────────────────────────────────

export default function SunoGovApp() {
  const [page, navigate] = usePageFromPath();
  const [cmd, setCmd] = useState(false);
  const [result, setResultState] = useState<ClassifyResponse | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const saved = sessionStorage.getItem("sg-result");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const setResult = (r: ClassifyResponse) => {
    setResultState(r);
    try { sessionStorage.setItem("sg-result", JSON.stringify(r)); } catch {}
  };

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmd((v) => !v);
      }
      if (e.key === "Escape") setCmd(false);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col bg-background"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <TopBar onCmd={() => setCmd(true)} navigate={navigate} page={page} />

      <AnimatePresence mode="wait">
        {page === "home" && (
          <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }} className="flex flex-col flex-1">
            <HomePage navigate={navigate} onClassify={setResult} />
          </motion.div>
        )}
        {page === "results" && (
          <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }} className="flex flex-col flex-1">
            <ResultsPage navigate={navigate} result={result} />
          </motion.div>
        )}
        {page === "about" && (
          <motion.div key="about" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }} className="flex flex-col flex-1">
            <AboutPage />
          </motion.div>
        )}
        {page === "dashboard" && (
          <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }} className="flex flex-col flex-1">
            <DashboardPage navigate={navigate} />
          </motion.div>
        )}
        {page === "404" && (
          <motion.div key="404" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }} className="flex flex-col flex-1">
            <NotFoundPageComponent navigate={navigate} />
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav page={page} navigate={navigate} />
      <CommandPalette open={cmd} onClose={() => setCmd(false)} navigate={navigate} />
    </div>
  );
}
