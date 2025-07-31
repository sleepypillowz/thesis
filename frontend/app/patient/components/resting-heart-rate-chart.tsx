"use client";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A line chart with a label";

const chartData = [
  { day: "Sunday", heartRate: 69 },
  { day: "Monday", heartRate: 75 },
  { day: "Tuesday", heartRate: 72 },
  { day: "Wednesday", heartRate: 69 },
  { day: "Thursday", heartRate: 75 },
  { day: "Friday", heartRate: 80 },
  { day: "Saturday", heartRate: 87 },
];

const chartConfig = {
  heartRate: {
    label: "Heart Rate",
    color: "oklch(55.1% 0.027 264.364)",
  },
} satisfies ChartConfig;

export function RestingHeartRateChart() {
  return (
    <Card className="chart">
      <CardHeader>
        <CardTitle>Resting Heart Rate</CardTitle>
        <CardDescription>
          <span className="font-bold">72 bmp </span>
          <span>(Average)</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={true}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="heartRate"
              type="natural"
              stroke="oklch(55.1% 0.027 264.364)"
              strokeWidth={2}
              dot={{
                fill: "oklch(55.1% 0.027 264.364)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-center gap-2 text-sm font-bold">
        <span>Weekday</span>
      </CardFooter>
    </Card>
  );
}
