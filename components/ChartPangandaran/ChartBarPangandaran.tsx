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
  data?: WeatherData[];
  getDataBali?: AvgWeatherData[];
}

export function ChartBarBali({ getDataBali }: ChartAreaProps) {
  const formattedData =
    getDataBali?.map((item) => ({
      ...item,

      displayTime: new Date(item.hour_timestampBali as any).toLocaleTimeString(
        "id-ID",
        {
          day: "numeric", // Muncul angka tanggal
          month: "short", // Muncul singkatan bulan (Jan, Feb, dsb)
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        },
      ),
    })) || [];
  console.log("Data chart:", formattedData);

  return (
    <>
      <div className="rounded-3xl bg-blue-800 w-60 py-1">
        <h3 className="font-black w-60 px-4 ">Bar Chart NetRadiometer</h3>
      </div>
      <ChartContainer
        config={chartConfig}
        className="h-[380px] w-full border dark:border-[#457B9D] rounded-3xl bg-[#A8DADC] dark:bg-[#1D3557] flex flex-col-2  transition-all duration-300 ease-in-out
                    hover:shadow-2xl hover:-translate-y-1 hover:border-transparent"
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
              tick={{ fill: "#ffffff", fontSize: 11 }}
              tickMargin={10}
              domain={["auto", "auto"]}
              axisLine={false}
            />
            <YAxis
              label={{
                value: "Suhu (W/m^2)",
                angle: -90,
                position: "insideLeft",
                color: "#ffffff",
              }}
              axisLine={true}
              tickLine={true}
              tick={{ fill: "#ffffff", fontSize: 12 }}
              tickCount={4}
              interval={0}
              domain={["auto", "auto"]}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_: any, payload: any) => {
                    const timestamp = payload?.[0]?.payload?.hour_timestamp;

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
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="avg_CNR_Wm2_Avg" fill="#FBBF24" radius={4} />
            <Bar dataKey="avg_CNR_Wm2_Max" fill="#10B981" radius={4} />
            <Bar dataKey="avg_CNR_Wm2_Min" fill="#F43F5E" radius={4} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </>
  );
}
