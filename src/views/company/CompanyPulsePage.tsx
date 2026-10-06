"use client";

/* Company administrator — Pulse surveys. Which surveys run for this company, and how workload
   balance looks per department. Results are aggregated only; departments under the privacy
   minimum are withheld. */

import React from "react";
import { Card, EmptyPagePlaceholder, PrivacyNotice } from "@/components/ui/Primitives";
import { Table } from "@/components/ui/Table";
import { useLanguage } from "@/i18n/LanguageContext";
import { useOrg } from "@/company/OrgContext";
import { DepartmentBars, SuppressedNote } from "@/views/company/orgUi";

export const CompanyPulsePage = () => {
  const { t, tOr } = useLanguage();
  const { insights } = useOrg();
  return (
    <EmptyPagePlaceholder title={t("admin.pulse.title")} desc={t("admin.pulse.desc")}>
      <PrivacyNotice text={t("admin.pulse.privacy")} />
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <p className="font-semibold text-slate-900 text-sm mb-1">{t("admin.pulse.workload")}</p>
          <p className="text-xs text-slate-400 mb-4">{t("company.pulse.workloadHint")}</p>
          <DepartmentBars groups={insights.byDepartment} metric="workload" color="#EE8710" />
          <SuppressedNote groups={insights.byDepartment} />
        </Card>
        <Card>
          <p className="font-semibold text-slate-900 text-sm mb-4">{t("admin.pulse.active")}</p>
          <Table
            columns={[t("admin.cols.survey"), t("admin.cols.frequency"), t("admin.cols.responseRate")]}
            rows={[
              ["Weekly Workload Check", tOr("data.freq.weekly", "Weekly"), "71%"],
              ["Monthly Wellbeing Pulse", tOr("data.freq.monthly", "Monthly"), "64%"],
              ["Post-Theme Reflection", tOr("data.freq.monthly", "Monthly"), "58%"],
            ]}
          />
        </Card>
      </div>
    </EmptyPagePlaceholder>
  );
};
