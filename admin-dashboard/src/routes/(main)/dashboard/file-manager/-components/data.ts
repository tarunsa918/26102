import { File, FileImage, FileText } from "lucide-react";

import { evidences, formatWorkDate, works } from "@/lib/mplads-mock";

export type FileKind = "doc" | "photo" | "report";
export type FileManagerView = "grid" | "list";
export const fileIcons = {
  doc: FileText,
  photo: FileImage,
  report: File,
} satisfies Record<FileKind, typeof File>;
export const fileKindLabels: Record<FileKind, string> = {
  doc: "Document",
  photo: "Photo",
  report: "Report",
};

export type LibraryShow = "all" | "starred" | "shared";
export type LibraryKind = "all" | FileKind;
export type LibrarySort = "modified" | "name" | "size";

export interface FileManagerFolder {
  id: string;
  name: string;
  fileCount: number;
  size: string;
  updatedAt: string;
}
export interface FileManagerFile {
  id: string;
  name: string;
  kind: FileKind;
  size: string;
  sizeKb: number;
  owner: string;
  ownerInitials: string;
  modifiedAt: string;
  uploadedAt: string;
  shared: boolean;
  starred: boolean;
  workId: string;
  workTitle: string;
  district: string;
}

function formatSize(sizeKb: number): string {
  if (sizeKb >= 1024) {
    return `${(sizeKb / 1024).toFixed(1)} MB`;
  }
  return `${Math.round(sizeKb)} KB`;
}

function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function slugOf(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function workOf(workId: string) {
  return works.find((work) => work.id === workId);
}

export const files: FileManagerFile[] = evidences.map((evidence) => {
  const work = workOf(evidence.workId);
  return {
    id: evidence.id,
    name: evidence.name,
    kind: evidence.kind,
    size: formatSize(evidence.sizeKb),
    sizeKb: evidence.sizeKb,
    owner: evidence.by,
    ownerInitials: initialsOf(evidence.by),
    modifiedAt: formatWorkDate(evidence.uploadedAt.slice(0, 10)),
    uploadedAt: evidence.uploadedAt,
    shared: false,
    starred: false,
    workId: evidence.workId,
    workTitle: work ? work.title : evidence.workId,
    district: work ? work.district : "",
  };
});

interface FolderAccumulator {
  fileCount: number;
  sizeKb: number;
  latestAt: string;
}

export const folders: FileManagerFolder[] = (() => {
  const byDistrict = new Map<string, FolderAccumulator>();
  for (const file of files) {
    const current = byDistrict.get(file.district) ?? { fileCount: 0, sizeKb: 0, latestAt: file.uploadedAt };
    current.fileCount += 1;
    current.sizeKb += file.sizeKb;
    if (file.uploadedAt > current.latestAt) {
      current.latestAt = file.uploadedAt;
    }
    byDistrict.set(file.district, current);
  }
  return [...byDistrict.entries()]
    .map(([district, acc]) => ({
      id: slugOf(district || "unassigned"),
      name: district || "Unassigned",
      fileCount: acc.fileCount,
      size: formatSize(acc.sizeKb),
      updatedAt: formatWorkDate(acc.latestAt.slice(0, 10)),
    }))
    .sort((a, b) => b.fileCount - a.fileCount || a.name.localeCompare(b.name));
})();
