import { BadgeCheck, Copy, Ellipsis, Link2, Printer } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import { formatWorkDate, stallLabel } from "@/lib/mplads-mock";
import type { Decision, Severity, Work } from "@/lib/mplads-schema";

import { DECISION_META, SEVERITY_DOT, SEVERITY_STYLES, TYPE_ICONS, TYPE_LABELS } from "./dossier-data";

interface DossierHeaderProps {
  work: Work;
  severity: Severity | "clear";
  decision: Decision | undefined;
  stallDays: number;
}

async function copyText(value: string, title: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(value);
    toast.add({ title });
  } catch {
    toast.add({ title: "Copy failed", description: "Select the text manually." });
  }
}

export function DossierHeader({ work, severity, decision, stallDays }: DossierHeaderProps) {
  const Icon = TYPE_ICONS[work.type];
  const stalled = work.status === "stalled";

  return (
    <div className="flex flex-col gap-5 px-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <div className="grid size-16 shrink-0 place-items-center rounded-xl border bg-muted text-muted-foreground">
          <Icon aria-hidden="true" className="size-8" />
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-col gap-0.5">
            <h1 className="truncate font-heading font-semibold text-xl leading-6 tracking-tight sm:text-2xl sm:leading-7">
              {work.title}
            </h1>
            <p className="truncate font-mono text-muted-foreground text-sm leading-5">
              #{work.id} · {work.agency} · {work.district}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              className={`gap-1.5 rounded-sm border font-medium capitalize ${SEVERITY_STYLES[severity]}`}
              variant="outline"
            >
              <span className={`size-1.5 rounded-full ${SEVERITY_DOT[severity]}`} />
              {severity === "clear" ? "No open flags" : `${severity} risk`}
            </Badge>
            {decision ? (
              <Badge
                className="gap-1.5 rounded-sm border border-emerald-600/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                variant="outline"
              >
                <span className={`size-1.5 rounded-full ${DECISION_META[decision.status].dot}`} />
                {DECISION_META[decision.status].label}
              </Badge>
            ) : (
              <Badge className="rounded-sm" variant="outline">
                Needs review
              </Badge>
            )}
            <Badge className="rounded-sm" variant="outline">
              {TYPE_LABELS[work.type]}
            </Badge>
            {stalled && (
              <Badge className="rounded-sm border-destructive/20 bg-destructive/10 text-destructive" variant="outline">
                Stalled · {stallDays}d
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => void copyText(work.id, `Copied ${work.id}`)}>
          <Copy data-icon="inline-start" />
          Copy ID
        </Button>
        <Button size="sm" variant="outline" onClick={() => window.print()}>
          <Printer data-icon="inline-start" />
          Export
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button aria-label="More dossier actions" size="icon-sm" variant="outline" />}>
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuItem
                onSelect={() =>
                  void copyText(`${window.location.origin}/dashboard/works/${work.id}`, "Dossier link copied")
                }
              >
                <Link2 />
                Copy dossier link
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() =>
                  toast.add({
                    title: "Case context",
                    description: `Sanctioned ${formatWorkDate(work.sanctionDate)} · due ${formatWorkDate(work.dueDate)} · updated ${stallLabel(work.lastUpdate)}.`,
                  })
                }
              >
                <BadgeCheck />
                Case context
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
