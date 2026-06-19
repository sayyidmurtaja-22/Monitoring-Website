

import prisma from "@/libs/prisma";

interface RangeProps  {
    from: Date;
    to: Date;
}


export async function getData({from, to} : RangeProps) {

    if (!from || !to) {
        // console.error("Missing parameters:", { from, to });
        throw new Error("from and to dates are required");
    }

    const startRange = new Date (from)
    console.log("startRange", startRange);
    startRange.setHours(0,0,0,0);

    const endDate = new Date (to)
    endDate.setHours(23,59,59,999);

     if (isNaN(startRange.getTime()) || isNaN(endDate.getTime())) {
        throw new Error("Invalid date format");
    }
  // const wibTime = oneday.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
  // console.log("wibtime", wibTime)
  // console.log("oneday",oneday)
  const Data = await prisma.aws_bungus.findMany({
    select: {
      id: true,
      timestamp: true,
      Batt_V_Avg: true,
      PTemp_Max: true,
      WS_S_Avg: true,
      WD_Std: true,
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
    },
    where: {
      timestamp: {
        gte:  startRange,
        lte: endDate,
      },
    },
    orderBy: { timestamp: "desc" },
    // take: 100,
  });

  // console.log("hasil result di server exoprt ", Data)
  return Data.reverse();

//   const results = await prisma.$queryRaw`
//       SELECT DATE_FORMAT("time", '%Y-%m-%d %H:00:00') as time, AVG("timestamp") as average FROM "aws_bungus" WHERE "timestamp" >= NOW() - INTERVAL 30 DAY GROUP BY time ORDER BY time ASC
// `;
// return results
}

interface RangeBaliProps {
  from: Date;
  to: Date;
  interval?: "hour" | "day" | "month";
}

export async function getDataBali({ from, to, interval = "hour" }: RangeBaliProps) {
  if (!from || !to) {
    throw new Error("from and to dates are required");
  }

  const startRange = new Date(from);
  const endDate = new Date(to);

  if (interval !== "month") {
    startRange.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
  } else {
    startRange.setDate(1);
    startRange.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
  }

  if (isNaN(startRange.getTime()) || isNaN(endDate.getTime())) {
    throw new Error("Invalid date format");
  }

  // ── Tentukan format GROUP BY berdasarkan interval ──
  // Per Jam  : '%Y-%m-%d %H:00:00'  → 2024-11-01 08:00:00
  // Per Hari : '%Y-%m-%d'            → 2024-11-01
  // Per Bulan: '%Y-%m'               → 2024-11
  let dateFormat: string;
  switch (interval) {
    case "day":
      dateFormat = "%Y-%m-%d";
      break;
    case "month":
      dateFormat = "%Y-%m";
      break;
    case "hour":
    default:
      dateFormat = "%Y-%m-%d %H:00:00";
      break;
  }

  // Menggunakan $queryRawUnsafe karena format DATE_FORMAT bersifat dinamis
  const startRangeStr = startRange.toISOString().slice(0, 19).replace("T", " ");
  const endDateStr = endDate.toISOString().slice(0, 19).replace("T", " ");

  const Data = await prisma.$queryRawUnsafe(`
    SELECT 
      DATE_FORMAT(DATE_ADD(timestamp, INTERVAL 7 HOUR), '${dateFormat}') as period,
      AVG(Batt_V_Avg)  as Batt_V_Avg,
      AVG(PTemp_Max)    as PTemp_Max,
      AVG(WS_S_Avg)     as WS_S_Avg,
      AVG(WD_Std)       as WD_Std,
      AVG(WS_Max)       as WS_Max,
      AVG(WD_Max_WS)    as WD_Max_WS,
      AVG(Ta_Avg)       as Ta_Avg,
      MAX(Ta_Max)       as Ta_Max,
      MIN(Ta_Min)       as Ta_Min,
      AVG(RH_Avg)       as RH_Avg,
      MAX(RH_Max)       as RH_Max,
      MIN(RH_Min)       as RH_Min,
      AVG(NR_Wm2_Avg)   as NR_Wm2_Avg,
      MAX(NR_Wm2_Max)   as NR_Wm2_Max,
      MIN(NR_Wm2_Min)   as NR_Wm2_Min,
      AVG(CNR_Wm2_Avg)  as CNR_Wm2_Avg,
      MAX(CNR_Wm2_Max)  as CNR_Wm2_Max,
      MIN(CNR_Wm2_Min)  as CNR_Wm2_Min,
      SUM(Rain_mm_Tot)   as Rain_mm_Tot,
      AVG(e_Avg)        as e_Avg,
      MAX(e_Max)        as e_Max,
      MIN(e_Min)        as e_Min,
      COUNT(*)          as jumlah_data
    FROM aws_bali
    WHERE 
      timestamp >= '${startRangeStr}' 
      AND timestamp <= '${endDateStr}'
    GROUP BY 
      DATE_FORMAT(DATE_ADD(timestamp, INTERVAL 7 HOUR), '${dateFormat}')
    ORDER BY 
      period ASC
  `);

  console.log(`getDataBali - interval ${interval} returned:`, (Data as any[]).length, "rows");
  return Data;
}
