import { createFileRoute } from "@tanstack/react-router";

import { Invoice } from "./-components/invoice";

export const Route = createFileRoute("/(main)/dashboard/invoice")({
  component: Page,
});

function Page() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-medium text-3xl leading-none tracking-tight">UC tracking</h1>
          <p className="text-muted-foreground text-sm">
            Which utilisation certificates are pending? Select a work and review its certificate.
          </p>
        </div>
      </div>

      <Invoice />
    </div>
  );
}
