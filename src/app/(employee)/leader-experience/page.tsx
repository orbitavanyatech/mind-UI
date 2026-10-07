import { RoleGate } from "@/components/layout/RoleGate";
import { LeaderExperiencePage } from "@/views/employee/LeaderExperiencePage";

export default function Page() {
  return (
    <RoleGate allow={["leader"]}>
      <LeaderExperiencePage />
    </RoleGate>
  );
}
