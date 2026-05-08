"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { WeatherData } from "@/types/weather";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface ChartAreaProps {
  data?: WeatherData[];
}

const chartConfig = {
  Ta_Avg: {
    label: "Suhu Rata-rata",
    color: "var(--chart-1)",
  },
  RH_Avg: {
    label: "Kelembaban",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

// ✅ Terima props data
export function ChartArea({ data = [] }: ChartAreaProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Area Chart</CardTitle>
        <CardDescription>Data Cuaca Terkini</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(11, 16)} // ambil jam:menit
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillTa" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-Ta_Avg)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-Ta_Avg)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillRH" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-RH_Avg)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-RH_Avg)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="Ta_Avg"
              type="natural"
              fill="url(#fillTa)"
              fillOpacity={0.4}
              stroke="var(--color-Ta_Avg)"
              stackId="a"
            />
            <Area
              dataKey="RH_Avg"
              type="natural"
              fill="url(#fillRH)"
              fillOpacity={0.4}
              stroke="var(--color-RH_Avg)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Data real-time <TrendingUp className="h-4 w-4" />
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
