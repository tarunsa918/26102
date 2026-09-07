import { Ellipsis, FileDown, RefreshCw, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { anomalies } from "@/lib/mplads-mock";

export type AnalyticsRange = "all" | "12m" | "6m";

const analyticsRangeItems: { value: AnalyticsRange; label: string }[] = [
  { value: "all", label: "All sanctions" },
  { value: "12m", label: "Last 12 months" },
  { value: "6m", label: "Last 6 months" },
];

function downloadFlagsCsv() {
  const header = "flag_id,work_id,kind,severity,headline";
  const lines = anomalies.map((a) => [a.id, a.workId, a.kind, a.severity, `"${a.headline}"`].join(","));
  const blob = new Blob([[header, ...lines].join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "mplads-flags-demo.csv";
  anchor.click();
  URL.revokeObjectURL(url);
  toast.add({ title: "Export ready", description: "Demo flags CSV downloaded (12 flags)." });
}

async function copyDashboardLink() {
  try {
    await navigator.clipboard.writeText(window.location.href);
    toast.add({ title: "Link copied", description: "Dashboard URL is on your clipboard." });
  } catch {
    toast.add({ title: "Copy failed", description: "Your browser blocked clipboard access." });
  }
}

export function AnalyticsToolbar({
  range,
  onRangeChange,
}: {
  range: AnalyticsRange;
  onRangeChange: (range: AnalyticsRange) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Select
        items={analyticsRangeItems}
        value={range}
        onValueChange={(value) => onRangeChange(value as AnalyticsRange)}
      >
        <SelectTrigger className="w-38">
          <SelectValue placeholder="Select range" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {analyticsRangeItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <DropdownMenu>
        <DropdownMenuTrigger render={<Button size="icon" variant="outline" aria-label="More analytics actions" />}>
          <Ellipsis />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Analytics actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={downloadFlagsCsv}>
              <FileDown />
              Export report
            </DropdownMenuItem>
            <DropdownMenuItem onClick={copyDashboardLink}>
              <Share2 />
              Share dashboard
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() =>
                toast.add({ title: "Metrics refreshed", description: "Demo data is already current (7 Sept 2026)." })
              }
            >
              <RefreshCw />
              Refresh metrics
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
