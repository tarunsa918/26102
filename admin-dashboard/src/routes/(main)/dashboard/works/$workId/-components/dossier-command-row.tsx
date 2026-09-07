import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatWorkDate } from "@/lib/mplads-mock";
import type { Work } from "@/lib/mplads-schema";

import { tenderScheduleLabel } from "./dossier-data";
import { WorkLocationMap } from "./work-location-map";

interface DossierCommandRowProps {
  work: Work;
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="text-right text-sm">{value}</span>
    </div>
  );
}

export function DossierCommandRow({ work }: DossierCommandRowProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-12">
      <div className="xl:col-span-7">
        <WorkLocationMap work={work} />
      </div>
      <Card className="xl:col-span-5">
        <CardHeader>
          <CardTitle className="font-normal">Tender & schedule</CardTitle>
          <CardDescription>{tenderScheduleLabel(work)}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col divide-y">
          <Fact label="Tender holder" value={work.tenderHolder} />
          <Fact label="Awarded by" value={work.tenderAwardedBy} />
          <Fact label="Department" value={work.department} />
          <Fact label="Labour on site" value={`${work.labourDeployed} workers`} />
          <Fact label="Created" value={formatWorkDate(work.sanctionDate)} />
          <Fact label="Due" value={formatWorkDate(work.dueDate)} />
        </CardContent>
      </Card>
    </div>
  );
}
