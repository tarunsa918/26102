import type { ReactTable, RowData } from "@tanstack/react-table";

import { cn } from "cn";
import { ListFilter, Search, Settings2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { DataTableFeatures } from "@/lib/data-table-features";

interface FilterOption {
  value: string;
  label: string;
  dotClass?: string;
}

const SEVERITY_OPTIONS: FilterOption[] = [
  { value: "high", label: "High", dotClass: "bg-destructive" },
  { value: "medium", label: "Medium", dotClass: "bg-amber-500" },
  { value: "low", label: "Low", dotClass: "bg-sky-500" },
  { value: "clear", label: "Clear", dotClass: "bg-muted-foreground" },
];

const KIND_OPTIONS: FilterOption[] = [
  { value: "cost", label: "cost" },
  { value: "expenditure", label: "expenditure" },
  { value: "delay", label: "delay" },
  { value: "duplicate", label: "duplicate" },
  { value: "utilisation", label: "utilisation" },
];

function MultiCheckFilter<TData extends RowData>({
  table,
  columnId,
  title,
  options,
}: {
  table: ReactTable<DataTableFeatures, TData>;
  columnId: string;
  title: string;
  options: FilterOption[];
}) {
  const column = table.getColumn(columnId);

  if (!column) {
    return null;
  }

  const selectedValues = new Set((column.getFilterValue() as string[] | undefined) ?? []);

  function updateFilter(value: string) {
    if (selectedValues.has(value)) {
      selectedValues.delete(value);
    } else {
      selectedValues.add(value);
    }

    const filterValues = Array.from(selectedValues);
    column?.setFilterValue(filterValues.length ? filterValues : undefined);
    table.setPageIndex(0);
  }

  function clearFilter() {
    column?.setFilterValue(undefined);
    table.setPageIndex(0);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            className={cn("border-dashed", selectedValues.size > 0 && "border-solid bg-muted text-foreground")}
          />
        }
      >
        <ListFilter data-icon="inline-start" />
        {title}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-50">
        <DropdownMenuGroup>
          {options.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={selectedValues.has(option.value)}
              onCheckedChange={() => updateFilter(option.value)}
              onSelect={(event) => event.preventDefault()}
            >
              {option.dotClass && <span className={cn("size-1.5 rounded-full", option.dotClass)} />}
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
        {selectedValues.size > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={clearFilter} className="justify-center text-center">
                <X />
                Clear filters
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface WorksToolbarProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
  query: string;
  onQueryChange: (query: string) => void;
}

export function WorksToolbar<TData extends RowData>({ table, query, onQueryChange }: WorksToolbarProps<TData>) {
  const isFiltered = table.state.columnFilters.length > 0;
  const hideableColumns = table
    .getAllColumns()
    .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide());
  const hiddenColumns = hideableColumns.filter((column) => !column.getIsVisible());

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search works..."
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="h-7 bg-background pr-8 pl-8 text-foreground placeholder:text-muted-foreground lg:w-80"
            aria-label="Search works by ID, title, or agency"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon-xs"
              className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground"
              onClick={() => onQueryChange("")}
              aria-label="Clear search"
            >
              <X />
            </Button>
          )}
        </div>
        <MultiCheckFilter table={table} columnId="severity" title="Severity" options={SEVERITY_OPTIONS} />
        <MultiCheckFilter table={table} columnId="kind" title="Kind" options={KIND_OPTIONS} />
        {isFiltered && (
          <Button
            variant="destructive"
            onClick={() => {
              table.resetColumnFilters();
              table.setPageIndex(0);
            }}
          >
            <X data-icon="inline-start" />
            Reset
          </Button>
        )}
      </div>
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className={cn("ml-auto hidden lg:flex", hiddenColumns.length > 0 && "bg-muted text-foreground")}
              />
            }
          >
            <Settings2 data-icon="inline-start" />
            View
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-38">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              {hideableColumns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
