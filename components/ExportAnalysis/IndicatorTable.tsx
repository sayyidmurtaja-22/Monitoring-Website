"use client";

import type { CSSProperties } from "react";
import { AvgWeatherData } from "@/types/AvgTypes";

interface IndicatorTableProps {
  data?: AvgWeatherData[];
  avgData: AvgWeatherData[];
}

function num(v: unknown): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function fmt(v: number | null, digits = 1): string {
  if (v === null || Number.isNaN(v)) return "-";
  return v.toFixed(digits).replace(".", ",");
}

interface Indicator {
  label: string;
  unit: string;
  key: string;
  digits: number;
}

const INDICATORS: Indicator[] = [
  { label: "Suhu", unit: "°C", key: "avg_Ta_Avg", digits: 1 },
  { label: "Kelembapan", unit: "%", key: "avg_RH_Avg", digits: 1 },
  { label: "Tekanan Uap", unit: "hPa", key: "avg_e_Avg", digits: 2 },
  { label: "Curah Hujan", unit: "mm", key: "avg_Rain_mm_Tot", digits: 1 },
];

export default function IndicatorTable({ data, avgData }: IndicatorTableProps) {
  const rows = Array.isArray(avgData) ? avgData : [];
  const latest =
    (Array.isArray(data) && data.length > 0 ? data[data.length - 1] : null) ??
    rows[rows.length - 1] ??
    null;

  const totalRecords = rows.reduce((acc, item) => acc + (num(item.jumlah_data) ?? 0), 0);

  const stats = INDICATORS.map((ind) => ({
    ...ind,
    latest: num((latest as unknown as Record<string, unknown>)?.[ind.key]) ?? null,
  }));

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
  const valueCellStyle: CSSProperties = { ...cellStyle, textAlign: "center" };

  return (
    <>
      <div data-export-subtitle className="hidden" style={{ marginTop: 8, borderBottom: "2px solid #334155", backgroundColor: "#f8fafc", padding: "6px 14px" }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a", fontFamily: "sans-serif" }}>
          Data Terbaru dengan Rata-rata per Jam
        </h2>
      </div>
      <div data-export-table className="hidden" style={{ marginTop: 0 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "sans-serif" }}>
          <thead>
            <tr>
              <th style={headCellStyle}>Indikator</th>
              {stats.map((ind) => (
                <th key={ind.key} style={headCellStyle}>
                  {ind.label} ({ind.unit})
                </th>
              ))}
              <th style={headCellStyle}>Total Data</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={cellStyle}>Terbaru</td>
              {stats.map((ind) => (
                <td key={ind.key} style={valueCellStyle}>
                  {ind.latest !== null ? fmt(ind.latest, ind.digits) : "-"}
                </td>
              ))}
              <td style={valueCellStyle}>{totalRecords.toLocaleString("id-ID")}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
