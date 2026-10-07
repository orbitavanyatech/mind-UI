import { RoleGate } from "@/components/layout/RoleGate";
import { CoachingPage } from "@/views/employee/CoachingPage";

/* Confidential leadership coaching is leader-only. */
export default function Page() {
  return (
    <RoleGate allow={["leader"]}>
      <CoachingPage />
    </RoleGate>
  );
}
