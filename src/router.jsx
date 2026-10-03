/* Central page router — maps the active role + nav key to a page component. */

import { EmployeeDashboard } from "./pages/employee/EmployeeDashboard";
import { ThemePage } from "./pages/employee/ThemePage";
import { LibraryPage } from "./pages/employee/LibraryPage";
import { ProgressPage } from "./pages/employee/ProgressPage";
import { SessionsPage } from "./pages/employee/SessionsPage";
import { CalendarPage } from "./pages/employee/CalendarPage";
import { PulsePage } from "./pages/employee/PulsePage";
import { ProfilePage } from "./pages/employee/ProfilePage";
import { CoachingPage } from "./pages/employee/CoachingPage";
import { ModuleDetailsPage } from "./pages/employee/ModuleDetailsPage";
import { VideoPlayerPage } from "./pages/employee/VideoPlayerPage";
import { ExercisePage } from "./pages/employee/ExercisePage";
import { QuestionsPage } from "./pages/employee/QuestionsPage";
import { ReflectionPage } from "./pages/employee/ReflectionPage";
import { SessionDetailsPage } from "./pages/employee/SessionDetailsPage";
import { AchievementsPage } from "./pages/employee/AchievementsPage";
import { PersonalSpacePage } from "./pages/employee/PersonalSpacePage";
import { TrainingItemPage } from "./pages/employee/TrainingItemPage";
import { LeaderExperiencePage } from "./pages/employee/LeaderExperiencePage";
import { TeamBalancePage } from "./pages/employee/TeamBalancePage";
import { CertificateDetailsPage } from "./pages/employee/CertificateDetailsPage";

import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { CompaniesPage } from "./pages/admin/CompaniesPage";
import { UsersPage } from "./pages/admin/UsersPage";
import { ContentLibraryPage } from "./pages/admin/ContentLibraryPage";
import { CreateContentPage } from "./pages/admin/CreateContentPage";
import { ThemesAdminPage } from "./pages/admin/ThemesAdminPage";
import { AdminSessionsPage } from "./pages/admin/AdminSessionsPage";
import { RecordingsPage } from "./pages/admin/RecordingsPage";
import { AdminPulsePage } from "./pages/admin/AdminPulsePage";
import { ReportsPage } from "./pages/admin/ReportsPage";
import { SettingsPage } from "./pages/admin/SettingsPage";

/* Values here are translation keys (looked up under `pageTitles.*` via
   useLanguage().t()), not display text. */
export const PAGE_TITLES = {
  dashboard: "pageTitles.dashboard", theme: "pageTitles.theme", library: "pageTitles.library", progress: "pageTitles.progress",
  sessions: "pageTitles.sessions", calendar: "pageTitles.calendar", pulse: "pageTitles.pulse", profile: "pageTitles.profile", coaching: "pageTitles.coaching",
  companies: "pageTitles.companies", users: "pageTitles.users", content: "pageTitles.content", create: "pageTitles.create",
  themes: "pageTitles.themes", adminSessions: "pageTitles.adminSessions", recordings: "pageTitles.recordings", adminPulse: "pageTitles.adminPulse",
  reports: "pageTitles.reports", settings: "pageTitles.settings",
  moduleDetails: "pageTitles.moduleDetails", videoPlayer: "pageTitles.videoPlayer", exercise: "pageTitles.exercise",
  questions: "pageTitles.questions", reflection: "pageTitles.reflection", sessionDetails: "pageTitles.sessionDetails",
  personalSpace: "pageTitles.personalSpace", trainingItem: "pageTitles.trainingItem",
  leaderExperience: "pageTitles.leaderExperience", teamBalance: "pageTitles.teamBalance",
  achievements: "pageTitles.achievements", certificateDetails: "pageTitles.certificateDetails",
};

export function renderPage(role, page, user) {
  if (role === "admin") {
    switch (page) {
      case "dashboard": return <AdminDashboard />;
      case "companies": return <CompaniesPage />;
      case "users": return <UsersPage />;
      case "content": return <ContentLibraryPage />;
      case "create": return <CreateContentPage />;
      case "themes": return <ThemesAdminPage />;
      case "adminSessions": return <AdminSessionsPage />;
      case "recordings": return <RecordingsPage />;
      case "adminPulse": return <AdminPulsePage />;
      case "reports": return <ReportsPage />;
      case "settings": return <SettingsPage />;
      default: return <AdminDashboard />;
    }
  }
  switch (page) {
    case "dashboard": return <EmployeeDashboard user={user} isLeader={role === "leader"} />;
    case "personalSpace": return <PersonalSpacePage />;
    case "trainingItem": return <TrainingItemPage />;
    case "leaderExperience": return role === "leader" ? <LeaderExperiencePage user={user} /> : <EmployeeDashboard user={user} isLeader={false} />;
    case "teamBalance": return role === "leader" ? <TeamBalancePage /> : <EmployeeDashboard user={user} isLeader={false} />;
    case "theme": return <ThemePage />;
    case "library": return <LibraryPage />;
    case "progress": return <ProgressPage />;
    case "sessions": return <SessionsPage />;
    case "calendar": return <CalendarPage />;
    case "pulse": return <PulsePage />;
    case "profile": return <ProfilePage user={user} />;
    case "coaching": return <CoachingPage />;
    case "achievements": return <AchievementsPage user={user} isLeader={role === "leader"} />;
    case "certificateDetails": return <CertificateDetailsPage user={user} />;
    case "moduleDetails": return <ModuleDetailsPage />;
    case "videoPlayer": return <VideoPlayerPage />;
    case "exercise": return <ExercisePage />;
    case "questions": return <QuestionsPage />;
    case "reflection": return <ReflectionPage />;
    case "sessionDetails": return <SessionDetailsPage />;
    default: return <EmployeeDashboard user={user} isLeader={role === "leader"} />;
  }
}
