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
import { ChartContainer } from "../ui/chart";
import { AvgWeatherData } from "@/types/AvgTypes";

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
  getDataBali?: AvgWeatherData[];
}

const chartConfig = {
  avg_Batt: { label: "Batt_V_Avg", color: "#60a5fa" },
};

export default function BatteryChart({ avgData }: ChartAreaProps) {
  const formattedData =
    avgData?.map((item) => ({
      ...item,

      rawTimeStamp: item.period,
      Batt_Time: new Date(item.period).toLocaleTimeString("id-ID", {
        day: "numeric", // Muncul angka tanggal
        month: "short", // Muncul singkatan bulan (Jan, Feb, dsb)
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    })) || [];

  return (
    <ChartContainer
      config={chartConfig}
      className="h-[380px] w-full border  rounded-3xl bg-blue-600 dark:bg-blue-950 flex flex-col-2  transition-all duration-300 ease-in-out
                    hover:shadow-2xl hover:-translate-y-1 hover:border-transparent"
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
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="Batt_Time"
            tick={{ fill: "#ffffff", fontSize: 11 }}
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
            }}
            domain={["auto", "auto"]}
          />
          <Tooltip
            LabelFormatter={(_, payload) => {
              const timestamp = payload?.[0]?.payload?.rawTimeStamp;

              if (!timestamp) return "";

              return new Date(timestamp).toLocaleString("id- ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
            }}
            formatter={(value: number) => [
              `${value?.toFixed(2)} V`,
              "Tegangan",
            ]}
            contentStyle={{
              backgroundColor: "rgba(15, 23, 42,0.9)",
              borderColor: "#FFFFFF33",
              borderRadius: "12px",
              color: "#fff",
            }}
          />
          <Legend />
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
  );
}
