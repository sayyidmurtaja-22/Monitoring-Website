"use client";

import React from "react";
import { CSSProperties } from "react";
import { AvgWeatherData, WeatherDataTypes } from "@/types/AvgTypes";
import {
  TEMPERATURE_CONFIG,
  HUMIDITY_CONFIG,
  VAPOR_PRESSURE_CONFIG,
  PRESSURE_CONFIG,
  RAIN_CONFIG,
  WIND_CONFIG,
  WIND_DIRECTION_CONFIG,
  NET_RADIATION_CONFIG,
  CNR_RADIATION_CONFIG,
  BATTERY_CONFIG,
  ChartConfig,
  ChartLineConfig,
} from "@/config/Location";
import { WeatherLine } from "@/components/Chart/WeatherLine";
import { WeatherBar } from "@/components/Chart/WeatherBar";
import { WeatherLineDual } from "@/components/Chart/WeatherLineDual";
import WindRose from "@/components/Chart/WindRose";
import { AnalysisNote, GROUPS, ParamGroup } from "@/components/ExportAnalysis/AnalysisSection";

// ─── Helper: format tanggal period ───────────────────────────────────────────
function formatPeriod(period: string | null | undefined): string {
  if (!period) return "-";
  const d = new Date(period);
  if (isNaN(d.getTime())) return period;

  const hasTime = period.includes(" ") || period.includes(":");

  const opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };

  if (hasTime) {
    opts.hour = "2-digit";
    opts.minute = "2-digit";
  }

  return d.toLocaleDateString("id-ID", opts);
}

// ─── Helper: hitung statistik dari avgData untuk key tertentu ────────────────
function calcStats(avgData: any[], key: string) {
  const values = avgData
    .map((item) => ({ val: Number(item[key]), period: item.period }))
    .filter((x) => !isNaN(x.val) && x.val !== null);

  if (values.length === 0)
    return { avg: null, min: null, max: null, minPeriod: null, maxPeriod: null };

  const nums = values.map((x) => x.val);
  const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
  const minObj = values.reduce((a, b) => (b.val < a.val ? b : a));
  const maxObj = values.reduce((a, b) => (b.val > a.val ? b : a));

  return {
    avg,
    min: minObj.val,
    max: maxObj.val,
    minPeriod: minObj.period,
    maxPeriod: maxObj.period,
  };
}

// ─── Helper: konversi derajat ke arah mata angin ───────────────────────────────
function getCompassDirection(degree: number) {
  const dirs = ["Utara", "Timur Laut", "Timur", "Tenggara", "Selatan", "Barat Daya", "Barat", "Barat Laut"];
  const index = Math.round(degree / 45) % 8;
  return dirs[index];
}

// ─── Helper: status badge berdasarkan nilai vs rata-rata ─────────────────────
function getStatus(value: number, avg: number, unit: string, analysisConfig?: any) {
  if (analysisConfig?.type === "none") return null;

  if (analysisConfig?.type === "compass") {
    const direction = getCompassDirection(value);
    return { label: `Arah: ${direction}`, color: "bg-blue-900 text-blue-100 border border-blue-400" };
  }

  // Fallback default jika tidak ada konfigurasi analysis (10% selisih absolut dari rata-rata)
  if (!analysisConfig) {
    const threshold = Math.abs(avg) * 0.1;
    if (value > avg + threshold) return { label: "Di atas normal", color: "bg-[#E63946] text-white" };
    if (value < avg - threshold) return { label: "Di bawah normal", color: "bg-blue-700 text-white" };
    return { label: "Normal", color: "bg-emerald-600 text-white" };
  }

  const { type, lowerBound, upperBound } = analysisConfig;

  if (type === "percentage") {
    // Hindari pembagian dengan 0
    if (avg === 0) return { label: "Normal", color: "bg-emerald-600 text-white" };
    const percentage = (value / avg) * 100;
    if (percentage > upperBound) return { label: "Di atas normal", color: "bg-[#E63946] text-white" };
    if (percentage < lowerBound) return { label: "Di bawah normal", color: "bg-blue-700 text-white" };
    return { label: "Normal", color: "bg-emerald-600 text-white" };
  }

  if (type === "absolute_diff") {
    const diff = value - avg;
    if (diff > upperBound) return { label: "Di atas normal", color: "bg-[#E63946] text-white" };
    if (diff < lowerBound) return { label: "Di bawah normal", color: "bg-blue-700 text-white" };
    return { label: "Normal", color: "bg-emerald-600 text-white" };
  }

  return { label: "Normal", color: "bg-emerald-600 text-white" };
}

