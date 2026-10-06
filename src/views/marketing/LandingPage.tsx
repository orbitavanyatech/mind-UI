"use client";

/* Auto-generated during modernization refactor of Mind Elevate */

import React, { useState } from "react";
import {
  Sparkles,
  TrendingUp,
  Video,
  Calendar,
  ClipboardList,
  Users,
  Building2,
  BarChart3,
  Menu,
  X,
  Lock,
  CheckCircle2,
  ArrowRight,
  Brain,
  EyeOff,
  Building,
  Smile,
  Globe,
  ShieldCheck
} from "lucide-react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area
} from "recharts";
import {
  Badge,
  Card,
  SectionHeader,
  Button,
  ProgressRing
} from "@/components/ui/Primitives";
import {
  ENGAGEMENT_TREND
} from "@/data/mockData";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageContext";
import { ROUTES } from "@/config/routes";

/* Shapes of the list-valued nodes in i18n/translations.ts, read via tx(). */
interface FeatureText { title: string; desc: string }
interface PlanText { name: string; desc: string; features: string[] }
interface OverviewRoleText { role: string; desc: string }
interface PrivacyPointText { title: string; desc: string }
interface FooterColumnText { h: string; items: string[] }

const NavBar = ({ onLogin }: { onLogin: () => void }) => {
  const [open, setOpen] = useState(false);
  const { lang, toggleLang, t } = useLanguage();
  const links = (["platform", "employees", "leaders", "organizations", "privacy", "integrations"] as const).map((id) => ({ id, label: t(`landing.nav.${id}`) }));
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-950 flex items-center justify-center">
            <Brain className="w-4.5 h-4.5 text-teal-400" />
          </div>
          <span className="mpp-display font-bold text-slate-900 text-lg">Mind<span className="text-teal-600">Elevate</span></span>
        </div>
        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => <a key={l.id} href={`#${l.id}`} className="text-sm font-medium text-slate-600 hover:text-slate-900">{l.label}</a>)}
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            aria-label={t("common.langButtonLabel")}
          >
            <Globe className="w-4 h-4 text-teal-600" />
            <span className={lang === "en" ? "text-slate-900" : "text-slate-400"}>EN</span>
            <span className="text-slate-300">/</span>
            <span className={lang === "nl" ? "text-slate-900" : "text-slate-400"}>NL</span>
          </button>
          <Button variant="ghost" size="sm" onClick={onLogin}>{t("common.signIn")}</Button>
          <Button variant="primary" size="sm" onClick={onLogin}>{t("landing.bookDemo")}</Button>
        </div>
        <button className="lg:hidden" onClick={() => setOpen(!open)}>{open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-slate-200 px-5 py-4 space-y-3 bg-white">
          {links.map((l) => <a key={l.id} href={`#${l.id}`} onClick={() => setOpen(false)} className="block text-sm font-medium text-slate-600">{l.label}</a>)}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 w-fit"
            aria-label={t("common.langButtonLabel")}
          >
            <Globe className="w-4 h-4 text-teal-600" />
            <span className={lang === "en" ? "text-slate-900" : "text-slate-400"}>EN</span>
            <span className="text-slate-300">/</span>
            <span className={lang === "nl" ? "text-slate-900" : "text-slate-400"}>NL</span>
          </button>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={onLogin}>{t("common.signIn")}</Button>
            <Button variant="primary" size="sm" className="flex-1" onClick={onLogin}>{t("landing.bookDemo")}</Button>
          </div>
        </div>
      )}
    </header>
  );
};

