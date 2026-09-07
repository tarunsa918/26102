import { useState } from "react";

import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { useRoleStore } from "@/stores/role/role-store";

import { buildWorksRows, filterByLens, type Lens, lensCounts } from "./-components/data";
import { type WorksSearch, WorksTable } from "./-components/table";

const LENSES: Lens[] = ["all", "needs-review", "high-risk"];

function parseLens(value: unknown): Lens {
  return LENSES.includes(value as Lens) ? (value as Lens) : "all";
}

function parseText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export const Route = createFileRoute("/(main)/dashboard/works/")({
  validateSearch: (search: Record<string, unknown>): WorksSearch => ({
    lens: parseLens(search.lens),
    state: parseText(search.state),
    district: parseText(search.district),
    type: parseText(search.type),
    q: parseText(search.q),
  }),
  component: Page,
});

function Page() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const role = useRoleStore((store) => store.role);
  const [resetKey, setResetKey] = useState(0);

  const scoped = buildWorksRows(role);
  const counts = lensCounts(scoped);
  const rows = filterByLens(scoped, search.lens);

  function patchSearch(patch: Partial<WorksSearch>) {
    void navigate({ from: Route.fullPath, search: (previous) => ({ ...previous, ...patch }), replace: true });
  }

  function resetAll() {
    setResetKey((key) => key + 1);
    void navigate({
      from: Route.fullPath,
      search: { lens: "all", state: "", district: "", type: "", q: "" },
      replace: true,
    });
  }

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <WorksTable
        data={rows}
        total={scoped.length}
        search={search}
        lensCounts={counts}
        resetKey={resetKey}
        onSearchPatch={patchSearch}
        onResetAll={resetAll}
      />
    </div>
  );
}
