

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

  return Data.reverse();

//   const results = await prisma.$queryRaw`
//       SELECT DATE_FORMAT("time", '%Y-%m-%d %H:00:00') as time, AVG("timestamp") as average FROM "aws_bungus" WHERE "timestamp" >= NOW() - INTERVAL 30 DAY GROUP BY time ORDER BY time ASC
// `;
// return results
}

