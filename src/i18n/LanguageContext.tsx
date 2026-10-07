"use client";

/* Small, dependency-free i18n layer.
   - LanguageProvider keeps the current language in state (persisted to
     localStorage, defaulting to the browser's language when available).
   - useLanguage() exposes { lang, setLang, toggleLang, t, tx }.
   - t("some.nested.key") returns a string from the active language, falls
     back to English if missing, and finally falls back to the key itself so
     a missing translation never crashes the UI. A second `vars` argument
     fills simple {placeholder} strings, e.g. t("login.signInAs", { role }).
   - tx<T>("some.list.key") returns a non-string node (e.g. a list of
     objects) cast to T.

   Server render and first client render both use "en"; the stored /
   browser language is applied in an effect, which avoids a hydration
   mismatch. */

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { translations, type TranslationNode } from "./translations";
import type { Lang } from "@/types";

const STORAGE_KEY = "mind-elevate-lang";

type Vars = Record<string, string | number>;

interface LanguageValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (key: string, vars?: Vars) => string;
  tx: <T>(key: string) => T;
  /** Like t(), but returns `fallback` (e.g. the raw demo-data value) when the key has no translation. */
  tOr: (key: string, fallback: string, vars?: Vars) => string;
}

const LanguageContext = createContext<LanguageValue | null>(null);

const getByPath = (obj: TranslationNode | undefined, path: string): TranslationNode | undefined =>
  path.split(".").reduce<TranslationNode | undefined>((acc, key) => {
    if (acc && typeof acc === "object" && !Array.isArray(acc)) return acc[key];
    return undefined;
  }, obj);

const interpolate = (str: string, vars?: Vars) =>
  vars ? str.replace(/\{(\w+)\}/g, (match, key: string) => (vars[key] !== undefined ? String(vars[key]) : match)) : str;

const detectStoredLang = (): Lang => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "da") return stored;
  } catch {
    /* localStorage unavailable (e.g. private browsing) — ignore */
  }
  if (navigator.language?.toLowerCase().startsWith("da")) return "da";
  return "en";
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("en");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLang(detectStoredLang());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return; // don't overwrite the stored choice with the SSR default
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore write failures */
    }
    document.documentElement.lang = lang;
  }, [lang, hydrated]);

  const toggleLang = useCallback(() => setLang((prev) => (prev === "en" ? "da" : "en")), []);

  const resolve = useCallback(
    (key: string): TranslationNode | undefined => getByPath(translations[lang], key) ?? getByPath(translations.en, key),
    [lang]
  );

  const t = useCallback(
    (key: string, vars?: Vars) => {
      const resolved = resolve(key);
      return typeof resolved === "string" ? interpolate(resolved, vars) : key;
    },
    [resolve]
  );

  const tx = useCallback(<T,>(key: string) => resolve(key) as T, [resolve]);

  const tOr = useCallback(
    (key: string, fallback: string, vars?: Vars) => {
      const resolved = resolve(key);
      return typeof resolved === "string" ? interpolate(resolved, vars) : fallback;
    },
    [resolve]
  );

  return <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, tx, tOr }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
};
