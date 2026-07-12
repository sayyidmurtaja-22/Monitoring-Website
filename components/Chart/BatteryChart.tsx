"use client"; // Wajib untuk Next.js App Router

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { WeatherData } from "@/types/weather";
import { ChartContainer, ChartLegend, ChartLegendContent } from "../ui/chart";
import { AvgWeatherData } from "@/types/AvgTypes";
import { useTheme } from "next-themes";

// Data simulasi tegangan baterai (V)
// const data = [
//   { time: '00:00', voltage: 12.6 },
//   { time: '02:00', voltage: 12.5 },
//   { time: '04:00', voltage: 12.3 },
//   { time: '06:00', voltage: 12.0 },
//   { time: '08:00', voltage: 11.8 },
//   { time: '10:00', voltage: 11.5 },
//   { time: '12:00', voltage: 12.8 }, // Mulai pengisian
//   { time: '14:00', voltage: 13.2 },
// ];
interface ChartAreaProps {
  data?: AvgWeatherData[];
  avgData: AvgWeatherData[];
  Bali?: AvgWeatherData[];
}

const chartConfig = {
  avg_Batt: { label: "Batt_V_Avg", color: "#60a5fa" },
};

export default function BatteryChart({ avgData }: ChartAreaProps) {
  const { resolvedTheme } = useTheme();
  const chartTextColor = resolvedTheme === "dark" ? "#F1FAEE" : "#1D3557";
  
  const tooltipStyle = {
    backgroundColor: resolvedTheme === "dark" ? "rgba(29, 53, 87, 0.95)" : "rgba(241, 250, 238, 0.95)",
    borderColor: resolvedTheme === "dark" ? "#457B9D" : "#A8DADC",
    borderRadius: "12px",
    color: resolvedTheme === "dark" ? "#F1FAEE" : "#1D3557",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  };
  
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
        rawTimeStamp: item.period,
        Batt_Time: safeString ? new Date(safeString).toLocaleString("id-ID", opts) : "-",
        avg_Batt: (item as any).Batt_V_Avg != null ? Number((item as any).Batt_V_Avg) : null,
      };
    }) || [];

  return (
    <div className="w-full border dark:border-[#457B9D] rounded-3xl bg-[#A8DADC] dark:bg-[#1D3557] flex flex-col transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 hover:border-transparent p-4 sm:p-6 mb-4">
      <div className="w-full flex justify-center mb-4">
        <h3 className="text-[#1D3557] dark:text-[#F1FAEE] font-poppins font-bold text-lg md:text-xl tracking-wide">
          Chart Tegangan Baterai
        </h3>
      </div>
      <ChartContainer
        config={chartConfig}
        className="h-[380px] w-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formattedData}
            margin={{
              top: 20,
              right: 40,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeWidth={1} opacity={0.1} />
            <XAxis
              dataKey="Batt_Time"
              tick={{ fill: chartTextColor, fontSize: 11 }}
              domain={["auto", "auto"]}
              axisLine={true}
            // label={{
            //   value: "Waktu",
            //   position: "insideBottomLeft",
            //   offset: 0,
            // }}
            />
            <YAxis
              label={{
                value: "Tegangan (V)",
                angle: -90,
                position: "insideLeft",
                fill: chartTextColor,
              }}
              tick={{ fill: chartTextColor, fontSize: 12 }}
              domain={["auto", "auto"]}
            />
            <Tooltip
              labelFormatter={(_: any, payload: any) => {
                const timestamp = payload?.[0]?.payload?.rawTimeStamp;

                if (!timestamp) return "";
                const safeString = timestamp.replace(/-/g, "/");

                const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
                if (hasTime) {
                  opts.hour = "2-digit";
                  opts.minute = "2-digit";
                }

                return new Date(safeString).toLocaleString("id-ID", opts);
              }}
              formatter={(value: any) => [
                `${value?.toFixed(2)} V`,
                "Tegangan",
              ]}
              contentStyle={tooltipStyle}
            />
            <ChartLegend
              content={<ChartLegendContent className="text-[#1D3557] dark:text-[#F1FAEE]" />}
            />
            <Line
              type="monotone"
              dataKey="avg_Batt"
              stroke="#8884d8"
              dot={false}
              // dot={{ r: 4, fill: "#60a5fa" }}
              activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
              name="Rata-Rata Tegangan Baterai"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
