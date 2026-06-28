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
import { useTheme } from "next-themes";

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
  const { resolvedTheme } = useTheme();
  const chartTextColor = resolvedTheme === "dark" ? "#F1FAEE" : "#1D3557";
  
  const tooltipStyle = {
    backgroundColor: resolvedTheme === "dark" ? "rgba(29, 53, 87, 0.95)" : "rgba(241, 250, 238, 0.95)",
    borderColor: resolvedTheme === "dark" ? "#457B9D" : "#A8DADC",
    borderRadius: "12px",
    color: resolvedTheme === "dark" ? "#F1FAEE" : "#1D3557",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  };
  
  // console.log("data di chart ", typeof avgData);

  const formattedData =
    avgData?.map((item) => ({
      period: new Date(item.period.replace(" ", "T")).getTime(),
      avg_e_Avg: (item as any).e_Avg != null ? Number((item as any).e_Avg) : null,
      avg_e_Max: (item as any).e_Max != null ? Number((item as any).e_Max) : null,
      avg_e_Min: (item as any).e_Min != null ? Number((item as any).e_Min) : null,
    })) || [];
  const hasTime = avgData && avgData.length > 0 ? (avgData[0].period?.includes(" ") || avgData[0].period?.includes(":")) : true;

  return (
    <div className="w-full border dark:border-[#457B9D] rounded-3xl bg-[#A8DADC] dark:bg-[#1D3557] flex flex-col transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 hover:border-transparent p-4 sm:p-6 mb-4">
      <div className="w-full flex justify-center mb-4">
        <h3 className="text-[#1D3557] dark:text-[#F1FAEE] font-poppins font-bold text-lg md:text-xl tracking-wide">
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
              tick={{ fill: chartTextColor, fontSize: 11 }}
              tickFormatter={(unixTime) => {
                const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
                if (hasTime) {
                  opts.hour = "2-digit";
                  opts.minute = "2-digit";
                  opts.hour12 = false;
                }
                return new Date(unixTime).toLocaleTimeString("id-ID", opts);
              }}
            />
            <YAxis
              label={{
                value: "Suhu (°C)",
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
            <Tooltip
              formatter={(value: any) => [typeof value === 'number' ? value.toFixed(1) : value, "Nilai"]}
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

