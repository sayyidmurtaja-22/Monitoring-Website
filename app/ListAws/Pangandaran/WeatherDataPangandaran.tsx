"use client";
import React, { useRef } from "react";
import { ChartBar } from "@/components/Chart/ChartBar";
import { ChartLine } from "@/components/Chart/LineChart";
import BatteryChart from "@/components/Chart/BatteryChart";
import { AvgWeatherData, WeatherDataTypes } from "@/types/AvgTypes";
import { type DateRange } from "react-day-picker";
import { TEMPERATURE_CONFIG, CNR_RADIATION_CONFIG, BATTERY_CONFIG } from "@/config/Location";
import CardData from "@/components/CardDataCuaca/CardData";
import AnalysisSection, { AnalysisConclusion } from "@/components/ExportAnalysis/AnalysisSection";
import IndicatorTable from "@/components/ExportAnalysis/IndicatorTable";
import { ChartSectionBlock, CHART_SECTIONS, MinMaxTable } from "@/components/ExportAnalysis/ChartSectionBlock";
import { ExportHeader } from "@/components/ExportAnalysis/ExportHeader";

interface ExportData {
  exportRef: React.RefObject<HTMLDivElement | null>;
  initialData: AvgWeatherData[];
  avgData: AvgWeatherData[];
  lastData: WeatherDataTypes | null;
  dateRange: DateRange | undefined;
  interval: "hour" | "day" | "month";
  exportHeaderData?: { nama: string; nim: string; instansi: string } | null;
  exporting?: boolean;
}

// ─── Komponen utama ─────────────────────────────────────────────────────────────
export default function WeatherDataPangandaran({
  exportRef,
  initialData,
  avgData,
  dateRange,
  lastData,
  interval,
  exportHeaderData,
  exporting,
}: ExportData) {
  if (!dateRange) {
    return (
      <div className="flex flex-col gap-2 w-full">
        <div ref={exportRef} data-export-area className="flex flex-col gap-4">
          <div data-export-header className="hidden">
            {exportHeaderData && <ExportHeader station="Pangandaran" data={exportHeaderData} />}
          </div>
          <div className="flex flex-row p-2" data-export-card>
            <CardData data={initialData} avgData={avgData} />
          </div>
          <IndicatorTable data={initialData} avgData={avgData} />
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 w-full">
            <ChartLine data={initialData} avgData={avgData} />
            <MinMaxTable data={avgData} lines={TEMPERATURE_CONFIG.lines} />
            <ChartBar data={initialData} avgData={avgData} />
            <MinMaxTable data={avgData} lines={CNR_RADIATION_CONFIG.lines} />
            <BatteryChart data={initialData} avgData={avgData} />
            <MinMaxTable data={avgData} lines={BATTERY_CONFIG.lines} />
          </div>
          <div data-export-analysis className="hidden">
            <AnalysisSection
              avgData={avgData}
              lastData={lastData}
              dateRange={dateRange}
              interval={interval}
              stationLabel="Pangandaran"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div ref={exportRef} data-export-area className="flex flex-col gap-4">
        <div data-export-header className="hidden">
          {exportHeaderData && <ExportHeader station="Pangandaran" data={exportHeaderData} />}
        </div>
        <div className="flex flex-row p-2" data-export-card>
          <CardData data={initialData} avgData={avgData} />
        </div>
        <IndicatorTable data={initialData} avgData={avgData} />

        {CHART_SECTIONS.map((section, index) => (
          <ChartSectionBlock
            key={section.key}
            section={section}
            index={index}
            avgData={avgData}
            lastData={lastData}
            exporting={exporting}
            interval={interval}
          />
        ))}

        {/* ── Kesimpulan Analisis Data ── */}
        <div data-export-analysis className="hidden">
          <AnalysisConclusion
            avgData={avgData}
            dateRange={dateRange}
            interval={interval}
            stationLabel="Pangandaran"
          />
        </div>
      </div>
    </div>
  );
}
