"use client";
import React, { useEffect, useRef, useState } from "react";
import { type WeatherData } from "@/types/weather";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import { ChartBarBali } from "./ChartBali/ChartBarBali";
import { ChartLineBali } from "./ChartBali/LineChartBali";
import CardDataBali from "./ChartBali/CardDataBali";
import BatteryChartBali from "./ChartBali/BatteryChartBali";

interface ExportData {
  exportRef: React.RefObject<HTMLDivElement | null>;
  // initialData: any[];
  getDataBali: any;
}

export default function WeatherDataBali({
  exportRef,
  // initialData,
  getDataBali,
}: ExportData) {
  // console.log("avgDataWeateher", getDataBali);
  // const [data, setData] = useState<WeatherData[]>(initialData || []);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  return (
    <div className=" flex flex-col gap-2 w-full">
      <div className="p-2"></div>
      <div ref={exportRef} className="gap-4">
        <div className="flex flex-row p-2 ">
          <CardDataBali getDataBali={getDataBali} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 w-full ">
          <ChartLineBali getDataBali={getDataBali} />
          <ChartBarBali getDataBali={getDataBali} />
          <BatteryChartBali getDataBali={getDataBali} />
        </div>
      </div>
    </div>
  );
}
