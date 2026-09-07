import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import type { Activity } from "@/lib/mplads-schema";

import { initialsOf, relativeDay } from "./dossier-data";

export function DossierActivity({ items }: { items: Activity[] }) {
  if (items.length === 0) {
    return (
      <div className="py-4">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No activity yet</EmptyTitle>
            <EmptyDescription>Flags, notes, and decisions will appear here.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="py-4">
      <ol className="divide-y">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3 py-3">
            <Avatar size="sm" className="mt-0.5 shrink-0">
              <AvatarFallback className="text-xs">{initialsOf(item.actor)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium text-sm">{item.action}</p>
              <p className="text-muted-foreground text-xs">
                {item.actor} · {relativeDay(item.at)}
              </p>
              {item.note && <p className="mt-1 text-muted-foreground text-sm">{item.note}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
