import { cn } from "cn";
import { Star } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { type FileManagerFile, fileIcons } from "./data";
import { FileActions } from "./file-actions";

interface FileListViewProps {
  files: FileManagerFile[];
  starred: ReadonlySet<string>;
  onToggleStar: (fileId: string) => void;
  onRemove: (fileId: string) => void;
}

export function FileListView({ files, starred, onToggleStar, onRemove }: FileListViewProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="pl-0">Name</TableHead>
          <TableHead className="hidden md:table-cell">Owner</TableHead>
          <TableHead className="hidden lg:table-cell">Modified</TableHead>
          <TableHead className="hidden sm:table-cell">Size</TableHead>
          <TableHead className="w-20">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map((file) => {
          const FileIcon = fileIcons[file.kind];
          const isStarred = starred.has(file.id) || file.starred;
          const starredFile = { ...file, starred: isStarred };
          return (
            <TableRow key={file.id}>
              <TableCell className="pl-0">
                <div className="flex min-w-0 items-center gap-3">
                  <FileIcon className="size-5 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <Button variant="link" size="sm" className="h-auto max-w-72 justify-start px-0">
                      <span className="truncate">{file.name}</span>
                    </Button>
                    <div className="truncate text-muted-foreground text-xs">
                      {file.workId} · {file.workTitle}
                    </div>
                  </div>
                  {file.shared && (
                    <Badge variant="outline" className="hidden xl:inline-flex">
                      Shared
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex items-center gap-2">
                  <Avatar size="sm">
                    <AvatarFallback>{file.ownerInitials}</AvatarFallback>
                  </Avatar>
                  <span>{file.owner}</span>
                </div>
              </TableCell>
              <TableCell className="hidden text-muted-foreground lg:table-cell">{file.modifiedAt}</TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">{file.size}</TableCell>
              <TableCell>
                <div className="flex items-center justify-end">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={isStarred ? `Unstar ${file.name}` : `Star ${file.name}`}
                    onClick={() => onToggleStar(file.id)}
                  >
                    <Star className={cn(isStarred && "fill-current")} />
                  </Button>
                  <FileActions
                    file={starredFile}
                    onToggleStar={() => onToggleStar(file.id)}
                    onRemove={() => onRemove(file.id)}
                  />
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
