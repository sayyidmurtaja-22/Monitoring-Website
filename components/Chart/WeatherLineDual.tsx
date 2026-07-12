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
import { ChartContainer, ChartLegend, ChartLegendContent } from "../ui/chart";
import { AvgWeatherData } from "@/types/AvgTypes";
import { ChartLineConfig } from "@/config/Location";
import { useTheme } from "next-themes";

interface ChartAreaProps {
  data?: AvgWeatherData[];
  lines: ChartLineConfig[];
  title: string;
}

export function WeatherLineDual({ data, lines, title }: ChartAreaProps) {
  const { resolvedTheme } = useTheme();
  const chartTextColor = resolvedTheme === "dark" ? "#F1FAEE" : "#1D3557";
  
  const tooltipStyle = {
    backgroundColor: resolvedTheme === "dark" ? "rgba(29, 53, 87, 0.95)" : "rgba(241, 250, 238, 0.95)",
    borderColor: resolvedTheme === "dark" ? "#457B9D" : "#A8DADC",
    borderRadius: "12px",
    color: resolvedTheme === "dark" ? "#F1FAEE" : "#1D3557",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  };
  
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
      // Mengonversi waktu periode ke format Timestamp (ms)
      period: new Date(item.period?.replace(" ", "T")).getTime(),
    })) || [];

  // Kita asumsikan array index 0 untuk Y-Axis Kiri, dan index 1 untuk Y-Axis Kanan
  const leftLine = lines[0];
  const rightLine = lines[1];

  const hasTime = data && data.length > 0 ? (data[0].period?.includes(" ") || data[0].period?.includes(":")) : true;

  return (
    <div className="w-full border dark:border-[#457B9D] rounded-3xl bg-[#A8DADC] dark:bg-[#1D3557] flex flex-col transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 hover:border-transparent p-4 sm:p-6">
      <div className="w-full flex justify-center mb-4">
        <h3 className="text-[#1D3557] dark:text-[#F1FAEE] font-poppins font-bold text-lg md:text-xl tracking-wide">
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
              right: 10,
              left: 0,
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
              tick={{ fill: chartTextColor, fontSize: 11 }}
              tickFormatter={(unixTime) => {
                const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
                if (hasTime) {
                  opts.hour = "2-digit";
                  opts.minute = "2-digit";
                  opts.hour12 = false;
                }
                return new Date(unixTime).toLocaleString("id-ID", opts);
              }}
            />

            {/* === Y-AXIS KIRI (Left) === */}
            {leftLine && (
              <YAxis
                yAxisId="left"
                orientation="left"
                label={{
                  value: `${leftLine.name} (${leftLine.unit || ""})`,
                  angle: -90,
                  position: "insideLeft",
                  fill: chartTextColor,
                  offset: 10,
                }}
                axisLine={true}
                tickLine={true}
                tick={{ fill: chartTextColor, fontSize: 12, fontWeight: 600 }}
                tickCount={4}
                domain={["auto", "auto"]}
              />
            )}

            {/* === Y-AXIS KANAN (Right) === */}
            {rightLine && (
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{
                  value: `${rightLine.name} (${rightLine.unit || ""})`,
                  angle: 90,
                  position: "insideRight",
                  fill: chartTextColor,
                  offset: 10,
                }}
                axisLine={true}
                tickLine={true}
                tick={{ fill: chartTextColor, fontSize: 12, fontWeight: 600 }}
                tickCount={4}
                domain={["auto", "auto"]}
              />
            )}

            <Tooltip
              formatter={(value: any, name: any) => {
                // Mencari line berdasarkan kunci atau nama untuk mendapatkan unit
                const line = lines.find(
                  (l) => l.key === name || l.name === name
                );
                const unit = line?.unit || "";
                return [`${value?.toFixed(2)} ${unit}`, name];
              }}
              labelFormatter={(label) => {
                const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
                if (hasTime) {
                  opts.hour = "2-digit";
                  opts.minute = "2-digit";
                  opts.hour12 = false;
                }
                return new Date(label).toLocaleString("id-ID", opts);
              }}
              contentStyle={tooltipStyle}
            />
            <ChartLegend
              content={<ChartLegendContent className="text-[#1D3557] dark:text-[#F1FAEE]" />}
            />

            {/* Garis Kiri */}
            {leftLine && (
              <Line
                yAxisId="left"
                type="monotone"
                key={leftLine.key}
                dataKey={leftLine.key}
                stroke={leftLine.color}
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={false}
              />
            )}

            {/* Garis Kanan */}
            {rightLine && (
              <Line
                yAxisId="right"
                type="monotone"
                key={rightLine.key}
                dataKey={rightLine.key}
                stroke={rightLine.color}
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={false}
              />
            )}

            <RechartsDevtools />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
