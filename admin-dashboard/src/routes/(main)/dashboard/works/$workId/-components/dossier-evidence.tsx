import { useEffect, useRef, useState } from "react";

import { FileChartColumn, FileImage, FileText, Grid2X2, List, Upload } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { formatWorkDate } from "@/lib/mplads-mock";
import type { Evidence } from "@/lib/mplads-schema";

import { type EvidenceView, formatSize, initialsOf, relativeDay } from "./dossier-data";

const EVIDENCE_ICONS = {
  doc: FileText,
  photo: FileImage,
  report: FileChartColumn,
} as const;

const EVIDENCE_LABELS: Record<Evidence["kind"], string> = {
  doc: "Doc",
  photo: "Photo",
  report: "Report",
};

interface DossierEvidenceProps {
  workId: string;
  evidence: Evidence[];
  view: EvidenceView;
  onViewChange: (view: EvidenceView) => void;
}

export function DossierEvidence({ workId, evidence, view, onViewChange }: DossierEvidenceProps) {
  const [items, setItems] = useState(evidence);
  const [uploading, setUploading] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    setItems(evidence);
  }, [evidence]);

  useEffect(() => () => {
    window.clearTimeout(timer.current);
  }, []);

  function simulateUpload() {
    if (uploading) {
      return;
    }
    setUploading(true);
    timer.current = window.setTimeout(() => {
      setItems((current) => [
        {
          id: `E-local-${Date.now()}`,
          workId,
          kind: "doc",
          name: `Field note — ${formatWorkDate("2026-09-07")}`,
          sizeKb: 640,
          uploadedAt: new Date().toISOString(),
          by: "You (demo)",
        },
        ...current,
      ]);
      setUploading(false);
      toast.add({ title: "Upload complete", description: "Field note attached to this dossier (demo)." });
    }, 1200);
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-medium text-lg">Evidence · {items.length}</h2>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={simulateUpload} disabled={uploading}>
            {uploading ? <Spinner data-icon="inline-start" /> : <Upload data-icon="inline-start" />}
            {uploading ? "Uploading…" : "Upload"}
          </Button>
          <ToggleGroup variant="outline" size="sm" spacing={0} value={[view]} aria-label="Evidence view">
            <ToggleGroupItem value="grid" onClick={() => onViewChange("grid")} aria-label="Grid view">
              <Grid2X2 />
              Grid
            </ToggleGroupItem>
            <ToggleGroupItem value="list" onClick={() => onViewChange("list")} aria-label="List view">
              <List />
              List
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {items.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No evidence yet</EmptyTitle>
            <EmptyDescription>Upload the first file to support this review.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <EvidenceBody items={items} view={view} />
      )}
    </div>
  );
}

function EvidenceBody({ items, view }: { items: Evidence[]; view: EvidenceView }) {
  if (view === "list") {
    return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-0">Name</TableHead>
              <TableHead className="hidden md:table-cell">Uploaded by</TableHead>
              <TableHead className="hidden lg:table-cell">Uploaded</TableHead>
              <TableHead className="hidden sm:table-cell">Size</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((file) => {
              const FileIcon = EVIDENCE_ICONS[file.kind];
              return (
                <TableRow key={file.id}>
                  <TableCell className="pl-0">
                    <div className="flex min-w-0 items-center gap-3">
                      <FileIcon className="size-5 shrink-0 text-muted-foreground" />
                      <span className="truncate text-sm">{file.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <Avatar size="sm">
                        <AvatarFallback>{initialsOf(file.by)}</AvatarFallback>
                      </Avatar>
                      <span>{file.by}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground lg:table-cell">
                    {relativeDay(file.uploadedAt)}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground sm:table-cell">
                    {formatSize(file.sizeKb)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
    );
  }

  return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((file) => {
            const FileIcon = EVIDENCE_ICONS[file.kind];
            return (
              <div key={file.id} className="rounded-xl border bg-card shadow-xs">
                <div className="p-2">
                  <div className="relative flex h-36 items-center justify-center rounded-lg bg-muted/50">
                    <FileIcon className="size-12 text-muted-foreground" aria-hidden="true" />
                    <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 text-muted-foreground text-xs">
                      <span>{EVIDENCE_LABELS[file.kind]}</span>
                      <span>{formatSize(file.sizeKb)}</span>
                    </div>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <p className="truncate font-medium text-sm">{file.name}</p>
                  <p className="truncate text-muted-foreground text-xs">
                    Uploaded {relativeDay(file.uploadedAt)} by {file.by}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
    );
}
