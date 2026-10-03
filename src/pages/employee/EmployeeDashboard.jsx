/* Auto-generated during modernization refactor of Mind Elevate */

import React from "react";
import {
  Calendar,
  ChevronRight,
  Lock,
  CheckCircle2,
  ArrowRight,
  Target,
  ShieldCheck,
  Award
} from "lucide-react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  Legend
} from "recharts";
import {
  Badge,
  Card,
  Button,
  ProgressBar
} from "../../components/ui/Primitives";
import {
  MONTHLY_THEME,
  LEARNING_PATHS,
  UPCOMING_SESSIONS,
  QUICK_ACTIONS,
  WELLBEING_TREND,
  COACHING_NOTES_PREVIEW,
  TEAM_PULSE,
  BADGES,
  CERTIFICATES
} from "../../data/mockData";
import { useNavigation } from "../../navigation/NavigationContext";

const WelcomeBanner = ({ user }) => (
  <div className="rounded-2xl bg-gradient-to-br from-indigo-950 to-slate-900 p-6 sm:p-8 relative overflow-hidden">
    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 85% 20%, #5D67E5 0, transparent 45%)" }} />
    <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <p className="text-teal-300 text-xs font-semibold uppercase tracking-wide mb-1.5">Good to see you, {user.name.split(" ")[0]}</p>
        <h2 className="mpp-display text-white text-2xl font-bold">Let's build your focus this week</h2>
        <p className="text-slate-400 text-sm mt-1.5">You're 68% through this month's theme — one module left to finish strong.</p>
      </div>
      <Button size="md" className="!bg-teal-500 hover:!bg-teal-400 shrink-0" icon={ArrowRight}>Continue Theme</Button>
    </div>
  </div>
);

const MonthlyThemeCard = () => (
  <Card>
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center"><Target className="w-4.5 h-4.5 text-amber-600" /></div>
        <div><p className="text-xs text-slate-400 font-medium">{MONTHLY_THEME.month}</p><p className="font-semibold text-slate-900 text-sm">{MONTHLY_THEME.title}</p></div>
      </div>
      <Badge color="amber">In Progress</Badge>
    </div>
    <p className="text-sm text-slate-500 mb-4">{MONTHLY_THEME.description}</p>
    <ProgressBar value={MONTHLY_THEME.progress} color="amber" className="mb-4" />
    <div className="space-y-2">
      {MONTHLY_THEME.modules.map((m) => (
        <div key={m.name} className="flex items-center gap-2.5 text-sm">
          {m.done ? <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />}
          <span className={m.done ? "text-slate-400 line-through" : "text-slate-700"}>{m.name}</span>
        </div>
      ))}
    </div>
  </Card>
);

const LearningProgressCard = () => (
  <Card>
    <div className="flex items-center justify-between mb-4">
      <p className="font-semibold text-slate-900 text-sm">Learning Progress</p>
      <a href="#" className="text-xs font-semibold text-teal-600 flex items-center gap-0.5">View library<ChevronRight className="w-3.5 h-3.5" /></a>
    </div>
    <div className="space-y-4">
      {LEARNING_PATHS.map((p) => (
        <div key={p.name}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm text-slate-700 font-medium">{p.name}</span>
            <span className="text-xs text-slate-400">{p.progress}%</span>
          </div>
          <ProgressBar value={p.progress} color={p.color} />
        </div>
      ))}
    </div>
  </Card>
);

