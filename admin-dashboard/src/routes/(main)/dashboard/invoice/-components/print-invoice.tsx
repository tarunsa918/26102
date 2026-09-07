import * as React from "react";

import { createPortal } from "react-dom";

import type { UCFormValues } from "./data";
import { InvoicePaper } from "./invoice-paper";

export function PrintInvoice({ invoice }: { invoice: UCFormValues }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div data-print-root>
      <InvoicePaper invoice={invoice} />
    </div>,
    document.body,
  );
}
