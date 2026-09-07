import { ArrowUpDown, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

import type { LibraryKind, LibraryShow, LibrarySort } from "./data";

interface FileManagerToolbarProps {
  query: string;
  onQueryChange: (value: string) => void;
  show: LibraryShow;
  onShowChange: (value: LibraryShow) => void;
  kind: LibraryKind;
  onKindChange: (value: LibraryKind) => void;
  sort: LibrarySort;
  onSortChange: (value: LibrarySort) => void;
}

export function FileManagerToolbar({
  query,
  onQueryChange,
  show,
  onShowChange,
  kind,
  onKindChange,
  sort,
  onSortChange,
}: FileManagerToolbarProps) {
  return (
    <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
      <InputGroup className="md:max-w-lg">
        <InputGroupInput
          placeholder="Search files and folders..."
          aria-label="Search files and folders"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>
      <div className="flex flex-1 flex-wrap items-center gap-2 xl:justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
            <SlidersHorizontal data-icon="inline-start" />
            Filter & sort
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Show</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={show} onValueChange={(value) => onShowChange(value as LibraryShow)}>
                <DropdownMenuRadioItem value="all">All files</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="starred">Starred</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="shared">Shared</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <SlidersHorizontal />
                  File type
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent sideOffset={8}>
                  <DropdownMenuGroup>
                    <DropdownMenuRadioGroup value={kind} onValueChange={(value) => onKindChange(value as LibraryKind)}>
                      <DropdownMenuRadioItem value="all">All types</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="doc">Document</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="photo">Photo</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="report">Report</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <ArrowUpDown />
                  Sort by
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent sideOffset={8}>
                  <DropdownMenuGroup>
                    <DropdownMenuRadioGroup value={sort} onValueChange={(value) => onSortChange(value as LibrarySort)}>
                      <DropdownMenuRadioItem value="modified">Last modified</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="size">File size</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
