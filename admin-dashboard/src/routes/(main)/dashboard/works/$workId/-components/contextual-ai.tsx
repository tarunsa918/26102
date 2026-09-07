import { useEffect, useState } from "react";

import { cn } from "cn";
import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { compareSentence, formatLakh } from "@/lib/mplads-mock";
import type { Anomaly, Work } from "@/lib/mplads-schema";

export interface AiPrompt {
  id: number;
  question: string;
  flag: Anomaly | undefined;
}

interface AiMessage {
  id: number;
  role: "user" | "assistant";
  text: string;
}

const CHIPS = ["Why was this flagged?", "Compare with peers", "What's missing?"] as const;

interface ContextualAIProps {
  work: Work;
  flags: Anomaly[];
  evidenceCount: number;
  stallDays: number;
  prompt: AiPrompt | null;
  onPromptConsumed: () => void;
}

function answerFor(
  question: string,
  flag: Anomaly | undefined,
  context: Omit<ContextualAIProps, "prompt" | "onPromptConsumed">,
): string {
  const { work, flags, evidenceCount, stallDays } = context;
  const top = flag ?? flags[0];
  if (question === "Compare with peers") {
    if (top?.actualLakh != null && top?.peerMedianLakh != null) {
      const ratio = top.peerMedianLakh > 0 ? (top.actualLakh / top.peerMedianLakh).toFixed(1) : "—";
      return `Peer picture: ${top.peerN} similar ${work.type} works in ${work.district}. Median ${formatLakh(top.peerMedianLakh)} vs this work ${formatLakh(top.actualLakh)} — ${ratio}× the median. ${top.corroboration}`;
    }
    return top
      ? `${top.headline}. ${top.corroboration}`
      : "No peer comparison available for this work in the demo dataset.";
  }
  if (question === "What's missing?") {
    return [
      "To close this review you still need:",
      `— Utilisation certificate for the last tranche (${evidenceCount} file(s) attached so far)`,
      `— Fresh field report (last update ${stallDays}d ago; fortnightly expected)`,
      "— Joint site check if the duplicate-scope flag stays open",
    ].join("\n");
  }
  if (!top) {
    return "No open flags on this work — nothing to explain in the demo dataset.";
  }
  if (top.actualLakh !== null && top.peerMedianLakh !== null) {
    return `${compareSentence(top.actualLakh, top.peerMedianLakh, top.peerN, work.type, work.district)}. ${top.corroboration}`;
  }
  return `${top.headline}. ${top.corroboration}`;
}

function AiPanel({ work, flags, evidenceCount, stallDays, prompt, onPromptConsumed }: ContextualAIProps) {
  const top = flags[0];
  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: 0,
      role: "assistant",
      text: top
        ? `Reviewing #${work.id}: ${top.headline}. Ask me why, how it compares, or what is missing.`
        : `Reviewing #${work.id}: no open flags in the demo dataset.`,
    },
  ]);

  useEffect(() => {
    if (!prompt) {
      return;
    }
    const context = { work, flags, evidenceCount, stallDays };
    const reply: AiMessage = {
      id: prompt.id + 1,
      role: "assistant",
      text: answerFor(prompt.question, prompt.flag, context),
    };
    setMessages((current) => [...current, { id: prompt.id, role: "user", text: prompt.question }, reply]);
    onPromptConsumed();
  }, [prompt, work, flags, evidenceCount, stallDays, onPromptConsumed]);

  function ask(question: string) {
    const context = { work, flags, evidenceCount, stallDays };
    const id = Date.now();
    setMessages((current) => [
      ...current,
      { id, role: "user", text: question },
      { id: id + 1, role: "assistant", text: answerFor(question, undefined, context) },
    ]);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "rounded-lg px-3 py-2 text-sm",
              message.role === "user"
                ? "self-end bg-primary text-primary-foreground"
                : "whitespace-pre-wrap bg-muted/60",
            )}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {CHIPS.map((chip) => (
          <Badge
            key={chip}
            variant="outline"
            className="cursor-pointer hover:bg-muted"
            onClick={() => ask(chip)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                ask(chip);
              }
            }}
          >
            {chip}
          </Badge>
        ))}
      </div>
      <p className="text-muted-foreground text-xs">
        Scripted demo answers from dossier data — full copilot ships in SPEC 05.
      </p>
    </div>
  );
}

export function ContextualAI(props: ContextualAIProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <aside className="hidden w-80 shrink-0 xl:block">
        <Card className="flex h-[32rem] flex-col xl:sticky xl:top-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Sparkles aria-hidden="true" className="size-4" />
              Case assistant
            </CardTitle>
            <CardDescription>#{props.work.id} · scripted demo</CardDescription>
          </CardHeader>
          <CardContent className="flex min-h-0 flex-1 flex-col">
            <AiPanel {...props} />
          </CardContent>
        </Card>
      </aside>

      <Button className="fixed right-4 bottom-20 z-40 shadow-lg xl:hidden" size="sm" onClick={() => setSheetOpen(true)}>
        <Sparkles data-icon="inline-start" />
        Ask AI
      </Button>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Case assistant</SheetTitle>
            <SheetDescription>#{props.work.id} · scripted demo</SheetDescription>
          </SheetHeader>
          <div className="flex min-h-0 flex-1 flex-col px-4 pb-4">
            <AiPanel {...props} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
