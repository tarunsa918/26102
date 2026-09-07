import { useMemo, useState } from "react";

import { createFileRoute, Link } from "@tanstack/react-router";

import { FolderPlus, Grid2X2, List, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FLAGSHIP_WORK_ID, works } from "@/lib/mplads-mock";

import {
  type FileManagerFile,
  type FileManagerFolder,
  type FileManagerView,
  files,
  folders,
  type LibraryKind,
  type LibraryShow,
  type LibrarySort,
} from "./-components/data";
import { FileGridView } from "./-components/file-grid-view";
import { FileListView } from "./-components/file-list-view";
import { FileManagerToolbar } from "./-components/file-manager-toolbar";
import { FoldersSection } from "./-components/folders-section";

export const Route = createFileRoute("/(main)/dashboard/file-manager")({
  validateSearch: (search: Record<string, unknown>): { view: FileManagerView } => ({
    view: search.view === "list" ? "list" : "grid",
  }),
  component: Page,
});

function Page() {
  const { view: activeView } = Route.useSearch();
  const [libraryFiles, setLibraryFiles] = useState<FileManagerFile[]>(files);
  const [libraryFolders, setLibraryFolders] = useState<FileManagerFolder[]>(folders);
  const [starred, setStarred] = useState<ReadonlySet<string>>(new Set());
  const [query, setQuery] = useState("");
  const [show, setShow] = useState<LibraryShow>("all");
  const [kind, setKind] = useState<LibraryKind>("all");
  const [sort, setSort] = useState<LibrarySort>("modified");

  function toggleStar(fileId: string) {
    setStarred((current) => {
      const next = new Set(current);
      if (next.has(fileId)) {
        next.delete(fileId);
      } else {
        next.add(fileId);
      }
      return next;
    });
  }

  function removeFile(fileId: string) {
    setLibraryFiles((current) => current.filter((file) => file.id !== fileId));
    setStarred((current) => {
      if (!current.has(fileId)) {
        return current;
      }
      const next = new Set(current);
      next.delete(fileId);
      return next;
    });
  }

  function handleUpload() {
    const flagship = works.find((work) => work.id === FLAGSHIP_WORK_ID);
    const stamp = Date.now();
    const demoFile: FileManagerFile = {
      id: `demo-upload-${stamp}`,
      name: "Site photo (demo upload).jpg",
      kind: "photo",
      size: "1.2 MB",
      sizeKb: 1229,
      owner: "District Officer (demo)",
      ownerInitials: "DO",
      modifiedAt: "just now",
      uploadedAt: new Date().toISOString(),
      shared: false,
      starred: false,
      workId: flagship ? flagship.id : FLAGSHIP_WORK_ID,
      workTitle: flagship ? flagship.title : FLAGSHIP_WORK_ID,
      district: flagship ? flagship.district : "",
    };
    setLibraryFiles((current) => [demoFile, ...current]);
    toast.add({ title: "Demo file uploaded to the library" });
  }

  function handleNewFolder() {
    const stamp = Date.now();
    setLibraryFolders((current) => [
      { id: `demo-folder-${stamp}`, name: "Demo folder", fileCount: 0, size: "0 KB", updatedAt: "just now" },
      ...current,
    ]);
    toast.add({ title: "Demo folder created" });
  }

  const visibleFiles = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = libraryFiles.filter((file) => {
      if (kind !== "all" && file.kind !== kind) {
        return false;
      }
      if (show === "shared" && !file.shared) {
        return false;
      }
      if (show === "starred" && !starred.has(file.id) && !file.starred) {
        return false;
      }
      if (needle.length === 0) {
        return true;
      }
      return `${file.name} ${file.workId} ${file.workTitle} ${file.district} ${file.owner}`
        .toLowerCase()
        .includes(needle);
    });
    return [...filtered].sort((a, b) => {
      if (sort === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sort === "size") {
        return b.sizeKb - a.sizeKb;
      }
      return b.uploadedAt.localeCompare(a.uploadedAt);
    });
  }, [libraryFiles, query, show, kind, sort, starred]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl leading-none tracking-tight">Documents library</h1>
          <p className="text-muted-foreground text-sm">Every evidence file, joined to its work — find any file.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" type="button" onClick={handleNewFolder}>
            <FolderPlus data-icon="inline-start" />
            New folder
          </Button>
          <Button type="button" onClick={handleUpload}>
            <Upload data-icon="inline-start" />
            Upload
          </Button>
        </div>
      </div>
      <FileManagerToolbar
        query={query}
        onQueryChange={(value) => setQuery(value)}
        show={show}
        onShowChange={setShow}
        kind={kind}
        onKindChange={setKind}
        sort={sort}
        onSortChange={setSort}
      />
      <FoldersSection folders={libraryFolders} onOpenFolder={(folder) => setQuery(folder.name)} />
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-medium text-lg">All files</h2>
          <ToggleGroup variant="outline" size="sm" spacing={0} value={[activeView]} aria-label="File view">
            <ToggleGroupItem
              value="grid"
              nativeButton={false}
              render={<Link from={Route.fullPath} search={(previous) => ({ ...previous, view: "grid" })} replace />}
            >
              <Grid2X2 />
              Grid View
            </ToggleGroupItem>
            <ToggleGroupItem
              value="list"
              nativeButton={false}
              render={<Link from={Route.fullPath} search={(previous) => ({ ...previous, view: "list" })} replace />}
            >
              <List />
              List View
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        {activeView === "list" ? (
          <FileListView files={visibleFiles} starred={starred} onToggleStar={toggleStar} onRemove={removeFile} />
        ) : (
          <FileGridView files={visibleFiles} starred={starred} onToggleStar={toggleStar} onRemove={removeFile} />
        )}
      </div>
    </div>
  );
}
