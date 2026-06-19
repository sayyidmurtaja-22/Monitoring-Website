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
  const formattedData =
    avgData?.map((item) => ({
      // Ganti spasi dengan "T" agar format "YYYY-MM-DD HH:00:00" menjadi ISO string yang valid
      displayTime: new Date(item.period.replace(" ", "T")).toLocaleTimeString("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      period: item.period,
      avg_CNR_Wm2_Avg: (item as any).CNR_Wm2_Avg != null ? Number((item as any).CNR_Wm2_Avg) : null,
      avg_CNR_Wm2_Max: (item as any).CNR_Wm2_Max != null ? Number((item as any).CNR_Wm2_Max) : null,
      avg_CNR_Wm2_Min: (item as any).CNR_Wm2_Min != null ? Number((item as any).CNR_Wm2_Min) : null,
    })) || [];
  // console.log("Data chart:", formattedData);

  return (
    <div className="w-full border rounded-3xl bg-[#A8DADC] dark:bg-blue-950 flex flex-col transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 hover:border-transparent p-4 sm:p-6 mb-4">
      <div className="w-full flex justify-center mb-4">
        <h3 className="text-[#575555ff] font-poppins font-bold text-lg md:text-xl tracking-wide">
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
              tick={{ fill: "#575555ff", fontSize: 11 }}
              tickMargin={10}
              domain={["auto", "auto"]}
              axisLine={false}
            />
            <YAxis
              label={{
                value: "Suhu (W/m^2)",
                angle: -90,
                position: "insideLeft",
                color: "#575555ff",
              }}
              axisLine={true}
              tickLine={true}
              tick={{ fill: "#575555ff", fontSize: 12 }}
              tickCount={4}
              interval={0}
              domain={["auto", "auto"]}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const timestamp = payload?.[0]?.payload?.period;

                    if (!timestamp) return "";

                    return new Date(timestamp).toLocaleString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <ChartLegend content={<ChartLegendContent className="text-[#575555ff]" />} />
            <Bar dataKey="avg_CNR_Wm2_Avg" fill="#FBBF24" radius={4} />
            <Bar dataKey="avg_CNR_Wm2_Max" fill="#10B981" radius={4} />
            <Bar dataKey="avg_CNR_Wm2_Min" fill="#F43F5E" radius={4} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
