"use client";

/* Auto-generated during modernization refactor of Mind Elevate */

import React, { type ReactNode } from "react";
import { Badge } from "@/components/ui/Primitives";
import { useLanguage } from "@/i18n/LanguageContext";
import { slug } from "@/i18n/slug";
import type { Tone } from "@/types";

export const Table = ({ columns, rows }: { columns: string[]; rows: ReactNode[][] }) => (
  <div className="overflow-x-auto -mx-1">
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide border-b border-slate-100">
          {columns.map((c) => <th key={c} className="py-2.5 px-3 whitespace-nowrap">{c}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
            {r.map((cell, j) => <td key={j} className="py-3 px-3 whitespace-nowrap">{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const { tOr } = useLanguage();
  const map: Record<string, Tone> = {
    Active: "teal", Published: "teal", Scheduled: "amber", Invited: "amber", Draft: "slate",
    Cancelled: "rose", Archived: "slate", Trial: "indigo", "At Risk": "amber", Suspended: "rose",
  };
  return <Badge color={map[status] || "slate"}>{tOr(`data.status.${slug(status)}`, status)}</Badge>;
};

export const statusBadge = (status: string) => <StatusBadge status={status} />;

