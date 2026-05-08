"use client";
import React, { useEffect, useRef, useState } from "react";
import CardData from "@/components/CardDataCuaca/CardData";
import { ChartBar } from "@/components/Chart/ChartBar";
import { ChartLine } from "@/components/Chart/LineChart";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import BatteryChart from "./Chart/BatteryChart";
import { AvgWeatherData } from "@/types/AvgTypes";
import { type DateRange } from "react-day-picker"; // ✅ Tambahkan import

interface ExportData {
  exportRef: React.RefObject<HTMLDivElement | null>;
  initialData: AvgWeatherData[];
  avgData: AvgWeatherData[];
  dateRange: DateRange | undefined;
  interval: "hour" | "day" | "month";
}

export default function WeatherData({
  exportRef,
  initialData,
  avgData,
  dateRange,
  interval,
}: ExportData) {
  // console.log("avgDataWeateher", avgData);
  // const [data, setData] = useState<WeatherData[]>(initialData || []);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  const getIntervalText = (interval: "hour" | "day" | "month") => {
    switch (interval) {
      case "hour":
        return "Per Jam";
      case "day":
        return "Per Hari";
      case "month":
        return "Per Bulan";
      default:
        return "Per Jam";
    }
  };

  if (!dateRange) {
    return (
      <div className="flex flex-col gap-2 w-full">
        <div className="p-2"></div>
        <div ref={exportRef} className="gap-4">
          <div className="flex flex-row p-2">
            <CardData data={initialData} avgData={avgData} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 w-full">
            <ChartLine data={initialData} avgData={avgData} />
            <ChartBar data={initialData} avgData={avgData} />
            <BatteryChart data={initialData} avgData={avgData} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" flex flex-col gap-2 w-full">
      <div className="p-2">
        <div className="text-sm text-gray-600 mb-2">
          Filter: {dateRange.from?.toLocaleDateString()} -{" "}
          {dateRange.to?.toLocaleDateString()}
        </div>
      </div>
      <div ref={exportRef} className="gap-4">
        <div className="flex flex-row p-2 ">
          <CardData data={initialData} avgData={avgData} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 w-full ">
          <ChartLine data={initialData} avgData={avgData} />
          <ChartBar data={initialData} avgData={avgData} />
          <BatteryChart data={initialData} avgData={avgData} />
        </div>
      </div>
    </div>
  );
}
