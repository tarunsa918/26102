import { addDays } from "date-fns";

import { anomalies, FLAGSHIP_WORK_ID, works } from "@/lib/mplads-mock";

export type DeadlineKind = "due" | "review" | "milestone";

export interface MpladsCalendarEvent {
  title: string;
  start: Date;
  allDay: boolean;
  url: string;
  extendedProps: { calendar: DeadlineKind; workId: string };
}

function parseDay(yyyyMmDd: string): Date {
  const [y, m, d] = yyyyMmDd.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function dossierUrl(workId: string): string {
  return `/dashboard/works/${workId}?tab=anomalies&view=grid&lens=all&state=&district=&type=&q=`;
}

function dueEvents(): MpladsCalendarEvent[] {
  return works.map((work) => ({
    title: `Due: ${work.id} — ${work.title}`,
    start: parseDay(work.dueDate),
    allDay: true,
    url: dossierUrl(work.id),
    extendedProps: { calendar: "due", workId: work.id },
  }));
}

function reviewEvents(): MpladsCalendarEvent[] {
  const flaggedIds = [...new Set(anomalies.map((anomaly) => anomaly.workId))];
  return flaggedIds
    .map((workId): MpladsCalendarEvent | undefined => {
      const work = works.find((candidate) => candidate.id === workId);
      if (!work) {
        return undefined;
      }
      return {
        title: `Review: ${work.id} 90d check`,
        start: addDays(parseDay(work.lastUpdate), 90),
        allDay: true,
        url: dossierUrl(work.id),
        extendedProps: { calendar: "review", workId: work.id },
      };
    })
    .filter((event): event is MpladsCalendarEvent => Boolean(event));
}

const MILESTONE_NAMES = ["Foundation", "Lintel", "Roofing", "Finishing"];

function flagshipMilestones(): MpladsCalendarEvent[] {
  const flagship = works.find((work) => work.id === FLAGSHIP_WORK_ID);
  if (!flagship) {
    return [];
  }
  const start = parseDay(flagship.sanctionDate).getTime();
  const end = parseDay(flagship.dueDate).getTime();
  const span = Math.max(end - start, 1);
  return MILESTONE_NAMES.map((name, index) => ({
    title: `${name}: ${flagship.id}`,
    start: new Date(start + (span * (index + 1)) / MILESTONE_NAMES.length),
    allDay: true,
    url: dossierUrl(flagship.id),
    extendedProps: { calendar: "milestone", workId: flagship.id },
  }));
}

export const mpladsEvents: MpladsCalendarEvent[] = [...dueEvents(), ...reviewEvents(), ...flagshipMilestones()];
