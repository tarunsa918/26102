import { createFileRoute, Outlet } from "@tanstack/react-router";

import type { Lens } from "./-components/data";

const LENSES: Lens[] = ["all", "needs-review", "high-risk"];

function parseLens(value: unknown): Lens {
  return LENSES.includes(value as Lens) ? (value as Lens) : "all";
}

function parseText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export const Route = createFileRoute("/(main)/dashboard/works")({
  validateSearch: (search: Record<string, unknown>) => ({
    lens: parseLens(search.lens),
    state: parseText(search.state),
    district: parseText(search.district),
    type: parseText(search.type),
    q: parseText(search.q),
  }),
  component: Layout,
});

function Layout() {
  return <Outlet />;
}
