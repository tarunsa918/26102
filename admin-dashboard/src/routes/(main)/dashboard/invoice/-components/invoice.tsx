import { FormProvider, useForm, useWatch } from "react-hook-form";

import { defaultUCValues, type UCFormValues } from "./data";
import { InvoiceForm } from "./invoice-form";
import { InvoicePreview } from "./invoice-preview";

export function Invoice() {
  const form = useForm<UCFormValues>({
    defaultValues: defaultUCValues,
  });
  const invoice = useWatch({ control: form.control }) as UCFormValues;

  return (
    <FormProvider {...form}>
      <form className="grid gap-5 xl:grid-cols-2" noValidate onSubmit={(event) => event.preventDefault()}>
        <InvoiceForm />
        <InvoicePreview invoice={invoice} />
      </form>
    </FormProvider>
  );
}
