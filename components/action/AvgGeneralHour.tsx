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

export async function AvgGeneralHour({
  from,
  to,
  interval = "day",
  table,
}: DataProps): Promise<AvgWeatherData[]> {
  if (!from || !to) throw new Error("from dan to perlu di isikan dahulu");

  const startRange = new Date(from);
  const endDate = new Date(to);

  // 1. PERBAIKAN: Set jam/tanggal DULUAN dan format manual ke String (Mencegah pergeseran Timezone UTC dari toISOString)
  if (interval !== "month") {
    startRange.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
  } else {
    startRange.setDate(1);
    startRange.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
  }

  // 2. Format secara manual menjadi YYYY-MM-DD HH:mm:ss menggunakan Local Time
  const formatSQLDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const start = formatSQLDate(startRange);
  const end = formatSQLDate(endDate);

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
        AVG(Batt_V_Avg)   as avg_Batt,
        AVG(PTemp_Max)    as avg_Ptemp,
        AVG(WS_S_Avg)     as avg_WS_S_Avg,
        AVG(WS_Max)       as avg_WS_Max,
        AVG(W_D_Avg)       as avg_W_D_Avg,
        AVG(WD_Max_WS)    as avg_WD_Max_WS,
        AVG(Ta_Avg)       as avg_Ta_Avg,
        MAX(Ta_Max)       as avg_Ta_Max,
        MIN(Ta_Min)       as avg_Ta_Min,
        AVG(RH_Avg)       as avg_RH_Avg,
        MAX(RH_Max)       as avg_RH_Max,
        MIN(RH_Min)       as avg_RH_Min,
        AVG(NR_Wm2_Avg)  as avg_NR_Wm2_Avg,
        MAX(NR_Wm2_Max)  as avg_NR_Wm2_Max,
        AVG(CNR_Wm2_Avg) as avg_CNR_Wm2_Avg,
        MAX(CNR_Wm2_Max) as avg_CNR_Wm2_Max,
        MIN(CNR_Wm2_Min) as avg_CNR_Wm2_Min,
        SUM(Rain_mm_Tot) as avg_Rain_mm_Tot,
        AVG(e_Avg)       as avg_e_Avg,
        MAX(e_Max)       as avg_e_Max,
        MIN(e_Min)       as avg_e_Min,
        AVG(P)           as avg_P,
        COUNT(*)         as jumlah_data
        FROM ${table}
        WHERE timestamp >= '${start}' AND timestamp <= '${end}'
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

  // PERBAIKAN: Set waktu duluan dan format secara manual
  if (interval !== "month") {
    startRange.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
  } else {
    startRange.setDate(1);
    startRange.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
  }

  const formatSQLDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const start = formatSQLDate(startRange);
  const end = formatSQLDate(endDate);

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
        AVG(Batt_V_Avg) as Batt_V_Avg, 
        MAX(PTemp_Max) as PTemp_Max,
        AVG(WS_S_Avg) as WS_S_Avg, 
        AVG(WD_Std) as WD_Std, 
        AVG(W_D_Avg) as W_D_Avg,
        MAX(WS_Max) as WS_Max, 
        AVG(WD_Max_WS) as WD_Max_WS,
        AVG(Ta_Avg) as Ta_Avg, 
        MAX(Ta_Max) as Ta_Max, 
        MIN(Ta_Min) as Ta_Min,
        AVG(RH_Avg) as RH_Avg, 
        MAX(RH_Max) as RH_Max, 
        MIN(RH_Min) as RH_Min,
        AVG(NR_Wm2_Avg) as NR_Wm2_Avg, 
        MAX(NR_Wm2_Max) as NR_Wm2_Max, 
        MIN(NR_Wm2_Min) as NR_Wm2_Min,
        AVG(CNR_Wm2_Avg) as CNR_Wm2_Avg, 
        MAX(CNR_Wm2_Max) as CNR_Wm2_Max, 
        MIN(CNR_Wm2_Min) as CNR_Wm2_Min,
        SUM(Rain_mm_Tot) as Rain_mm_Tot,
        AVG(e_Avg) as e_Avg, 
        MAX(e_Max) as e_Max, 
        MIN(e_Min) as e_Min,
        AVG(P) as P,
        COUNT(*) as jumlah_data
        FROM ${table}
        WHERE timestamp >= '${start}' AND timestamp <= '${end}'
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