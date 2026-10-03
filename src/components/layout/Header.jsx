/* Auto-generated during modernization refactor of Mind Elevate */

import React from "react";
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  Globe2
} from "lucide-react";
import {
  OrgSwitcher
} from "../../components/ui/Primitives";
import {
  ROLE_META
} from "../../config/nav";
import { useLanguage } from "../../i18n/LanguageContext";

export const Header = ({ user, onMenuClick, onCollapseClick, pageTitle }) => {
  const meta = ROLE_META[user.role];
  const { lang, toggleLang, t } = useLanguage();
  return (
    <header className="sticky top-0 z-20 mpp-safe-top bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="h-16 flex items-center gap-3 px-4 sm:px-6">
        <button onClick={onMenuClick} className="lg:hidden text-slate-500" aria-label="Open menu"><Menu className="w-5.5 h-5.5" /></button>
        <button onClick={onCollapseClick} className="hidden lg:flex text-slate-400 hover:text-slate-600" aria-label="Collapse sidebar"><Menu className="w-5 h-5" /></button>

        <div className="hidden lg:block">
          <OrgSwitcher isAdmin={user.role === "admin"} />
        </div>
        <div className="hidden lg:block h-6 w-px bg-slate-200" />

        <h1 className="mpp-display font-bold text-slate-900 text-lg hidden sm:block truncate">{pageTitle}</h1>
        <div className="flex-1" />
        <button
          onClick={toggleLang}
          className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          aria-label={t("common.langButtonLabel")}
        >
          <Globe2 className="w-4 h-4 text-teal-600" />
          <span className={lang === "en" ? "text-slate-900" : "text-slate-400"}>EN</span>
          <span className="text-slate-300">/</span>
          <span className={lang === "nl" ? "text-slate-900" : "text-slate-400"}>NL</span>
        </button>
        <button className="hidden md:flex items-center gap-2 bg-slate-100 hover:bg-slate-200/70 transition-colors rounded-xl px-3 py-2 w-64 text-left">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-sm text-slate-400 flex-1">{t("header.search")}</span>
          <kbd className="text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded px-1.5 py-0.5">⌘K</kbd>
        </button>
        <button className="relative text-slate-500 p-2 hover:bg-slate-100 rounded-lg" aria-label="Notifications">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
        </button>
        <button className="flex items-center gap-2.5 pl-2 sm:border-l sm:border-slate-200 hover:bg-slate-50 rounded-lg py-1 pr-1">
          <div className={`w-9 h-9 rounded-full bg-${meta.color}-600 text-white flex items-center justify-center text-sm font-semibold shrink-0`}>{user.initials}</div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-slate-900 leading-tight">{user.name}</p>
            <p className="text-xs text-slate-500 leading-tight">{t(meta.label)}</p>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
        </button>
      </div>
    </header>
  );
};

/* Fixed bottom tab bar — the primary navigation surface on phones, in
   line with native/PWA mobile conventions (thumb-reachable, always
   visible, no hamburger needed for the top few destinations). */
