"use client";

/* Auto-generated during modernization refactor of Mind Elevate */

import React, { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronLeft,
  ShieldCheck,
  Star
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Tone } from "@/types";
import { useLanguage } from "@/i18n/LanguageContext";
import { slug } from "@/i18n/slug";

export const Badge = ({ children, color = "teal", className = "" }: { children: ReactNode; color?: Tone; className?: string }) => {
  const map: Record<Tone, string> = {
    teal: "bg-teal-50 text-teal-700 ring-teal-600/20",
    amber: "bg-amber-50 text-amber-700 ring-amber-600/20",
    violet: "bg-violet-50 text-violet-700 ring-violet-600/20",
    indigo: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
    slate: "bg-slate-100 text-slate-600 ring-slate-500/20",
    rose: "bg-rose-50 text-rose-700 ring-rose-600/20",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${map[color]} ${className}`}>
      {children}
    </span>
  );
};

export const Card = ({ children, className = "", padded = true }: { children: ReactNode; className?: string; padded?: boolean }) => (
  <div className={`bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${padded ? "p-5 sm:p-6" : ""} ${className}`}>
    {children}
  </div>
);

/* Small "workspace" pill — the org-switcher, used in the header and the
   sidebar footer. B2B products are multi-tenant, so who you're logged in
   as (which company workspace) needs to always be one glance away.
   Platform administrators aren't scoped to a single company, so they see the
   Mind Elevate platform identity instead of a client workspace. */
export const OrgSwitcher = ({ compact = false, isPlatform = false }: { compact?: boolean; isPlatform?: boolean }) => {
  const { t } = useLanguage();
  return (
  <button
    className={`flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-left ${compact ? "px-2.5 py-2" : "px-3 py-2"}`}
  >
    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 mpp-display ${isPlatform ? "bg-teal-500 text-indigo-950" : "bg-indigo-950 text-teal-300"}`}>{isPlatform ? "ME" : "AC"}</div>
    {!compact && (
      <div className="min-w-0 hidden sm:block">
        <p className="text-xs font-semibold text-slate-900 leading-tight truncate">{isPlatform ? t("common.platformName") : "Acme Corp"}</p>
        <p className="text-[10.5px] text-slate-400 leading-tight">{isPlatform ? t("common.platformMeta") : t("common.orgMeta")}</p>
      </div>
    )}
    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:block" />
  </button>
  );
};

export const SectionHeader = ({ eyebrow, title, desc, action }: { eyebrow?: string; title: ReactNode; desc?: string; action?: ReactNode }) => (
  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
    <div>
      {eyebrow && <p className="text-xs font-semibold tracking-wide uppercase text-teal-600 mb-1">{eyebrow}</p>}
      <h2 className="mpp-display text-xl sm:text-2xl font-bold text-slate-900">{title}</h2>
      {desc && <p className="text-slate-500 text-sm mt-1 max-w-2xl">{desc}</p>}
    </div>
    {action}
  </div>
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "dark" | "outline" | "ghost" | "subtle";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
};

