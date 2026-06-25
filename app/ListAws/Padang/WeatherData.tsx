"use client";
import React, { useRef } from "react";
import { ChartBar } from "@/components/Chart/ChartBar";
import { ChartLine } from "@/components/Chart/LineChart";
import BatteryChart from "@/components/Chart/BatteryChart";
import { AvgWeatherData, WeatherDataTypes } from "@/types/AvgTypes";
import { type DateRange } from "react-day-picker";
import {
  HUMIDITY_CONFIG,
  VAPOR_PRESSURE_CONFIG,
  TEMPERATURE_CONFIG,
  PRESSURE_CONFIG,
  NET_RADIATION_CONFIG,
  CNR_RADIATION_CONFIG,
  BATTERY_CONFIG,
  WIND_CONFIG,
  WIND_DIRECTION_CONFIG,
} from "@/config/Location";
import { WeatherLine } from "@/components/Chart/WeatherLine";
import { WeatherLineDual } from "@/components/Chart/WeatherLineDual";
import WindRose from "@/components/Chart/WindRose";
import CardData from "@/components/CardDataCuaca/CardData";

interface ExportData {
  exportRef: React.RefObject<HTMLDivElement | null>;
  initialData: AvgWeatherData[];
  avgData: AvgWeatherData[];
  lastData: WeatherDataTypes | null;
  dateRange: DateRange | undefined;
  interval: "hour" | "day" | "month";
  exportHeaderData?: { nama: string; nim: string; instansi: string } | null;
}

// ─── Helper: format tanggal period ───────────────────────────────────────────
function formatPeriod(period: string | null | undefined): string {
  if (!period) return "-";
  const d = new Date(period);
  if (isNaN(d.getTime())) return period;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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
  config: any; // Menggunakan ChartConfig
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

  const prefix = primaryLine.key.split('_')[0]; // misal "RH", "NR"
  const avgKey = primaryLine.key;
  const maxKey = config.lines.find((l: any) => l.key.startsWith(prefix) && l.key.toLowerCase().includes("max"))?.key || avgKey;
  const minKey = config.lines.find((l: any) => l.key.startsWith(prefix) && l.key.toLowerCase().includes("min"))?.key || avgKey;

  // Hitung stats dari data periode
  const avgStats = calcStats(avgData, avgKey);
  const maxStats = calcStats(avgData, maxKey);
  const minStats = calcStats(avgData, minKey);

  const periodMin = minStats.min;
  const periodMax = maxStats.max;
  const periodAvg = avgStats.avg;

  // Progress bar: posisi avg dalam rentang [periodMin, periodMax]
  const progressPct =
    periodMin !== null && periodMax !== null && periodMax !== periodMin
      ? Math.round(((periodAvg ?? periodMin) - periodMin) / (periodMax - periodMin) * 100)
      : 50;

  // Temukan period (tanggal) saat max dan min terjadi dari avgData
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

  // Jika ada secondary (seperti arah angin), ganti status badge dengan arah pada waktu tersebut
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

  // Kelas card (warna & hover tetap seperti sebelumnya)
  const cardBase =
    "flex flex-col gap-1 p-5 rounded-2xl bg-[#1d3557] transition-all duration-200 ease-in-out " +
    "hover:bg-[#a8dadc] hover:font-black hover:shadow-2xl hover:-translate-y-1 " +
    "hover:border-transparent hover:text-[#1d3557] border border-[#1a3a6e]/40";

  return (
    <div className="flex flex-col gap-1 pt-0 h-full">
      <div className={`${cardBase} h-full justify-center`}>
        <div className="flex items-center gap-2 mb-6">
          <span className="text-[#a8dadc] group-hover:text-[#1d3557]">{icon}</span>
          <p className="text-xs text-white uppercase tracking-widest font-bold">
            Ringkasan {label}
          </p>
        </div>

        {/* Nilai Tertinggi */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#E63946] text-lg font-bold leading-none">↗</span>
            <p className="text-[11px] text-white/70 uppercase tracking-wider font-bold">Tertinggi</p>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-3xl font-bold text-white leading-none">
                {periodMax !== null ? periodMax.toFixed(1) : "-"}
                <span className="text-lg font-normal ml-1">{unit}</span>
              </p>
              <p className="text-[11px] text-white/60 mt-1">{formatPeriod(maxPeriod)}</p>
            </div>
            {maxStatus && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${maxStatus.color}`}>
                {maxStatus.label}
              </span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 my-3 rounded-full"></div>

        {/* Nilai Terendah */}
        <div className="mt-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-emerald-400 text-lg font-bold leading-none">↘</span>
            <p className="text-[11px] text-white/70 uppercase tracking-wider font-bold">Terendah</p>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-3xl font-bold text-white leading-none">
                {periodMin !== null ? periodMin.toFixed(1) : "-"}
                <span className="text-lg font-normal ml-1">{unit}</span>
              </p>
              <p className="text-[11px] text-white/60 mt-1">{formatPeriod(minPeriod)}</p>
            </div>
            {minStatus && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${minStatus.color}`}>
                {minStatus.label}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Icon SVG sederhana ───────────────────────────────────────────────────────
const IconDrop = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 8.27 2 13a10 10 0 0020 0C22 8.27 17.52 2 12 2z" />
  </svg>
);
const IconSun = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);
const IconBattery = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 7h11a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2zm13 4h1a1 1 0 010 2h-1v-2z" />
  </svg>
);
const IconWave = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IconWind = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
  </svg>
);
const IconCompass = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

