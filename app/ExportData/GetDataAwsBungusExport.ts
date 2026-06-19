import prisma from "@/libs/prisma";
import { AvgWeatherData, IntervalType } from "@/types/AvgTypes";
import { format, parseISO } from "date-fns";

interface getDataAwsBungusProps {
  startDate: Date | string;
  endDate: Date | string;
  interval?: IntervalType;
}

export async function getDataAwsBungusExport({ 
  startDate, 
  endDate, 
  interval = "day" 
}: getDataAwsBungusProps): Promise<AvgWeatherData[]> {
  try {
    // console.log("Fetching data from:", startDate, "to:", endDate);  
    
    
    // if (!startDate || !endDate) return [];

    
    const fromDate = typeof startDate === "string" ? parseISO(startDate) : startDate;
    const toDate = typeof endDate === "string" ? parseISO(endDate) : endDate;
    
    console.log("fromdate", fromDate)
    console.log("enddate", toDate)


    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) return [];

    if (fromDate > toDate) return [];

    const startString = `${format(fromDate, "yyyy-MM-dd")} 00:00:00`;
    const endString = `${format(toDate, "yyyy-MM-dd")} 23:59:59`;

    let timeFormat: string;
    switch (interval) {
      case "hour":
        timeFormat = "%Y-%m-%d %H:00:00";
        break;
      case "month":
        timeFormat = "%Y-%m";
        break;
      default:
        timeFormat = "%Y-%m-%d";
    }

    // console.log("timeformat", timeFormat)
    console.log("Querying with:", { startString, endString, timeFormat });

    // const result = await prisma.$queryRaw`
    // select * from aws_bungus limit 20`;

// console.log("result", result)

    const data = await prisma.$queryRaw<any[]>`
  SELECT 
    DATE_FORMAT(DATE_ADD(time, INTERVAL 7 HOUR), ${timeFormat}) as period, 
    AVG(Ta_Avg) as avg_Ta_Avg, 
    AVG(Ta_Max) as avg_Ta_Max, 
    AVG(Ta_Min) as avg_Ta_Min, 
    AVG(RH_Avg) as avg_RH_Avg, 
    AVG(RH_Max) as avg_RH_Max, 
    AVG(RH_Min) as avg_RH_Min, 
    AVG(e_Avg) as avg_e_Avg, 
    AVG(e_Max) as avg_e_Max, 
    AVG(e_Min) as avg_e_Min, 
    AVG(WS_Max) as avg_WS_Max, 
    AVG(WS_S_Avg) as avg_WS_S_Avg, 
    AVG(Rain_mm_Tot) as avg_Rain_mm_Tot 
  FROM aws_bungus 
  WHERE \`time\` >= ${new Date(startString)} 
    AND \`time\` <= ${new Date(endString)} 
  GROUP BY DATE_FORMAT(DATE_ADD(time, INTERVAL 7 HOUR), ${timeFormat}) 
  ORDER BY period ASC
`;


console.log("data", data)
    // console.log("Data fetched:", data?.length || 0, "rows");

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
      // Field opsional
      avg_Batt: null,
      avg_Ptemp: null,
      avg_WD_Max_WS: null,
      avg_NR_Wm2_Avg: null,
      avg_NR_Wm2_Max: null,
      avg_CNR_Wm2_Min: null,
      avg_CNR_Wm2_Max: null,
      avg_CNR_Wm2_Avg: null,
      jumlah_data: 0,
    }));
  } catch (error) {
    console.error("Error getDataAwsBungusExport:", error);
    return [];
  }
}