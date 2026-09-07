import { anomalies, compareSentence, FLAGSHIP_WORK_ID, works } from "@/lib/mplads-mock";
import type { Anomaly, OfficerRole, Work } from "@/lib/mplads-schema";

const SEVERITY_RANK: Record<Anomaly["severity"], number> = { high: 0, medium: 1, low: 2 };

export function scopeWorks(role: OfficerRole): Work[] {
  if (role === "district") {
    return works.filter((work) => work.district === "Bhopal");
  }
  if (role === "state") {
    return works.filter((work) => work.state === "Madhya Pradesh");
  }
  return works;
}

export interface QueueRow {
  work: Work;
  anomaly: Anomaly;
  reason: string;
}

function reasonFor(work: Work, anomaly: Anomaly): string {
  if (anomaly.actualLakh !== null && anomaly.peerMedianLakh !== null) {
    return compareSentence(anomaly.actualLakh, anomaly.peerMedianLakh, anomaly.peerN, work.type, work.district);
  }
  return anomaly.headline;
}

function amountOf(work: Work, anomaly: Anomaly): number {
  return anomaly.actualLakh ?? work.sanctionedLakh;
}

export function topQueue(scoped: Work[]): QueueRow[] {
  const byId = new Map(scoped.map((work) => [work.id, work]));
  return anomalies
    .flatMap((anomaly) => {
      const work = byId.get(anomaly.workId);
      return work ? [{ work, anomaly, reason: reasonFor(work, anomaly) }] : [];
    })
    .sort((a, b) => {
      if (a.work.id === FLAGSHIP_WORK_ID) {
        return -1;
      }
      if (b.work.id === FLAGSHIP_WORK_ID) {
        return 1;
      }
      return (
        SEVERITY_RANK[a.anomaly.severity] - SEVERITY_RANK[b.anomaly.severity] ||
        amountOf(b.work, b.anomaly) - amountOf(a.work, a.anomaly)
      );
    })
    .slice(0, 8);
}

export interface StateSlice {
  state: string;
  works: number;
  high: number;
}

export function scopedGeo(scoped: Work[]): StateSlice[] {
  const highByWork = new Set(anomalies.filter((a) => a.severity === "high").map((a) => a.workId));
  const byState = new Map<string, StateSlice>();
  for (const work of scoped) {
    const entry = byState.get(work.state) ?? { state: work.state, works: 0, high: 0 };
    entry.works += 1;
    if (highByWork.has(work.id)) {
      entry.high += 1;
    }
    byState.set(work.state, entry);
  }
  return [...byState.values()].sort((a, b) => a.state.localeCompare(b.state));
}

export function getOverviewData(role: OfficerRole, selectedState: string): { queue: QueueRow[]; geo: StateSlice[] } {
  const scoped = scopeWorks(role);
  const inScope = selectedState && scoped.some((work) => work.state === selectedState) ? selectedState : "";
  const visible = inScope ? scoped.filter((work) => work.state === inScope) : scoped;
  return { queue: topQueue(visible), geo: scopedGeo(scoped) };
}
