import { AppShell } from "@/components/layout/AppShell";
import { SignalsProvider } from "@/signals/SignalsContext";

/* The signals provider lives only in the learner app: company and platform administrators never get it. */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SignalsProvider>
      <AppShell scope="employee">{children}</AppShell>
    </SignalsProvider>
  );
}
