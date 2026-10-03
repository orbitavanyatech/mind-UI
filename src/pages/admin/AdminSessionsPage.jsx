/* Auto-generated during modernization refactor of Mind Elevate */

import React from "react";
import {
  Plus
} from "lucide-react";
import {
  Card,
  Button,
  EmptyPagePlaceholder
} from "../../components/ui/Primitives";
import {
  Table,
  statusBadge
} from "../../components/ui/Table";

export const AdminSessionsPage = () => (
  <EmptyPagePlaceholder title="Live Sessions" desc="Schedule and manage organization-wide live sessions.">
    <Card>
      <div className="flex justify-end mb-4"><Button size="sm" icon={Plus}>Schedule Session</Button></div>
      <Table
        columns={["Session", "Host", "Date", "Registrants", "Status"]}
        rows={[
          ["Managing Pre-Deadline Stress", "Dr. Alina Wu", "Aug 27, 11:00 AM", "186", statusBadge("Scheduled")],
          ["Mindful Mornings", "Sofia Alvarez", "Sep 2, 9:00 AM", "94", statusBadge("Scheduled")],
          ["Leading Through Uncertainty", "James Patel", "Sep 10, 1:00 PM", "212", statusBadge("Scheduled")],
        ]}
      />
    </Card>
  </EmptyPagePlaceholder>
);

