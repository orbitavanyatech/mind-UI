import { RoleGate } from "@/components/layout/RoleGate";
import { TeamBalancePage } from "@/views/company/TeamBalancePage";

/* Anonymous team / group / company insights: Company Administrator only.
   Team leaders are deliberately excluded — they only receive named direct signals. */
export default function Page() {
  return (
    <RoleGate allow={["company_admin"]}>
      <TeamBalancePage />
    </RoleGate>
  );
}
