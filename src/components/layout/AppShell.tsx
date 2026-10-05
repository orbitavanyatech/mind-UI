"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import type { Scope } from "@/types";
import { useAuth } from "@/auth/AuthContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { USERS } from "@/data/mockData";
import { ROUTES, homeFor, pageTitleKey, scopeFor } from "@/config/routes";

interface AppShellProps {
  /** Which area of the app this layout serves (learner app, company admin, platform admin); users of another area are redirected home. */
  scope: Scope;
  children: ReactNode;
}

export const AppShell = ({ scope, children }: AppShellProps) => {
  const { role, ready, signOut } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  /* Set while signing out so the "no role -> /login" guard below doesn't race the push to the landing page. */
  const signingOut = useRef(false);

  const allowed = role !== null && scopeFor(role) === scope;

  useEffect(() => {
    if (!ready || signingOut.current) return;
    if (!role) router.replace(ROUTES.login);
    else if (!allowed) router.replace(homeFor(role));
  }, [ready, role, allowed, router]);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => setMobileOpen(false), [pathname]);

  if (!ready || !role || !allowed) {
    return <div className="min-h-screen bg-slate-50" aria-busy="true" />;
  }

  const user = USERS[role];
  const pageTitle = t(pageTitleKey(pathname));

  const handleSignOut = () => {
    signingOut.current = true;
    setMobileOpen(false);
    signOut();
    router.push(ROUTES.landing);
  };

  return (
    <div className="mpp-root bg-slate-50 min-h-screen flex">
      <Sidebar
        role={role}
        pathname={pathname}
        onSignOut={handleSignOut}
        open={mobileOpen}
        desktopOpen={sidebarOpen}
        setOpen={setMobileOpen}
      />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header
          user={user}
          pageTitle={pageTitle}
          onMenuClick={() => setMobileOpen(true)}
          onCollapseClick={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-[1400px] w-full mx-auto mpp-safe-x lg:px-8">
          <div className="flex items-center justify-between mb-1 sm:hidden">
            <h1 className="mpp-display font-bold text-slate-900 text-xl">{pageTitle}</h1>
          </div>
          <div className="mt-4 sm:mt-0">{children}</div>
        </main>
      </div>

      <MobileTabBar role={role} pathname={pathname} onMore={() => setMobileOpen(true)} />
    </div>
  );
};
