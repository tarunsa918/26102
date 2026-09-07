import { create } from "zustand";

import { type OfficerRole, officerRoleSchema } from "@/lib/mplads-schema";
import { setValueToCookie } from "@/server/server-actions";

export const ROLE_COOKIE_KEY = "mplads_role";

const ROLE_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export const OFFICER_ROLES: ReadonlyArray<{ readonly value: OfficerRole; readonly label: string }> = [
  { value: "district", label: "District — Bhopal" },
  { value: "state", label: "State — MP" },
  { value: "ministry", label: "Ministry — All states" },
];

export function parseRole(value: unknown): OfficerRole {
  const parsed = officerRoleSchema.safeParse(value);
  return parsed.success ? parsed.data : "ministry";
}

export function roleLabel(role: OfficerRole): string {
  return OFFICER_ROLES.find((entry) => entry.value === role)?.label ?? "Ministry — All states";
}

type RoleState = {
  role: OfficerRole;
  hydrate: (role: OfficerRole) => void;
  setRole: (role: OfficerRole) => void;
};

export const useRoleStore = create<RoleState>()((set) => ({
  role: "ministry",
  hydrate: (role) => set({ role }),
  setRole: (role) => {
    set({ role });
    void setValueToCookie(ROLE_COOKIE_KEY, role, { path: "/", maxAge: ROLE_COOKIE_MAX_AGE });
  },
}));