const UpcomingSessionsCard = () => (
  <Card>
    <div className="flex items-center justify-between mb-4">
      <p className="font-semibold text-slate-900 text-sm">Upcoming Sessions</p>
      <a href="#" className="text-xs font-semibold text-teal-600 flex items-center gap-0.5">Calendar<ChevronRight className="w-3.5 h-3.5" /></a>
    </div>
    <div className="space-y-3">
      {UPCOMING_SESSIONS.map((s) => (
        <div key={s.title} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200">
          <div className="w-12 h-12 rounded-lg bg-teal-50 flex flex-col items-center justify-center shrink-0">
            <span className="text-[10px] font-semibold text-teal-600 uppercase">{s.date.split(" ")[0]}</span>
            <span className="text-sm font-bold text-teal-700 leading-none">{s.date.split(" ")[1]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">{s.title}</p>
            <p className="text-xs text-slate-500">{s.type} · {s.host} · {s.time}</p>
          </div>
          <Badge color={s.spots === "Confirmed" ? "teal" : "slate"} className="shrink-0 hidden sm:inline-flex">{s.spots}</Badge>
        </div>
      ))}
    </div>
  </Card>
);

const QuickActionsGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
    {QUICK_ACTIONS.map((a) => (
      <button key={a.label} className="min-h-36 text-left bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-teal-300 hover:shadow-sm transition-all">
        <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center mb-3"><a.icon className="w-4.5 h-4.5 text-teal-600" /></div>
        <p className="text-sm font-semibold text-slate-900">{a.label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{a.desc}</p>
      </button>
    ))}
  </div>
);

const WellbeingTrendCard = () => (
  <Card>
    <div className="flex items-center justify-between mb-4">
      <p className="font-semibold text-slate-900 text-sm">Your Wellbeing Trend</p>
      <Badge color="slate">Private to you</Badge>
    </div>
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={WELLBEING_TREND}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0F2" />
        <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#9AA2AB" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#9AA2AB" }} axisLine={false} tickLine={false} />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="focus" stroke="#3346E8" strokeWidth={2.5} dot={false} />
        <Line type="monotone" dataKey="resilience" stroke="#EE8710" strokeWidth={2.5} dot={false} />
        <Line type="monotone" dataKey="energy" stroke="#12B8A6" strokeWidth={2.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </Card>
);

const AchievementsPreviewCard = ({ isLeader }) => {
  const { navigate } = useNavigation();
  const role = isLeader ? "leader" : "employee";
  const badges = BADGES.filter((b) => b.roles.includes(role));
  const earned = badges.filter((b) => b.earned);
  const latest = earned[earned.length - 1];
  const certCount = CERTIFICATES.filter((c) => c.roles.includes(role)).length;
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <p className="font-semibold text-slate-900 text-sm">Certificates & Badges</p>
        <button onClick={() => navigate("achievements", {})} className="text-xs font-semibold text-teal-600 flex items-center gap-0.5">View all<ChevronRight className="w-3.5 h-3.5" /></button>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center shrink-0"><Award className="w-5 h-5 text-amber-600" /></div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{earned.length} badge{earned.length === 1 ? "" : "s"} earned</p>
          <p className="text-xs text-slate-500">{certCount} certificate{certCount === 1 ? "" : "s"} on your profile</p>
        </div>
      </div>
      {latest && (
        <div className="flex items-center gap-2.5 bg-amber-50/60 border border-amber-100 rounded-xl p-3">
          <latest.icon className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="text-xs text-slate-700"><span className="font-semibold">{latest.name}</span> · earned {latest.earnedDate}</p>
        </div>
      )}
    </Card>
  );
};

const LeadershipCoachingSection = () => (
  <Card className="border-violet-100 bg-gradient-to-br from-violet-50/60 to-white">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center"><ShieldCheck className="w-4.5 h-4.5 text-violet-600" /></div>
        <div><p className="font-semibold text-slate-900 text-sm">Leadership Coaching</p><p className="text-xs text-slate-500">Confidential — never visible to your organization</p></div>
      </div>
      <Badge color="violet"><Lock className="w-3 h-3" />Private</Badge>
    </div>
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="bg-white rounded-xl border border-violet-100 p-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Next Session</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center font-semibold text-sm shrink-0">MF</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900">Coach Marcus Ford</p>
            <p className="text-xs text-slate-500">Thu, Aug 29 · 2:30 PM · 45 min</p>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button size="sm" className="flex-1 !bg-violet-600 hover:!bg-violet-700">Join Call</Button>
          <Button size="sm" variant="outline" className="flex-1">Reschedule</Button>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-violet-100 p-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Your Private Notes</p>
        <div className="space-y-2.5">
          {COACHING_NOTES_PREVIEW.map((n) => (
            <div key={n.date} className="flex gap-2.5 text-sm">
              <span className="text-xs text-slate-400 shrink-0 w-11">{n.date}</span>
              <p className="text-slate-600 text-xs leading-relaxed">{n.note}</p>
            </div>
          ))}
        </div>
        <a href="#" className="text-xs font-semibold text-violet-600 flex items-center gap-0.5 mt-3">View all notes<ChevronRight className="w-3.5 h-3.5" /></a>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-3 mt-4">
      {TEAM_PULSE.map((t) => (
        <div key={t.label} className="bg-white rounded-xl border border-violet-100 p-3 text-center">
          <p className="mpp-display text-xl font-bold text-slate-900">{t.value}%</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{t.label}</p>
        </div>
      ))}
    </div>
  </Card>
);

export const EmployeeDashboard = ({ user, isLeader }) => (
  <div className="space-y-6">
    <WelcomeBanner user={user} />
    <QuickActionsGrid />
    <div className="grid gap-6 xl:grid-cols-12">
      <div className="xl:col-span-8 [&>div]:h-full"><MonthlyThemeCard /></div>
      <div className="xl:col-span-4 [&>div]:h-full"><LearningProgressCard /></div>
      <div className="xl:col-span-8 [&>div]:h-full"><WellbeingTrendCard /></div>
      <div className="xl:col-span-4 [&>div]:h-full"><UpcomingSessionsCard /></div>
      <div className="xl:col-span-4 [&>div]:h-full"><AchievementsPreviewCard isLeader={isLeader} /></div>
      {isLeader && <div className="xl:col-span-12"><LeadershipCoachingSection /></div>}
    </div>
  </div>
);
