/* Auto-generated during modernization refactor of Mind Elevate */

import React from "react";
import {
  Calendar,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import {
  Card,
  Button,
  EmptyPagePlaceholder
} from "../../components/ui/Primitives";

export const CalendarPage = () => {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const marked = [4, 9, 15, 22, 27, 29];
  return (
    <EmptyPagePlaceholder title="Calendar" desc="All your sessions and theme milestones in one view.">
      <Card>
        <div className="flex items-center justify-between mb-5">
          <p className="font-semibold text-slate-900">August 2026</p>
          <div className="flex gap-2"><Button size="sm" variant="outline"><ChevronLeft className="w-4 h-4" /></Button><Button size="sm" variant="outline"><ChevronRight className="w-4 h-4" /></Button></div>
        </div>
        <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold text-slate-400 mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((d) => (
            <div key={d} className={`aspect-square rounded-lg flex items-center justify-center text-sm relative ${marked.includes(d) ? "bg-teal-50 text-teal-700 font-semibold" : "text-slate-600 hover:bg-slate-50"}`}>
              {d}
              {marked.includes(d) && <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-teal-500" />}
            </div>
          ))}
        </div>
      </Card>
    </EmptyPagePlaceholder>
  );
};

