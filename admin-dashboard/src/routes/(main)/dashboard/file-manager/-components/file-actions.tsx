import { Download, MoreVertical, Share2, Star, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";

import type { FileManagerFile } from "./data";

export function FileActions({
  file,
  onToggleStar,
  onRemove,
}: {
  file: FileManagerFile;
  onToggleStar: () => void;
  onRemove: () => void;
}) {
  function handleDownload() {
    const summary = [
      `Evidence: ${file.name}`,
      `Work: ${file.workId} — ${file.workTitle} (${file.district})`,
      `Kind: ${file.kind} · Size: ${file.size}`,
      `Uploaded: ${file.modifiedAt} by ${file.owner}`,
    ].join("\n");
    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${file.id}-summary.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    toast.add({ title: `Downloaded ${file.id} summary` });
  }

  async function handleCopyLink() {
    const link = `${window.location.origin}/dashboard/works/${file.workId}?tab=evidence&view=grid&lens=all&state=&district=&type=&q=`;
    try {
      await navigator.clipboard.writeText(link);
      toast.add({ title: "Evidence link copied" });
    } catch {
      toast.add({ title: "Copy failed", description: "Select the link manually." });
    }
  }

  function handleTrash() {
    onRemove();
    toast.add({ title: `Moved ${file.name} to trash (demo)` });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${file.name}`} />}>
        <MoreVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={onToggleStar}>
            <Star />
            {file.starred ? "Remove from starred" : "Add to starred"}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleDownload}>
            <Download />
            Download
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              void handleCopyLink();
            }}
          >
            <Share2 />
            Copy share link
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onSelect={handleTrash}>
            <Trash2 />
            Move to trash
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
