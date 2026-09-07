import { Separator } from "@/components/ui/separator";

import { WorkSelector } from "./client-selector";
import { InvoiceDetails } from "./invoice-details";
import { InvoiceItems } from "./invoice-items";

export function InvoiceForm() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-4">
      <WorkSelector />

      <Separator />

      <InvoiceDetails />

      <Separator />

      <InvoiceItems />
    </div>
  );
}
