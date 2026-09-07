import { useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import type { OfficerRole } from "@/lib/mplads-schema";
import { OFFICER_ROLES, parseRole, roleLabel, useRoleStore } from "@/stores/role/role-store";

export function RoleSwitcher({ initialRole }: { readonly initialRole: OfficerRole }) {
  const role = useRoleStore((state) => state.role);
  const hydrate = useRoleStore((state) => state.hydrate);
  const setRole = useRoleStore((state) => state.setRole);

  useEffect(() => {
    hydrate(initialRole);
  }, [hydrate, initialRole]);

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline">{roleLabel(role).split(" — ")[0]}</Badge>
      <Select
        value={role}
        items={OFFICER_ROLES.map((entry) => ({ value: entry.value, label: entry.label }))}
        onValueChange={(value) => {
          if (!value) {
            return;
          }
          const next = parseRole(value);
          setRole(next);
          toast.add({ title: `Viewing as ${roleLabel(next)}` });
        }}
      >
        <SelectTrigger size="sm" className="w-36" aria-label="Switch officer role">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {OFFICER_ROLES.map((entry) => (
              <SelectItem key={entry.value} value={entry.value}>
                {entry.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
