import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Decision } from "@/lib/mplads-schema";

import { DECISION_META, type DecisionStatus, saveDecision } from "./dossier-data";

const NOTE_PLACEHOLDERS: Record<DecisionStatus, string> = {
  "action-required": "What action is required, and by whom?",
  dismissed: "Why is this flag not applicable?",
  verified: "What did you verify? (e.g. estimate checked against peers)",
};

interface DecisionBarProps {
  workId: string;
  decision: Decision | undefined;
  onDecided: (decision: Decision) => void;
}

export function DecisionBar({ workId, decision, onDecided }: DecisionBarProps) {
  const [status, setStatus] = useState<DecisionStatus>(decision?.status ?? "verified");
  const [note, setNote] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  function recordDecision() {
    const recorded: Decision = {
      workId,
      status,
      note,
      at: new Date().toISOString(),
      by: "District Officer (demo)",
    };
    saveDecision(recorded);
    onDecided(recorded);
    setConfirmOpen(false);
    toast.add({ title: `Recorded as ${DECISION_META[status].label}`, description: "Written to the activity log." });
  }

  return (
    <>
      <div className="sticky bottom-0 border-t bg-background/95 px-4 py-3 backdrop-blur">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <span id="decision-status-label" className="font-medium text-sm">
              Officer decision
            </span>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <ToggleGroup
                variant="outline"
                size="sm"
                spacing={2}
                value={[status]}
                aria-labelledby="decision-status-label"
              >
                {(Object.keys(DECISION_META) as DecisionStatus[]).map((option) => (
                  <ToggleGroupItem key={option} value={option} onClick={() => setStatus(option)}>
                    <span aria-hidden="true" className={`size-1.5 rounded-full ${DECISION_META[option].dot}`} />
                    {DECISION_META[option].label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <Textarea
                className="min-h-16 flex-1"
                placeholder={NOTE_PLACEHOLDERS[status]}
                aria-label="Decision note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
            </div>
          </div>
          <Button className="shrink-0" onClick={() => setConfirmOpen(true)}>
            Submit decision
          </Button>
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Record as {DECISION_META[status].label}?</AlertDialogTitle>
            <AlertDialogDescription>This writes to the activity log.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={recordDecision}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
