import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatLakh, works } from "@/lib/mplads-mock";

const sanctioned = works.reduce((total, w) => total + w.sanctionedLakh, 0);
const spent = works.reduce((total, w) => total + w.expenditureLakh, 0);
const balance = sanctioned - spent;
const utilisation = (spent / sanctioned) * 100;

export function OverviewKpis() {
  return (
    <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
      <div className="grid grid-cols-1 xl:grid-cols-8">
        <Card className="gap-5 overflow-hidden rounded-none border-0 border-foreground/10 border-b ring-0 xl:col-span-4 xl:border-r">
          <CardHeader>
            <CardTitle className="font-normal">Sanctioned total</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="space-y-1">
              <div className="font-heading text-3xl tabular-nums leading-none tracking-tight">
                {formatLakh(sanctioned)}
              </div>
              <p className="text-muted-foreground text-xs">across {works.length} demo works</p>
            </div>
            <Badge className="bg-green-500/10 text-green-700 dark:bg-green-500/15 dark:text-green-300">
              {works.length} works
            </Badge>
          </CardContent>
        </Card>

        <Card className="gap-5 overflow-hidden rounded-none border-0 border-foreground/10 border-b ring-0 xl:col-span-4">
          <CardHeader>
            <CardTitle className="font-normal">Released · spent</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <div className="font-heading text-3xl tabular-nums leading-none tracking-tight">{formatLakh(spent)}</div>
              <p className="text-muted-foreground text-xs">{utilisation.toFixed(1)}% of sanctioned · demo-derived</p>
            </div>
            <Badge className="bg-green-500/10 text-green-700 dark:bg-green-500/15 dark:text-green-300">
              {utilisation.toFixed(1)}%
            </Badge>
          </CardContent>
        </Card>

        <Card className="gap-5 overflow-hidden rounded-none border-0 border-foreground/10 ring-0 xl:col-span-4 xl:border-r">
          <CardHeader>
            <CardTitle className="font-normal">Balance · unspent</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <div className="font-heading text-3xl tabular-nums leading-none tracking-tight">
                {formatLakh(balance)}
              </div>
              <p className="text-muted-foreground text-xs">
                {((balance / sanctioned) * 100).toFixed(1)}% held back · demo-derived
              </p>
            </div>
            <Badge variant="destructive" className="bg-destructive/10 text-destructive">
              {((balance / sanctioned) * 100).toFixed(1)}%
            </Badge>
          </CardContent>
        </Card>

        <Card className="gap-5 overflow-hidden rounded-none border-0 ring-0 xl:col-span-4">
          <CardHeader>
            <CardTitle className="font-normal">Utilisation</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <div className="font-heading text-3xl tabular-nums leading-none tracking-tight">
                {utilisation.toFixed(1)}%
              </div>
              <p className="text-muted-foreground text-xs">spent ÷ sanctioned · 40 works</p>
            </div>
            <Badge className="bg-green-500/10 text-green-700 dark:bg-green-500/15 dark:text-green-300">demo</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
