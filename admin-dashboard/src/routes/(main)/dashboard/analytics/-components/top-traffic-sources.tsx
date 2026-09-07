import { Ellipsis } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, type LabelProps, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { geoRollup } from "@/lib/mplads-mock";

const chartConfig = {
  count: {
    color: "var(--chart-1)",
    label: "Works",
  },
} satisfies ChartConfig;

type RiskDatum = {
  label: string;
  state: string;
  count: number;
};

const riskLens = [
  { value: "high", label: "High-risk", get: (entry: (typeof geoRollup)[number]) => entry.high },
  { value: "delayed", label: "Delayed", get: (entry: (typeof geoRollup)[number]) => entry.delayed },
  { value: "stalled", label: "Stalled", get: (entry: (typeof geoRollup)[number]) => entry.stalled },
] as const;

function lensData(get: (entry: (typeof geoRollup)[number]) => number): RiskDatum[] {
  return [...geoRollup]
    .sort((a, b) => b.works - a.works)
    .map((entry) => ({ state: entry.state, count: get(entry), label: String(get(entry)) }));
}

const renderValueLabel = (props: LabelProps) => {
  const { height, value, y } = props;

  return (
    <text
      className="fill-foreground"
      dominantBaseline="middle"
      dx={-6}
      fontSize={14}
      textAnchor="end"
      x="100%"
      y={Number(y) + Number(height) / 2}
    >
      {value}
    </text>
  );
};

function RiskBarChart({ data }: { data: RiskDatum[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"
        margin={{
          left: 0,
          right: 48,
        }}
      >
        <CartesianGrid horizontal={false} vertical={false} />
        <YAxis dataKey="state" hide tickLine={false} tickMargin={10} type="category" />
        <XAxis dataKey="count" hide type="number" />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
        <Bar barSize={40} dataKey="count" fill="var(--color-count)" fillOpacity={0.5} radius={8}>
          <LabelList className="fill-foreground" dataKey="state" fontSize={14} offset={12} position="insideLeft" />
          <LabelList content={renderValueLabel} dataKey="label" />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

export function TopTrafficSources() {
  return (
    <Card className="h-full gap-2">
      <CardHeader>
        <CardTitle className="font-normal">Risk by state</CardTitle>
        <CardAction>
          <Ellipsis className="size-4" />
        </CardAction>
      </CardHeader>

      <CardContent className="px-0">
        <Tabs defaultValue="high" className="flex flex-col gap-3">
          <TabsList className="w-full justify-start border-b px-2.5" variant="line">
            {riskLens.map((lens) => (
              <TabsTrigger key={lens.value} className="flex-none font-normal" value={lens.value}>
                {lens.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {riskLens.map((lens) => (
            <TabsContent key={lens.value} value={lens.value} className="px-4">
              <RiskBarChart data={lensData(lens.get)} />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
