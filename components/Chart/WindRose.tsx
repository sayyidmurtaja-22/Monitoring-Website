"use client";

import React from "react";
import ReactECharts from "echarts-for-react";
import { WeatherData } from "@/types/weather";

interface ChartAreaProps {
  data?: WeatherData[];
}

const WindRose = ({ data }: ChartAreaProps) => {
  // Data Wind Rose: Kategori arah (N, NE, dll) dan kecepatan
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

  // Contoh data: [kecepatan 0-5, 5-10, 10-15, >15]

  const seriesData = [
    { name: "< 5 m/s", data: data?.map((d) => d[0]) },
    { name: "5-10 m/s", data: data?.map((d) => d[1]) },
    { name: "10-15 m/s", data: data?.map((d) => d[2]) },
    { name: "> 15 m/s", data: data?.map((d) => d[3]) },
  ];

  const option = {
    title: { text: "Wind Rose Diagram", left: "center" },
    legend: { data: seriesData.map((s) => s.name), top: "bottom" },
    polar: { center: ["50%", "50%"], radius: "70%" },
    radiusAxis: {
      min: 0,
      splitNumber: 4,
      axisLabel: {
        show: true,
        color: "#aaaaaa",
        fontSize: 10,
        margin: 2,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(255,255,255,0.2)",
          type: "solid",
          width: 1,
        },
      },
      axisLine: {
        show: true,
      },
    },
    angleAxis: {
      type: "category",
      data: directions,
      startAngle: 69, // Utara di atas
      clockwise: false,
    },
    tooltip: {},
    series: seriesData.map((s) => ({
      type: "bar",
      data: s.data,
      coordinateSystem: "polar",
      name: s.name,
      stack: "wind", // Stacked bar
      emphasis: { focus: "series" },
    })),
  };

  return (
    <ReactECharts option={option} style={{ height: "500px", width: "100%" }} />
  );
};

export default WindRose;
