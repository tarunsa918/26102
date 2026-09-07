import { CartesianGrid, Label, Line, LineChart, Pie, PieChart, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatINR, formatLakh } from "@/lib/mplads-mock";
import type { Work } from "@/lib/mplads-schema";

import type { SpendPoint } from "./dossier-data";

interface DossierFinancialsProps {
  work: Work;
  series: SpendPoint[];
  peerLabel: string;
  utilisationPct: number;
}

const chartConfig = {
  peer: {
    color: "var(--chart-2)",
    label: "Peer",
  },
  spent: {
    color: "var(--chart-4)",
    label: "Spent",
  },
} satisfies ChartConfig;

interface FundSlice {
  account: string;
  amount: number;
  key: string;
  percentage: number;
}

export function DossierFinancials({ work, series, peerLabel, utilisationPct }: DossierFinancialsProps) {
  const balanceLakh = Math.max(work.sanctionedLakh - work.expenditureLakh, 0);
  const slices: FundSlice[] = [
    { account: "Spent", amount: work.expenditureLakh, key: "spent", percentage: utilisationPct },
    {
      account: "Balance",
      amount: balanceLakh,
      key: "balance",
      percentage: work.sanctionedLakh > 0 ? (balanceLakh / work.sanctionedLakh) * 100 : 0,
    },
  ];
  const fundConfig = {
    amount: { label: "Funds" },
    balance: { color: "var(--chart-2)", label: "Balance" },
    spent: { color: "var(--chart-4)", label: "Spent" },
  } satisfies ChartConfig;
  const fundData = slices.map((slice) => ({
    ...slice,
    fill: slice.key === "spent" ? "var(--chart-4)" : "var(--chart-2)",
  }));

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
        <div className="grid grid-cols-1 xl:grid-cols-6">
          <Card className="gap-5 overflow-hidden rounded-none border-0 border-foreground/10 border-b ring-0 xl:col-span-2 xl:border-r">
            <CardHeader>
              <CardTitle className="font-normal">Sanctioned</CardTitle>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <div className="space-y-1">
                <div className="font-heading text-3xl tabular-nums leading-none tracking-tight">
                  {formatLakh(work.sanctionedLakh)}
                </div>
                <p className="text-muted-foreground text-xs">{formatINR(work.sanctionedLakh)}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="gap-5 overflow-hidden rounded-none border-0 border-foreground/10 border-b ring-0 xl:col-span-2 xl:border-r">
            <CardHeader>
              <CardTitle className="font-normal">Spent</CardTitle>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <div className="flex flex-col gap-1">
                <div className="font-heading text-3xl tabular-nums leading-none tracking-tight">
                  {formatLakh(work.expenditureLakh)}
                </div>
                <p className="text-muted-foreground text-xs">{formatINR(work.expenditureLakh)}</p>
              </div>
              <Badge className="bg-green-500/10 text-green-700 dark:bg-green-500/15 dark:text-green-300">
                {utilisationPct.toFixed(0)}% released
              </Badge>
            </CardContent>
          </Card>
          <Card className="gap-5 overflow-hidden rounded-none border-0 ring-0 xl:col-span-2">
            <CardHeader>
              <CardTitle className="font-normal">Balance</CardTitle>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <div className="flex flex-col gap-1">
                <div className="font-heading text-3xl tabular-nums leading-none tracking-tight">
                  {formatLakh(balanceLakh)}
                </div>
                <p className="text-muted-foreground text-xs">Yet to be released</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-7">
          <CardHeader>
            <CardTitle className="font-normal">Expenditure over time</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-50 w-full">
              <LineChart accessibilityLayer data={series} margin={{ bottom: 0, left: 0, right: 0, top: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  axisLine={false}
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  tick={{ fontSize: 12 }}
                  minTickGap={48}
                />
                <YAxis hide axisLine={false} tickLine={false} tickMargin={10} tick={{ fontSize: 12 }} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Line
                  connectNulls
                  dataKey="peer"
                  dot={false}
                  name={peerLabel}
                  stroke="var(--color-peer)"
                  strokeDasharray="5 5"
                  strokeLinecap="round"
                  strokeWidth={1}
                  type="linear"
                />
                <Line
                  dataKey="spent"
                  dot={false}
                  name="Spent"
                  stroke="var(--color-spent)"
                  strokeLinecap="round"
                  strokeWidth={3}
                  type="linear"
                />
              </LineChart>
            </ChartContainer>
            <p className="mt-2 text-muted-foreground text-xs">
              Cumulative releases against {peerLabel.toLowerCase()} — deterministic demo series from work totals.
            </p>
          </CardContent>
        </Card>

        <Card className="xl:col-span-5">
          <CardHeader>
            <CardTitle className="font-normal">Fund split</CardTitle>
          </CardHeader>
          <CardContent className="grid items-center gap-4 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
            <ChartContainer config={fundConfig} className="mx-auto aspect-square h-50">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel className="w-52" nameKey="account" />}
                />
                <Pie
                  cornerRadius={6}
                  data={fundData}
                  dataKey="amount"
                  innerRadius={65}
                  nameKey="account"
                  outerRadius={90}
                  paddingAngle={2}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (!(viewBox && "cx" in viewBox && "cy" in viewBox)) {
                        return null;
                      }
                      return (
                        <text dominantBaseline="middle" textAnchor="middle" x={viewBox.cx} y={viewBox.cy}>
                          <tspan className="fill-muted-foreground text-xs" x={viewBox.cx} y={(viewBox.cy ?? 0) - 8}>
                            Sanctioned
                          </tspan>
                          <tspan
                            className="fill-foreground font-heading font-medium text-lg tabular-nums"
                            x={viewBox.cx}
                            y={(viewBox.cy ?? 0) + 14}
                          >
                            {formatLakh(work.sanctionedLakh)}
                          </tspan>
                        </text>
                      );
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="flex min-w-0 flex-col gap-3">
              {fundData.map((item) => (
                <div className="grid grid-cols-[1fr_auto] items-end gap-3" key={item.key}>
                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-1">
                      <span
                        aria-hidden="true"
                        className="h-2 w-1 rounded-full"
                        style={{ backgroundColor: item.fill }}
                      />
                      <p className="truncate text-muted-foreground text-xs">{item.account}</p>
                    </div>
                    <p className="font-medium tabular-nums">{formatLakh(item.amount)}</p>
                  </div>
                  <div className="font-medium tabular-nums">{item.percentage.toFixed(0)}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
