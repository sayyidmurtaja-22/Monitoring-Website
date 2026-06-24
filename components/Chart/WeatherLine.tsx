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
import { ChartLineConfig } from "@/config/Location";

interface ChartAreaProps {
  data?: AvgWeatherData[];
  avgData?: AvgWeatherData[]; // data dari tabel manapun
  lines: ChartLineConfig[];
  title: string; // judul chart
  yLabel: string;
}

export function WeatherLine({ data, lines, title, yLabel }: ChartAreaProps) {
  const chartConfig = lines.reduce(
    (acc, line) => {
      acc[line.key] = { label: line.name, color: line.color };
      return acc;
    },
    {} as Record<string, { label: string; color: string }>,
  );

  const formatted =
    data?.map((item) => ({
      ...item,
      period: new Date(item.period?.replace(" ", "T")).getTime(),
    })) || [];

  return (
    <div className="w-full border rounded-3xl bg-[#A8DADC] dark:bg-blue-950 flex flex-col transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 hover:border-transparent p-4 sm:p-6 mb-4">
      <div className="w-full flex justify-center mb-4">
        <h3 className="text-[#ffff] font-poppins font-bold text-lg md:text-xl tracking-wide">
          {title}
        </h3>
      </div>
      <ChartContainer config={chartConfig} className="h-[380px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            style={{
              aspectRatio: 1.618,
            }}
            data={formatted}
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
                value: yLabel,
                angle: -90,
                position: "insideLeft",
                color: "#ffffff",
              }}
              axisLine={true}
              tickLine={true}
              tick={{ fill: "#575555ff", fontSize: 12 }}
              tickCount={4}
              interval={0}
              domain={["auto", "auto"]}
            />
            <Tooltip
              formatter={(value: any, name: any) => [
                value?.toFixed(1),
                "Nilai",
              ]}
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

            {lines.map((line) => (
              <Line
                type="monotone"
                key={line.key}
                dataKey={line.key}
                stroke={line.color}
                strokeWidth={2.5}
                // label={CustomizedLabel}
                // dot={{
                //   fill: "var(--color-surface-base)",
                // }}
                dot={false}
                isAnimationActive={false}
                // activeDot={{
                //   stroke: "#fffff",
                // }}
              />
            ))}
            <RechartsDevtools />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
