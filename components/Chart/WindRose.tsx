"use client";

import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { AvgWeatherData } from "@/types/AvgTypes";
import { ChartConfig } from "@/config/Location";
import { useTheme } from "next-themes";

interface WindRoseProps {
  data?: AvgWeatherData[];
  speedConfig: ChartConfig;
  directionConfig: ChartConfig;
}

const WindRose = ({ data, speedConfig, directionConfig }: WindRoseProps) => {
  const { resolvedTheme } = useTheme();
  const chartTextColor = resolvedTheme === "dark" ? "#F1FAEE" : "#1D3557";
  
  const tooltipBgColor = resolvedTheme === "dark" ? "rgba(29, 53, 87, 0.95)" : "rgba(241, 250, 238, 0.95)";
  const tooltipBorderColor = resolvedTheme === "dark" ? "#457B9D" : "#A8DADC";
  const tooltipTextColor = resolvedTheme === "dark" ? "#F1FAEE" : "#1D3557";
  
  // Arah mata angin (16 arah atau 8 arah)
  const directions = [
    "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", 
    "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
  ];
  
  // Kategori kecepatan angin (m/s) berdasarkan Skala Beaufort (Force 0 - 12)
  const speedCategories = [
    { name: "0 Calm (<0.3)", min: 0, max: 0.3, color: "#e5e7eb" }, // Gray-200
    { name: "1 Light Air (0.3-1.5)", min: 0.3, max: 1.5, color: "#bbf7d0" }, // Green-200
    { name: "2 Light Breeze (1.5-3.3)", min: 1.5, max: 3.3, color: "#86efac" }, // Green-300
    { name: "3 Gentle Breeze (3.3-5.4)", min: 3.3, max: 5.4, color: "#4ade80" }, // Green-400
    { name: "4 Mod. Breeze (5.4-7.9)", min: 5.4, max: 7.9, color: "#22c55e" }, // Green-500
    { name: "5 Fresh Breeze (7.9-10.7)", min: 7.9, max: 10.7, color: "#fef08a" }, // Yellow-200
    { name: "6 Strong Breeze (10.7-13.8)", min: 10.7, max: 13.8, color: "#facc15" }, // Yellow-400
    { name: "7 Near Gale (13.8-17.1)", min: 13.8, max: 17.1, color: "#eab308" }, // Yellow-500
    { name: "8 Gale (17.1-20.7)", min: 17.1, max: 20.7, color: "#fb923c" }, // Orange-400
    { name: "9 Strong Gale (20.7-24.4)", min: 20.7, max: 24.4, color: "#f97316" }, // Orange-500
    { name: "10 Storm (24.4-28.4)", min: 24.4, max: 28.4, color: "#ef4444" }, // Red-500
    { name: "11 Violent Storm (28.4-32.6)", min: 28.4, max: 32.6, color: "#b91c1c" }, // Red-700
    { name: "12 Hurricane (>32.6)", min: 32.6, max: Infinity, color: "#7e22ce" }, // Purple-600
  ];

  // Hitung distribusi arah dan kecepatan angin dari data secara dinamis
  const { windData, totalCount } = useMemo(() => {
    if (!data || data.length === 0) return { windData: [], totalCount: 0 };

    const matrix = directions.map(() => speedCategories.map(() => 0));
    let totalCount = 0;

    // Mendapatkan kunci (key) parameter utama dari config (Contoh: "WS_S_Avg", "W_D_Avg")
    const speedKey = speedConfig.lines[0]?.key;
    const dirKey = directionConfig.lines[0]?.key;

    data.forEach((record) => {
      // Mengambil data secara dinamis menggunakan kunci yang disediakan dari config.
      // Jika di tabel rata-rata (AvgTypes) ada prefiks "avg_", maka kita coba "avg_" + key terlebih dahulu
      let windSpeed = (record as any)[`avg_${speedKey}`] ?? (record as any)[speedKey];
      let windDirection = (record as any)[`avg_${dirKey}`] ?? (record as any)[dirKey];

      // Trik fallback jika key config tidak cocok atau belum disesuaikan sempurna (Misalnya W_D_Avg kosong, coba WD_Max_WS)
      if (windDirection == null) windDirection = (record as any).WD_Max_WS ?? (record as any).avg_WD_Max_WS ?? record.avg_W_D_Avg;
      if (windSpeed == null) windSpeed = (record as any).WS_S_Avg ?? record.avg_WS_S_Avg;

      if (windDirection == null || windSpeed == null) return;

      // Konversi derajat arah angin (0-360) ke indeks (0-15)
      const normalizedDir = ((windDirection % 360) + 360) % 360;
      const dirIndex = Math.floor(((normalizedDir + 11.25) % 360) / 22.5);
      
      // Menggolongkan kecepatan angin ke salah satu kategori indeks array
      const speedIndex = speedCategories.findIndex(
        (cat) => windSpeed! >= cat.min && windSpeed! < cat.max
      );
      
      if (dirIndex >= 0 && dirIndex < directions.length && speedIndex >= 0) {
        matrix[dirIndex][speedIndex]++;
        totalCount++;
      }
    });

    // Mengkonversi total temuan menjadi Persentase Frekuensi terhadap `totalCount`
    const processedWindData = directions.map((dir, i) => {
      return {
        name: dir,
        data: matrix[i].map((count) => (totalCount > 0 ? (count / totalCount) * 100 : 0)),
      };
    });

    return { windData: processedWindData, totalCount };
  }, [data, speedConfig, directionConfig]);

  if (!data || data.length === 0 || totalCount === 0) {
    return (
      <div className="w-full border dark:border-[#457B9D] rounded-3xl bg-[#A8DADC] dark:bg-[#1D3557] flex flex-col items-center justify-center h-[500px] transition-all duration-300">
        <p className="text-[#1D3557] dark:text-[#F1FAEE] font-poppins font-medium">Tidak ada data angin valid untuk ditampilkan</p>
      </div>
    );
  }

  // Konfigurasi visual diagram ECharts
  const option = {
    // Menghapus title ECharts internal agar bisa menggunakan HTML title biasa yang seragam dengan Chart lain
    tooltip: {
      trigger: "item",
      backgroundColor: tooltipBgColor, // Mengikuti gaya Tooltip LineChart
      borderColor: tooltipBorderColor,
      textStyle: { color: tooltipTextColor },
      extraCssText: "border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);",
      formatter: (params: any) => {
        return `<div style="font-weight:bold;margin-bottom:4px;">Arah: ${params.name}</div>
                ${speedCategories[params.seriesIndex]?.name}: ${params.value.toFixed(1)}%`;
      },
    },
    legend: {
      type: "scroll",
      data: speedCategories.map((cat) => cat.name),
      orient: "horizontal",
      bottom: 0,
      left: "center",
      textStyle: { color: chartTextColor, fontSize: 11, fontFamily: "inherit" }, // Sesuaikan warna tulisan agar seperti LineChart
      itemWidth: 12,
      itemHeight: 12,
      icon: "circle",
    },
    polar: {
      center: ["50%", "42%"], // Digeser sedikit ke atas memberi ruang ekstra untuk legend yang padat
      radius: "58%",
    },
    angleAxis: {
      type: "category",
      data: directions,
      startAngle: 101.25, 
      clockwise: true,
      axisLabel: {
        show: true,
        color: chartTextColor, // Diubah sesuai keinginan pengguna mengikuti Chart yang lain
        fontSize: 11,
        fontWeight: "600",
      },
      axisLine: { 
        lineStyle: { color: "rgba(87, 85, 85, 0.2)" } 
      },
      splitLine: { 
        show: true, 
        lineStyle: { color: "rgba(87, 85, 85, 0.1)", type: "solid" } 
      },
    },
    radiusAxis: {
      min: 0,
      splitNumber: 4,
      axisLabel: {
        show: true,
        color: chartTextColor,
        fontSize: 10,
        formatter: (value: number) => `${value}%`,
      },
      splitLine: {
        show: true,
        lineStyle: { color: "rgba(87, 85, 85, 0.15)", type: "dashed" },
      },
      axisLine: { show: false },
    },
    series: speedCategories.map((category, idx) => ({
      name: category.name,
      type: "bar",
      data: windData.map((dir) => dir.data[idx]),
      coordinateSystem: "polar",
      stack: "wind",
      barCategoryGap: 0,
      itemStyle: {
        color: category.color,
        borderColor: "rgba(168, 218, 220, 0.8)", // Menyelaraskan border antar balok dengan background container
        borderWidth: 0.5,
      },
      emphasis: { focus: "series" },
    })),
    graphic: [
      {
        type: "text",
        left: "center",
        top: "43%",
        style: {
          text: "", // Opsional teks di tengah
          fill: chartTextColor,
          fontSize: 10,
        },
        z: 100,
      },
    ],
    backgroundColor: "transparent",
  };

  return (
    <div className="w-full border dark:border-[#457B9D] rounded-3xl bg-[#A8DADC] dark:bg-[#1D3557] flex flex-col transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 hover:border-transparent p-4 sm:p-6">
      <div className="w-full flex justify-center mb-2">
        <h3 className="text-[#1D3557] dark:text-[#F1FAEE] font-poppins font-bold text-lg md:text-xl tracking-wide">
          Wind Rose (Arah & Kecepatan Angin)
        </h3>
      </div>
      <ReactECharts
        option={option}
        style={{ height: "450px", width: "100%" }}
        theme="light" // Theme mengikuti parentnya
        opts={{ renderer: "canvas" }}
      />
    </div>
  );
};

export default WindRose;