// ─── Komponen 3 Card per chart ────────────────────────────────────────────────
interface StatCardsProps {
  avgData: any[];
  config: any;
  icon: React.ReactNode;
  secondary?: {
    config: any;
    icon: React.ReactNode;
    label: string;
  };
}

function StatCards({ avgData, config, icon, secondary }: StatCardsProps) {
  const primaryLine = config.lines[0];
  const unit = primaryLine.unit || "";
  let label = config.title.replace("Grafik ", "");
  if (label.includes("Kelembaban")) label = "Kelembaban";
  if (label.includes("Baterai")) label = "Baterai";

  const prefix = primaryLine.key.split('_')[0];
  const avgKey = primaryLine.key;
  const maxKey = config.lines.find((l: any) => l.key.startsWith(prefix) && l.key.toLowerCase().includes("max"))?.key || avgKey;
  const minKey = config.lines.find((l: any) => l.key.startsWith(prefix) && l.key.toLowerCase().includes("min"))?.key || avgKey;

  const avgStats = calcStats(avgData, avgKey);
  const maxStats = calcStats(avgData, maxKey);
  const minStats = calcStats(avgData, minKey);

  const periodMin = minStats.min;
  const periodMax = maxStats.max;
  const periodAvg = avgStats.avg;

  const progressPct =
    periodMin !== null && periodMax !== null && periodMax !== periodMin
      ? Math.round(((periodAvg ?? periodMin) - periodMin) / (periodMax - periodMin) * 100)
      : 50;

  let maxPeriod: string | null = null;
  let minPeriod: string | null = null;
  if (avgData.length > 0 && maxKey && minKey) {
    const maxRow = avgData.reduce((best: any, cur: any) => {
      const v = Number(cur[maxKey]);
      return !isNaN(v) && v > Number(best[maxKey] ?? -Infinity) ? cur : best;
    });
    const minRow = avgData.reduce((best: any, cur: any) => {
      const v = Number(cur[minKey]);
      return !isNaN(v) && v < Number(best[minKey] ?? Infinity) ? cur : best;
    });
    maxPeriod = maxRow.period;
    minPeriod = minRow.period;
  }

  let maxStatus = periodMax !== null && periodAvg !== null
    ? getStatus(periodMax, periodAvg, unit, config.analysis) : null;
  let minStatus = periodMin !== null && periodAvg !== null
    ? getStatus(periodMin, periodAvg, unit, config.analysis) : null;

  if (secondary) {
    const secKey = secondary.config.lines[0].key;
    const maxRow = avgData.find((d) => d.period === maxPeriod);
    const minRow = avgData.find((d) => d.period === minPeriod);

    if (maxRow && maxRow[secKey] !== undefined && !isNaN(Number(maxRow[secKey]))) {
      maxStatus = getStatus(Number(maxRow[secKey]), 0, "", secondary.config.analysis);
    }
    if (minRow && minRow[secKey] !== undefined && !isNaN(Number(minRow[secKey]))) {
      minStatus = getStatus(Number(minRow[secKey]), 0, "", secondary.config.analysis);
    }
  }

  const cardBase =
    "w-full rounded-2xl bg-[#1d3557] border border-[#1a3a6e]/40 shadow-lg shadow-[#1d3557]/20 " +
    "overflow-hidden transition-all duration-200 ease-in-out hover:shadow-2xl hover:-translate-y-1";

  return (
    <div data-export-card className="w-full h-full">
      <div className={`${cardBase} flex flex-col h-full`}>
        {/* Header Ringkasan */}
        <div className="flex items-center justify-between gap-3 px-5 py-3 bg-white/5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-[#a8dadc]">{icon}</span>
            <p className="text-[11px] text-white/80 uppercase tracking-widest font-bold">
              Ringkasan {label}
            </p>
          </div>
          {periodAvg !== null && (
            <span className="text-[11px] text-white/60 font-semibold whitespace-nowrap">
              Rata-rata: {periodAvg.toFixed(1)} {unit}
            </span>
          )}
        </div>

        {/* Nilai Tertinggi */}
        <div className="p-5 pb-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[#E63946] text-lg font-bold leading-none">↗</span>
            <p className="text-[11px] text-white/70 uppercase tracking-wider font-bold">Nilai Tertinggi</p>
          </div>
          <div className="flex items-start justify-between gap-2">
            <p className="text-3xl font-bold text-white leading-none">
              {periodMax !== null ? periodMax.toFixed(1) : "-"}
              <span className="text-lg font-normal ml-1 text-white/70">{unit}</span>
            </p>
            {maxStatus && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${maxStatus.color}`}>
                {maxStatus.label}
              </span>
            )}
          </div>
          <p className="text-[11px] text-white/60 mt-1.5">{formatPeriod(maxPeriod)}</p>
        </div>

        {/* Divider */}
        <div className="mx-5 h-px bg-white/10"></div>

        {/* Nilai Terendah */}
        <div className="p-5 pt-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-emerald-400 text-lg font-bold leading-none">↘</span>
            <p className="text-[11px] text-white/70 uppercase tracking-wider font-bold">Nilai Terendah</p>
          </div>
          <div className="flex items-start justify-between gap-2">
            <p className="text-3xl font-bold text-white leading-none">
              {periodMin !== null ? periodMin.toFixed(1) : "-"}
              <span className="text-lg font-normal ml-1 text-white/70">{unit}</span>
            </p>
            {minStatus && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${minStatus.color}`}>
                {minStatus.label}
              </span>
            )}
          </div>
          <p className="text-[11px] text-white/60 mt-1.5">{formatPeriod(minPeriod)}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Icon SVG untuk visualisasi sederhana (Mudah Dipahami) ───────────────────
