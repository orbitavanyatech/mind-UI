/* Auto-generated during modernization refactor of Mind Elevate */

import React, { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ShieldCheck,
  Star
} from "lucide-react";

export const MenuSelect = ({ value, options, onChange, ariaLabel, className = "" }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const selected = options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`flex min-h-10 w-full items-center justify-between gap-3 rounded-lg border bg-white px-3 text-left text-sm shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 ${open ? "border-indigo-400 text-slate-900" : "border-slate-200 text-slate-700 hover:border-slate-300"}`}
      >
        <span className="truncate">{selected?.label}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div role="listbox" aria-label={ariaLabel} className="absolute right-0 z-30 mt-2 max-h-64 min-w-full overflow-y-auto rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onClick={() => { onChange(option.value); setOpen(false); }}
              className={`flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500/30 ${option.value === value ? "bg-indigo-50 font-semibold text-indigo-700" : "text-slate-700 hover:bg-slate-50"}`}
            >
              <span className="whitespace-nowrap">{option.label}</span>
              {option.value === value && <Check className="h-4 w-4 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const Badge = ({ children, color = "teal", className = "" }) => {
  const map = {
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

export const Card = ({ children, className = "", padded = true }) => (
  <div className={`bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${padded ? "p-5 sm:p-6" : ""} ${className}`}>
    {children}
  </div>
);

/* Small "workspace" pill — the org-switcher, used in the header and the
   sidebar footer. B2B products are multi-tenant, so who you're logged in
   as (which company workspace) needs to always be one glance away.
   Platform admins aren't scoped to a single company, so they see the
   Mind Elevate platform identity instead of a client workspace. */
export const OrgSwitcher = ({ compact = false, isAdmin = false }) => (
  <button
    className={`flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-left ${compact ? "px-2.5 py-2" : "px-3 py-2"}`}
  >
    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 mpp-display ${isAdmin ? "bg-teal-500 text-indigo-950" : "bg-indigo-950 text-teal-300"}`}>{isAdmin ? "ME" : "AC"}</div>
    {!compact && (
      <div className="min-w-0 hidden sm:block">
        <p className="text-xs font-semibold text-slate-900 leading-tight truncate">{isAdmin ? "Mind Elevate Platform" : "Acme Corp"}</p>
        <p className="text-[10.5px] text-slate-400 leading-tight">{isAdmin ? "48 companies · Operator view" : "Enterprise · 2,314 seats"}</p>
      </div>
    )}
    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:block" />
  </button>
);

export const SectionHeader = ({ eyebrow, title, desc, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
    <div>
      {eyebrow && <p className="text-xs font-semibold tracking-wide uppercase text-teal-600 mb-1">{eyebrow}</p>}
      <h2 className="mpp-display text-xl sm:text-2xl font-bold text-slate-900">{title}</h2>
      {desc && <p className="text-slate-500 text-sm mt-1 max-w-2xl">{desc}</p>}
    </div>
    {action}
  </div>
);

export const Button = ({ children, variant = "primary", size = "md", className = "", icon: Icon, ...rest }) => {
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

export const ProgressBar = ({ value, color = "teal", className = "" }) => {
  const map = { teal: "bg-teal-500", amber: "bg-amber-500", indigo: "bg-indigo-500", violet: "bg-violet-500", rose: "bg-rose-500" };
  return (
    <div className={`w-full h-2 rounded-full bg-slate-100 overflow-hidden ${className}`}>
      <div className={`h-full rounded-full ${map[color]} transition-all duration-700`} style={{ width: `${value}%` }} />
    </div>
  );
};

/* Signature element: concentric focus rings */
export const ProgressRing = ({ value, size = 96, stroke = 10, color = "#3346E8", label, sub }) => {
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

export const StatCard = ({ label, value, delta, icon: Icon, color = "teal" }) => {
  const map = { teal: "text-teal-600 bg-teal-50", amber: "text-amber-600 bg-amber-50", indigo: "text-indigo-600 bg-indigo-50", violet: "text-violet-600 bg-violet-50" };
  return (
    <Card className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mpp-display text-2xl font-bold text-slate-900 mt-1">{value}</p>
        {delta && <p className="text-xs font-medium text-teal-600 mt-1">{delta} vs last month</p>}
      </div>
      {Icon && <div className={`p-2.5 rounded-xl ${map[color]}`}><Icon className="w-5 h-5" /></div>}
    </Card>
  );
};

export const EmptyPagePlaceholder = ({ icon: Icon, title, desc, children }) => (
  <div className="space-y-6">
    <SectionHeader title={title} desc={desc} />
    {children}
  </div>
);

/* Back button used at the top of drill-down / detail pages (module
   details, video player, exercise, questions, reflection, session
   details) so users always have an obvious way back up the hierarchy. */
export const BackLink = ({ onClick, children = "Back" }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-1"
  >
    <ChevronLeft className="w-4 h-4" />
    {children}
  </button>
);

/* "Content rating" — employees can rate learning content (module /
   video / exercise) they complete. Purely a UI affordance over local
   state; nothing here is ever shared with the organization. */
export const StarRating = ({ value = 0, onChange, size = "md" }) => {
  const [hover, setHover] = useState(0);
  const dim = size === "sm" ? "w-4 h-4" : "w-6 h-6";
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rate this content">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = (hover || value) >= n;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
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

export const PrivacyNotice = ({ text }) => (
  <div className="flex items-start gap-3 bg-indigo-50/60 border border-indigo-100 rounded-xl p-4">
    <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
    <p className="text-sm text-indigo-900">{text}</p>
  </div>
);
