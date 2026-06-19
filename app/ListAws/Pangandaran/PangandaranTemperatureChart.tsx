"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { RechartsDevtools } from "@recharts/devtools";
import { AvgWeatherData } from "@/types/AvgTypes";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

interface PangandaranTemperatureChartProps {
  avgData: AvgWeatherData[];
}

// ── Konfigurasi warna & label untuk legend ──
const chartConfig = {
  avg_Ta_Avg: { label: "Suhu Rata-rata (°C)", color: "#008000" },
  avg_Ta_Max: { label: "Suhu Tertinggi (°C)", color: "#FF0000" },
  avg_Ta_Min: { label: "Suhu Terendah (°C)", color: "#00FFFF" },
};

export function PangandaranTemperatureChart({ avgData }: PangandaranTemperatureChartProps) {
  // ── Transformasi data: konversi `period` → unix-time, pastikan tipe Number ──
  const formattedData = avgData.map((item) => ({
    ...item,
    periodTime: new Date(item.period).getTime(),
    avg_Ta_Max: item.avg_Ta_Max != null ? Number(item.avg_Ta_Max) : null,
    avg_Ta_Min: item.avg_Ta_Min != null ? Number(item.avg_Ta_Min) : null,
    avg_Ta_Avg: item.avg_Ta_Avg != null ? Number(item.avg_Ta_Avg) : null,
  }));

  return (
    <div className="w-full border rounded-3xl bg-blue-600 dark:bg-blue-950 flex flex-col transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 hover:border-transparent p-4 sm:p-6 mb-4">
      <div className="w-full flex justify-center mb-4">
        <h3 className="text-white font-bold text-lg md:text-xl tracking-wide">
          Line Chart Suhu Pangandaran
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
              strokeWidth={0.5}
              opacity={0.5}
            />
            <XAxis
              dataKey="periodTime"
              type="number"
              domain={["dataMin", "dataMax"]}
              scale="time"
              tick={{ fill: "#ffffff", fontSize: 11 }}
              tickFormatter={(unixTime) => {
                return new Date(unixTime).toLocaleTimeString("id-ID", {
                  day: "numeric",
                  month: "short",
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
                color: "#ffffff",
              }}
              axisLine={true}
              tickLine={true}
              tick={{ fill: "#ffffff", fontSize: 12 }}
              tickCount={4}
              interval={0}
              domain={["auto", "auto"]}
            />
            <Tooltip
              formatter={(value: number) => [value?.toFixed(2), "Nilai"]}
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
              content={<ChartLegendContent className="text-white" />}
            />
            <Line
              type="monotone"
              dataKey="avg_Ta_Avg"
              stroke="#008000"
              dot={false}
              isAnimationActive={false}
              activeDot={{
                stroke: "var(--color-line-stroke)",
              }}
            />
            <Line
              type="monotone"
              dataKey="avg_Ta_Max"
              stroke="#FF0000"
              dot={false}
              activeDot={{
                stroke: "var(--color-line-stroke)",
              }}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="avg_Ta_Min"
              stroke="#00FFFF"
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
