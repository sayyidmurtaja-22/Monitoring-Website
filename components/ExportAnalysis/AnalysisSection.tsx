"use client";

import React from "react";
import { AvgWeatherData, WeatherDataTypes } from "@/types/AvgTypes";
import {
  TEMPERATURE_CONFIG,
  HUMIDITY_CONFIG,
  VAPOR_PRESSURE_CONFIG,
  PRESSURE_CONFIG,
  WIND_CONFIG,
  WIND_DIRECTION_CONFIG,
  NET_RADIATION_CONFIG,
  CNR_RADIATION_CONFIG,
  RAIN_CONFIG,
  BATTERY_CONFIG,
  ChartConfig,
} from "@/config/Location";
import { buildInterpretation, InterpretationValues } from "@/config/Interpretations";

interface AnalysisSectionProps {
  avgData: AvgWeatherData[];
  lastData?: WeatherDataTypes | null;
  dateRange?: { from?: Date; to?: Date } | undefined;
  interval?: "hour" | "day" | "month";
  stationLabel: string;
}

const DIRS = ["Utara", "Timur Laut", "Timur", "Tenggara", "Selatan", "Barat Daya", "Barat", "Barat Laut"];

function getCompassDirection(degree: number) {
  const index = Math.round(degree / 45) % 8;
  return DIRS[index];
}

// ─── Status nilai vs rata-rata (konsisten dengan badge di dashboard) ───────
function getStatus(value: number, avg: number, analysisConfig?: ChartConfig["analysis"]): string | null {
  if (analysisConfig?.type === "none") return null;
  if (analysisConfig?.type === "compass") return `Arah ${getCompassDirection(value)}`;

  if (!analysisConfig) {
    const threshold = Math.abs(avg) * 0.1;
    if (value > avg + threshold) return "di atas normal";
    if (value < avg - threshold) return "di bawah normal";
    return "normal";
  }

  const { type, lowerBound, upperBound } = analysisConfig;
  if (type === "percentage") {
    if (avg === 0) return "normal";
    const pct = (value / avg) * 100;
    if (pct > (upperBound ?? 100)) return "di atas normal";
    if (pct < (lowerBound ?? 0)) return "di bawah normal";
    return "normal";
  }

  if (type === "absolute_diff") {
    const diff = value - avg;
    if (diff > (upperBound ?? 0)) return "di atas normal";
    if (diff < (lowerBound ?? 0)) return "di bawah normal";
    return "normal";
  }

  return "normal";
}

// Peta kunci kolom data agregat (beberapa nama berbeda dari skema asli)
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

