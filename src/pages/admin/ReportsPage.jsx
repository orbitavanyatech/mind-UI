/* Auto-generated during modernization refactor of Mind Elevate */

import React from "react";
import {
  Download
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line
} from "recharts";
import {
  Card,
  Button,
  StatCard,
  EmptyPagePlaceholder,
  PrivacyNotice
} from "../../components/ui/Primitives";
import {
  ORG_STATS,
  ENGAGEMENT_TREND,
  DEPARTMENT_COMPLETION
} from "../../data/mockData";

export const ReportsPage = () => (
  <EmptyPagePlaceholder title="Aggregated Reports" desc="Company-wide insight, always anonymized and rolled up.">
    <PrivacyNotice text="Reports never break down below department level, and any segment under 5 people is automatically suppressed to protect anonymity." />
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 my-6">
      {ORG_STATS.map((s) => <StatCard key={s.label} {...s} color="indigo" />)}
    </div>
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <p className="font-semibold text-slate-900 text-sm mb-4">Engagement Over Time</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={ENGAGEMENT_TREND}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0F2" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9AA2AB" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9AA2AB" }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="engagement" stroke="#DE3FA3" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
      <Card>
        <p className="font-semibold text-slate-900 text-sm mb-4">Completion by Department</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={DEPARTMENT_COMPLETION}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0F2" />
            <XAxis dataKey="dept" tick={{ fontSize: 11, fill: "#9AA2AB" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9AA2AB" }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="completion" fill="#3346E8" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
    <div className="flex justify-end mt-5"><Button variant="outline" size="sm" icon={Download}>Export Report (CSV)</Button></div>
  </EmptyPagePlaceholder>
);