export const Button = ({ children, variant = "primary", size = "md", className = "", icon: Icon, ...rest }: ButtonProps) => {
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2.5 text-sm", lg: "px-6 py-3 text-base" };
  const variants = {
    primary: "bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800 shadow-sm shadow-teal-600/20",
    dark: "bg-indigo-950 text-white hover:bg-indigo-900 active:bg-indigo-900",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50 active:bg-slate-100 bg-white",
    ghost: "text-slate-600 hover:bg-slate-100 active:bg-slate-200",
    subtle: "bg-teal-50 text-teal-700 hover:bg-teal-100 active:bg-teal-200",
  };
  return (
    <button className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none ${sizes[size]} ${variants[variant]} ${className}`} {...rest}>
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </button>
  );
};

export const ProgressBar = ({ value, color = "teal", className = "" }: { value: number; color?: Tone; className?: string }) => {
  const map: Record<Tone, string> = { teal: "bg-teal-500", amber: "bg-amber-500", indigo: "bg-indigo-500", violet: "bg-violet-500", rose: "bg-rose-500", slate: "bg-slate-500" };
  return (
    <div className={`w-full h-2 rounded-full bg-slate-100 overflow-hidden ${className}`}>
      <div className={`h-full rounded-full ${map[color]} transition-all duration-700`} style={{ width: `${value}%` }} />
    </div>
  );
};

/* Signature element: concentric focus rings */
export const ProgressRing = ({ value, size = 96, stroke = 10, color = "#3346E8", label, sub }: { value: number; size?: number; stroke?: number; color?: string; label?: string; sub?: string }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="flex flex-col items-center justify-center" style={{ width: size }}>
      <div className="relative grid place-items-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} stroke="#DDE1E5" strokeWidth={stroke} fill="none" />
          <circle
            cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
            strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" className="mpp-ring-anim"
          />
        </svg>
        <p className="absolute mpp-display font-bold text-slate-900" style={{ fontSize: size * 0.22 }}>{value}%</p>
      </div>
      {label && <p className="text-xs font-semibold text-slate-700 mt-2">{label}</p>}
      {sub && <p className="text-[11px] text-slate-400">{sub}</p>}
    </div>
  );
};

export const StatCard = ({ label, value, delta, icon: Icon, color = "teal" }: { label: string; value: string; delta?: string; icon?: LucideIcon; color?: "teal" | "amber" | "indigo" | "violet" }) => {
  const { t, tOr } = useLanguage();
  const map: Record<"teal" | "amber" | "indigo" | "violet", string> = { teal: "text-teal-600 bg-teal-50", amber: "text-amber-600 bg-amber-50", indigo: "text-indigo-600 bg-indigo-50", violet: "text-violet-600 bg-violet-50" };
  return (
    <Card className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-slate-500">{tOr(`data.stat.${slug(label)}`, label)}</p>
        <p className="mpp-display text-2xl font-bold text-slate-900 mt-1">{value}</p>
        {delta && <p className="text-xs font-medium text-teal-600 mt-1">{t("common.statLabelVsLast", { delta })}</p>}
      </div>
      {Icon && <div className={`p-2.5 rounded-xl ${map[color]}`}><Icon className="w-5 h-5" /></div>}
    </Card>
  );
};

export const EmptyPagePlaceholder = ({ title, desc, action, children }: { icon?: LucideIcon; title: string; desc?: string; action?: ReactNode; children?: ReactNode }) => (
  <div className="space-y-6">
    <SectionHeader title={title} desc={desc} action={action} />
    {children}
  </div>
);

/* Back button used at the top of drill-down / detail pages (module
   details, video player, exercise, questions, reflection, session
   details) so users always have an obvious way back up the hierarchy. */
export const BackLink = ({ href, onClick, children }: { href?: string; onClick?: () => void; children?: ReactNode }) => {
  const { t } = useLanguage();
  const className = "inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-1";
  const content = (
    <>
      <ChevronLeft className="w-4 h-4" />
      {children ?? t("shared.back")}
    </>
  );
  return href ? (
    <Link href={href} className={className}>{content}</Link>
  ) : (
    <button type="button" onClick={onClick} className={className}>{content}</button>
  );
};

/* "Content rating" — employees can rate learning content (module /
   video / exercise) they complete. Purely a UI affordance over local
   state; nothing here is ever shared with the organization. */
export const StarRating = ({ value = 0, onChange, size = "md" }: { value?: number; onChange?: (value: number) => void; size?: "sm" | "md" }) => {
  const { t } = useLanguage();
  const [hover, setHover] = useState(0);
  const dim = size === "sm" ? "w-4 h-4" : "w-6 h-6";
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label={t("common.rateContent")}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = (hover || value) >= n;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={t(n === 1 ? "common.starOne" : "common.starMany", { n })}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange && onChange(n)}
            className="p-0.5"
          >
            <Star className={`${dim} transition-colors ${filled ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
          </button>
        );
      })}
    </div>
  );
};

export const PrivacyNotice = ({ text }: { text: string }) => (
  <div className="flex items-start gap-3 bg-indigo-50/60 border border-indigo-100 rounded-xl p-4">
    <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
    <p className="text-sm text-indigo-900">{text}</p>
  </div>
);
