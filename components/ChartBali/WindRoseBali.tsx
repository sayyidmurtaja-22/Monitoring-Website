"use client";

import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { WeatherData } from "@/types/weather";

interface ChartAreaProps {
  data?: WeatherData[];
}

const WindRose = ({ data }: ChartAreaProps) => {
  // Arah mata angin (16 arah atau 8 arah)
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  
  // Kategori kecepatan angin (m/s)
  const speedCategories = [
    { name: "Calm (0-0.5)", min: 0, max: 0.5, color: "#22c55e" },
    { name: "Light (0.5-3)", min: 0.5, max: 3, color: "#3b82f6" },
    { name: "Moderate (3-6)", min: 3, max: 6, color: "#eab308" },
    { name: "Fresh (6-11)", min: 6, max: 11, color: "#f97316" },
    { name: "Strong (11-17)", min: 11, max: 17, color: "#ef4444" },
    { name: "Gale (>17)", min: 17, max: Infinity, color: "#991b1b" },
  ];

  // Hitung distribusi arah dan kecepatan angin dari data
  const { windData, totalCount } = useMemo(() => {
    if (!data || data.length === 0) return { windData: [], totalCount: 0 };

    // Inisialisasi matrix: directions x speedCategories
    const matrix = directions.map(() => speedCategories.map(() => 0));
    let totalCount = 0;

    data.forEach((record) => {
      // Gunakan WD_Max_WS jika ada, lalu fallback ke variabel lain
      let windDirection = record.WD_Max_WS ?? (record as any).W_D_Avg ?? (record as any).avg_W_D_Avg ?? (record as any).avg_WD_Max_WS; 
      let windSpeed = record.WS_S_Avg ?? (record as any).avg_WS_S_Avg;    // Kecepatan angin (m/s)

      if (windDirection == null || windSpeed == null) return;

      // Konversi derajat ke indeks arah (0-15 untuk 16 arah)
      const normalizedDir = ((windDirection % 360) + 360) % 360;
      const dirIndex = Math.floor(((normalizedDir + 11.25) % 360) / 22.5);
      
      // Cari kategori kecepatan
      const speedIndex = speedCategories.findIndex(
        (cat) => windSpeed! >= cat.min && windSpeed! < cat.max
      );
      
      if (dirIndex >= 0 && dirIndex < directions.length && speedIndex >= 0) {
        matrix[dirIndex][speedIndex]++;
        totalCount++;
      }
    });

    // Konversi ke persentase berdasarkan TOTAL KESELURUHAN (totalCount)
    const processedWindData = directions.map((dir, i) => {
      return {
        name: dir,
        data: matrix[i].map((count) => (totalCount > 0 ? (count / totalCount) * 100 : 0)),
      };
    });

    return { windData: processedWindData, totalCount };
  }, [data]);

  if (!data || data.length === 0 || totalCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] w-full bg-[#0f2044] rounded-2xl border border-[#1a3a6e]/40 shadow-xl">
        <p className="text-slate-400">Tidak ada data angin valid untuk ditampilkan</p>
      </div>
    );
  }

  // Konfigurasi ECharts untuk Wind Rose
  const option = {
    title: {
      text: "Wind Rose Diagram",
      left: "center",
      top: 10,
      textStyle: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
    },
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(15, 32, 68, 0.9)",
      borderColor: "rgba(26, 58, 110, 0.5)",
      textStyle: { color: "#fff" },
      formatter: (params: any) => {
        return `<div style="font-weight:bold;margin-bottom:4px;">${params.name}</div>
                ${speedCategories[params.seriesIndex]?.name}: ${params.value.toFixed(1)}%`;
      },
    },
    legend: {
      data: speedCategories.map((cat) => cat.name),
      orient: "horizontal",
      bottom: 0,
      left: "center",
      textStyle: { color: "#cccccc", fontSize: 15 },
      itemWidth: 14,
      itemHeight: 14,
      icon: "circle",
    },
    polar: {
      center: ["50%", "50%"],
      radius: "60%",
    },
    angleAxis: {
      type: "category",
      data: directions,
      startAngle: 90,  // North di atas
      clockwise: true, // Searah jarum jam agar urutannya N, NNE, NE, dst... ke kanan
      axisLabel: {
        show: true,
        color: "#cbd5e1",
        fontSize: 15,
        fontWeight: "500",
      },
      axisLine: { 
        lineStyle: { color: "rgba(255,255,255,0.2)" } 
      },
      splitLine: { 
        show: true, 
        lineStyle: { color: "rgba(255,255,255,0.1)", type: "solid" } 
      },
    },
    radiusAxis: {
      min: 0,
      splitNumber: 4,
      axisLabel: {
        show: true,
        color: "#94a3b8",
        fontSize: 12,
        formatter: (value: number) => `${value}%`,
      },
      splitLine: {
        show: true,
        lineStyle: { color: "rgba(255,255,255,0.15)", type: "dashed" },
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
        borderColor: "rgba(15, 32, 68, 0.8)",
        borderWidth: 0.5,
      },
      emphasis: { focus: "series" },
    })),
    graphic: [
      {
        type: "text",
        left: "center",
        top: "48%",
        style: {
          text: "", // Bisa dikosongkan atau diisi teks
          fill: "#666666",
          fontSize: 12,
        },
        z: 100,
      },
    ],
    backgroundColor: "transparent",
  };

  return (
    <div className="w-full flex flex-col items-center">
      <ReactECharts
        option={option}
        style={{ height: "450px", width: "100%" }}
        theme="dark"
        opts={{ renderer: "canvas" }}
      />
    </div>
  );
};

export default WindRose;
