import React, { useState, useMemo } from "react";

import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { MobileTabBar } from "./components/layout/MobileTabBar";

import { LandingPage } from "./pages/marketing/LandingPage";
import { LoginPage } from "./pages/marketing/LoginPage";

import { NAV_PARENT } from "./config/nav";
import { USERS } from "./data/mockData";
import { PAGE_TITLES, renderPage } from "./router";
import { useLanguage } from "./i18n/LanguageContext";
import { NavigationProvider, useNavigation } from "./navigation/NavigationContext";

function AppShell({ role, page, setPage, sidebarOpen, setSidebarOpen, mobileOpen, setMobileOpen, onSignOut }) {
  const { resetTo } = useNavigation();
  const user = useMemo(() => USERS[role], [role]);
  const { t } = useLanguage();
  const pageTitle = t(PAGE_TITLES[page]);

  return (
    <div className="mpp-root bg-slate-50 min-h-screen flex">
      <Sidebar
        role={role}
        active={NAV_PARENT[page] || page}
        onNavigate={(k) => { resetTo(k); setMobileOpen(false); }}
        onSignOut={onSignOut}
        open={mobileOpen}
        desktopOpen={sidebarOpen}
        setOpen={setMobileOpen}
      />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header user={user} pageTitle={pageTitle} onMenuClick={() => setMobileOpen(true)} onCollapseClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-[1400px] w-full mx-auto mpp-safe-x lg:px-8">
          <div className="flex items-center justify-between mb-1 sm:hidden">
            <h1 className="mpp-display font-bold text-slate-900 text-xl">{pageTitle}</h1>
          </div>
          <div className="mt-4 sm:mt-0">
            {renderPage(role, page, user)}
          </div>
        </main>
      </div>

      <MobileTabBar role={role} active={NAV_PARENT[page] || page} onNavigate={(k) => resetTo(k)} onMore={() => setMobileOpen(true)} />
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("landing"); // landing | login | app
  const [role, setRole] = useState("employee");
  const [page, setPage] = useState("dashboard");
  const [params, setParams] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogin = (selectedRole) => {
    setRole(selectedRole);
    setPage("dashboard");
    setParams({});
    setView("app");
  };

  const handleSignOut = () => {
    setMobileOpen(false);
    setPage("dashboard");
    setParams({});
    setView("landing");
  };

  if (view === "landing") return <LandingPage onLogin={() => setView("login")} />;
  if (view === "login") return <LoginPage onLogin={handleLogin} onBack={() => setView("landing")} />;

  return (
    <NavigationProvider page={page} params={params} setPage={setPage} setParams={setParams}>
      <AppShell
        role={role}
        page={page}
        setPage={setPage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onSignOut={handleSignOut}
      />
    </NavigationProvider>
  );
}
