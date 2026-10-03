/* Auto-generated during modernization refactor of Mind Elevate */

import React, { useState } from "react";
import {
  X,
  LogOut,
  ChevronDown,
  Brain
} from "lucide-react";
import {
  NAV_CONFIG,
  ROLE_META
} from "../../config/nav";
import { useLanguage } from "../../i18n/LanguageContext";

export const Sidebar = ({ role, active, onNavigate, onSignOut, open, desktopOpen, setOpen }) => {
  const items = NAV_CONFIG[role];
  const meta = ROLE_META[role];
  const expanded = open || desktopOpen;
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const { t } = useLanguage();
  return (
    <>
      {showSignOutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="signout-title">
          <div className="absolute inset-0 bg-slate-950/50" onClick={() => setShowSignOutConfirm(false)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h2 id="signout-title" className="mpp-display text-lg font-bold text-slate-900">{t("signOutDialog.title")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{t("signOutDialog.body")}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowSignOutConfirm(false)} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">{t("signOutDialog.cancel")}</button>
              <button onClick={() => { setShowSignOutConfirm(false); onSignOut(); }} className="rounded-xl bg-indigo-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-900">{t("signOutDialog.confirm")}</button>
            </div>
          </div>
        </div>
      )}
      {open && <div className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed lg:sticky top-0 h-screen z-40 w-72 bg-indigo-950 flex flex-col transition-all duration-300 mpp-safe-top mpp-safe-bottom ${open ? "translate-x-0" : "-translate-x-full"} ${desktopOpen ? "lg:translate-x-0 lg:w-72" : "lg:translate-x-0 lg:w-20"}`}>
        <div className={`h-16 flex items-center gap-2 border-b border-white/10 shrink-0 ${expanded ? "px-5" : "px-5 lg:justify-center lg:px-0"}`}>
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0"><Brain className="w-4.5 h-4.5 text-teal-300" /></div>
          {expanded && <span className="mpp-display font-bold text-white text-base whitespace-nowrap">Mind<span className="text-teal-400">Elevate</span></span>}
          <button className="ml-auto lg:hidden text-white/60" onClick={() => setOpen(false)}><X className="w-5 h-5" /></button>
        </div>

        {expanded && (
          <div className="px-3 pt-3">
            <button className="w-full flex items-center gap-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors px-3 py-2.5 text-left">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 mpp-display ${role === "admin" ? "bg-teal-400/20 text-teal-300" : "bg-teal-400/15 text-teal-300"}`}>{role === "admin" ? "ME" : "AC"}</div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white leading-tight truncate">{role === "admin" ? "Mind Elevate Platform" : "Acme Corp"}</p>
                <p className="text-[10.5px] text-slate-400 leading-tight">{role === "admin" ? "Operator view · 48 companies" : "Enterprise plan"}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto mpp-scrollbar py-4 px-3 space-y-1">
          {items.map((item) => {
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                title={t(item.label)}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors group relative
                  ${isActive ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"}
                  ${!expanded && "lg:justify-center"}`}
              >
                <item.icon className={`w-4.5 h-4.5 shrink-0 ${item.accent && !isActive ? "text-violet-300" : ""}`} />
                {expanded && <span className="whitespace-nowrap">{t(item.label)}</span>}
                {isActive && <span className={`absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full bg-${meta.color === "indigo" ? "indigo" : meta.color}-400`} />}
              </button>
            );
          })}
        </nav>

        <div className={`p-3 border-t border-white/10 ${!expanded && "lg:flex lg:justify-center"}`}>
          <button onClick={() => setShowSignOutConfirm(true)} className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white ${!expanded && "lg:justify-center"}`}>
            <LogOut className="w-4.5 h-4.5 shrink-0" />
            {expanded && t("nav.signOut")}
          </button>
        </div>
      </aside>
    </>
  );
};
