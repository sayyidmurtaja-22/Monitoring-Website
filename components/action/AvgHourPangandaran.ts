// components/action/AvgHourBali.ts
import prisma from "@/libs/prisma";
import { AvgWeatherData, IntervalType } from "@/types/AvgTypes";

interface RangeProps {
    from: Date;
    to: Date;
    interval?: IntervalType;
}

export async function AvgHourPangandaran({ from, to, interval = "hour" }: RangeProps): Promise<AvgWeatherData[]> {
    if (!from || !to) {
        throw new Error("from and to dates are required");
    }

    const startRange = new Date(from);
    const endDate = new Date(to);
    
    if (interval !== 'month') {
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

    try {
        let result: AvgWeatherData[];
        
        // Query untuk interval PER HARI
        if (interval === 'day') {
            result = await prisma.$queryRaw<AvgWeatherData[]>`
                SELECT 
                    DATE_FORMAT(DATE_ADD(timestamp, INTERVAL 7 HOUR), '%Y-%m-%d') as period,
                    AVG(Batt_V_Avg) as avg_Batt,
                    AVG(PTemp_Max) as avg_Ptemp,
                    AVG(WS_S_Avg) as avg_WS_S_Avg,
                    AVG(WS_Max) as avg_WS_Max,
                    AVG(WD_Max_WS) as avg_WD_Max_WS,
                    AVG(Ta_Avg) as avg_Ta_Avg,
                    AVG(Ta_Max) as avg_Ta_Max,
                    AVG(Ta_Min) as avg_Ta_Min,
                    AVG(RH_Avg) as avg_RH_Avg,
                    AVG(RH_Max) as avg_RH_Max,
                    AVG(RH_Min) as avg_RH_Min,
                    AVG(NR_Wm2_Avg) as avg_NR_Wm2_Avg,
                    AVG(NR_Wm2_Max) as avg_NR_Wm2_Max,
                    AVG(CNR_Wm2_Min) as avg_CNR_Wm2_Min,
                    AVG(CNR_Wm2_Max) as avg_CNR_Wm2_Max,
                    AVG(CNR_Wm2_Avg) as avg_CNR_Wm2_Avg,
                    AVG(Rain_mm_Tot) as avg_Rain_mm_Tot,
                    AVG(e_Avg) as avg_e_Avg,
                    AVG(e_Max) as avg_e_Max,
                    AVG(e_Min) as avg_e_Min,
                    COUNT(*) as jumlah_data
                FROM aws_pangandaran
                WHERE 
                    timestamp >= ${startRange} 
                    AND timestamp <= ${endDate}
                GROUP BY 
                    DATE_FORMAT(DATE_ADD(timestamp, INTERVAL 7 HOUR), '%Y-%m-%d')
                ORDER BY 
                    period ASC
            `;
        } 
        // Query untuk interval PER BULAN
        else if (interval === 'month') {
            result = await prisma.$queryRaw<AvgWeatherData[]>`
                SELECT 
                    DATE_FORMAT(DATE_ADD(timestamp, INTERVAL 7 HOUR), '%Y-%m') as period,
                    AVG(Batt_V_Avg) as avg_Batt,
                    AVG(PTemp_Max) as avg_Ptemp,
                    AVG(WS_S_Avg) as avg_WS_S_Avg,
                    AVG(WS_Max) as avg_WS_Max,
                    AVG(WD_Max_WS) as avg_WD_Max_WS,
                    AVG(Ta_Avg) as avg_Ta_Avg,
                    AVG(Ta_Max) as avg_Ta_Max,
                    AVG(Ta_Min) as avg_Ta_Min,
                    AVG(RH_Avg) as avg_RH_Avg,
                    AVG(RH_Max) as avg_RH_Max,
                    AVG(RH_Min) as avg_RH_Min,
                    AVG(NR_Wm2_Avg) as avg_NR_Wm2_Avg,
                    AVG(NR_Wm2_Max) as avg_NR_Wm2_Max,
                    AVG(CNR_Wm2_Min) as avg_CNR_Wm2_Min,
                    AVG(CNR_Wm2_Max) as avg_CNR_Wm2_Max,
                    AVG(CNR_Wm2_Avg) as avg_CNR_Wm2_Avg,
                    AVG(Rain_mm_Tot) as avg_Rain_mm_Tot,
                    AVG(e_Avg) as avg_e_Avg,
                    AVG(e_Max) as avg_e_Max,
                    AVG(e_Min) as avg_e_Min,
                    COUNT(*) as jumlah_data
                FROM aws_pangandaran
                WHERE 
                    timestamp >= ${startRange} 
                    AND timestamp <= ${endDate}
                GROUP BY 
                    DATE_FORMAT(DATE_ADD(timestamp, INTERVAL 7 HOUR), '%Y-%m')
                ORDER BY 
                    period ASC
            `;
        } 
        // Query untuk interval PER JAM (default)
        else {
          result = await prisma.$queryRaw<AvgWeatherData[]>`
                SELECT 
                    DATE_FORMAT(DATE_ADD(timestamp, INTERVAL 7 HOUR), '%Y-%m-%d %H:00:00') as period,
                    AVG(Batt_V_Avg) as avg_Batt,
                    AVG(PTemp_Max) as avg_Ptemp,
                    AVG(WS_S_Avg) as avg_WS_S_Avg,
                    AVG(WS_Max) as avg_WS_Max,
                    AVG(WD_Max_WS) as avg_WD_Max_WS,
                    AVG(Ta_Avg) as avg_Ta_Avg,
                    AVG(Ta_Max) as avg_Ta_Max,
                    AVG(Ta_Min) as avg_Ta_Min,
                    AVG(RH_Avg) as avg_RH_Avg,
                    AVG(RH_Max) as avg_RH_Max,
                    AVG(RH_Min) as avg_RH_Min,
                    AVG(NR_Wm2_Avg) as avg_NR_Wm2_Avg,
                    AVG(NR_Wm2_Max) as avg_NR_Wm2_Max,
                    AVG(CNR_Wm2_Min) as avg_CNR_Wm2_Min,
                    AVG(CNR_Wm2_Max) as avg_CNR_Wm2_Max,
                    AVG(CNR_Wm2_Avg) as avg_CNR_Wm2_Avg,
                    AVG(Rain_mm_Tot) as avg_Rain_mm_Tot,
                    AVG(e_Avg) as avg_e_Avg,
                    AVG(e_Max) as avg_e_Max,
                    AVG(e_Min) as avg_e_Min,
                    COUNT(*) as jumlah_data
                FROM aws_pangandaran
                WHERE 
                    timestamp >= ${startRange} 
                    AND timestamp <= ${endDate}
                GROUP BY 
                    DATE_FORMAT(DATE_ADD(timestamp, INTERVAL 7 HOUR), '%Y-%m-%d %H:00:00')
                ORDER BY 
                    period ASC
            `;
        }
        
        console.log(`AvgHourPangandaran - ${interval} query returned:`, result.length);
        return result || [];
    } catch (error) {
        console.error("Error in Pangandaran:", error);
        return [];
    }
}
