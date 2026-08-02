import { TableName } from "@/config/Location";
import { AvgWeatherData, IntervalType,WeatherData, WeatherDataTypes } from "@/types/AvgTypes";
import prisma from "@/libs/prisma";


interface DataProps {
  from: Date;
  to: Date;
  interval?: IntervalType;
  table: TableName;
}
interface lastData {
  table:TableName
}

// Konversi instant ke waktu WIB (UTC+7) untuk filter yang konsisten
// dengan pengelompokan DATE_ADD(timestamp, INTERVAL 7 HOUR).
const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
const shiftWIB = (d: Date) => new Date(d.getTime() + WIB_OFFSET_MS);

function formatWIB(d: Date): string {
  const w = shiftWIB(d);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${w.getUTCFullYear()}-${p(w.getUTCMonth() + 1)}-${p(w.getUTCDate())} ${p(w.getUTCHours())}:${p(w.getUTCMinutes())}:${p(w.getUTCSeconds())}`;
}

// Snap rentang ke kalender WIB untuk interval bulan (pertahankan perilaku lama)
function snapMonthRange(from: Date, to: Date): { from: Date; to: Date } {
  const fs = shiftWIB(from);
  fs.setUTCDate(1);
  fs.setUTCHours(0, 0, 0, 0);
  const te = shiftWIB(to);
  te.setUTCDate(1);
  te.setUTCMonth(te.getUTCMonth() + 1, 0);
  te.setUTCHours(23, 59, 59, 999);
  return {
    from: new Date(fs.getTime() - WIB_OFFSET_MS),
    to: new Date(te.getTime() - WIB_OFFSET_MS),
  };
}

export async function AvgGeneralHour({
  from,
  to,
  interval = "day",
  table,
}: DataProps): Promise<AvgWeatherData[]> {
  if (!from || !to) throw new Error("from dan to perlu di isikan dahulu");

  const startRange = new Date(from);
  const endDate = new Date(to);

  if (isNaN(startRange.getTime()) || isNaN(endDate.getTime()))
    throw new Error("from dan to perlu di isikan dahulu");

  // Snap ke kalender WIB untuk interval bulan (pertahankan perilaku lama)
  if (interval === "month") {
    const snapped = snapMonthRange(startRange, endDate);
    startRange.setTime(snapped.from.getTime());
    endDate.setTime(snapped.to.getTime());
  }

  // Format waktu WIB (UTC+7) agar konsisten dengan GROUP BY periode
  const start = formatWIB(startRange);
  const end = formatWIB(endDate);

  const formatWaktu =
    interval === "day"
      ? "%Y-%m-%d"
      : interval === "month"
        ? "%Y-%m"
        : "%Y-%m-%d %H:00:00";

  try {
    const result = await prisma.$queryRawUnsafe<AvgWeatherData[]>(`
        SELECT 
        DATE_FORMAT(DATE_ADD(timestamp, INTERVAL 7 HOUR), '${formatWaktu}') as period,
        AVG(CASE WHEN Batt_V_Avg BETWEEN 9 AND 18 THEN Batt_V_Avg END)   as avg_Batt,
        AVG(CASE WHEN PTemp_Max BETWEEN -50 AND 80 THEN PTemp_Max END)    as avg_Ptemp,
        AVG(CASE WHEN WS_S_Avg BETWEEN 0 AND 60 THEN WS_S_Avg END)     as avg_WS_S_Avg,
        AVG(CASE WHEN WS_Max BETWEEN 0 AND 100 THEN WS_Max END)       as avg_WS_Max,
        AVG(CASE WHEN W_D_Avg BETWEEN 0 AND 360 THEN W_D_Avg END)      as avg_W_D_Avg,
        AVG(CASE WHEN WD_Max_WS BETWEEN 0 AND 360 THEN WD_Max_WS END)    as avg_WD_Max_WS,
        AVG(CASE WHEN Ta_Avg BETWEEN -50 AND 60 THEN Ta_Avg END)       as avg_Ta_Avg,
        MAX(CASE WHEN Ta_Max BETWEEN -50 AND 60 THEN Ta_Max END)       as avg_Ta_Max,
        MIN(CASE WHEN Ta_Min BETWEEN -50 AND 60 THEN Ta_Min END)       as avg_Ta_Min,
        AVG(CASE WHEN RH_Avg BETWEEN 0 AND 100 THEN RH_Avg END)       as avg_RH_Avg,
        MAX(CASE WHEN RH_Max BETWEEN 0 AND 100 THEN RH_Max END)       as avg_RH_Max,
        MIN(CASE WHEN RH_Min BETWEEN 0 AND 100 THEN RH_Min END)       as avg_RH_Min,
        AVG(CASE WHEN NR_Wm2_Avg BETWEEN -200 AND 1100 THEN NR_Wm2_Avg END)  as avg_NR_Wm2_Avg,
        MAX(CASE WHEN NR_Wm2_Max BETWEEN -200 AND 1100 THEN NR_Wm2_Max END)  as avg_NR_Wm2_Max,
        AVG(CASE WHEN CNR_Wm2_Avg BETWEEN -200 AND 1100 THEN CNR_Wm2_Avg END) as avg_CNR_Wm2_Avg,
        MAX(CASE WHEN CNR_Wm2_Max BETWEEN -200 AND 1100 THEN CNR_Wm2_Max END) as avg_CNR_Wm2_Max,
        MIN(CASE WHEN CNR_Wm2_Min BETWEEN -200 AND 1100 THEN CNR_Wm2_Min END) as avg_CNR_Wm2_Min,
        SUM(CASE WHEN Rain_mm_Tot >= 0 THEN Rain_mm_Tot END) as avg_Rain_mm_Tot,
        AVG(CASE WHEN e_Avg BETWEEN 0 AND 100 THEN e_Avg END)       as avg_e_Avg,
        MAX(CASE WHEN e_Max BETWEEN 0 AND 100 THEN e_Max END)       as avg_e_Max,
        MIN(CASE WHEN e_Min BETWEEN 0 AND 100 THEN e_Min END)       as avg_e_Min,
        AVG(CASE WHEN P BETWEEN 900 AND 1100 THEN P END)           as avg_P,
        COUNT(*)         as jumlah_data
        FROM ${table}
        WHERE DATE_ADD(timestamp, INTERVAL 7 HOUR) >= '${start}' AND DATE_ADD(timestamp, INTERVAL 7 HOUR) <= '${end}'
        GROUP BY DATE_FORMAT(DATE_ADD(timestamp, INTERVAL 7 HOUR), '${formatWaktu}')
        ORDER BY period ASC
    `);

    console.log(`AvgHourGeneric [${table}][${interval}]:`, result.length);
    const serializedResult = result.map((item: any) => ({
      ...item,
      jumlah_data: item.jumlah_data != null ? Number(item.jumlah_data) : 0,
    }));
    return serializedResult ?? [];
  } catch (error) {
    console.error(`error di bagian database ${table}`, error);
    return [];
  }
}

export async function ExportGeneric({
  from,
  to,
  interval = "day",
  table,
}: DataProps): Promise<AvgWeatherData[]> {
  if (!from || !to)
    throw new Error("from dan to di perlukan dan tidak boleh kosong");

  const startRange = new Date(from);
  const endDate = new Date(to);

  if (isNaN(startRange.getTime()) || isNaN(endDate.getTime()))
    throw new Error("from dan to di perlukan dan tidak boleh kosong");

  // Snap ke kalender WIB untuk interval bulan (pertahankan perilaku lama)
  if (interval === "month") {
    const snapped = snapMonthRange(startRange, endDate);
    startRange.setTime(snapped.from.getTime());
    endDate.setTime(snapped.to.getTime());
  }

  // Format waktu WIB (UTC+7) agar konsisten dengan GROUP BY periode
  const start = formatWIB(startRange);
  const end = formatWIB(endDate);

  const formatWaktu =
    interval === "day"
      ? "%Y-%m-%d"
      : interval === "month"
        ? "%Y-%m"
        : "%Y-%m-%d %H:00:00";

  try {
    // PERBAIKAN: Jika tujuannya EXPORT data mentah per interval, gunakan agregasi (AVG/MAX) atau HAPUS GROUP BY-nya. 
    // Di sini saya asumsikan Anda ingin data rata-rata/ter-agregasi yang siap diexport berdasarkan formatWaktu.
    const hasil = await prisma.$queryRawUnsafe<AvgWeatherData[]>(`
        SELECT
        DATE_FORMAT(DATE_ADD(timestamp, INTERVAL 7 HOUR), '${formatWaktu}') as period,
        AVG(CASE WHEN Batt_V_Avg BETWEEN 9 AND 18 THEN Batt_V_Avg END) as Batt_V_Avg, 
        MAX(CASE WHEN PTemp_Max BETWEEN -50 AND 80 THEN PTemp_Max END) as PTemp_Max,
        AVG(CASE WHEN WS_S_Avg BETWEEN 0 AND 60 THEN WS_S_Avg END) as WS_S_Avg, 
        AVG(CASE WHEN WD_Std BETWEEN 0 AND 360 THEN WD_Std END) as WD_Std, 
        AVG(CASE WHEN W_D_Avg BETWEEN 0 AND 360 THEN W_D_Avg END) as W_D_Avg,
        MAX(CASE WHEN WS_Max BETWEEN 0 AND 100 THEN WS_Max END) as WS_Max, 
        AVG(CASE WHEN WD_Max_WS BETWEEN 0 AND 360 THEN WD_Max_WS END) as WD_Max_WS,
        AVG(CASE WHEN Ta_Avg BETWEEN -50 AND 60 THEN Ta_Avg END) as Ta_Avg, 
        MAX(CASE WHEN Ta_Max BETWEEN -50 AND 60 THEN Ta_Max END) as Ta_Max, 
        MIN(CASE WHEN Ta_Min BETWEEN -50 AND 60 THEN Ta_Min END) as Ta_Min,
        AVG(CASE WHEN RH_Avg BETWEEN 0 AND 100 THEN RH_Avg END) as RH_Avg, 
        MAX(CASE WHEN RH_Max BETWEEN 0 AND 100 THEN RH_Max END) as RH_Max, 
        MIN(CASE WHEN RH_Min BETWEEN 0 AND 100 THEN RH_Min END) as RH_Min,
        AVG(CASE WHEN NR_Wm2_Avg BETWEEN -200 AND 1100 THEN NR_Wm2_Avg END) as NR_Wm2_Avg, 
        MAX(CASE WHEN NR_Wm2_Max BETWEEN -200 AND 1100 THEN NR_Wm2_Max END) as NR_Wm2_Max, 
        MIN(CASE WHEN NR_Wm2_Min BETWEEN -200 AND 1100 THEN NR_Wm2_Min END) as NR_Wm2_Min,
        AVG(CASE WHEN CNR_Wm2_Avg BETWEEN -200 AND 1100 THEN CNR_Wm2_Avg END) as CNR_Wm2_Avg, 
        MAX(CASE WHEN CNR_Wm2_Max BETWEEN -200 AND 1100 THEN CNR_Wm2_Max END) as CNR_Wm2_Max, 
        MIN(CASE WHEN CNR_Wm2_Min BETWEEN -200 AND 1100 THEN CNR_Wm2_Min END) as CNR_Wm2_Min,
        SUM(CASE WHEN Rain_mm_Tot >= 0 THEN Rain_mm_Tot END) as Rain_mm_Tot,
        AVG(CASE WHEN e_Avg BETWEEN 0 AND 100 THEN e_Avg END) as e_Avg, 
        MAX(CASE WHEN e_Max BETWEEN 0 AND 100 THEN e_Max END) as e_Max, 
        MIN(CASE WHEN e_Min BETWEEN 0 AND 100 THEN e_Min END) as e_Min,
        AVG(CASE WHEN P BETWEEN 900 AND 1100 THEN P END) as P,
        COUNT(*) as jumlah_data
        FROM ${table}
        WHERE DATE_ADD(timestamp, INTERVAL 7 HOUR) >= '${start}' AND DATE_ADD(timestamp, INTERVAL 7 HOUR) <= '${end}'
        GROUP BY DATE_FORMAT(DATE_ADD(timestamp, INTERVAL 7 HOUR), '${formatWaktu}')
        ORDER BY period ASC
    `);
    
    console.log(`ExportGeneric [${table}][${interval}]:`, hasil.length);
    return hasil ?? [];
  } catch (error) {
    console.error(`error pada bagian database export [${table}]`, error);
    return [];
  }

}


export async function LastData({ table }: lastData): Promise<WeatherDataTypes | null> {
  const clientModel = prisma[table] as any;

  const dataLast = await clientModel.findFirst({
    select: {
      id: true,
      time: true,
      Batt_V_Avg: true,
      PTemp_Max: true,
      WS_S_Avg: true,
      WS_Max: true,
      WD_Max_WS: true,
      Ta_Avg: true,
      Ta_Max: true,
      Ta_Min: true,
      RH_Avg: true,
      RH_Max: true,
      RH_Min: true,
      NR_Wm2_Avg: true,
      NR_Wm2_Max: true,
      NR_Wm2_Min: true,
      CNR_Wm2_Avg: true,
      CNR_Wm2_Max: true,
      CNR_Wm2_Min: true,
      Rain_mm_Tot: true,
      e_Avg: true,
      e_Max: true,
      e_Min: true,
      // ❌ Hapus jumlah_data — tidak ada di schema tabel
    },
    orderBy: {
      time: "desc",
    },
  });

  console.log(`[${table}] data terakhir:`, dataLast);
  return dataLast ?? null;
}