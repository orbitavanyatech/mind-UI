import { AppShell } from "@/components/layout/AppShell";
import { OrgProvider } from "@/company/OrgContext";

/* Company administrator area. OrgProvider keeps the company's people, departments and
   teams in one place so the People / Departments / Teams pages stay in sync. */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell scope="company">
      <OrgProvider>{children}</OrgProvider>
    </AppShell>
  );
}
