"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelProps,
  ResponsiveContainer,
} from "recharts";
import { RechartsDevtools } from "@recharts/devtools";
import { ChartContainer, ChartLegend, ChartLegendContent } from "../ui/chart";
import { AvgWeatherData } from "@/types/AvgTypes";

interface ChartAreaProps {
  data?: AvgWeatherData[];
  avgData?: AvgWeatherData[];
}

const chartConfig = {
  avg_Ta_Avg: { label: "Suhu Rata-rata", color: "#FF0000" },
  avg_Ta_Max: { label: "Suhu Tertinggi", color: "#FFFF00" },
  avg_Ta_Min: { label: "Suhu Terendah", color: "#00FFFF" },
};

// console.log("avgdaata", AvgHour);

export function ChartLine({ avgData }: ChartAreaProps) {
  // console.log("data di chart ", typeof avgData);

  const formattedData =
    avgData?.map((item) => ({
      period: new Date(item.period.replace(" ", "T")).getTime(),
      avg_e_Avg: (item as any).e_Avg != null ? Number((item as any).e_Avg) : null,
      avg_e_Max: (item as any).e_Max != null ? Number((item as any).e_Max) : null,
      avg_e_Min: (item as any).e_Min != null ? Number((item as any).e_Min) : null,
    })) || [];
  return (
    <div className="w-full border rounded-3xl bg-[#A8DADC] dark:bg-blue-950 flex flex-col transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 hover:border-transparent p-4 sm:p-6 mb-4">
      <div className="w-full flex justify-center mb-4">
        <h3 className="text-[#575555ff] font-poppins font-bold text-lg md:text-xl tracking-wide">
          Line Chart Suhu
        </h3>
      </div>
      <ChartContainer config={chartConfig} className="h-[380px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            style={{
              aspectRatio: 1.618,
            }}
            data={formattedData}
            margin={{
              top: 20,
              right: 40,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid
              strokeDasharray="2 2"
              stroke="#ffffff"
              strokeWidth={1}
              opacity={0.1}
            />
            <XAxis
              dataKey="period"
              
              type="number" // WAJIB: agar jarak antar waktu akurat
              domain={["dataMin", "dataMax"]} // Mulai dari data terkecil sampai terbesar
              scale="time" // Menggunakan skala waktu
              tick={{ fill: "#575555ff", fontSize: 11 }}
              tickFormatter={(unixTime) => {
                return new Date(unixTime).toLocaleTimeString("id-ID", {
                  day: "numeric", // Muncul angka tanggal
                  month: "short", // Muncul singkatan bulan (Jan, Feb, dsb)
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                });
              }}
            />
            <YAxis
              label={{
                value: "Suhu (°C)",
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
            <Tooltip
              formatter={(value: any) => [typeof value === 'number' ? value.toFixed(1) : value, "Nilai"]}
              labelFormatter={(label) =>
                new Date(label).toLocaleString("id-ID")
              }
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                borderColor: "#FFFFFF",
                color: "#fff",
              }}
            />
            <ChartLegend
              content={<ChartLegendContent className="text-[#575555ff]" />}
            />
            <Line
              type="monotone"
              dataKey="avg_e_Avg"
              stroke="#008000"
              // label={CustomizedLabel}
              // dot={{
              //   fill: "var(--color-surface-base)",
              // }}
              dot={false}
              isAnimationActive={false}
              activeDot={{
                stroke: "var(--color-line-stroke)",
              }}
            />
            <Line
              type="monotone"
              dataKey="avg_e_Max"
              stroke="#FF0000"
              // label={CustomizedLabel}
              dot={false}
              // dot={{
              //   fill: "var(--color-surface-base)",
              // }}
              activeDot={{
                stroke: "var(--color-line-stroke)",
              }}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="avg_e_Min"
              stroke="#00FFFF"
              // label={CustomizedLabel}
              // dot={{
              //   fill: "#A78BFA",
              // }}
              dot={false}
              activeDot={{
                stroke: "var(--color-line-stroke-Temp)",
              }}
              isAnimationActive={false}
            />
            <RechartsDevtools />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}

