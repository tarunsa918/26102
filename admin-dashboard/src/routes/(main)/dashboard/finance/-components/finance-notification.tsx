import { Link } from "@tanstack/react-router";

import { TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { anomalies, FLAGSHIP_WORK_ID, works } from "@/lib/mplads-mock";

const flagship = works.find((w) => w.id === FLAGSHIP_WORK_ID);
const flagshipFlag = anomalies.find((a) => a.workId === FLAGSHIP_WORK_ID);

export function FinanceNotification() {
  return (
    <Item className="rounded-xl" variant="outline">
      <ItemMedia variant="icon">
        <TriangleAlert />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{flagship ? `${flagship.id} needs review` : "Flagship work needs review"}</ItemTitle>
        <ItemDescription>{flagshipFlag?.headline ?? "Cost variance flagged — needs review."}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button
          nativeButton={false}
          render={
            <Link
              to="/dashboard/works/$workId"
              params={{ workId: FLAGSHIP_WORK_ID }}
              search={{ tab: "overview", view: "grid", lens: "all", state: "", district: "", type: "", q: "" }}
            />
          }
          size="sm"
          variant="outline"
        >
          Open work
        </Button>
      </ItemActions>
    </Item>
  );
}
