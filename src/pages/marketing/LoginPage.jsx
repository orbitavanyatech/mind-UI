/* Auto-generated during modernization refactor of Mind Elevate */

import React, { useState } from "react";
import {
  Lock,
  Brain,
  Eye,
  EyeOff,
  Mail,
  KeyRound,
  ShieldCheck,
  ChevronLeft,
  Quote
} from "lucide-react";
import {
  Button
} from "../../components/ui/Primitives";
import {
  ROLE_META
} from "../../config/nav";
import { useLanguage } from "../../i18n/LanguageContext";

export const LoginPage = ({ onLogin, onBack }) => {
  const [showPw, setShowPw] = useState(false);
  const [selectedRole, setSelectedRole] = useState("employee");
  const [email, setEmail] = useState("sophie.vandijk@acme.com");
  const { t } = useLanguage();

  const roleEmails = { employee: "sophie.vandijk@acme.com", leader: "thomas.devries@acme.com", admin: "lotte.jansen@acme.com" };

  return (
    <div className="mpp-root min-h-screen bg-slate-50 flex">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-950 to-slate-900 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "radial-gradient(circle at 30% 30%, #5D67E5 0, transparent 40%)" }} />
        <div className="relative flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"><Brain className="w-4.5 h-4.5 text-teal-300" /></div>
          <span className="mpp-display font-bold text-white text-lg">Mind<span className="text-teal-400">Elevate</span></span>
        </div>
        <div className="relative">
          <Quote className="w-8 h-8 text-teal-400 mb-4" />
          <p className="mpp-display text-2xl text-white font-medium leading-snug max-w-md">{t("login.quote")}</p>
          <p className="text-slate-400 text-sm mt-4">{t("login.quoteAuthor")}</p>
        </div>
        <div className="relative flex items-center gap-6 text-slate-400 text-xs">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-teal-400" />{t("login.soc2")}</span>
          <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-teal-400" />{t("login.gdpr")}</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <button onClick={onBack} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-8"><ChevronLeft className="w-4 h-4" />{t("login.backToSite")}</button>
          <h1 className="mpp-display text-2xl font-bold text-slate-900 mb-1">{t("login.welcomeBack")}</h1>
          <p className="text-sm text-slate-500 mb-7">{t("login.subtitle")}</p>

          <div className="mb-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{t("login.demoLabel")}</p>
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(ROLE_META).map((r) => (
                <button
                  key={r}
                  onClick={() => { setSelectedRole(r); setEmail(roleEmails[r]); }}
                  className={`rounded-xl border px-2 py-2.5 text-xs font-semibold transition-colors ${selectedRole === r ? "border-teal-600 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}
                >
                  {t(ROLE_META[r].label)}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); onLogin(selectedRole); }} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">{t("login.workEmail")}</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">{t("login.password")}</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input defaultValue="••••••••••" type={showPw ? "text" : "password"} className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-500"><input type="checkbox" className="rounded border-slate-300 text-teal-600 focus:ring-teal-500" defaultChecked />{t("login.rememberMe")}</label>
              <a href="#" className="text-teal-600 font-medium">{t("login.forgotPassword")}</a>
            </div>
            <Button type="submit" className="w-full" size="lg">{t("login.signInAs", { role: t(ROLE_META[selectedRole].label) })}</Button>
          </form>

          <div className="flex items-center gap-3 my-6"><div className="h-px bg-slate-200 flex-1" /><span className="text-xs text-slate-400">{t("login.orContinueWith")}</span><div className="h-px bg-slate-200 flex-1" /></div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full">{t("login.googleSso")}</Button>
            <Button variant="outline" className="w-full">{t("login.oktaSso")}</Button>
          </div>
          <p className="text-xs text-slate-400 text-center mt-8">{t("login.redirectNote")}</p>
        </div>
      </div>
    </div>
  );
};
