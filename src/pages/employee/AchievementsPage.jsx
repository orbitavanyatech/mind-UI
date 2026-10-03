/* Certificates & Badges — personal recognition for employees and leaders.
   Purely a "you've earned this" surface: nothing here is ever exposed to
   administrators (see PrivacyNotice below). */

import React, { useState } from "react";
import { Award, CheckCircle2, ChevronRight, Download, Lock, Sparkles } from "lucide-react";
import { Badge, Button, Card, EmptyPagePlaceholder, PrivacyNotice, ProgressBar } from "../../components/ui/Primitives";
import { BADGES, CERTIFICATES, UPCOMING_CERTIFICATES } from "../../data/mockData";
import { useNavigation } from "../../navigation/NavigationContext";

const TIER_STYLES = {
  gold: { ring: "ring-amber-200", bg: "bg-amber-50", text: "text-amber-600", badge: "amber" },
  silver: { ring: "ring-slate-200", bg: "bg-slate-100", text: "text-slate-500", badge: "slate" },
  bronze: { ring: "ring-orange-200", bg: "bg-orange-50", text: "text-orange-600", badge: "amber" },
};

const BadgeCard = ({ badge }) => {
  const style = TIER_STYLES[badge.tier];
  return (
    <Card className={`flex flex-col items-center text-center ${!badge.earned ? "opacity-80" : ""}`}>
      <div className={`relative w-16 h-16 rounded-full flex items-center justify-center mb-4 ring-4 ${badge.earned ? `${style.bg} ${style.ring}` : "bg-slate-50 ring-slate-100"}`}>
        <badge.icon className={`w-7 h-7 ${badge.earned ? style.text : "text-slate-300"}`} />
        {!badge.earned && (
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center">
            <Lock className="w-3 h-3 text-slate-400" />
          </div>
        )}
      </div>
      <p className="text-sm font-semibold text-slate-900">{badge.name}</p>
      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{badge.description}</p>
      <div className="mt-4 w-full">
        {badge.earned ? (
          <Badge color={style.badge}>Earned {badge.earnedDate}</Badge>
        ) : (
          <>
            <ProgressBar value={badge.progress} color="slate" className="mb-1.5" />
            <p className="text-[11px] text-slate-400">{badge.progress}% of the way there</p>
          </>
        )}
      </div>
    </Card>
  );
};

const CertificateCard = ({ cert }) => {
  const { navigate } = useNavigation();
  return (
    <Card className="flex flex-col sm:flex-row sm:items-center gap-4">
      <div className={`w-12 h-12 rounded-xl bg-${cert.color}-50 flex items-center justify-center shrink-0`}>
        <Award className={`w-6 h-6 text-${cert.color}-600`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900">{cert.title}</p>
        <p className="text-xs text-slate-500 mt-0.5">Issued {cert.issuedDate} · {cert.detail}</p>
        <p className="text-[11px] text-slate-400 mt-0.5">Credential ID: {cert.credentialId}</p>
      </div>
      <Button size="sm" variant="outline" icon={ChevronRight} className="shrink-0" onClick={() => navigate("certificateDetails", { certificateId: cert.id })}>
        View certificate
      </Button>
    </Card>
  );
};

const UpcomingCertificateRow = ({ item }) => (
  <div className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-slate-200">
    <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center shrink-0"><Sparkles className="w-4.5 h-4.5 text-slate-400" /></div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-slate-700">{item.title}</p>
      <ProgressBar value={item.progress} color="amber" className="mt-2" />
    </div>
    <span className="text-xs text-slate-400 shrink-0">{item.progress}%</span>
  </div>
);

export const AchievementsPage = ({ user, isLeader }) => {
  const [tab, setTab] = useState("badges");
  const role = isLeader ? "leader" : "employee";
  const badges = BADGES.filter((b) => b.roles.includes(role));
  const certificates = CERTIFICATES.filter((c) => c.roles.includes(role));
  const upcoming = UPCOMING_CERTIFICATES.filter((c) => c.roles.includes(role));
  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <EmptyPagePlaceholder title="Certificates & Badges" desc="Recognition for the progress you've made — private to you, never shared with your organization.">
      <PrivacyNotice text="Your certificates and badges are yours alone. Administrators can never see which badges you've earned or how close you are to the next one." />

      <div className="grid sm:grid-cols-3 gap-5 mt-6 mb-6">
        <Card className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center shrink-0"><Award className="w-5 h-5 text-teal-600" /></div>
          <div><p className="mpp-display text-xl font-bold text-slate-900">{earnedCount}/{badges.length}</p><p className="text-xs text-slate-500">Badges earned</p></div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center shrink-0"><CheckCircle2 className="w-5 h-5 text-violet-600" /></div>
          <div><p className="mpp-display text-xl font-bold text-slate-900">{certificates.length}</p><p className="text-xs text-slate-500">Certificates earned</p></div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center shrink-0"><Sparkles className="w-5 h-5 text-amber-600" /></div>
          <div><p className="mpp-display text-xl font-bold text-slate-900">{upcoming.length}</p><p className="text-xs text-slate-500">In progress</p></div>
        </Card>
      </div>

      <div className="inline-flex items-center gap-1 rounded-xl bg-slate-100 p-1 mb-6">
        {[{ key: "badges", label: "Badges" }, { key: "certificates", label: "Certificates" }].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === t.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "badges" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {badges.map((b) => <BadgeCard key={b.id} badge={b} />)}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            {certificates.length > 0 ? certificates.map((c) => <CertificateCard key={c.id} cert={c} />) : (
              <Card className="text-center py-10">
                <Download className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-700">No certificates yet</p>
                <p className="text-xs text-slate-500 mt-1">Complete a learning path to earn your first certificate.</p>
              </Card>
            )}
          </div>
          {upcoming.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-3">On the way</p>
              <div className="space-y-3">
                {upcoming.map((u) => <UpcomingCertificateRow key={u.id} item={u} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </EmptyPagePlaceholder>
  );
};
