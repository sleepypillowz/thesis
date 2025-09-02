"use client";

import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
const chartData = [
  {
    browser: "cardiovascular",
    visitors: 275,
    fill: "var(--color-cardiovascular)",
  },
  { browser: "cancer", visitors: 200, fill: "var(--color-cancer)" },
  { browser: "respiratory", visitors: 187, fill: "var(--color-respiratory)" },
  { browser: "mental", visitors: 173, fill: "var(--color-mental)" },
  { browser: "diabetes", visitors: 90, fill: "var(--color-diabetes)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  cardiovascular: {
    label: "cardiovascular",
    color: "hsl(var(--chart-1))",
  },
  cancer: {
    label: "cancer",
    color: "hsl(var(--chart-2))",
  },
  respiratory: {
    label: "respiratory",
    color: "hsl(var(--chart-3))",
  },
  mental: {
    label: "mental",
    color: "hsl(var(--chart-4))",
  },
  diabetes: {
    label: "diabetes",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function CommonDiseasesChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Common Diseases</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <Pie data={chartData} dataKey="visitors" />
            <ChartLegend
              content={<ChartLegendContent nameKey="browser" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