function readValue(item: AvgWeatherData, key: string): number | null {
  const raw = (item as unknown as Record<string, unknown>)[avgKey(key)] ?? (item as unknown as Record<string, unknown>)[key];
  return num(raw);
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function stddev(values: number[]): number | null {
  if (values.length < 2) return null;
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((acc, v) => acc + (v - avg) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

// Jumlah periode yang berada di luar kisaran normal
function countOutOfRange(nums: number[], avg: number, analysis?: ChartConfig["analysis"]): number {
  if (analysis?.type === "none" || analysis?.type === "compass") return 0;
  if (!analysis) {
    const threshold = Math.abs(avg) * 0.1;
    return nums.filter((v) => v > avg + threshold || v < avg - threshold).length;
  }
  const { type, lowerBound, upperBound } = analysis;
  if (type === "percentage") {
    if (avg === 0) return 0;
    return nums.filter((v) => (v / avg) * 100 > (upperBound ?? 100) || (v / avg) * 100 < (lowerBound ?? 0)).length;
  }
  if (type === "absolute_diff") {
    return nums.filter((v) => v - avg > (upperBound ?? 0) || v - avg < (lowerBound ?? 0)).length;
  }
  return 0;
}

// Tentukan kecenderungan (trend) naik/turun/stabil dari nilai-nilai urut waktu
function computeTrend(values: { val: number; period: string }[], thresholdPct = 8): "meningkat" | "menurun" | "stabil" | null {
  if (values.length < 4) return null;
  const first = values[0].val;
  const last = values[values.length - 1].val;
  const base = Math.abs(first) || 1;
  const changePct = (Math.abs(last - first) / base) * 100;
  if (changePct >= thresholdPct) return last > first ? "meningkat" : "menurun";
  return "stabil";
}

function formatDate(d: Date | undefined): string {
  if (!d) return "-";
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(d);
}

// Format periode data agregat ("2026-01-01" atau "2026-01-01 12:00") ke teks
function formatPeriod(period: string): string {
  if (!period) return "-";
  const hasTime = period.includes(" ") || period.includes(":");
  const parsed = new Date(period.replace(/-/g, "/"));
  if (Number.isNaN(parsed.getTime())) return period;
  const opts: Intl.DateTimeFormatOptions = hasTime
    ? { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }
    : { day: "numeric", month: "long", year: "numeric" };
  return new Intl.DateTimeFormat("id-ID", opts).format(parsed);
}

export interface ParamGroup {
  label: string;
  config: ChartConfig;
  avgKeyName: string;
  maxKeyName?: string;
  minKeyName?: string;
  sum?: boolean;
  unit?: string;
}

export const GROUPS: ParamGroup[] = [
  { label: "Suhu Udara", config: TEMPERATURE_CONFIG, avgKeyName: "Ta_Avg", maxKeyName: "Ta_Max", minKeyName: "Ta_Min" },
  { label: "Kelembapan Udara", config: HUMIDITY_CONFIG, avgKeyName: "RH_Avg", maxKeyName: "RH_Max", minKeyName: "RH_Min" },
  { label: "Tekanan Uap Air", config: VAPOR_PRESSURE_CONFIG, avgKeyName: "e_Avg", maxKeyName: "e_Max", minKeyName: "e_Min" },
  { label: "Tekanan Udara", config: PRESSURE_CONFIG, avgKeyName: "P" },
  { label: "Curah Hujan", config: RAIN_CONFIG, avgKeyName: "Rain_mm_Tot", sum: true },
  { label: "Kecepatan Angin", config: WIND_CONFIG, avgKeyName: "WS_S_Avg", maxKeyName: "WS_Max" },
  { label: "Arah Angin", config: WIND_DIRECTION_CONFIG, avgKeyName: "W_D_Avg", maxKeyName: "WD_Max_WS" },
  { label: "Radiasi Neto", config: NET_RADIATION_CONFIG, avgKeyName: "NR_Wm2_Avg", maxKeyName: "NR_Wm2_Max", minKeyName: "NR_Wm2_Min" },
  { label: "Radiasi CNR", config: CNR_RADIATION_CONFIG, avgKeyName: "CNR_Wm2_Avg", maxKeyName: "CNR_Wm2_Max", minKeyName: "CNR_Wm2_Min" },
  { label: "Baterai & Panel", config: BATTERY_CONFIG, avgKeyName: "Batt_V_Avg" },
];

const INTERVAL_LABEL: Record<string, string> = { hour: "Per Jam", day: "Per Hari", month: "Per Bulan" };

// ─── Hasil analisis lengkap untuk satu kelompok parameter ──────────────────
interface GroupResult {
  label: string;
  unit: string;
  primary: string;
  sum: boolean;
  count: number;
  avg: number | null;
  max: number | null;
  min: number | null;
  maxPeriod: string | null;
  minPeriod: string | null;
  median: number | null;
  stddev: number | null;
  cv: number | null;
  range: number | null;
  latest: number | null;
  status: string | null;
  countOutOfRange: number;
  total: number | null;
  countPositive: number;
  first: number | null;
  last: number | null;
  trend: "meningkat" | "menurun" | "stabil" | null;
  fromDate: string;
  toDate: string;
}

function buildResult(data: AvgWeatherData[], lastData: WeatherDataTypes | null, group: ParamGroup): GroupResult {
  const unit = group.unit || group.config.lines[0]?.unit || "";
  const primary = group.config.lines[0]?.name || group.label;

  const values = data
    .map((item) => ({ val: readValue(item, group.avgKeyName), period: item.period }))
    .filter((x): x is { val: number; period: string } => x.val !== null)
    .sort((a, b) => a.period.localeCompare(b.period));
  const nums = values.map((x) => x.val);
  const count = nums.length;

  const periods = values.map((x) => x.period).sort();
  const fromDate = count > 0 ? formatPeriod(periods[0]) : "-";
  const toDate = count > 0 ? formatPeriod(periods[periods.length - 1]) : "-";

  if (group.sum) {
    const total = nums.reduce((a, b) => a + b, 0);
    let maxObj: { val: number; period: string } | undefined;
    if (count > 0) maxObj = values.reduce((a, b) => (b.val > a.val ? b : a));
    return {
      label: group.label, unit, primary, sum: true, count,
      avg: count ? total / count : null,
      max: maxObj?.val ?? null, min: null,
      maxPeriod: maxObj?.period ?? null, minPeriod: null,
      median: median(nums), stddev: stddev(nums),
      cv: null, range: null,
      latest: null, status: null,
      countOutOfRange: 0, total, countPositive: nums.filter((v) => v > 0).length,
      first: null, last: null, trend: null,
      fromDate, toDate,
    };
  }

  let maxObj: { val: number; period: string } | undefined;
  let minObj: { val: number; period: string } | undefined;
  if (count > 0) {
    maxObj = values.reduce((a, b) => (b.val > a.val ? b : a));
    minObj = values.reduce((a, b) => (b.val < a.val ? b : a));
  }
  const avg = count ? nums.reduce((a, b) => a + b, 0) / count : null;
  const sdev = stddev(nums);
  const latest = num((lastData as unknown as Record<string, unknown>)?.[group.avgKeyName]) ?? avg;
  const status = avg !== null && latest !== null ? getStatus(latest, avg, group.config.analysis) : null;
  const outOfRangeCount = avg !== null ? countOutOfRange(nums, avg, group.config.analysis) : 0;

  return {
    label: group.label, unit, primary, sum: false, count,
    avg,
    max: maxObj?.val ?? null, min: minObj?.val ?? null,
    maxPeriod: maxObj?.period ?? null, minPeriod: minObj?.period ?? null,
    median: median(nums),
    stddev: sdev,
    cv: avg !== null && avg !== 0 && sdev !== null ? (sdev / Math.abs(avg)) * 100 : null,
    range: maxObj?.val != null && minObj?.val != null ? maxObj.val - minObj.val : null,
    latest, status, countOutOfRange: outOfRangeCount, total: null, countPositive: 0,
    first: count > 0 ? values[0].val : null,
    last: count > 0 ? values[values.length - 1].val : null,
    trend: computeTrend(values),
    fromDate, toDate,
  };
}

// ─── Penjelasan analisis di bawah setiap grafik (hanya tampil di PDF) ──────
interface AnalysisNoteProps {
  avgData: AvgWeatherData[];
  lastData?: WeatherDataTypes | null;
  group: ParamGroup;
  interval?: "hour" | "day" | "month";
}

export function AnalysisNote({ avgData, lastData, group, interval }: AnalysisNoteProps) {
  const data = Array.isArray(avgData) ? avgData : [];
  const r = buildResult(data, lastData ?? null, group);

  // Ambang jumlah data agar dianggap "periode pendek" sesuai interval
  const shortPeriodThreshold = interval === "hour" ? 24 : interval === "month" ? 3 : 7;
  const shortPeriod = r.count > 0 && r.count < shortPeriodThreshold;

  const values: InterpretationValues = {
    label: group.label,
    unit: r.unit,
    sum: r.sum,
    compass: group.config.analysis?.type === "compass",
    count: r.count,
    avg: r.avg,
    median: r.median,
    stddev: r.stddev,
    cv: r.cv,
    range: r.range,
    max: r.max,
    min: r.min,
    maxPeriod: r.maxPeriod ?? "",
    minPeriod: r.minPeriod ?? "",
    latest: r.latest,
    status: r.status,
    outOfRange: r.countOutOfRange,
    total: r.total,
    positive: r.countPositive,
    first: r.first,
    last: r.last,
    trend: r.trend,
    fromDate: r.fromDate,
    toDate: r.toDate,
    shortPeriod,
  };
  const text = buildInterpretation(group.label, values, interval ?? "day");

  return (
    <div
      style={{
        marginTop: 8,
        color: "#1e293b",
        fontSize: 20,
        lineHeight: 1.8,
        textAlign: "justify",
      }}
    >
      <p style={{ margin: 0, textAlign: "justify" }}>{text}</p>
    </div>
  );
}

// ─── Kesimpulan analisis (diletakkan setelah grafik terakhir) ──────────────
interface AnalysisConclusionProps {
  avgData: AvgWeatherData[];
  dateRange?: { from?: Date; to?: Date } | undefined;
  interval?: "hour" | "day" | "month";
  stationLabel: string;
}

export function AnalysisConclusion({ avgData, dateRange, interval, stationLabel }: AnalysisConclusionProps) {
  const data = Array.isArray(avgData) ? avgData : [];

  const dirCount = new Array(8).fill(0);
  data.forEach((item) => {
    const dirVal = readValue(item, "W_D_Avg") ?? readValue(item, "WD_Max_WS");
    if (dirVal !== null) dirCount[Math.round(dirVal / 45) % 8]++;
  });
  const dominantDir = dirCount.every((c) => c === 0) ? null : DIRS[dirCount.indexOf(Math.max(...dirCount))];

  const totalSamples = data.reduce((acc, item) => acc + (num(item.jumlah_data) ?? 0), 0);

  const results = GROUPS.map((group) => buildResult(data, null, group));
  const abnormalCount = results.filter((r) => r.status === "di atas normal" || r.status === "di bawah normal").length;
  const ta = results[0];
  const rain = results[4];

  const conclusionParts: string[] = [];
  conclusionParts.push(
    `Selama periode ${formatDate(dateRange?.from)} hingga ${formatDate(dateRange?.to)} (${INTERVAL_LABEL[interval ?? "day"] ?? "Per Hari"}), AWS ${stationLabel} mencatat suhu udara rata-rata ${fmt(ta.avg)}°C dengan rentang ${fmt(ta.min)}–${fmt(ta.max)}°C.`
  );
  if (dominantDir) conclusionParts.push(`Arah angin dominan adalah ${dominantDir}.`);
  conclusionParts.push(
    `Curah hujan total mencapai ${fmt(rain.total)} mm dari ${rain.count} periode, dengan total sampel data ${totalSamples.toLocaleString("id-ID")} periode.`
  );
  conclusionParts.push(
    abnormalCount > 0
      ? `Dari ${results.length} parameter yang diamati, ${abnormalCount} parameter tercatat di luar kisaran normal dan perlu menjadi perhatian.`
      : `Secara umum seluruh parameter yang diamati berada dalam kisaran normal selama periode tersebut.`
  );

  return (
    <div
      style={{
        marginTop: 24,
        border: "1px solid #334155",
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ backgroundColor: "#1e293b", padding: "10px 16px" }}>
        <h2 style={{ color: "#ffffff", fontSize: 23, fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: 1 }}>
          Kesimpulan Analisis Data — AWS {stationLabel}
        </h2>
      </div>
      <div style={{ padding: "16px 20px", color: "#1e293b", fontSize: 20, lineHeight: 1.8 }}>
        {conclusionParts.map((part, i) => (
          <p key={i} style={{ margin: "0 0 4px 0" }}>
            {part}
          </p>
        ))}
      </div>
    </div>
  );
}

// ─── Blok analisis lengkap (dipakai pada tampilan tanpa rentang tanggal) ───
export default function AnalysisSection({ avgData, lastData, dateRange, interval, stationLabel }: AnalysisSectionProps) {
  const data = Array.isArray(avgData) ? avgData : [];
  return (
    <div
      style={{
        marginTop: 24,
        border: "1px solid #334155",
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ backgroundColor: "#1e293b", padding: "10px 16px" }}>
        <h2 style={{ color: "#ffffff", fontSize: 23, fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: 1 }}>
          Analisis Data Cuaca — AWS {stationLabel}
        </h2>
      </div>
      <div style={{ padding: "16px 20px", color: "#1e293b", fontSize: 20, lineHeight: 1.8 }}>
        {GROUPS.map((group) => (
          <AnalysisNote key={group.label} avgData={data} lastData={lastData} group={group} interval={interval} />
        ))}
        <AnalysisConclusion avgData={data} dateRange={dateRange} interval={interval} stationLabel={stationLabel} />
      </div>
    </div>
  );
}
