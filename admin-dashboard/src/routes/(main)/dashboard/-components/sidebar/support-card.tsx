import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SupportCard() {
  return (
    <Card size="sm" className="overflow-hidden shadow-none group-data-[collapsible=icon]:hidden">
      <CardHeader className="min-w-0 px-4">
        <CardTitle className="truncate text-sm">Have something in mind?</CardTitle>
        <CardDescription className="line-clamp-3">Suggest a feature or contact your workspace admin.</CardDescription>
      </CardHeader>
    </Card>
  );
}
