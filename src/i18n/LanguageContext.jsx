/* Small, dependency-free i18n layer.
   - LanguageProvider keeps the current language in state (persisted to
     localStorage, defaulting to the browser's language when available).
   - useLanguage() exposes { lang, setLang, toggleLang, t }.
   - t("some.nested.key") looks the key up in the active language, falls
     back to English if missing, and finally falls back to the key itself
     so a missing translation never crashes the UI.
   - t() also accepts an object of {value} arrays for pluralization-free
     lists, and a second `vars` argument for simple {placeholder} strings,
     e.g. t("login.signInAs", { role: "Employee" }). */

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { translations } from "./translations";

const STORAGE_KEY = "mind-elevate-lang";
const LanguageContext = createContext(null);

const getByPath = (obj, path) =>
  path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);

const interpolate = (str, vars) => {
  if (!vars || typeof str !== "string") return str;
  return str.replace(/\{(\w+)\}/g, (match, key) => (vars[key] !== undefined ? vars[key] : match));
};

const detectInitialLang = () => {
  if (typeof window !== "undefined") {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "nl") return stored;
    } catch (e) {
      /* localStorage unavailable (e.g. private browsing) — ignore */
    }
  }
  if (typeof navigator !== "undefined" && navigator.language) {
    if (navigator.language.toLowerCase().startsWith("nl")) return "nl";
  }
  return "en";
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(detectInitialLang);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* ignore write failures */
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "en" ? "nl" : "en"));
  }, []);

  const t = useCallback(
    (key, vars) => {
      const value = getByPath(translations[lang], key);
      const resolved = value !== undefined ? value : getByPath(translations.en, key);
      if (resolved === undefined) return key;
      return typeof resolved === "string" ? interpolate(resolved, vars) : resolved;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
};
