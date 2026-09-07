import { useState } from "react";

import { Link } from "@tanstack/react-router";

import { ClipboardList, Flame, Landmark, LayoutGrid, Map as MapIcon, MapPin, Star, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { toast } from "@/components/ui/toast";

const queueSearch = { lens: "all", state: "", district: "", type: "", q: "" } as const;

const shortcuts = [
  { id: 1, label: "All works", icon: LayoutGrid, to: "/dashboard/works", search: queueSearch },
  {
    id: 2,
    label: "Needs review",
    icon: ClipboardList,
    to: "/dashboard/works",
    search: { ...queueSearch, lens: "needs-review" },
  },
  {
    id: 3,
    label: "High-risk",
    icon: Flame,
    to: "/dashboard/works",
    search: { ...queueSearch, lens: "high-risk" },
  },
  {
    id: 4,
    label: "Flagship W-1014",
    icon: Star,
    to: "/dashboard/works/$workId",
    params: { workId: "W-1014" },
    search: { tab: "overview", view: "grid", lens: "all", state: "", district: "", type: "", q: "" },
  },
  { id: 5, label: "Overview", icon: MapIcon, to: "/dashboard/overview", search: undefined },
  {
    id: 6,
    label: "Bhopal works",
    icon: MapPin,
    to: "/dashboard/works",
    search: { ...queueSearch, state: "Madhya Pradesh", district: "Bhopal" },
  },
  {
    id: 7,
    label: "Assam works",
    icon: Wallet,
    to: "/dashboard/works",
    search: { ...queueSearch, state: "Assam" },
  },
  {
    id: 8,
    label: "Rajasthan works",
    icon: Landmark,
    to: "/dashboard/works",
    search: { ...queueSearch, state: "Rajasthan" },
  },
] as const;

function shortcutLink(shortcut: (typeof shortcuts)[number]) {
  if ("params" in shortcut) {
    return <Link to={shortcut.to} params={shortcut.params} search={shortcut.search} aria-label={shortcut.label} />;
  }
  if (shortcut.search) {
    return <Link to={shortcut.to} search={shortcut.search} aria-label={shortcut.label} />;
  }
  return <Link to={shortcut.to} aria-label={shortcut.label} />;
}

export function QuickActions() {
  const [amount, setAmount] = useState("");

  const sendNote = () => {
    const value = Number(amount);
    if (!amount.trim() || Number.isNaN(value) || value <= 0) {
      toast.add({ title: "Enter an amount", description: "Type a release amount in lakh first (demo only)." });
      return;
    }
    toast.add({
      title: "Demo only — no transfer made",
      description: `₹${value.toFixed(1)}L noted. Real releases are recorded in eSAKSHI, not here.`,
    });
    setAmount("");
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-normal">Quick Transfer</CardTitle>
        </CardHeader>
        <CardContent>
          <Field orientation="horizontal">
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>₹</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                inputMode="decimal"
                placeholder="0.0"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                aria-label="Release amount in lakh"
              />
              <InputGroupAddon align="inline-end">
                <InputGroupText>Lakh</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <Button onClick={sendNote}>Send</Button>
          </Field>
          <p className="pt-2 text-muted-foreground text-xs">Demo only — no money moves here.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-normal">Scheme shortcuts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {shortcuts.map((shortcut) => {
              const Icon = shortcut.icon;
              return (
                <div key={shortcut.id} className="flex flex-col items-center gap-2.5">
                  <Button
                    variant="outline"
                    className="size-12 rounded-full [&_a]:flex [&_a]:size-full [&_a]:items-center [&_a]:justify-center"
                    nativeButton={false}
                    render={shortcutLink(shortcut)}
                  >
                    <Icon className="size-5" />
                  </Button>
                  <span className="text-center text-muted-foreground text-xs">{shortcut.label}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
