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

interface ChartAreaProps {
  data?: WeatherData[];
  getDataBali?: AvgWeatherData[];
}

const chartConfig = {
  avg_Batt: { label: "Batt_V_Avg", color: "#60a5fa" },
};

export default function BatteryChartBali({ getDataBali }: ChartAreaProps) {
  const formattedData =
    getDataBali?.map((item) => ({
      ...item,

      rawTime: item.hour_timestampBali,
      Batt_Time: new Date(item.hour_timestampBali as any).toLocaleTimeString("id-ID", {
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
      className="h-[380px] w-full border dark:border-[#457B9D] rounded-3xl bg-[#A8DADC] dark:bg-[#1D3557] flex flex-col-2  transition-all duration-300 ease-in-out
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
            labelFormatter={(_: any, payload: any) => {
              const timestamp = payload?.[0]?.payload?.raw_timestampBali;

              if (!timestamp) return "";

              return new Date(timestamp).toLocaleString("id- ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
            }}
            formatter={(value: any) => [
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
