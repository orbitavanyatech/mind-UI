/* Auto-generated during modernization refactor of Mind Elevate */

import React from "react";
import {
  BookOpen,
  Library,
  Building
} from "lucide-react";
import {
  Card,
  Button,
  ProgressBar,
  EmptyPagePlaceholder
} from "../../components/ui/Primitives";
import {
  LEARNING_PATHS,
  MODULES,
  PATH_MODULES
} from "../../data/mockData";
import { useNavigation } from "../../navigation/NavigationContext";

const EXTRA_PATHS = [
  { name: "Communicating Under Pressure", progress: 0, modules: 4, color: "teal" },
  { name: "Energy Management 101", progress: 0, modules: 5, color: "amber" },
  { name: "Building Psychological Safety", progress: 0, modules: 6, color: "indigo" },
];

export const LibraryPage = () => {
  const { navigate } = useNavigation();

  const openPath = (path) => {
    const moduleIds = PATH_MODULES[path.name];
    if (!moduleIds) return; // no wired-up modules for this mock path yet
    const nextModuleId = moduleIds.find((id) => MODULES[id]?.progress < 100) || moduleIds[0];
    navigate("moduleDetails", { moduleId: nextModuleId });
  };

  return (
    <EmptyPagePlaceholder title="Learning Library" desc="Explore every course path at your own pace.">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...LEARNING_PATHS, ...EXTRA_PATHS].map((p) => {
          const hasModules = !!PATH_MODULES[p.name];
          return (
            <Card key={p.name} className="flex flex-col">
              <div className={`w-10 h-10 rounded-lg bg-${p.color}-50 flex items-center justify-center mb-4`}><BookOpen className={`w-5 h-5 text-${p.color}-600`} /></div>
              <p className="font-semibold text-slate-900 text-sm mb-1">{p.name}</p>
              <p className="text-xs text-slate-500 mb-4">{p.modules} modules</p>
              <ProgressBar value={p.progress} color={p.color} className="mb-2" />
              <p className="text-xs text-slate-400 mb-4">{p.progress}% complete</p>
              <Button
                size="sm"
                variant={p.progress > 0 ? "primary" : "outline"}
                className="mt-auto"
                disabled={!hasModules}
                onClick={() => openPath(p)}
              >
                {p.progress > 0 ? "Continue" : "Start Path"}
              </Button>
            </Card>
          );
        })}
      </div>
    </EmptyPagePlaceholder>
  );
};
