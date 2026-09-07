import * as React from "react";

import {
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type PaginationState,
  type SortingState,
  useTable,
} from "@tanstack/react-table";

import { cn } from "cn";
import { ChevronsLeft, ChevronsRight, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { dataTableFeatures } from "@/lib/data-table-features";

import { columns } from "./columns";
import { DISTRICT_OPTIONS, type Lens, STATE_OPTIONS, TYPE_OPTIONS, type WorkRow } from "./data";
import { WorksToolbar } from "./works-toolbar";

function preventPaginationNavigation(event: React.MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
}

function getPageNumbers(currentPage: number, pageCount: number) {
  if (pageCount <= 3) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  if (currentPage <= 2) return [1, 2, 3];
  if (currentPage >= pageCount - 1) return [pageCount - 2, pageCount - 1, pageCount];
  return [currentPage - 1, currentPage, currentPage + 1];
}

export interface WorksSearch {
  lens: Lens;
  state: string;
  district: string;
  type: string;
  q: string;
}

interface WorksTableProps {
  data: WorkRow[];
  total: number;
  search: WorksSearch;
  lensCounts: { all: number; review: number; high: number };
  resetKey: number;
  onSearchPatch: (patch: Partial<WorksSearch>) => void;
  onResetAll: () => void;
}

export function WorksTable({ data, total, search, lensCounts, resetKey, onSearchPatch, onResetAll }: WorksTableProps) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<ColumnVisibilityState>({
    state: false,
    type: false,
    search: false,
  });
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useTable({
    features: dataTableFeatures,
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
  });

  const initialReset = React.useRef(resetKey);

  React.useEffect(() => {
    table.getColumn("state")?.setFilterValue(search.state || undefined);
    table.getColumn("district")?.setFilterValue(search.district || undefined);
    table.getColumn("type")?.setFilterValue(search.type || undefined);
    table.getColumn("search")?.setFilterValue(search.q.toLowerCase() || undefined);
    table.setPageIndex(0);
  }, [table, search.state, search.district, search.type, search.q]);

  React.useEffect(() => {
    if (resetKey !== initialReset.current) {
      table.resetColumnFilters();
      table.setPageIndex(0);
    }
  }, [table, resetKey]);

  const filteredCount = table.getFilteredRowModel().rows.length;
  const pageIndex = table.state.pagination.pageIndex;
  const pageCount = Math.max(table.getPageCount(), 1);
  const currentPage = Math.min(pageIndex + 1, pageCount);
  const pageNumbers = getPageNumbers(currentPage, pageCount);
  const canPreviousPage = table.getCanPreviousPage();
  const canNextPage = table.getCanNextPage();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl leading-none tracking-tight">Works</h1>
          <p className="text-muted-foreground text-sm">
            {filteredCount} of {total} MPLADS works · demo sample
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <Select
            value={search.state}
            items={[
              { value: "", label: "All states" },
              ...STATE_OPTIONS.map((state) => ({ value: state, label: state })),
            ]}
            onValueChange={(value) => onSearchPatch({ state: value ?? "" })}
          >
            <SelectTrigger size="sm" className="w-40" aria-label="Filter by state">
              <SelectValue placeholder="All states" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="">All states</SelectItem>
                {STATE_OPTIONS.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            value={search.district}
            items={[
              { value: "", label: "All districts" },
              ...DISTRICT_OPTIONS.map((district) => ({ value: district, label: district })),
            ]}
            onValueChange={(value) => onSearchPatch({ district: value ?? "" })}
          >
            <SelectTrigger size="sm" className="w-40" aria-label="Filter by district">
              <SelectValue placeholder="All districts" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="">All districts</SelectItem>
                {DISTRICT_OPTIONS.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            value={search.type}
            items={[{ value: "", label: "All types" }, ...TYPE_OPTIONS.map((type) => ({ value: type, label: type }))]}
            onValueChange={(value) => onSearchPatch({ type: value ?? "" })}
          >
            <SelectTrigger size="sm" aria-label="Filter by work type">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="">All types</SelectItem>
                {TYPE_OPTIONS.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button variant="destructive" onClick={onResetAll}>
            <X data-icon="inline-start" />
            Reset
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/70 bg-background">
        <div className="flex flex-col gap-3 border-b px-4 py-4">
          <WorksToolbar table={table} query={search.q} onQueryChange={(q) => onSearchPatch({ q })} />
          <ToggleGroup
            variant="outline"
            size="sm"
            value={[search.lens]}
            onValueChange={(value) => {
              const next = Array.isArray(value) ? value[0] : value;
              if (next === "all" || next === "needs-review" || next === "high-risk") {
                onSearchPatch({ lens: next });
              }
            }}
            aria-label="Risk lens"
          >
            <ToggleGroupItem value="all">All {lensCounts.all}</ToggleGroupItem>
            <ToggleGroupItem value="needs-review">Review {lensCounts.review}</ToggleGroupItem>
            <ToggleGroupItem value="high-risk">High {lensCounts.high}</ToggleGroupItem>
          </ToggleGroup>
        </div>
        {filteredCount === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No works match</EmptyTitle>
              <EmptyDescription>No works match — clear filters to see the full ledger.</EmptyDescription>
            </EmptyHeader>
            <Button variant="outline" size="sm" onClick={onResetAll}>
              <X data-icon="inline-start" />
              Clear filters
            </Button>
          </Empty>
        ) : (
          <>
            <Table className="**:data-[slot=table-cell]:px-4 **:data-[slot=table-head]:px-4">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="hover:bg-transparent">
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="h-11 font-medium text-muted-foreground"
                        colSpan={header.colSpan}
                      >
                        {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-border/60 hover:bg-muted/20"
                    data-state={table.state.rowSelection[row.id] && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3 align-middle">
                        <table.FlexRender cell={cell} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex flex-col gap-3 border-t px-4 py-4 md:flex-row md:items-center md:justify-between">
              <div className="text-muted-foreground text-sm">
                {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
                selected.
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-6 lg:gap-8">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-muted-foreground text-sm">Rows per page</p>
                  <Select
                    value={`${table.state.pagination.pageSize}`}
                    onValueChange={(value) => {
                      table.setPageSize(Number(value));
                    }}
                  >
                    <SelectTrigger className="h-8 w-18">
                      <SelectValue placeholder={table.state.pagination.pageSize} />
                    </SelectTrigger>
                    <SelectContent side="top">
                      <SelectGroup>
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                          <SelectItem key={pageSize} value={`${pageSize}`}>
                            {pageSize}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex w-24 items-center justify-start font-medium text-sm sm:justify-center">
                  Page {currentPage} of {pageCount}
                </div>
                <Pagination className="mx-0 w-auto justify-start sm:justify-end">
                  <PaginationContent className="gap-1">
                    <PaginationItem className="hidden lg:block">
                      <PaginationLink
                        href="#"
                        aria-label="Go to first page"
                        aria-disabled={!canPreviousPage}
                        className={cn(!canPreviousPage && "pointer-events-none opacity-50")}
                        onClick={(event) => {
                          preventPaginationNavigation(event);
                          if (canPreviousPage) table.setPageIndex(0);
                        }}
                      >
                        <ChevronsLeft />
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        text="Prev"
                        aria-disabled={!canPreviousPage}
                        className={cn(!canPreviousPage && "pointer-events-none opacity-50")}
                        onClick={(event) => {
                          preventPaginationNavigation(event);
                          if (canPreviousPage) table.previousPage();
                        }}
                      />
                    </PaginationItem>
                    {pageNumbers[0] > 1 ? (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : null}
                    {pageNumbers.map((pageNumber) => (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          isActive={pageIndex === pageNumber - 1}
                          onClick={(event) => {
                            preventPaginationNavigation(event);
                            table.setPageIndex(pageNumber - 1);
                          }}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    {pageNumbers[pageNumbers.length - 1] < pageCount ? (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : null}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        aria-disabled={!canNextPage}
                        className={cn(!canNextPage && "pointer-events-none opacity-50")}
                        onClick={(event) => {
                          preventPaginationNavigation(event);
                          if (canNextPage) table.nextPage();
                        }}
                      />
                    </PaginationItem>
                    <PaginationItem className="hidden lg:block">
                      <PaginationLink
                        href="#"
                        aria-label="Go to last page"
                        aria-disabled={!canNextPage}
                        className={cn(!canNextPage && "pointer-events-none opacity-50")}
                        onClick={(event) => {
                          preventPaginationNavigation(event);
                          if (canNextPage) table.setPageIndex(pageCount - 1);
                        }}
                      >
                        <ChevronsRight />
                      </PaginationLink>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
