/* Auto-generated during modernization refactor of Mind Elevate */

import React from "react";
import {
  Plus
} from "lucide-react";
import {
  Badge,
  Card,
  Button,
  EmptyPagePlaceholder
} from "../../components/ui/Primitives";
import {
  ADMIN_THEMES
} from "../../data/mockData";

export const ThemesAdminPage = () => (
  <EmptyPagePlaceholder title="Monthly Themes" desc="Plan and schedule the organization's monthly focus areas.">
    <div className="flex justify-end mb-4"><Button size="sm" icon={Plus}>New Theme</Button></div>
    <div className="grid sm:grid-cols-3 gap-5">
      {ADMIN_THEMES.map((t) => (
        <Card key={t.title}>
          <Badge color={t.status === "Active" ? "teal" : t.status === "Scheduled" ? "amber" : "slate"} className="mb-3">{t.status}</Badge>
          <p className="text-xs text-slate-400 font-medium mb-1">{t.month}</p>
          <p className="font-semibold text-slate-900">{t.title}</p>
          <Button size="sm" variant="outline" className="w-full mt-4">Edit Theme</Button>
        </Card>
      ))}
    </div>
  </EmptyPagePlaceholder>
);

