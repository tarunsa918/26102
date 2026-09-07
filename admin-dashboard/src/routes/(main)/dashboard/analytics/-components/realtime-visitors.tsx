import { useMemo } from "react";

import { Ellipsis } from "lucide-react";
import { Bar, BarChart, type BarShapeProps, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { geoRollup, works } from "@/lib/mplads-mock";

const DEMO_TODAY_MS = Date.UTC(2026, 8, 7);

const BUCKETS = [
  { key: "0–30d", min: 0, max: 30 },
  { key: "31–60d", min: 31, max: 60 },
  { key: "61–90d", min: 61, max: 90 },
  { key: "91–120d", min: 91, max: 120 },
  { key: "121d+", min: 121, max: Number.MAX_SAFE_INTEGER },
] as const;

function stallDays(lastUpdate: string) {
  return Math.round((DEMO_TODAY_MS - Date.parse(`${lastUpdate}T00:00:00Z`)) / 86400000);
}

const chartConfig = {
  stalled: {
    color: "var(--chart-3)",
    label: "Works stalled",
  },
} satisfies ChartConfig;

function StallBarShape(props: BarShapeProps) {
  const { height, payload, width, x, y } = props;
  const barPayload = payload as { stalled?: number } | undefined;
  const barHeightValue = Number(height);
  const barWidthValue = Number(width);
  const xValue = Number(x);
  const yValue = Number(y);
  const stalled = barPayload?.stalled ?? 0;
  const fill = "var(--color-stalled)";
  const fillOpacity = stalled >= 10 ? 0.95 : 0.4;
  const baselineFill = stalled === 0 ? "var(--destructive)" : fill;
  const baselineOpacity = stalled === 0 ? 1 : fillOpacity;
  const baselineY = yValue + barHeightValue - 2;
  const barGap = 4;
  const barHeight = Math.max(0, barHeightValue - barGap);

  return (
    <g>
      <rect
        x={xValue}
        y={baselineY}
        width={barWidthValue}
        height={2}
        rx={1}
        fill={baselineFill}
        fillOpacity={baselineOpacity}
      />
      {stalled > 0 && barHeight > 0 ? (
        <rect
          x={xValue}
          y={yValue}
          width={barWidthValue}
          height={barHeight}
          rx={2}
          fill={fill}
          fillOpacity={fillOpacity}
        />
      ) : null}
    </g>
  );
}

export function RealtimeVisitors() {
  const distribution = useMemo(
    () =>
      BUCKETS.map((bucket) => ({
        bucket: bucket.key,
        stalled: works.filter((w) => {
          const days = stallDays(w.lastUpdate);
          return days >= bucket.min && days <= bucket.max;
        }).length,
      })),
    [],
  );
  const stalled91 = useMemo(() => works.filter((w) => stallDays(w.lastUpdate) >= 91).length, []);
  const topDelayed = useMemo(() => [...geoRollup].sort((a, b) => b.delayed - a.delayed).slice(0, 4), []);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal">Stall watch</CardTitle>
        <CardAction>
          <Ellipsis className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl tabular-nums leading-none tracking-tight">{stalled91}</span>
            <span className="text-muted-foreground text-sm">stalled 91d+ · demo</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span className="relative flex size-2">
              <span className="relative inline-flex size-2 rounded-full bg-amber-500" />
            </span>
            <span>Snapshot</span>
          </div>
        </div>
        <ChartContainer config={chartConfig} className="h-36 w-full">
          <BarChart data={distribution} margin={{ bottom: 0, left: 0, right: 0, top: 0 }} barCategoryGap={3}>
            <XAxis dataKey="bucket" hide />
            <YAxis hide domain={[0, 22]} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="stalled" fill="var(--color-stalled)" shape={StallBarShape} />
          </BarChart>
        </ChartContainer>
        <div className="grid grid-cols-2">
          {topDelayed.map((entry, index) => (
            <div
              key={entry.state}
              className={`flex items-center gap-3 pt-1 pb-4 ${
                index % 2 === 0 ? "border-border/50 border-r pr-5" : "pl-5"
              } ${index < 2 ? "border-b" : "pt-4 pb-1"}`}
            >
              <span
                aria-hidden="true"
                className={`size-2 shrink-0 rounded-full ${index === 0 ? "bg-destructive" : "bg-amber-500"}`}
              />
              <span className="min-w-0 flex-1 truncate text-sm">{entry.state}</span>
              <span className="text-sm tabular-nums">{entry.delayed}</span>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground text-xs">Days since last update · most delayed states · no live feed.</p>
      </CardContent>
    </Card>
  );
}
