import prisma from "@/libs/prisma";
import { AvgWeatherData } from "@/types/AvgTypes";
import { format, parseISO } from "date-fns";
import { TableName } from "@/config/Location";

interface GetDataExportProps {
  tableName: TableName;
  startDate: Date | string;
  endDate: Date | string;
  interval?: "hour" | "day" | "month";
}

export async function getDataExport({
  tableName,
  startDate,
  endDate,
  interval = "day", // <-- Pastikan defaultnya memanggil 'day'
}: GetDataExportProps): Promise<AvgWeatherData[]> {
  try {
    const fromDate = typeof startDate === "string" ? parseISO(startDate) : startDate;
    const toDate = typeof endDate === "string" ? parseISO(endDate) : endDate;

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) return [];
    if (fromDate > toDate) return [];

    const startString = `${format(fromDate, "yyyy-MM-dd")} 00:00:00`;
    const endString = `${format(toDate, "yyyy-MM-dd")} 23:59:59`;

    // Penentuan Format Tanggal (Tanpa Waktu/Jam untuk Day dan Month)
    let dateFormat: string;
    switch (interval) {
      case "month":
        dateFormat = "%Y-%m"; // Hasil: 2026-06
        break;
      case "hour":
      case "day":
      default:
        // HANYA menampilkan Tahun-Bulan-Tanggal, jamnya dihilangkan.
        dateFormat = "%Y-%m-%d"; // Hasil: 2026-06-24
        break;
    }

    const timeColumn = tableName === "aws_bungus" ? "time" : "timestamp";

    const data = await prisma.$queryRawUnsafe<any[]>(`
      SELECT 
        DATE_FORMAT(DATE_ADD(${timeColumn}, INTERVAL 7 HOUR), '${dateFormat}') as period,
        AVG(Ta_Avg)       as avg_Ta_Avg,
        MAX(Ta_Max)       as avg_Ta_Max,
        MIN(Ta_Min)       as avg_Ta_Min,
        AVG(RH_Avg)       as avg_RH_Avg,
        MAX(RH_Max)       as avg_RH_Max,
        MIN(RH_Min)       as avg_RH_Min,
        AVG(e_Avg)        as avg_e_Avg,
        MAX(e_Max)        as avg_e_Max,
        MIN(e_Min)        as avg_e_Min,
        AVG(WS_Max)       as avg_WS_Max,
        AVG(WS_S_Avg)     as avg_WS_S_Avg,
        SUM(Rain_mm_Tot)  as avg_Rain_mm_Tot,
        AVG(Batt_V_Avg)   as avg_Batt,
        AVG(PTemp_Max)    as avg_Ptemp,
        AVG(WD_Max_WS)    as avg_WD_Max_WS,
        AVG(NR_Wm2_Avg)   as avg_NR_Wm2_Avg,
        MAX(NR_Wm2_Max)   as avg_NR_Wm2_Max,
        AVG(CNR_Wm2_Avg)  as avg_CNR_Wm2_Avg,
        MAX(CNR_Wm2_Max)  as avg_CNR_Wm2_Max,
        MIN(CNR_Wm2_Min)  as avg_CNR_Wm2_Min,
        COUNT(*)          as jumlah_data
      FROM ${tableName}
      WHERE 
        DATE_ADD(${timeColumn}, INTERVAL 7 HOUR) >= '${startString}' 
        AND DATE_ADD(${timeColumn}, INTERVAL 7 HOUR) <= '${endString}'
      GROUP BY 
        DATE_FORMAT(DATE_ADD(${timeColumn}, INTERVAL 7 HOUR), '${dateFormat}')
      ORDER BY 
        period ASC
    `);

    return (data || []).map((row) => ({
      period: row.period ? String(row.period) : "",
      avg_Ta_Avg: row.avg_Ta_Avg !== null ? Number(row.avg_Ta_Avg) : null,
      avg_Ta_Max: row.avg_Ta_Max !== null ? Number(row.avg_Ta_Max) : null,
      avg_Ta_Min: row.avg_Ta_Min !== null ? Number(row.avg_Ta_Min) : null,
      avg_RH_Avg: row.avg_RH_Avg !== null ? Number(row.avg_RH_Avg) : null,
      avg_RH_Max: row.avg_RH_Max !== null ? Number(row.avg_RH_Max) : null,
      avg_RH_Min: row.avg_RH_Min !== null ? Number(row.avg_RH_Min) : null,
      avg_e_Avg: row.avg_e_Avg !== null ? Number(row.avg_e_Avg) : null,
      avg_e_Max: row.avg_e_Max !== null ? Number(row.avg_e_Max) : null,
      avg_e_Min: row.avg_e_Min !== null ? Number(row.avg_e_Min) : null,
      avg_WS_Max: row.avg_WS_Max !== null ? Number(row.avg_WS_Max) : null,
      avg_WS_S_Avg: row.avg_WS_S_Avg !== null ? Number(row.avg_WS_S_Avg) : null,
      avg_Rain_mm_Tot: row.avg_Rain_mm_Tot !== null ? Number(row.avg_Rain_mm_Tot) : null,
      avg_Batt: row.avg_Batt !== null ? Number(row.avg_Batt) : null,
      avg_Ptemp: row.avg_Ptemp !== null ? Number(row.avg_Ptemp) : null,
      avg_WD_Max_WS: row.avg_WD_Max_WS !== null ? Number(row.avg_WD_Max_WS) : null,
      avg_NR_Wm2_Avg: row.avg_NR_Wm2_Avg !== null ? Number(row.avg_NR_Wm2_Avg) : null,
      avg_NR_Wm2_Max: row.avg_NR_Wm2_Max !== null ? Number(row.avg_NR_Wm2_Max) : null,
      avg_CNR_Wm2_Avg: row.avg_CNR_Wm2_Avg !== null ? Number(row.avg_CNR_Wm2_Avg) : null,
      avg_CNR_Wm2_Max: row.avg_CNR_Wm2_Max !== null ? Number(row.avg_CNR_Wm2_Max) : null,
      avg_CNR_Wm2_Min: row.avg_CNR_Wm2_Min !== null ? Number(row.avg_CNR_Wm2_Min) : null,
      jumlah_data: row.jumlah_data ? Number(row.jumlah_data) : 0,
    }));
  } catch (error) {
    console.error(`Error getDataExport (${tableName}):`, error);
    return [];
  }
}
