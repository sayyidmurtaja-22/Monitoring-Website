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
import { WeatherData } from "@/types/weather";
import { ChartContainer, ChartLegend, ChartLegendContent } from "../ui/chart";
import { useSearchParams } from "next/navigation";
import { log } from "console";

import { AvgWeatherData } from "@/types/AvgTypes";
import { div } from "framer-motion/client";

interface ChartAreaProps {
  data?: WeatherData[];
  getDataBali?: AvgWeatherData[];
}

// const CustomizedLabel = ({ x, y, stroke, value }: LabelProps) => {
//   const formatedValue = Number(value).toFixed(1);
//   return (
//     <text
//       x={x}
//       y={y}
//       dy={-4}
//       fill={"#ffffff"}
//       fontSize={12}
//       textAnchor="middle"
//     >
//       {formatedValue}
//     </text>
//   );
// };

// const CustomizedAxisTick = ({ x, y, payload }: any) => {
//   const date = new Date(payload.value);
//   if (isNaN(date.getTime())) return null;

//   const formatted = date.toLocaleString("id-ID", {
//     day: "2-digit",
//     month: "2-digit",
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: false,
//   });

//   return (
//     <g transform={`translate(${x},${y})`}>
//       <text
//         x={0}
//         y={0}
//         dy={20}
//         textAnchor="middle"
//         fill="#FFFFFF"
//         fontSize={12}
//         transform="rotate(-15)"
//         fontWeight={500}
//       >
//         {formatted}
//       </text>
//     </g>
//   );
// };

const chartConfig = {
  avg_e_Avg: { label: "Suhu Rata-rata", color: "#FF0000" },
  avg_e_Max: { label: "Tekanan Uap Rata-rata", color: "#FFFF00" },
  avg_e_Min: { label: "Tekanan Uap Rata-rata", color: "#00FFFF" },
};

// console.log("avgdaata", AvgHour);

export function ChartLineBali({ getDataBali }: ChartAreaProps) {
  const formattedData =
    getDataBali?.map((item) => ({
      ...item,

      hour_timestampBali: new Date(item.hour_timestampBali as any).getTime(),
    })) || [];
  console.log("Data Terformat:", formattedData);
  return (
    <>
      <div className=" rounded-3xl w-40 py-1 bg-blue-800">
        <h3 className=" w-60 px-4 font-black  "> Line Chart Suhu </h3>
      </div>
      <ChartContainer
        config={chartConfig}
        className="h-[380px] w-full border rounded-3xl bg-blue-600 dark:bg-blue-950 flex flex-col-2  transition-all duration-300 ease-in-out
      hover:shadow-2xl hover:-translate-y-1 hover:border-transparent "
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            style={{
              // width: "100%",
              // maxWidth: "400px",
              // maxHeight: "200px",
              aspectRatio: 1.618,
            }}
            responsive
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
              dataKey="hour_timestampBali"
              // height={40}
              // tick={CustomizedAxisTick}
              // axisLine={true}
              // interval={23}
              type="number" // WAJIB: agar jarak antar waktu akurat
              domain={["dataMin", "dataMax"]} // Mulai dari data terkecil sampai terbesar
              scale="time" // Menggunakan skala waktu
              tick={{ fill: "#ffffff", fontSize: 11 }}
              tickFormatter={(unixTime) => {
                // Menampilkan label per hari (Contoh: 13 Sep)
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
              formatter={(value: any) => [typeof value === 'number' ? value.toFixed(2) : value, "Nilai"]}
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
              dataKey="avg_e_Avg"
              stroke="#008000"
              // label={CustomizedLabel}
              // dot={{
              //   fill: "var(--color-surface-base)",
              // }}
              dot={false}
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
            />
            <RechartsDevtools />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </>
  );
}
