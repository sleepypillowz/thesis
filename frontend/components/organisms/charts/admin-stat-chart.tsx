"use client";

import { Area, AreaChart } from "recharts";

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

export const description = "A area chart";

// Component props
type AdminStatChartProps = {
  title: string;
  total: number | string;
  color: string;
  icon: React.ElementType;
  data: { month: string; value: number }[];
};

export function AdminStatChart({
  title,
  total,
  color,
  icon,
  data,
}: AdminStatChartProps) {
  const colorMap: Record<string, string> = {
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
  };

  const chartConfig: ChartConfig = {
    value: {
      label: title,
      color: `var(--${color})`,
    },
  };

  const IconComponent = icon;

  return (
    <Card className={`h-full rounded-lg bg-${color}-100`}>
      <CardHeader className="p-0 mt-4">
        <div className="flex flex-row justify-between ml-4 items-center">
          <div
            className={`border rounded-lg p-2 ${
              colorMap[color] || "bg-gray-500"
            }`}
          >
            <IconComponent className="text-white" />
          </div>

          <div className="mr-4 space-y-2 flex flex-col items-end font-bold text-xs">
            <CardTitle className="dark:text-black">{title}</CardTitle>
            <CardDescription className="text-black dark:text-black">
              {total}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer config={chartConfig} className="w-full h-16">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 0,
              right: 0,
            }}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Area
              dataKey="value"
              type="natural"
              fill={color}
              fillOpacity={0.2}
              stroke={color}
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
