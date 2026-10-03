/* Auto-generated during modernization refactor of Mind Elevate */

import React from "react";
import {
  Filter
} from "lucide-react";
import {
  Badge,
  Card,
  Button,
  EmptyPagePlaceholder
} from "../../components/ui/Primitives";
import {
  UPCOMING_SESSIONS
} from "../../data/mockData";
import { useNavigation } from "../../navigation/NavigationContext";

export const SessionsPage = () => {
  const { navigate } = useNavigation();
  return (
    <EmptyPagePlaceholder title="Live Sessions" desc="Book group sessions or manage your 1:1 coaching time.">
      <div className="flex gap-3 mb-5">
        <Button variant="subtle" size="sm" icon={Filter}>All Sessions</Button>
        <Button variant="ghost" size="sm">Group</Button>
        <Button variant="ghost" size="sm">1:1</Button>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        {UPCOMING_SESSIONS.map((s) => (
          <Card key={s.title} className="flex flex-col">
            <Badge color={s.type === "1:1 Coaching" ? "violet" : "teal"} className="w-fit mb-3">{s.type}</Badge>
            <p className="font-semibold text-slate-900 text-sm mb-1">{s.title}</p>
            <p className="text-xs text-slate-500 mb-4">{s.host} · {s.date}, {s.time}</p>
            <Button size="sm" className="mt-auto" onClick={() => navigate("sessionDetails", { sessionTitle: s.title })}>
              {s.spots === "Confirmed" ? "View Details" : "Reserve Spot"}
            </Button>
          </Card>
        ))}
      </div>
    </EmptyPagePlaceholder>
  );
};
