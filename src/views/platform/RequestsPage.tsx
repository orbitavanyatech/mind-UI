"use client";

/* Platform administrator (Bebrave) — Requests.
   Approval queue for what Customer Administrators may not do themselves: create or delete accounts and
   change Leader / Company Admin roles. Approving applies the change to the company's people. */

import { Check, X } from "lucide-react";
import { Badge, Button, Card, EmptyPagePlaceholder } from "@/components/ui/Primitives";
import { useRequests } from "@/requests/RequestsContext";
import type { AccountRequest } from "@/types";

const describe = (r: AccountRequest) => {
  if (r.kind === "new_user") return `Create account${r.toRole && r.toRole !== "Employee" ? ` as ${r.toRole}` : ""}${r.email ? ` · ${r.email}` : ""}`;
  if (r.kind === "remove_user") return "Permanently delete account";
  return `Change role: ${r.fromRole} → ${r.toRole}`;
};

const needsCoachingCheck = (r: AccountRequest) => r.toRole === "Leader" || r.fromRole === "Leader";

export const RequestsPage = () => {
  const { requests, resolveRequest } = useRequests();
  const pending = requests.filter((r) => r.status === "Pending");
  const done = requests.filter((r) => r.status !== "Pending");

  return (
    <EmptyPagePlaceholder title="Requests" desc="Account and role changes that Customer Administrators have requested.">
      <Card>
        <p className="font-semibold text-slate-900 text-sm mb-3">Waiting for approval ({pending.length})</p>
        {pending.length === 0 && <p className="text-sm text-slate-400 py-6 text-center">No pending requests.</p>}
        <div className="divide-y divide-slate-100">
          {pending.map((r) => (
            <div key={r.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3">
              <div>
                <p className="text-sm font-medium text-slate-800">{r.personName}</p>
                <p className="text-xs text-slate-500">{describe(r)} · {r.createdAt}</p>
                {needsCoachingCheck(r) && <p className="text-xs text-violet-700 mt-1">Leader status is linked to the Performance package and monthly leadership coaching.</p>}
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="outline" icon={X} onClick={() => resolveRequest(r.id, false)}>Decline</Button>
                <Button size="sm" icon={Check} onClick={() => resolveRequest(r.id, true)}>Approve</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
      {done.length > 0 && (
        <Card>
          <p className="font-semibold text-slate-900 text-sm mb-3">History</p>
          <div className="divide-y divide-slate-100">
            {done.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-3 py-2.5">
                <p className="text-sm text-slate-700">{r.personName} <span className="text-xs text-slate-400">· {describe(r)}</span></p>
                <Badge color={r.status === "Approved" ? "teal" : "rose"}>{r.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </EmptyPagePlaceholder>
  );
};
