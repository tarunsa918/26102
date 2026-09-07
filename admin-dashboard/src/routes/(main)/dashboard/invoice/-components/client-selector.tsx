import { cn } from "cn";
import { Controller, useFormContext, useWatch } from "react-hook-form";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getInitials } from "@/lib/utils";

import { type UCFormValues, ucWorks, valuesForWork } from "./data";

export function WorkSelector() {
  const { control, reset } = useFormContext<UCFormValues>();
  const workId = useWatch({ control, name: "workId" });
  const selected = ucWorks.find((option) => option.id === workId) ?? ucWorks[0];

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-medium tracking-tight">Work</h2>
        <Badge
          className={cn(
            "rounded-sm border font-medium",
            selected.ucStatus === "pending"
              ? "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300"
              : "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
          )}
          variant="outline"
        >
          UC {selected.ucStatus === "pending" ? "pending" : "received"}
        </Badge>
      </div>

      <Controller
        control={control}
        name="workId"
        render={({ field }) => {
          const selectedClient = ucWorks.find((option) => option.id === field.value) ?? ucWorks[0];

          return (
            <Field className="gap-1">
              <FieldLabel className="text-xs">Work</FieldLabel>
              <Select
                value={selectedClient.id}
                onValueChange={(nextWorkId) => {
                  if (!nextWorkId) {
                    return;
                  }
                  field.onChange(nextWorkId);
                  reset(valuesForWork(nextWorkId));
                }}
              >
                <SelectTrigger className="w-full data-[size=default]:h-auto">
                  <SelectValue placeholder="Select work">
                    <div className="flex items-center gap-1.5">
                      <Avatar className="after:rounded-md">
                        <AvatarFallback className="rounded-md bg-card text-foreground">
                          {getInitials(selectedClient.title).slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="text-left text-xs">
                        <div>
                          {selectedClient.id} — {selectedClient.title}
                        </div>
                        <div className="text-muted-foreground">
                          {selectedClient.district}, {selectedClient.state}
                        </div>
                      </div>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent align="start" alignItemWithTrigger={false}>
                  <SelectGroup>
                    {ucWorks.map((clientOption) => (
                      <SelectItem key={clientOption.id} value={clientOption.id}>
                        {clientOption.id} — {clientOption.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          );
        }}
      />
    </section>
  );
}
