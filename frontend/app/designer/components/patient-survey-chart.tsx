"use client";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { month: "January", new_patients: 186, old_patients: 80 },
  { month: "February", new_patients: 305, old_patients: 200 },
  { month: "March", new_patients: 237, old_patients: 120 },
  { month: "April", new_patients: 73, old_patients: 190 },
  { month: "May", new_patients: 209, old_patients: 130 },
  { month: "June", new_patients: 214, old_patients: 140 },
  { month: "July", new_patients: 186, old_patients: 80 },
  { month: "August", new_patients: 305, old_patients: 200 },
  { month: "September", new_patients: 237, old_patients: 120 },
  { month: "October", new_patients: 73, old_patients: 190 },
  { month: "November", new_patients: 209, old_patients: 130 },
  { month: "December", new_patients: 214, old_patients: 140 },
];

const chartConfig = {
  new_patients: {
    label: "new_patients",
    color: "oklch(60.6% 0.25 292.717)",
  },
  old_patients: {
    label: "old_patients",
    color: "oklch(72.3% 0.219 149.579)",
  },
} satisfies ChartConfig;

export function PatientSurveyChart() {
  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Patient Statistics</CardTitle>
        <CardDescription>Showing total visitors for last year</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: -20,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={3}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Area
              dataKey="old_patients"
              type="natural"
              fill="var(--color-old_patients)"
              fillOpacity={0.4}
              stroke="var(--color-old_patients)"
              stackId="a"
            />
            <Area
              dataKey="new_patients"
              type="natural"
              fill="var(--color-new_patients)"
              fillOpacity={0.4}
              stroke="var(--color-new_patients)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
