import { useMemo } from "react";

import { Ellipsis } from "lucide-react";
import { CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { anomalies, works } from "@/lib/mplads-mock";

import type { AnalyticsRange } from "./analytics-toolbar";

const RANGE_KEEP: Record<AnalyticsRange, number> = { all: Number.MAX_SAFE_INTEGER, "12m": 12, "6m": 6 };

interface FlagPoint {
  key: string;
  monthIndex: number;
  flags: number;
  high: number;
}

function buildFlagSeries(): FlagPoint[] {
  const months = [...new Set(works.map((w) => w.sanctionDate.slice(0, 7)))].sort();
  const workMonth = new Map(works.map((w) => [w.id, w.sanctionDate.slice(0, 7)]));
  return months.map((key, index) => {
    const monthFlags = anomalies.filter((a) => workMonth.get(a.workId) === key);
    return {
      key,
      monthIndex: index + 1,
      flags: monthFlags.length,
      high: monthFlags.filter((a) => a.severity === "high").length,
    };
  });
}

const monthLabel = new Intl.DateTimeFormat("en-IN", { timeZone: "UTC", month: "short", year: "2-digit" });

function tickLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  return monthLabel.format(new Date(Date.UTC(y, m - 1, 1)));
}

const chartConfig = {
  flags: {
    color: "var(--chart-3)",
    label: "Flags raised",
  },
  high: {
    color: "var(--muted-foreground)",
    label: "High-severity",
  },
} satisfies ChartConfig;

export function TrafficQuality({ range }: { range: AnalyticsRange }) {
  const full = useMemo(() => buildFlagSeries(), []);
  const chartData = useMemo(() => full.slice(-RANGE_KEEP[range]), [full, range]);
  const ticks = useMemo(
    () =>
      chartData
        .filter((p) => p.key.endsWith("-01") || p.key.endsWith("-04") || p.key.endsWith("-07") || p.key.endsWith("-10"))
        .map((p) => p.monthIndex),
    [chartData],
  );
  const maxFlags = useMemo(() => Math.max(2, ...chartData.map((p) => p.flags)), [chartData]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal">Flags by sanction month</CardTitle>
        <CardAction>
          <Ellipsis className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent>
        <p className="pb-2 text-muted-foreground text-xs">
          Flags raised (solid) vs high-severity (dashed) per sanction month · demo-derived from 12 flags.
        </p>
        <ChartContainer config={chartConfig} className="h-68 w-full">
          <ComposedChart data={chartData} margin={{ bottom: 0, left: 0, right: 0, top: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="monthIndex"
              axisLine={false}
              domain={[1, full.length]}
              interval={0}
              tickFormatter={(value) => {
                const point = full.find((p) => p.monthIndex === value);
                return point ? tickLabel(point.key) : "";
              }}
              tickLine={false}
              tickMargin={14}
              ticks={ticks}
              type="number"
            />
            <YAxis
              axisLine={false}
              domain={[0, maxFlags]}
              allowDecimals={false}
              tickLine={false}
              tickMargin={10}
              width={34}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="w-44"
                  labelFormatter={(_, payload) => {
                    const key = payload?.[0]?.payload?.key;
                    return typeof key === "string" ? tickLabel(key) : "Flags by month";
                  }}
                />
              }
            />
            <Line
              dataKey="high"
              dot={false}
              stroke="var(--color-high)"
              strokeOpacity={0.65}
              strokeDasharray="4 4"
              strokeWidth={1.75}
              type="linear"
            />
            <Line
              dataKey="flags"
              dot={false}
              activeDot={{ r: 4 }}
              stroke="var(--color-flags)"
              strokeWidth={2.5}
              type="linear"
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
