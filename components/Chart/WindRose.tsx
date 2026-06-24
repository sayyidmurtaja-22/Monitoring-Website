"use client";

import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { AvgWeatherData } from "@/types/AvgTypes";
import { ChartConfig } from "@/config/Location";

interface WindRoseProps {
  data?: AvgWeatherData[];
  speedConfig: ChartConfig;
  directionConfig: ChartConfig;
}

const WindRose = ({ data, speedConfig, directionConfig }: WindRoseProps) => {
  // Arah mata angin (16 arah atau 8 arah)
  const directions = [
    "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", 
    "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
  ];
  
  // Kategori kecepatan angin (m/s)
  const speedCategories = [
    { name: "Calm (0-0.5)", min: 0, max: 0.5, color: "#22c55e" },
    { name: "Light (0.5-3)", min: 0.5, max: 3, color: "#3b82f6" },
    { name: "Moderate (3-6)", min: 3, max: 6, color: "#eab308" },
    { name: "Fresh (6-11)", min: 6, max: 11, color: "#f97316" },
    { name: "Strong (11-17)", min: 11, max: 17, color: "#ef4444" },
    { name: "Gale (>17)", min: 17, max: Infinity, color: "#991b1b" },
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
      <div className="w-full border rounded-3xl bg-[#A8DADC] dark:bg-blue-950 flex flex-col items-center justify-center h-[500px] mb-4 transition-all duration-300">
        <p className="text-[#575555ff] font-poppins font-medium">Tidak ada data angin valid untuk ditampilkan</p>
      </div>
    );
  }

  // Konfigurasi visual diagram ECharts
  const option = {
    // Menghapus title ECharts internal agar bisa menggunakan HTML title biasa yang seragam dengan Chart lain
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(0, 0, 0, 0.8)", // Mengikuti gaya Tooltip LineChart
      borderColor: "#FFFFFF",
      textStyle: { color: "#fff" },
      formatter: (params: any) => {
        return `<div style="font-weight:bold;margin-bottom:4px;">Arah: ${params.name}</div>
                ${speedCategories[params.seriesIndex]?.name}: ${params.value.toFixed(1)}%`;
      },
    },
    legend: {
      data: speedCategories.map((cat) => cat.name),
      orient: "horizontal",
      bottom: 0,
      left: "center",
      textStyle: { color: "#575555ff", fontSize: 11, fontFamily: "inherit" }, // Sesuaikan warna tulisan agar seperti LineChart
      itemWidth: 14,
      itemHeight: 14,
      icon: "circle",
    },
    polar: {
      center: ["50%", "45%"], // Digeser sedikit ke atas memberi ruang untuk legend di bawah
      radius: "60%",
    },
    angleAxis: {
      type: "category",
      data: directions,
      startAngle: 90, 
      clockwise: true,
      axisLabel: {
        show: true,
        color: "#575555ff", // Diubah sesuai keinginan pengguna mengikuti Chart yang lain
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
        color: "#575555ff",
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
          fill: "#575555ff",
          fontSize: 10,
        },
        z: 100,
      },
    ],
    backgroundColor: "transparent",
  };

  return (
    <div className="w-full border rounded-3xl bg-[#A8DADC] dark:bg-blue-950 flex flex-col transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 hover:border-transparent p-4 sm:p-6 mb-4">
      <div className="w-full flex justify-center mb-2">
        <h3 className="text-[#ffff] font-poppins font-bold text-lg md:text-xl tracking-wide">
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