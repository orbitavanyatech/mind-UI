import { AppShell } from "@/components/layout/AppShell";
import { PlatformProvider } from "@/platform/PlatformContext";

/* Platform administrator area (Mind Elevate operators). PlatformProvider holds the client
   companies and their subscriptions so Companies, Subscriptions and the dashboard agree. */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell scope="platform">
      <PlatformProvider>{children}</PlatformProvider>
    </AppShell>
  );
}