const IconDrop = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 8.27 2 13a10 10 0 0020 0C22 8.27 17.52 2 12 2z" /></svg>
);
const IconSun = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
);
const IconBattery = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h11a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2zm13 4h1a1 1 0 010 2h-1v-2z" /></svg>
);
const IconWave = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>
);
const IconThermometer = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" /></svg>
);
const IconWind = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" /></svg>
);
const IconCompass = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>
);
const IconRain = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v14M16 13l-4 4-4-4" /></svg>
);
const IconGauge = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 12l3-3" /><path d="M12 12V6" /><path d="M8 12h4" /></svg>
);

// ─── Tabel Nilai Tertinggi & Terendah per grafik (tampil di PDF) ────────────
const avgKeyMap: Record<string, string> = {
  Batt_V_Avg: "avg_Batt",
  PTemp_Max: "avg_Ptemp",
  P: "avg_P",
};
const avgKey = (key: string) => avgKeyMap[key] || `avg_${key}`;

function num(v: unknown): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function fmt(v: number | null, digits = 1): string {
  if (v === null) return "-";
  return v.toFixed(digits).replace(".", ",");
}

interface MinMaxTableProps {
  data: AvgWeatherData[];
  lines: ChartLineConfig[];
}

export function MinMaxTable({ data, lines }: MinMaxTableProps) {
  const rows = lines.map((line) => {
    const values = (Array.isArray(data) ? data : [])
      .map((item) => {
        const row = item as unknown as Record<string, unknown>;
        const raw = row[avgKey(line.key)] ?? row[line.key];
        return { val: num(raw), period: item.period };
      })
      .filter((x): x is { val: number; period: string } => x.val !== null);

    if (values.length === 0)
      return { line, avg: null, max: null, maxPeriod: null, min: null, minPeriod: null };

    const nums = values.map((x) => x.val);
    const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
    const maxObj = values.reduce((a, b) => (b.val > a.val ? b : a));
    const minObj = values.reduce((a, b) => (b.val < a.val ? b : a));

    return {
      line,
      avg,
      max: maxObj.val,
      maxPeriod: maxObj.period,
      min: minObj.val,
      minPeriod: minObj.period,
    };
  });

  const cellStyle: CSSProperties = {
    padding: "10px 14px",
    border: "1px solid #cbd5e1",
    fontSize: 19,
    color: "#0f172a",
  };
  const headCellStyle: CSSProperties = {
    ...cellStyle,
    fontWeight: 700,
    backgroundColor: "#f1f5f9",
    textAlign: "center",
  };
  const centerStyle: CSSProperties = { ...cellStyle, textAlign: "center" };

  return (
    <div data-export-minmax className="hidden" style={{ marginTop: 12 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "sans-serif" }}>
        <thead>
          <tr>
            <th style={headCellStyle}>Parameter</th>
            <th style={headCellStyle}>Nilai Tertinggi</th>
            <th style={headCellStyle}>Nilai Terendah</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.line.key}>
              <td style={cellStyle}>{r.line.name}</td>
              <td style={centerStyle}>
                {r.max !== null ? `${fmt(r.max)} ${r.line.unit ?? ""}` : "-"}
                <div style={{ fontSize: 14, color: "#64748b", marginTop: 2 }}>{formatPeriod(r.maxPeriod)}</div>
              </td>
              <td style={centerStyle}>
                {r.min !== null ? `${fmt(r.min)} ${r.line.unit ?? ""}` : "-"}
                <div style={{ fontSize: 14, color: "#64748b", marginTop: 2 }}>{formatPeriod(r.minPeriod)}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Konfigurasi semua seksi grafik (1 config, dipakai berulang) ────────────
export interface ChartSectionDef {
  key: string;
  id?: string;
  subtitle: string;
  kind: "line" | "bar" | "dual" | "windrose";
  config: ChartConfig;
  group: ParamGroup;
  icon: React.ReactNode;
  secondary?: {
    config: ChartConfig;
    icon: React.ReactNode;
    label: string;
  };
}

export const CHART_SECTIONS: ChartSectionDef[] = [
  { key: "suhu", kind: "line", subtitle: "Kondisi Suhu Udara", config: TEMPERATURE_CONFIG, group: GROUPS[0], icon: <IconThermometer /> },
  { key: "kelembaban", kind: "line", subtitle: "Kondisi Kelembapan Udara", config: HUMIDITY_CONFIG, group: GROUPS[1], icon: <IconDrop /> },
  { key: "vapor", kind: "line", subtitle: "Tekanan Uap Air di Udara", config: VAPOR_PRESSURE_CONFIG, group: GROUPS[2], icon: <IconWave /> },
  { key: "tekanan", kind: "line", subtitle: "Kondisi Tekanan Udara", config: PRESSURE_CONFIG, group: GROUPS[3], icon: <IconGauge /> },
  { key: "hujan", id: "tour-new-charts", kind: "bar", subtitle: "Total Curah Hujan", config: RAIN_CONFIG, group: GROUPS[4], icon: <IconRain /> },
  { key: "angin", kind: "line", subtitle: "Kecepatan Angin", config: WIND_CONFIG, group: GROUPS[5], icon: <IconWind /> },
  { key: "arah-angin", kind: "line", subtitle: "Pergerakan Arah Angin", config: WIND_DIRECTION_CONFIG, group: GROUPS[6], icon: <IconCompass /> },
  { key: "radiasi-neto", kind: "line", subtitle: "Radiasi Matahari Langsung (Radiasi Neto)", config: NET_RADIATION_CONFIG, group: GROUPS[7], icon: <IconSun /> },
  { key: "radiasi-cnr", kind: "line", subtitle: "Pantulan Sinar Matahari (Radiasi CNR)", config: CNR_RADIATION_CONFIG, group: GROUPS[8], icon: <IconSun /> },
  { key: "baterai", kind: "dual", subtitle: "Kondisi Baterai Stasiun & Suhu Panel", config: BATTERY_CONFIG, group: GROUPS[9], icon: <IconBattery /> },
  {
    key: "windrose",
    kind: "windrose",
    subtitle: "Diagram Distribusi Arah Angin (WindRose)",
    config: WIND_CONFIG,
    group: GROUPS[5],
    icon: <IconWind />,
    secondary: {
      config: WIND_DIRECTION_CONFIG,
      icon: <IconCompass />,
      label: "Arah Dominan",
    },
  },
];

// ─── Blok satu seksi grafik: sub-bab + grafik + tabel ekstrem + penjelasan ───
interface ChartSectionBlockProps {
  section: ChartSectionDef;
  index: number;
  avgData: AvgWeatherData[];
  lastData?: WeatherDataTypes | null;
  exporting?: boolean;
  interval?: "hour" | "day" | "month";
}

export function ChartSectionBlock({ section, index, avgData, lastData, exporting, interval }: ChartSectionBlockProps) {
  const { kind, config, group, icon, secondary, id } = section;

  return (
    <>
      <div data-export-subtitle className="hidden" style={{ marginTop: 16, borderBottom: "2px solid #334155", backgroundColor: "#f8fafc", padding: "8px 14px" }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a", fontFamily: "sans-serif" }}>
          {index + 1}. {section.subtitle}
        </h2>
      </div>
      <div id={id} data-chart-section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-4 w-full items-stretch">
        {kind === "line" && (
          <WeatherLine data={avgData} lines={config.lines} title={config.title} yLabel={config.yLabel} />
        )}
        {kind === "bar" && (
          <WeatherBar data={avgData} lines={config.lines} title={config.title} yLabel={config.yLabel} />
        )}
        {kind === "dual" && (
          <WeatherLineDual data={avgData} lines={config.lines} title={config.title} />
        )}
        {kind === "windrose" && (
          <WindRose
            data={avgData}
            speedConfig={WIND_CONFIG}
            directionConfig={WIND_DIRECTION_CONFIG}
            monochrome={exporting}
          />
        )}
        <div className="w-full min-w-0">
          <StatCards avgData={avgData} config={config} icon={icon} secondary={secondary} />
        </div>
      </div>
      <div data-export-minmax className="hidden">
        <MinMaxTable data={avgData} lines={config.lines} />
      </div>
      <div data-export-analysis className="hidden">
        <AnalysisNote avgData={avgData} lastData={lastData} group={group} interval={interval} />
      </div>
    </>
  );
}

