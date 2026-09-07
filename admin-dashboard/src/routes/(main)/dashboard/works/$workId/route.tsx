import { useEffect, useMemo, useState } from "react";

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Decision } from "@/lib/mplads-schema";

import { type AiPrompt, ContextualAI } from "./-components/contextual-ai";
import { DecisionBar } from "./-components/decision-bar";
import { DossierActivity } from "./-components/dossier-activity";
import { DossierAnomalies } from "./-components/dossier-anomalies";
import {
  DOSSIER_TABS,
  type DossierSearch,
  type DossierTab,
  decisionActivity,
  type EvidenceView,
  getDossier,
  loadDecision,
  milestonesFor,
  parseEvidenceView,
  parseTab,
  spendSeries,
  tabLabel,
} from "./-components/dossier-data";
import { DossierEvidence } from "./-components/dossier-evidence";
import { DossierFinancials } from "./-components/dossier-financials";
import { DossierHeader } from "./-components/dossier-header";
import { DossierOverview } from "./-components/dossier-overview";
import { DossierProgress } from "./-components/dossier-progress";

const AI_TABS: DossierTab[] = ["anomalies", "evidence", "activity"];

export const Route = createFileRoute("/(main)/dashboard/works/$workId")({
  validateSearch: (search: Record<string, unknown>): DossierSearch => ({
    tab: parseTab(search.tab),
    view: parseEvidenceView(search.view),
  }),
  component: Page,
});

function Page() {
  const { workId } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [decision, setDecision] = useState<Decision | undefined>(() => loadDecision(workId));
  const [aiPrompt, setAiPrompt] = useState<AiPrompt | null>(null);

  const dossier = useMemo(() => getDossier(workId), [workId]);

  useEffect(() => {
    setDecision(loadDecision(workId));
    setAiPrompt(null);
  }, [workId]);

  function patchSearch(patch: Partial<DossierSearch>) {
    void navigate({ from: Route.fullPath, search: (previous) => ({ ...previous, ...patch }), replace: true });
  }

  function goTab(tab: DossierTab) {
    patchSearch({ tab });
  }

  function goView(view: EvidenceView) {
    patchSearch({ view });
  }

  if (!dossier) {
    return (
      <div className="flex flex-col gap-4 py-4" data-content-padding="false">
        <Breadcrumb className="px-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link
                className="hover:underline"
                to="/dashboard/works"
                search={{ lens: "all", state: "", district: "", type: "", q: "" }}
              >
                Works
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Not found</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="px-4 md:px-6">
          <Empty>
            <EmptyHeader>
              <EmptyTitle>Work not found</EmptyTitle>
              <EmptyDescription>No work matches #{workId} in the demo dataset.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button
                nativeButton={false}
                render={
                  <Link to="/dashboard/works" search={{ lens: "all", state: "", district: "", type: "", q: "" }} />
                }
                size="sm"
              >
                Back to works
              </Button>
            </EmptyContent>
          </Empty>
        </div>
      </div>
    );
  }

  const { work, flags, evidence, activity, stallDays, utilisationPct } = dossier;
  const topFlag = flags[0];
  const { data: series, peerLabel } = spendSeries(work, topFlag?.peerMedianLakh ?? null);
  const milestones = milestonesFor(work);
  const severity = topFlag ? topFlag.severity : "clear";
  const activityItems = (decision ? [decisionActivity(decision), ...activity] : activity).sort((a, b) =>
    a.at < b.at ? 1 : -1,
  );

  return (
    <div className="flex flex-col gap-4 py-4" data-content-padding="false">
      <Breadcrumb className="px-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link
              className="hover:underline"
              to="/dashboard/works"
              search={{ lens: "all", state: "", district: "", type: "", q: "" }}
            >
              Works
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span>{work.district}</span>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <span className="font-mono">#{work.id}</span>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Dossier</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <DossierHeader work={work} severity={severity} decision={decision} stallDays={stallDays} />

      <Tabs className="min-h-0 flex-1 gap-0" value={search.tab} onValueChange={(value) => goTab(value as DossierTab)}>
        <div className="scrollbar-none touch-pan-x overflow-x-auto overscroll-x-contain border-y">
          <TabsList
            className="w-max min-w-full justify-start gap-4 px-4 *:data-[slot=tabs-trigger]:flex-none"
            variant="line"
          >
            {DOSSIER_TABS.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tabLabel(tab)}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="px-4 md:px-6">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_auto]">
            <div className="min-w-0">
              <TabsContent value="overview">
                <DossierOverview
                  work={work}
                  decision={decision}
                  stallDays={stallDays}
                  utilisationPct={utilisationPct}
                />
              </TabsContent>
              <TabsContent value="financials">
                <DossierFinancials work={work} series={series} peerLabel={peerLabel} utilisationPct={utilisationPct} />
              </TabsContent>
              <TabsContent value="progress">
                <DossierProgress work={work} milestones={milestones} stallDays={stallDays} />
              </TabsContent>
              <TabsContent value="anomalies">
                <DossierAnomalies
                  work={work}
                  flags={flags}
                  onGoTab={goTab}
                  onAskAI={(question, flag) => {
                    goTab("anomalies");
                    setAiPrompt({ id: Date.now(), question, flag });
                  }}
                />
              </TabsContent>
              <TabsContent value="evidence">
                <DossierEvidence workId={work.id} evidence={evidence} view={search.view} onViewChange={goView} />
              </TabsContent>
              <TabsContent value="activity">
                <DossierActivity items={activityItems} />
              </TabsContent>
            </div>
            {AI_TABS.includes(search.tab) && (
              <div className="py-4">
                <ContextualAI
                  work={work}
                  flags={flags}
                  evidenceCount={evidence.length}
                  stallDays={stallDays}
                  prompt={aiPrompt}
                  onPromptConsumed={() => setAiPrompt(null)}
                />
              </div>
            )}
          </div>
        </div>
      </Tabs>

      <DecisionBar key={workId} workId={work.id} decision={decision} onDecided={setDecision} />
    </div>
  );
}
