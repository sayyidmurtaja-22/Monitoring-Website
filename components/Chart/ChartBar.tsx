"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { WeatherData } from "@/types/weather";
import { AvgWeatherData } from "@/types/AvgTypes";
import { useTheme } from "next-themes";

const chartConfig = {
  avg_CNR_Wm2_Avg: { label: "Net Radiometer Average", color: "#2563eb" },
  avg_CNR_Wm2_Max: { label: "Net Radiometer Maximum", color: "#60a5fa" },
  avg_CNR_Wm2_Min: { label: "Net Radiometer Minimum", color: "#60a5fa" },
};

interface ChartAreaProps {
  data?: AvgWeatherData[];
  avgData?: AvgWeatherData[];
}

export function ChartBar({ avgData }: ChartAreaProps) {
  const { resolvedTheme } = useTheme();
  const chartTextColor = resolvedTheme === "dark" ? "#F1FAEE" : "#1D3557";
  
  const hasTime = avgData && avgData.length > 0 ? (avgData[0].period?.includes(" ") || avgData[0].period?.includes(":")) : true;

  const formattedData =
    avgData?.map((item) => {
      const safeString = item.period ? item.period.replace(/-/g, "/") : "";
      const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
      if (hasTime) {
        opts.hour = "2-digit";
        opts.minute = "2-digit";
        opts.hour12 = false;
      }
      return {
        displayTime: safeString ? new Date(safeString).toLocaleTimeString("id-ID", opts) : "-",
        period: item.period,
        avg_CNR_Wm2_Avg: (item as any).CNR_Wm2_Avg != null ? Number((item as any).CNR_Wm2_Avg) : null,
        avg_CNR_Wm2_Max: (item as any).CNR_Wm2_Max != null ? Number((item as any).CNR_Wm2_Max) : null,
        avg_CNR_Wm2_Min: (item as any).CNR_Wm2_Min != null ? Number((item as any).CNR_Wm2_Min) : null,
      };
    }) || [];
  // console.log("Data chart:", formattedData);

  return (
    <div className="w-full border dark:border-[#457B9D] rounded-3xl bg-[#A8DADC] dark:bg-[#1D3557] flex flex-col transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 hover:border-transparent p-4 sm:p-6 mb-4">
      <div className="w-full flex justify-center mb-4">
        <h3 className="text-[#1D3557] dark:text-[#F1FAEE] font-poppins font-bold text-lg md:text-xl tracking-wide">
          Bar Chart NetRadiometer
        </h3>
      </div>
      <ChartContainer
        config={chartConfig}
        className="h-[380px] w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="displayTime"
              type="category"
              tick={{ fill: chartTextColor, fontSize: 11 }}
              tickMargin={10}
              domain={["auto", "auto"]}
              axisLine={false}
            />
            <YAxis
              label={{
                value: "Suhu (W/m^2)",
                angle: -90,
                position: "insideLeft",
                fill: chartTextColor,
              }}
              axisLine={true}
              tickLine={true}
              tick={{ fill: chartTextColor, fontSize: 12 }}
              tickCount={4}
              interval={0}
              domain={["auto", "auto"]}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_: any, payload: any) => {
                    const timestamp = payload?.[0]?.payload?.period;

                    if (!timestamp) return "";
                    const safeString = timestamp.replace(/-/g, "/");

                    const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
                    if (hasTime) {
                      opts.hour = "2-digit";
                      opts.minute = "2-digit";
                    }

                    return new Date(safeString).toLocaleString("id-ID", opts);
                  }}
                  indicator="dot"
                />
              }
            />
            <ChartLegend content={<ChartLegendContent className="text-[#1D3557] dark:text-[#F1FAEE]" />} />
            <Bar dataKey="avg_CNR_Wm2_Avg" fill="#FBBF24" radius={4} />
            <Bar dataKey="avg_CNR_Wm2_Max" fill="#10B981" radius={4} />
            <Bar dataKey="avg_CNR_Wm2_Min" fill="#F43F5E" radius={4} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