// ─── Header Laporan PDF ─────────────────────────────────────────────────────────
function ExportHeader({ data }: { data: { nama: string; nim: string; instansi: string } }) {
  // 1. Ambil waktu saat ini secara dinamis (mengikuti zona waktu perangkat lokal)
  const now = new Date();

  // 2. Format Tanggal (Contoh: 24 Juni 2026)
  const dateStr = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);

  // 3. Format Jam (Contoh: 14.41)
  const timeStr = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now).replace(":", ".");

  // 4. Deteksi otomatis Zona Waktu (WIB/WITA/WIT) berdasarkan lokasi perangkat pengguna
  const tzParts = new Intl.DateTimeFormat("id-ID", { timeZoneName: "short" }).formatToParts(now);
  const timeZoneName = tzParts.find((part) => part.type === "timeZoneName")?.value || "";

  return (
    <div style={{ padding: "24px 32px", borderBottom: "3px solid #1d3557", marginBottom: 16, backgroundColor: "#ffffff" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1d3557", marginBottom: 4, fontFamily: "sans-serif" }}>
        Laporan Data Cuaca — AWS Padang
      </h1>
      <p style={{ fontSize: 12, color: "#64748b", marginBottom: 12, fontFamily: "sans-serif" }}>
        Diekspor pada {dateStr} pukul {timeStr} {timeZoneName}
      </p>
      <div style={{ display: "flex", gap: 32, fontSize: 13, fontFamily: "sans-serif" }}>
        <div><span style={{ color: "#64748b" }}>Nama:</span> <strong style={{ color: "#1e293b" }}>{data.nama}</strong></div>
        <div><span style={{ color: "#64748b" }}>NIM:</span> <strong style={{ color: "#1e293b" }}>{data.nim}</strong></div>
        <div><span style={{ color: "#64748b" }}>Instansi:</span> <strong style={{ color: "#1e293b" }}>{data.instansi}</strong></div>
      </div>
    </div>
  );
}

// ─── Komponen utama ─────────────────────────────────────────────────────────────
export default function WeatherData({
  exportRef,
  initialData,
  avgData,
  dateRange,
  lastData,
  interval,
  exportHeaderData,
}: ExportData) {
  if (!dateRange) {
    return (
      <div className="flex flex-col gap-2 w-full">
        <div ref={exportRef} className="flex flex-col gap-4">
          {exportHeaderData && <ExportHeader data={exportHeaderData} />}
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
    <div className="flex flex-col gap-4 w-full">
      <div ref={exportRef} className="flex flex-col gap-4">
        {exportHeaderData && <ExportHeader data={exportHeaderData} />}
        <div className="flex flex-row p-2">
          <CardData data={initialData} avgData={avgData} />
        </div>

        {/* ── Baris 1: Kelembaban ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 w-full">
          <WeatherLine
            data={avgData}
            lines={HUMIDITY_CONFIG.lines}
            title={HUMIDITY_CONFIG.title}
            yLabel={HUMIDITY_CONFIG.yLabel}
          />
          <StatCards
            avgData={avgData}
            config={HUMIDITY_CONFIG}
            icon={<IconDrop />}
          />
        </div>

        {/* ── Baris 2: Radiasi Neto ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 w-full">
          <WeatherLine
            data={avgData}
            lines={NET_RADIATION_CONFIG.lines}
            title={NET_RADIATION_CONFIG.title}
            yLabel={NET_RADIATION_CONFIG.yLabel}
          />
          <StatCards
            avgData={avgData}
            config={NET_RADIATION_CONFIG}
            icon={<IconSun />}
          />
        </div>

        {/* ── Baris 3: Baterai & Panel ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 w-full">
          <WeatherLineDual
            data={avgData}
            lines={BATTERY_CONFIG.lines}
            title={BATTERY_CONFIG.title}
          />
          <StatCards
            avgData={avgData}
            config={BATTERY_CONFIG}
            icon={<IconBattery />}
          />
        </div>

        {/* ── Baris 4: Radiasi CNR + WindRose ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 w-full">
          <WeatherLine
            data={avgData}
            lines={CNR_RADIATION_CONFIG.lines}
            title={CNR_RADIATION_CONFIG.title}
            yLabel={CNR_RADIATION_CONFIG.yLabel}
          />
          <StatCards
            avgData={avgData}
            config={CNR_RADIATION_CONFIG}
            icon={<IconWave />}
          />
        </div>

        {/* ── WindRose ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 w-full">
          <WindRose
            data={avgData}
            speedConfig={WIND_CONFIG}
            directionConfig={WIND_DIRECTION_CONFIG}
          />
          <div className="h-full">
            <StatCards
              avgData={avgData}
              config={WIND_CONFIG}
              icon={<IconWind />}
              secondary={{
                config: WIND_DIRECTION_CONFIG,
                icon: <IconCompass />,
                label: "Arah Dominan"
              }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}