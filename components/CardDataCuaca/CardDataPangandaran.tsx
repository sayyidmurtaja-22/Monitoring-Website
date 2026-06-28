// components/WeatherCard.tsx

"use client";
import * as motion from "motion/react-client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CloudIcon,
  Thermometer,
  Droplet,
  Wind,
  CloudRain,
  Flame,
} from "lucide-react"; // Contoh icon
// import { useEffect, useState } from "react";
// import { WeatherData } from "@/types/weather";
import { AvgWeatherData } from "@/types/AvgTypes";

interface ChartAreaProps {
  data?: AvgWeatherData[];
  avgData: AvgWeatherData[];
}

export default function CardDataPangandaran({ data, avgData }: ChartAreaProps) {
  // Ambil data terbaru (terakhir di array karena data diurutkan ASC)
  const latest = data && data.length > 0 ? data[data.length - 1] : null;
  
  // Hitung total data dari semua data rata-rata
  const totalRecords = avgData?.reduce((acc, curr) => acc + Number(curr.jumlah_data || 0), 0) || 0;

  const cardsInfo = [
    {
      title: "Suhu Terbaru",
      value: Number(latest?.avg_Ta_Avg ?? 0).toFixed(1),
      icon: <Thermometer className="text-orange-300" size={22} />,
      suffix: " °C",
    },
    {
      title: "Kelembapan",
      value: Number(latest?.avg_RH_Avg ?? 0).toFixed(1),
      icon: <Droplet className="text-blue-300" size={22} />,
      suffix: " %",
    },
    {
      title: "Tekanan Uap",
      value: Number(latest?.avg_e_Avg ?? 0).toFixed(2),
      icon: <Wind className="text-cyan-300" size={22} />,
      suffix: " hPa",
    },
    {
      title: "Curah Hujan",
      value: Number(latest?.avg_Rain_mm_Tot ?? 0).toFixed(1),
      icon: <CloudRain className="text-sky-300" size={22} />,
      suffix: " mm",
    },
    {
      title: "Total Data",
      value: totalRecords.toLocaleString("id-ID"),
      icon: <Flame className="text-red-300" size={22} />,
      suffix: " baris",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 w-full ">
        {cardsInfo?.map((card, index) => (
          <motion.div
            key={index}
            className="text-xl"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
          >
            <Card
              className="w-full h-full bg-[#A8DADC] dark:bg-[#1D3557]  transition-all duration-300 ease-in-out
                    hover:shadow-2xl hover:-translate-y-1 hover:border-transparent"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  {card.icon}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className=" text-white dark:text-white capitalize">
                  {card.title}
                </p>
                <p className="text-4xl font-bold text-white">
                  {card.value}
                  {card.suffix}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </>
  );
}
