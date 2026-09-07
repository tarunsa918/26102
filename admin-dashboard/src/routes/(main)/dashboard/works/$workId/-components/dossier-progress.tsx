import { TriangleAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import type { Work } from "@/lib/mplads-schema";

import type { Milestone } from "./dossier-data";

interface DossierProgressProps {
  work: Work;
  milestones: Milestone[];
  stallDays: number;
}

export function DossierProgress({ work, milestones, stallDays }: DossierProgressProps) {
  if (work.status === "sanctioned") {
    return (
      <div className="py-4">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No physical progress yet</EmptyTitle>
            <EmptyDescription>Sanctioned work — execution milestones appear after the first release.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      {stallDays >= 90 && (
        <Alert className="border-amber-600/20 bg-amber-500/10 text-amber-900 dark:text-amber-200">
          <TriangleAlert />
          <AlertTitle>No update in {stallDays} days</AlertTitle>
          <AlertDescription>Field reports are expected fortnightly for works in execution.</AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="font-normal">Execution milestones</CardTitle>
          <CardDescription>Planned vs actual completion · {work.progressPct}% overall</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {milestones.map((milestone) => {
            const behind = milestone.actualPct < milestone.plannedPct;
            return (
              <div key={milestone.name} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-medium text-sm">{milestone.name}</p>
                  <p className="text-muted-foreground text-xs">
                    due {milestone.dueLabel} · <span className="tabular-nums">{milestone.actualPct}%</span>
                  </p>
                </div>
                <div
                  className="relative h-2.5 rounded-full bg-muted"
                  role="img"
                  aria-label={`${milestone.name}: ${milestone.actualPct}% complete, ${milestone.plannedPct}% planned`}
                >
                  <div
                    className={`h-full rounded-full ${behind ? "bg-amber-500" : "bg-emerald-500"}`}
                    style={{ width: `${milestone.actualPct}%` }}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute top-[-3px] h-[18px] w-0.5 rounded-full bg-foreground/60"
                    style={{ left: `calc(${milestone.plannedPct}% - 1px)` }}
                  />
                </div>
                <p className="text-muted-foreground text-xs">
                  Planned {milestone.plannedPct}% · actual {milestone.actualPct}%
                  {behind ? " · behind schedule" : " · on track"}
                </p>
              </div>
            );
          })}
          <p className="text-muted-foreground text-xs">Marker shows planned completion; fill shows reported actuals.</p>
        </CardContent>
      </Card>
    </div>
  );
}
