import { createFileRoute } from "@tanstack/react-router";

import { tasks } from "./-components/data";
import { Tasks } from "./-components/tasks";

export const Route = createFileRoute("/(main)/dashboard/tasks")({
  component: Page,
});

function Page() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-3xl tracking-tight">Field verification queue</h2>
        <p className="text-muted-foreground">Flagged works that need a field visit — what must I inspect?</p>
      </div>
      <Tasks data={tasks} />
    </div>
  );
}
