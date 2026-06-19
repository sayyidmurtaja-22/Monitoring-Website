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
import { WeatherData } from "@/types/weather";
import { AvgWeatherData } from "@/types/AvgTypes";

interface ChartAreaProps {
  data?: AvgWeatherData[];
  getDataBali?: AvgWeatherData[];
}

export default function CardDataBali({ data, getDataBali }: ChartAreaProps) {
  const latest = data && data.length > 0 ? data[0] : null;
  const latestavg =
    getDataBali && getDataBali.length > 0 ? getDataBali[0] : null;
  // const totalRecords = latestavg.reduce((acc, curr) => acc + Number(curr.jumlah_data), 0);
  const cardsInfo = [
    {
      title: "Suhu Rata-rata",
      value: `${Number(latestavg?.avg_Ta_Avg ?? 0).toFixed(1)}°C`,
      icon: <Thermometer className="text-orange-300" size={22} />,
      suffix: " °C",
    },
    {
      title: "Kelembapan",
      value: `${Number(latestavg?.avg_RH_Avg ?? 0).toFixed(1)}%`,
      icon: <Droplet className="text-blue-300" size={22} />,
      suffix: " %",
    },
    {
      title: "Tekanan Uap",
      value: Number(latestavg?.avg_e_Avg ?? 0).toFixed(2),
      icon: <Wind className="text-cyan-300" size={22} />,
      suffix: " hPa",
    },
    {
      title: "Curah Hujan",
      value: `${Number(latestavg?.avg_Rain_mm_Tot ?? 0).toFixed(1)} mm`,
      icon: <CloudRain className="text-sky-300" size={22} />,
      suffix: " mm",
    },
    {
      title: "Jumlah Data",
      value: `${Number(latestavg?.jumlah_data ?? 0).toLocaleString("id-ID")} data`,
      icon: <Flame className="text-red-300" size={22} />,
      // suffix: "°C=",
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
              className="w-full h-full bg-blue-600 dark:bg-blue-950  transition-all duration-300 ease-in-out
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
                  {parseFloat(String(card.value)).toString().substring(0, 4)}
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
