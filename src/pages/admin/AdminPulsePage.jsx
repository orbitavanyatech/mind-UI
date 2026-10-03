/* Auto-generated during modernization refactor of Mind Elevate */

import React from "react";
import {
  Check
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import {
  Card,
  EmptyPagePlaceholder,
  PrivacyNotice
} from "../../components/ui/Primitives";
import {
  Table
} from "../../components/ui/Table";
import {
  DEPARTMENT_COMPLETION
} from "../../data/mockData";

export const AdminPulsePage = () => (
  <EmptyPagePlaceholder title="Pulse Surveys" desc="Configure recurring pulse surveys and view aggregated results only.">
    <PrivacyNotice text="Only aggregated results are ever shown here. Individual responses are never linked to a person, and results are suppressed for any group below 5 respondents." />
    <div className="grid lg:grid-cols-2 gap-6 mt-6">
      <Card>
        <p className="font-semibold text-slate-900 text-sm mb-4">Workload Balance — Company-wide</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={DEPARTMENT_COMPLETION.map((d) => ({ dept: d.dept, score: 100 - d.completion + 20 }))}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0F2" />
            <XAxis dataKey="dept" tick={{ fontSize: 11, fill: "#9AA2AB" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9AA2AB" }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="score" fill="#EE8710" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <Card>
        <p className="font-semibold text-slate-900 text-sm mb-4">Active Surveys</p>
        <Table columns={["Survey", "Frequency", "Response Rate"]} rows={[["Weekly Workload Check", "Weekly", "71%"], ["Monthly Wellbeing Pulse", "Monthly", "64%"], ["Post-Theme Reflection", "Monthly", "58%"]]} />
      </Card>
    </div>
  </EmptyPagePlaceholder>
);

