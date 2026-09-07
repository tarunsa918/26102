import { ArrowDown, ArrowRight, ArrowUp, CheckCircle, Circle, CircleOff, HelpCircle, Timer } from "lucide-react";
import { z } from "zod";

import { anomalies, works } from "@/lib/mplads-mock";
import type { WorkStatus } from "@/lib/mplads-schema";

const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
  dueDate: z.string(),
});

export type Task = z.infer<typeof taskSchema>;

const SEVERITY_RANK: Record<string, number> = { high: 0, medium: 1, low: 2 };

const WORK_STATUS_TO_QUEUE: Record<WorkStatus, string> = {
  sanctioned: "backlog",
  stalled: "todo",
  "in-execution": "in progress",
  completed: "done",
};

function bestFlagFor(workId: string) {
  let best: (typeof anomalies)[number] | undefined;
  for (const anomaly of anomalies) {
    if (anomaly.workId !== workId) {
      continue;
    }
    if (!best || SEVERITY_RANK[anomaly.severity] < SEVERITY_RANK[best.severity]) {
      best = anomaly;
    }
  }
  return best;
}

const verificationRows = works
  .map((work) => ({ work, flag: bestFlagFor(work.id) }))
  .filter((entry): entry is { work: (typeof works)[number]; flag: NonNullable<ReturnType<typeof bestFlagFor>> } =>
    Boolean(entry.flag),
  )
  .map(({ work, flag }) => ({
    id: work.id,
    title: work.title,
    status: WORK_STATUS_TO_QUEUE[work.status],
    label: flag.kind,
    priority: flag.severity,
    dueDate: work.dueDate,
  }))
  .sort((a, b) => SEVERITY_RANK[a.priority] - SEVERITY_RANK[b.priority] || (a.dueDate < b.dueDate ? -1 : 1));

export const tasks = z.array(taskSchema).parse(verificationRows);

export const DOSSIER_ENTRY_SEARCH = {
  tab: "anomalies",
  view: "grid",
  lens: "all",
  state: "",
  district: "",
  type: "",
  q: "",
} as const;

export const labels = [
  {
    value: "cost",
    label: "Cost",
  },
  {
    value: "expenditure",
    label: "Expenditure",
  },
  {
    value: "delay",
    label: "Delay",
  },
  {
    value: "duplicate",
    label: "Duplicate",
  },
  {
    value: "utilisation",
    label: "Utilisation",
  },
];

export const statuses = [
  {
    value: "backlog",
    label: "Backlog",
    icon: HelpCircle,
  },
  {
    value: "todo",
    label: "Todo",
    icon: Circle,
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: Timer,
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircle,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: CircleOff,
  },
];

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDown,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRight,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUp,
  },
];
