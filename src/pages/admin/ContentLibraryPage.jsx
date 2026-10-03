/* Auto-generated during modernization refactor of Mind Elevate */

import React from "react";
import {
  Library,
  MoreVertical,
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
import {
  CONTENT_LIBRARY
} from "../../data/mockData";

export const ContentLibraryPage = () => (
  <EmptyPagePlaceholder title="Content Library" desc="All courses, articles, and sessions across the platform.">
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex gap-2">
          <Button variant="subtle" size="sm">All</Button><Button variant="ghost" size="sm">Courses</Button><Button variant="ghost" size="sm">Sessions</Button><Button variant="ghost" size="sm">Articles</Button>
        </div>
        <Button size="sm" icon={Plus}>New Content</Button>
      </div>
      <Table columns={["Title", "Type", "Theme", "Status", ""]} rows={CONTENT_LIBRARY.map((c) => [c.title, c.type, c.theme, statusBadge(c.status), <MoreVertical key="m" className="w-4 h-4 text-slate-400" />])} />
    </Card>
  </EmptyPagePlaceholder>
);