export const LandingPage = () => {
  const { t, tx } = useLanguage();
  const router = useRouter();
  const onLogin = () => router.push(ROUTES.login);
  const featureIcons = [Sparkles, Video, TrendingUp, ClipboardList, ShieldCheck, BarChart3];
  const features = tx<FeatureText[]>("landing.features.items").map((f, i) => ({ ...f, icon: featureIcons[i] }));
  const integrations = ["Slack", "Microsoft Teams", "Google Calendar", "Outlook", "Workday", "BambooHR", "Okta", "Zoom"];
  const planPrices = ["€ 7,50", "€ 12,50", t("landing.pricing.customPrice")];
  const plans = tx<PlanText[]>("landing.pricing.plans").map((plan, i) => ({
    ...plan,
    price: planPrices[i],
    featured: i === 1,
  }));
  const overviewIcons = [Smile, Users, Building2];
  const overviewRoles = tx<OverviewRoleText[]>("landing.overview.roles").map((r, i) => ({ ...r, icon: overviewIcons[i], color: ["teal", "violet", "indigo"][i] }));
  const privacyIcons = [EyeOff, Lock, BarChart3];
  const privacyPoints = tx<PrivacyPointText[]>("landing.privacy.points").map((p, i) => ({ ...p, icon: privacyIcons[i] }));
  return (
    <div className="mpp-root bg-white text-slate-900">
      <NavBar onLogin={onLogin} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-950 via-indigo-950 to-slate-900">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, #5D67E5 0, transparent 35%), radial-gradient(circle at 80% 0%, #12B8A6 0, transparent 40%)" }} />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28 relative grid lg:grid-cols-2 gap-12 items-center">
          <div className="mpp-fade-up">
            <Badge color="teal" className="bg-teal-500/10 text-teal-300 ring-teal-400/30 mb-5">
              <Sparkles className="w-3.5 h-3.5" /> {t("landing.hero.badge")}
            </Badge>
            <h1 className="mpp-display text-4xl sm:text-5xl font-bold text-white leading-[1.1]">
              {t("landing.hero.title")}
            </h1>
            <p className="text-slate-300 text-lg mt-5 max-w-xl">
              {t("landing.hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Button size="lg" onClick={onLogin} icon={ArrowRight}>{t("landing.hero.ctaPrimary")}</Button>
              <Button size="lg" variant="outline" className="!border-white/20 !bg-transparent !text-white hover:!border-white/50 hover:!bg-white/10 hover:!text-white">{t("landing.hero.ctaSecondary")}</Button>
            </div>
            <div className="flex items-center gap-6 mt-10 text-slate-400 text-sm">
              <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-teal-400" /> {t("landing.hero.privacyFirst")}</div>
              <div className="flex items-center gap-2"><Building className="w-4 h-4 text-teal-400" /> {t("landing.hero.orgCount")}</div>
            </div>
          </div>
          <div className="relative mpp-fade-up" style={{ animationDelay: ".1s" }}>
            <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-6 max-w-md ml-auto">
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-600 mb-3">{t("landing.hero.themeCardLabel")}</p>
              <h3 className="mpp-display font-bold text-slate-900 text-lg mb-1">{t("landing.hero.themeCardTitle")}</h3>
              <p className="text-sm text-slate-500 mb-5">{t("landing.hero.themeCardDesc")}</p>
              <div className="flex items-center gap-5">
                <ProgressRing value={68} size={92} color="#3346E8" />
                <div className="flex-1 space-y-2">
                  {tx<string[]>("landing.hero.themeModules").map((m, i) => (
                    <div key={m} className="flex items-center gap-2 text-sm">
                      {i < 2 ? <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />}
                      <span className="text-slate-600">{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 hidden sm:flex items-center gap-3 w-56">
              <div className="p-2 rounded-lg bg-violet-50"><ShieldCheck className="w-5 h-5 text-violet-600" /></div>
              <div>
                <p className="text-xs font-semibold text-slate-900">{t("landing.hero.coachingConfidentialTitle")}</p>
                <p className="text-[11px] text-slate-500">{t("landing.hero.coachingConfidentialDesc")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* B2B SOCIAL PROOF STRIP */}
      <section className="border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
          <p className="text-center text-xs font-semibold uppercase tracking-wide text-slate-400 mb-6">{t("landing.socialProof")}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-70">
            {tx<string[]>("landing.logos").map((n) => (
              <span key={n} className="mpp-display text-lg font-bold text-slate-400 select-none">{n}</span>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM OVERVIEW */}
      <section id="platform" className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <SectionHeader eyebrow={t("landing.overview.eyebrow")} title={t("landing.overview.title")} desc={t("landing.overview.desc")} />
        <div className="grid md:grid-cols-3 gap-5">
          {overviewRoles.map((r) => (
            <Card key={r.role} className="hover:shadow-md transition-shadow">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-${r.color}-50`}>
                <r.icon className={`w-5.5 h-5.5 text-${r.color}-600`} />
              </div>
              <h3 className="mpp-display font-bold text-slate-900 mb-1.5">{r.role}</h3>
              <p className="text-sm text-slate-500">{r.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <SectionHeader eyebrow={t("landing.features.eyebrow")} title={t("landing.features.title")} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <Card key={f.title}>
                <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-teal-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* EMPLOYEE / LEADER / ORG DETAIL SECTIONS */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20 space-y-20">
        {/* Employee */}
        <div id="employees" className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge color="teal" className="mb-4">{t("landing.employeeSection.badge")}</Badge>
            <h3 className="mpp-display text-2xl sm:text-3xl font-bold text-slate-900 mb-4">{t("landing.employeeSection.title")}</h3>
            <ul className="space-y-3">
              {tx<string[]>("landing.employeeSection.bullets").map((b) => (
                <li key={b} className="flex items-start gap-3 text-slate-600 text-sm"><CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />{b}</li>
              ))}
            </ul>
          </div>
          <Card className="bg-slate-50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-semibold text-sm">MC</div>
              <div><p className="font-semibold text-sm text-slate-900">{t("landing.employeeSection.cardName")}</p><p className="text-xs text-slate-500">{t("landing.employeeSection.cardMeta")}</p></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <ProgressRing value={82} size={78} color="#3346E8" label={t("landing.employeeSection.ringFocus")} />
              <ProgressRing value={64} size={78} color="#EE8710" label={t("landing.employeeSection.ringResilience")} />
              <ProgressRing value={71} size={78} color="#12B8A6" label={t("landing.employeeSection.ringEnergy")} />
            </div>
          </Card>
        </div>

        {/* Leader */}
        <div id="leaders" className="grid lg:grid-cols-2 gap-12 items-center">
          <Card className="order-2 lg:order-1 bg-violet-50/50 border-violet-100">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-sm text-slate-900">{t("landing.leaderSection.upcomingSession")}</p>
              <Badge color="violet"><Lock className="w-3 h-3" />{t("landing.leaderSection.confidential")}</Badge>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-violet-100">
              <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center font-semibold text-sm">MF</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{t("landing.leaderSection.coachName")}</p>
                <p className="text-xs text-slate-500">{t("landing.leaderSection.sessionTime")}</p>
              </div>
              <Button size="sm" variant="dark" className="!bg-violet-600 hover:!bg-violet-700">{t("landing.leaderSection.join")}</Button>
            </div>
          </Card>
          <div className="order-1 lg:order-2">
            <Badge color="violet" className="mb-4">{t("landing.leaderSection.badge")}</Badge>
            <h3 className="mpp-display text-2xl sm:text-3xl font-bold text-slate-900 mb-4">{t("landing.leaderSection.title")}</h3>
            <p className="text-slate-600 text-sm mb-4">{t("landing.leaderSection.desc")}</p>
            <ul className="space-y-3">
              {tx<string[]>("landing.leaderSection.bullets").map((b) => (
                <li key={b} className="flex items-start gap-3 text-slate-600 text-sm"><CheckCircle2 className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />{b}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Organization */}
        <div id="organizations" className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge color="indigo" className="mb-4">{t("landing.orgSection.badge")}</Badge>
            <h3 className="mpp-display text-2xl sm:text-3xl font-bold text-slate-900 mb-4">{t("landing.orgSection.title")}</h3>
            <p className="text-slate-600 text-sm mb-4">{t("landing.orgSection.desc")}</p>
            <ul className="space-y-3">
              {tx<string[]>("landing.orgSection.bullets").map((b) => (
                <li key={b} className="flex items-start gap-3 text-slate-600 text-sm"><CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />{b}</li>
              ))}
            </ul>
          </div>
          <Card>
            <p className="font-semibold text-sm text-slate-900 mb-4">{t("landing.orgSection.chartTitle")}</p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={ENGAGEMENT_TREND}>
                <defs>
                  <linearGradient id="eng" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#12B8A6" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#12B8A6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9AA2AB" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="engagement" stroke="#12B8A6" fill="url(#eng)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </section>

      {/* PRIVACY */}
      <section id="privacy" className="bg-indigo-950 py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge color="teal" className="bg-teal-500/10 text-teal-300 ring-teal-400/30 mb-4"><ShieldCheck className="w-3.5 h-3.5" />{t("landing.privacy.badge")}</Badge>
            <h2 className="mpp-display text-3xl font-bold text-white mb-4">{t("landing.privacy.title")}</h2>
            <p className="text-slate-300 text-sm mb-6 max-w-lg">{t("landing.privacy.desc")}</p>
            <div className="space-y-4">
              {privacyPoints.map((p) => (
                <div key={p.title} className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/10"><p.icon className="w-4.5 h-4.5 text-teal-300" /></div>
                  <div><p className="text-white text-sm font-semibold">{p.title}</p><p className="text-slate-400 text-xs mt-0.5">{p.desc}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-300 mb-4">{t("landing.privacy.adminSeesLabel")}</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3"><span className="text-sm text-slate-200">{t("landing.privacy.rowDesignPulse")}</span><Badge color="teal">{t("landing.privacy.visible")}</Badge></div>
              <div className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3"><span className="text-sm text-slate-200">{t("landing.privacy.rowCompletion")}</span><Badge color="teal">{t("landing.privacy.visible")}</Badge></div>
              <div className="flex items-center justify-between bg-rose-500/10 rounded-lg px-4 py-3"><span className="text-sm text-slate-300">{t("landing.privacy.rowSophie")}</span><Badge color="rose"><Lock className="w-3 h-3" />{t("landing.privacy.hidden")}</Badge></div>
              <div className="flex items-center justify-between bg-rose-500/10 rounded-lg px-4 py-3"><span className="text-sm text-slate-300">{t("landing.privacy.rowThomas")}</span><Badge color="rose"><Lock className="w-3 h-3" />{t("landing.privacy.hidden")}</Badge></div>
            </div>
          </div>
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section id="integrations" className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <SectionHeader eyebrow={t("landing.integrations.eyebrow")} title={t("landing.integrations.title")} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {integrations.map((i) => (
            <div key={i} className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-600">
              <Globe className="w-4 h-4 text-slate-400" />{i}
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeader eyebrow={t("landing.pricing.eyebrow")} title={t("landing.pricing.title")} desc={t("landing.pricing.desc")} />
          <div className="grid gap-5 lg:grid-cols-3 lg:items-stretch">
            {plans.map((plan) => (
              <Card key={plan.name} className={`relative flex h-full flex-col ${plan.featured ? "border-teal-400 ring-1 ring-teal-400 shadow-lift" : ""}`}>
                {plan.featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold text-white">{t("landing.pricing.mostPopular")}</div>}
                <div className="mb-6">
                  <p className="mpp-display text-xl font-bold text-slate-900">{plan.name}</p>
                  <p className="mt-2 min-h-10 text-sm leading-relaxed text-slate-500">{plan.desc}</p>
                </div>
                <div className="mb-6"><span className="mpp-display text-3xl font-bold text-slate-900">{plan.price}</span>{plan.name !== "Enterprise" && <span className="ml-1 text-sm text-slate-500">{t("landing.pricing.perEmployeeMonth")}</span>}</div>
                <Button onClick={onLogin} variant={plan.featured ? "primary" : "outline"} className="mb-6 w-full">{plan.name === "Enterprise" ? t("landing.pricing.talkToSales") : t("landing.pricing.choosePlan")}</Button>
                <div className="border-t border-slate-100 pt-5"><p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{t("landing.pricing.included")}</p><ul className="space-y-3">{plan.features.map((feature) => <li key={feature} className="flex items-start gap-2 text-sm text-slate-600"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />{feature}</li>)}</ul></div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-20">
        <div className="bg-gradient-to-br from-teal-600 to-indigo-900 rounded-3xl px-8 py-14 sm:px-16 text-center relative overflow-hidden">
          <h2 className="mpp-display text-3xl font-bold text-white mb-3">{t("landing.cta.title")}</h2>
          <p className="text-teal-50 max-w-xl mx-auto mb-8">{t("landing.cta.desc")}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="!bg-white !text-teal-700 hover:!bg-teal-50" onClick={onLogin}>{t("landing.cta.signIn")}</Button>
            <Button size="lg" variant="outline" className="!border-white/40 !bg-transparent !text-white hover:!border-white/60 hover:!bg-white/10 hover:!text-white">{t("landing.cta.talkToSales")}</Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-950 flex items-center justify-center"><Brain className="w-4 h-4 text-teal-400" /></div>
              <span className="mpp-display font-bold text-slate-900">Mind<span className="text-teal-600">Elevate</span></span>
            </div>
            <p className="text-sm text-slate-500 max-w-xs">{t("landing.footer.tagline")}</p>
          </div>
          {tx<FooterColumnText[]>("landing.footer.columns").map((c) => (
            <div key={c.h}>
              <p className="text-sm font-semibold text-slate-900 mb-3">{c.h}</p>
              <ul className="space-y-2">{c.items.map((i) => <li key={i}><a href="#" className="text-sm text-slate-500 hover:text-slate-800">{i}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-200 py-5 text-center text-xs text-slate-400">{t("landing.footer.copyright")}</div>
      </footer>
    </div>
  );
};
