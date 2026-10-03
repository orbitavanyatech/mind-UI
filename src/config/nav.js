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
  Crown
} from "lucide-react";

/* `label` here is a translation key (looked up under `nav.*` via
   useLanguage().t()) rather than display text, so the sidebar / mobile
   tab bar can render it in the active language. */
export const NAV_CONFIG = {
  employee: [
    { key: "dashboard", label: "nav.dashboard", icon: Home },
    { key: "personalSpace", label: "nav.personalSpace", icon: Compass },
    { key: "theme", label: "nav.theme", icon: Sparkles },
    { key: "library", label: "nav.library", icon: BookOpen },
    { key: "reflection", label: "nav.reflection", icon: NotebookPen },
    { key: "progress", label: "nav.progress", icon: TrendingUp },
    { key: "achievements", label: "nav.achievements", icon: Award },
    { key: "sessions", label: "nav.sessions", icon: Video },
    { key: "calendar", label: "nav.calendar", icon: Calendar },
    { key: "pulse", label: "nav.pulse", icon: ClipboardList },
    { key: "profile", label: "nav.profile", icon: User },
  ],
  leader: [
    { key: "dashboard", label: "nav.dashboard", icon: Home },
    { key: "leaderExperience", label: "nav.leaderExperience", icon: Crown, accent: true },
    { key: "teamBalance", label: "nav.teamBalance", icon: Scale, accent: true },
    { key: "personalSpace", label: "nav.personalSpace", icon: Compass },
    { key: "theme", label: "nav.theme", icon: Sparkles },
    { key: "library", label: "nav.library", icon: BookOpen },
    { key: "reflection", label: "nav.reflection", icon: NotebookPen },
    { key: "progress", label: "nav.progress", icon: TrendingUp },
    { key: "achievements", label: "nav.achievements", icon: Award },
    { key: "sessions", label: "nav.sessions", icon: Video },
    { key: "calendar", label: "nav.calendar", icon: Calendar },
    { key: "pulse", label: "nav.pulse", icon: ClipboardList },
    { key: "coaching", label: "nav.coaching", icon: ShieldCheck, accent: true },
    { key: "profile", label: "nav.profile", icon: User },
  ],
  admin: [
    { key: "dashboard", label: "nav.dashboard", icon: Home },
    { key: "companies", label: "nav.companies", icon: Building2 },
    { key: "users", label: "nav.users", icon: Users },
    { key: "content", label: "nav.content", icon: Library },
    { key: "create", label: "nav.create", icon: FilePlus },
    { key: "themes", label: "nav.themes", icon: Sparkles },
    { key: "adminSessions", label: "nav.adminSessions", icon: Video },
    { key: "recordings", label: "nav.recordings", icon: PlayCircle },
    { key: "adminPulse", label: "nav.adminPulse", icon: ClipboardList },
    { key: "reports", label: "nav.reports", icon: BarChart3 },
    { key: "settings", label: "nav.settings", icon: Settings },
  ],
};

/* `label` here is a translation key too (looked up under `roles.*`). */
export const ROLE_META = {
  employee: { color: "teal", label: "roles.employee" },
  leader: { color: "violet", label: "roles.leader" },
  admin: { color: "indigo", label: "roles.admin" },
};

/* Drill-down pages keep their parent's sidebar entry highlighted. */
export const NAV_PARENT = {
  trainingItem: "personalSpace",
};
