import { Link } from "@tanstack/react-router";
import type { Column, ColumnDef } from "@tanstack/react-table";
import { Subscribe } from "@tanstack/react-table";

import { cn } from "cn";
import { differenceInCalendarDays } from "date-fns";
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal, RotateCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import type { DataTableFeatures } from "@/lib/data-table-features";
import { DEMO_TODAY_ISO, formatWorkDate } from "@/lib/mplads-mock";

import { DOSSIER_ENTRY_SEARCH, labels, priorities, statuses, type Task } from "./data";

const statusStyles: Record<string, string> = {
  backlog: "border-muted-foreground/20 bg-muted text-muted-foreground",
  todo: "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  "in progress": "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  done: "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-300",
  canceled: "border-muted-foreground/20 bg-muted text-muted-foreground",
};

function SortIcon({ sortDirection }: { sortDirection: false | "asc" | "desc" }) {
  if (sortDirection === "desc") {
    return <ArrowDown data-icon="inline-end" />;
  }

  if (sortDirection === "asc") {
    return <ArrowUp data-icon="inline-end" />;
  }

  return <ArrowUpDown data-icon="inline-end" />;
}

function TitleColumnHeader({ column }: { column: Column<DataTableFeatures, Task, unknown> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="sm" className="-ml-3 text-muted-foreground data-popup-open:bg-accent" />}
      >
        Title
        <SortIcon sortDirection={column.getIsSorted()} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onSelect={() => column.toggleSorting(false)}>
          <ArrowUp />
          Asc
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => column.toggleSorting(true)}>
          <ArrowDown />
          Desc
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => column.clearSorting()}>
          <RotateCcw />
          Reset
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function parseDay(yyyyMmDd: string): Date {
  const [y, m, d] = yyyyMmDd.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function dueSubline(dueDate: string): string {
  const diff = differenceInCalendarDays(parseDay(DEMO_TODAY_ISO), parseDay(dueDate));
  if (diff > 0) {
    return `overdue ${diff}d`;
  }
  if (diff === 0) {
    return "due today";
  }
  return `in ${Math.abs(diff)}d`;
}

async function copyWorkId(id: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(id);
    toast.add({ title: `Copied ${id}` });
  } catch {
    toast.add({ title: "Copy failed", description: "Select the ID manually." });
  }
}

export const columns: ColumnDef<DataTableFeatures, Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Subscribe source={table.atoms.rowSelection}>
        {() => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={!table.getIsAllPageRowsSelected() && table.getIsSomePageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(value)}
            aria-label="Select all"
            className="translate-y-0.5"
          />
        )}
      </Subscribe>
    ),
    cell: ({ row }) => (
      <Subscribe source={row.table.atoms.rowSelection} selector={(selection) => Boolean(selection?.[row.id])}>
        {(checked) => (
          <Checkbox
            checked={checked}
            onCheckedChange={(value) => row.toggleSelected(value)}
            aria-label="Select row"
            className="translate-y-0.5"
          />
        )}
      </Subscribe>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "Task",
    cell: ({ row }) => <div className="w-20 font-mono text-muted-foreground text-sm">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => <TitleColumnHeader column={column} />,
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.label);

      return (
        <div className="flex min-w-0 items-center gap-2">
          {label && (
            <Badge className="rounded-sm bg-transparent" variant="outline">
              {label.label}
            </Badge>
          )}
          <Link
            className="hover:underline"
            to="/dashboard/works/$workId"
            params={{ workId: row.original.id }}
            search={{ ...DOSSIER_ENTRY_SEARCH }}
          >
            <span className="block max-w-lg truncate font-medium text-sm">{row.getValue("title")}</span>
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = statuses.find((status) => status.value === row.getValue("status"));

      if (!status) {
        return null;
      }

      return (
        <Badge className={cn("gap-1.5 rounded-sm border font-medium", statusStyles[status.value])} variant="outline">
          {status.icon && <status.icon className="size-4" />}
          {status.label}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = priorities.find((priority) => priority.value === row.getValue("priority"));

      if (!priority) {
        return null;
      }

      return (
        <div className="flex items-center gap-2 text-sm">
          {priority.icon && <priority.icon className="size-4 text-muted-foreground" />}
          {priority.label}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "dueDate",
    header: "Due",
    cell: ({ row }) => {
      const dueDate = row.getValue("dueDate") as string;
      const overdue = dueDate < DEMO_TODAY_ISO;
      return (
        <div>
          <div className="text-sm">{formatWorkDate(dueDate)}</div>
          <div className={cn("text-xs", overdue ? "text-destructive" : "text-muted-foreground")}>
            {dueSubline(dueDate)}
          </div>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon-sm" className="text-muted-foreground data-popup-open:bg-accent" />
              }
            >
              <MoreHorizontal />
              <span className="sr-only">Open menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                render={
                  <Link
                    to="/dashboard/works/$workId"
                    params={{ workId: row.original.id }}
                    search={{ ...DOSSIER_ENTRY_SEARCH }}
                  />
                }
              >
                Open dossier
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  void copyWorkId(row.original.id);
                }}
              >
                Copy ID
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
