"use client";

/* Platform (Mind Elevate operator) state: the client companies and their subscriptions, plus the
   content catalog (library + monthly themes) that every company receives.
   Shared by the dashboard, Companies, Subscriptions, Content, Create and Themes pages.
   Demo only — in memory.

   Billing rule: a company's MRR is seats x plan list price, discounted when billed annually.
   Trial and suspended companies don't generate MRR.

   Theme rule: exactly one monthly theme is Active at a time; activating a theme archives the
   one that was running. Archived themes are history and can't be edited. */

import { createContext, useCallback, useContext, useMemo, useRef, type ReactNode, useState } from "react";
import { ADMIN_THEMES, ANNUAL_DISCOUNT, COMPANIES, CONTENT_LIBRARY, PLANS } from "@/data/mockData";
import type { BillingCycle, Company, ContentItem, ContentStatus, ContentType, MonthlyThemeItem, PlanName } from "@/types";

export const planPrice = (plan: string) => PLANS.find((p) => p.name === plan)?.pricePerSeat ?? 0;

/** Monthly recurring revenue for a subscription at list price. */
export const computeMrr = (plan: string, seats: number, billing: BillingCycle) =>
  Math.round(seats * planPrice(plan) * (billing === "Annual" ? 1 - ANNUAL_DISCOUNT : 1));

export interface NewCompany {
  name: string;
  plan: PlanName;
  seats: number;
  billing: BillingCycle;
  adminEmail: string;
}

export interface NewContent {
  title: string;
  type: ContentType;
  theme: string;
  status: Extract<ContentStatus, "Published" | "Draft">;
}

interface PlatformValue {
  content: ContentItem[];
  themes: MonthlyThemeItem[];
  addContent: (input: NewContent) => void;
  setContentStatus: (id: string, status: ContentStatus) => void;
  addTheme: (input: { month: string; title: string }) => void;
  updateTheme: (id: string, patch: { month?: string; title?: string }) => void;
  activateTheme: (id: string) => void;

  companies: Company[];
  createCompany: (input: NewCompany) => void;
  toggleSuspend: (id: string) => void;
  changePlan: (id: string, plan: PlanName) => void;
  changeSeats: (id: string, seats: number) => void;
  changeBilling: (id: string, billing: BillingCycle) => void;
  /** Convert a trial into a paying subscription. */
  activateSubscription: (id: string) => void;
}

const PlatformContext = createContext<PlatformValue | null>(null);

const reprice = (c: Company): Company => ({ ...c, mrr: c.status === "Active" || c.status === "At Risk" ? computeMrr(c.plan, c.seats, c.billing) : 0 });

export const PlatformProvider = ({ children }: { children: ReactNode }) => {
  const [companies, setCompanies] = useState<Company[]>(COMPANIES);
  const [content, setContent] = useState<ContentItem[]>(CONTENT_LIBRARY);
  const [themes, setThemes] = useState<MonthlyThemeItem[]>(ADMIN_THEMES);
  const counter = useRef(0);
  const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${(counter.current++).toString(36)}`;

  /* Newest first, so what the operator just made is at the top of the library. */
  const addContent = useCallback(({ title, type, theme, status }: NewContent) => {
    setContent((cur) => [{ id: newId("c"), title, type, theme, status }, ...cur]);
  }, []);
  const setContentStatus = useCallback((id: string, status: ContentStatus) => {
    setContent((cur) => cur.map((c) => (c.id === id ? { ...c, status } : c)));
  }, []);

  const addTheme = useCallback(({ month, title }: { month: string; title: string }) => {
    setThemes((cur) => [{ id: newId("th"), month, title, status: "Scheduled" }, ...cur]);
  }, []);
  const updateTheme = useCallback((id: string, patch: { month?: string; title?: string }) => {
    setThemes((cur) => cur.map((th) => (th.id === id && th.status !== "Archived" ? { ...th, ...patch } : th)));
  }, []);
  const activateTheme = useCallback((id: string) => {
    setThemes((cur) => {
      const target = cur.find((th) => th.id === id);
      /* Archived themes are history: reactivating one would archive the running theme and leave none. */
      if (!target || target.status === "Archived") return cur;
      return cur.map((th) => {
        if (th.id === id) return { ...th, status: "Active" };
        return th.status === "Active" ? { ...th, status: "Archived" } : th;
      });
    });
  }, []);

  const patch = useCallback((id: string, fn: (c: Company) => Company) => {
    setCompanies((cur) => cur.map((c) => (c.id === id ? fn(c) : c)));
  }, []);

  const createCompany = useCallback(({ name, plan, seats, billing, adminEmail }: NewCompany) => {
    setCompanies((cur) => {
      const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 24) || `company-${cur.length + 1}`;
      const id = cur.some((c) => c.id === base) ? `${base}-${cur.length + 1}` : base;
      return [
        { id, name, plan, seats, seatsUsed: 0, engagement: 0, status: "Trial", renewal: "—", health: "at_risk", mrr: 0, billing, adminEmail: adminEmail || undefined },
        ...cur,
      ];
    });
  }, []);

  const toggleSuspend = useCallback((id: string) => {
    patch(id, (c) => {
      const suspending = c.status !== "Suspended";
      return reprice({ ...c, status: suspending ? "Suspended" : "Active", health: suspending ? "suspended" : "good" });
    });
  }, [patch]);

  const changePlan = useCallback((id: string, plan: PlanName) => patch(id, (c) => reprice({ ...c, plan })), [patch]);
  const changeSeats = useCallback((id: string, seats: number) => patch(id, (c) => reprice({ ...c, seats: Math.max(1, Math.round(seats)) })), [patch]);
  const changeBilling = useCallback((id: string, billing: BillingCycle) => patch(id, (c) => reprice({ ...c, billing })), [patch]);
  const activateSubscription = useCallback((id: string) => {
    patch(id, (c) => reprice({ ...c, status: "Active", health: "good", renewal: c.renewal === "—" ? "In 12 months" : c.renewal }));
  }, [patch]);

  const value = useMemo(
    () => ({
      companies, createCompany, toggleSuspend, changePlan, changeSeats, changeBilling, activateSubscription,
      content, themes, addContent, setContentStatus, addTheme, updateTheme, activateTheme,
    }),
    [companies, createCompany, toggleSuspend, changePlan, changeSeats, changeBilling, activateSubscription, content, themes, addContent, setContentStatus, addTheme, updateTheme, activateTheme],
  );
  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
};

export const usePlatform = () => {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error("usePlatform must be used within a PlatformProvider");
  return ctx;
};
