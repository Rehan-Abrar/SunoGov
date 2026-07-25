"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { flushSync } from "react-dom";

type Theme = "light" | "dark";
type Lang = "en" | "ur";

const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "dark",
  toggle: () => {},
});

const LangCtx = createContext<{ lang: Lang; toggle: () => void }>({
  lang: "en",
  toggle: () => {},
});

export const useTheme = () => useContext(ThemeCtx);
export const useLang = () => useContext(LangCtx);

export function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [lang, setLang] = useState<Lang>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme((localStorage.getItem("sg-theme") as Theme) ?? "dark");
    setLang((localStorage.getItem("sg-lang") as Lang) ?? "en");
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("sg-theme", theme);
  }, [theme, mounted]);

  const toggleLang = () => {
    const next: Lang = lang === "en" ? "ur" : "en";
    setLang(next);
    localStorage.setItem("sg-lang", next);
  };

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    if (!("startViewTransition" in document)) {
      setTheme(next);
      return;
    }
    (document as Document & { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
      flushSync(() => setTheme(next));
    });
  };

  if (!mounted) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <LangCtx.Provider value={{ lang, toggle: toggleLang }}>
      <ThemeCtx.Provider value={{ theme, toggle: toggleTheme }}>
        {children}
      </ThemeCtx.Provider>
    </LangCtx.Provider>
  );
}
