/* Auto-generated during modernization refactor of Mind Elevate */
import {
  Home,
  Sparkles,
  BookOpen,
  TrendingUp,
  Video,
  Calendar,
  ClipboardList,
  User,
  Users,
  Building2,
  Library,
  FilePlus,
  PlayCircle,
  BarChart3,
  Settings,
  ShieldCheck,
  NotebookPen,
  Award,
  Compass,
  Scale,
  Network,
  UsersRound,
  CreditCard,
  MessageSquareText
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Role, Tone } from "@/types";

/* `label` here is a translation key (looked up under `nav.*` via
   useLanguage().t()) rather than display text, so the sidebar / mobile
   tab bar can render it in the active language. */
export interface NavItem {
  key: string;
  href: string;
  label: string;
  icon: LucideIcon;
  accent?: boolean;
}

export const NAV_CONFIG: Record<Role, NavItem[]> = {
  employee: [
    { key: "dashboard", href: "/dashboard", label: "nav.dashboard", icon: Home },
    { key: "theme", href: "/theme", label: "nav.theme", icon: Sparkles },
    { key: "library", href: "/library", label: "nav.library", icon: BookOpen },
    { key: "personalSpace", href: "/personal-space", label: "nav.personalSpace", icon: Compass },
    { key: "reflection", href: "/reflection", label: "nav.reflection", icon: NotebookPen },
    { key: "progress", href: "/progress", label: "nav.progress", icon: TrendingUp },
    { key: "achievements", href: "/achievements", label: "nav.achievements", icon: Award },
    { key: "sessions", href: "/sessions", label: "nav.sessions", icon: Video },
    { key: "calendar", href: "/calendar", label: "nav.calendar", icon: Calendar },
    { key: "pulse", href: "/pulse", label: "nav.pulse", icon: ClipboardList },
    { key: "signals", href: "/signals", label: "nav.signals", icon: MessageSquareText },
    { key: "profile", href: "/profile", label: "nav.profile", icon: User },
  ],
  /* A leader is an employee first: every employee item, derived below so the two can never drift,
     plus the leader-only items. */
  leader: [],
  company_admin: [
    { key: "dashboard", href: "/company/dashboard", label: "nav.dashboard", icon: Home },
    { key: "people", href: "/company/people", label: "nav.people", icon: Users },
    { key: "departments", href: "/company/departments", label: "nav.departments", icon: Network },
    { key: "teams", href: "/company/teams", label: "nav.teams", icon: UsersRound },
    { key: "teamBalance", href: "/company/team-balance", label: "nav.teamBalance", icon: Scale },
    { key: "adminSessions", href: "/company/sessions", label: "nav.adminSessions", icon: Video },
    { key: "adminPulse", href: "/company/pulse", label: "nav.adminPulse", icon: ClipboardList },
    { key: "reports", href: "/company/reports", label: "nav.reports", icon: BarChart3 },
    { key: "settings", href: "/company/settings", label: "nav.settings", icon: Settings },
  ],
  platform_admin: [
    { key: "dashboard", href: "/platform/dashboard", label: "nav.dashboard", icon: Home },
    { key: "companies", href: "/platform/companies", label: "nav.companies", icon: Building2 },
    { key: "subscriptions", href: "/platform/subscriptions", label: "nav.subscriptions", icon: CreditCard },
    { key: "content", href: "/platform/content", label: "nav.content", icon: Library },
    { key: "create", href: "/platform/create", label: "nav.create", icon: FilePlus },
    { key: "themes", href: "/platform/themes", label: "nav.themes", icon: Sparkles },
    { key: "recordings", href: "/platform/recordings", label: "nav.recordings", icon: PlayCircle },
    { key: "settings", href: "/platform/settings", label: "nav.settings", icon: Settings },
  ],
};

/* Leader = all employee items + Leader Experience (after Private Reflection) + Leadership Coaching (after Pulse). */
const LEADER_EXTRAS: Record<string, NavItem> = {
  reflection: { key: "leaderExperience", href: "/leader-experience", label: "nav.leaderExperience", icon: ShieldCheck, accent: true },
  pulse: { key: "coaching", href: "/coaching", label: "nav.coaching", icon: ShieldCheck, accent: true },
};
NAV_CONFIG.leader = NAV_CONFIG.employee.flatMap((item) => (LEADER_EXTRAS[item.key] ? [item, LEADER_EXTRAS[item.key]] : [item]));

/* `label` here is a translation key too (looked up under `roles.*`). */
export const ROLE_META: Record<Role, { color: Tone; label: string }> = {
  employee: { color: "teal", label: "roles.employee" },
  leader: { color: "violet", label: "roles.leader" },
  company_admin: { color: "indigo", label: "roles.company_admin" },
  platform_admin: { color: "amber", label: "roles.platform_admin" },
};
