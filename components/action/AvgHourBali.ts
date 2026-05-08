import prisma from "@/libs/prisma";
import { AvgWeatherData } from "@/types/AvgTypes";



export async function AvgHourBali (timeRange:string|undefined) {
    const GetTry = new Date ('2025-09-11T13:23:16Z')
    let FixedData = new Date(GetTry)
// console.log("range", range)
    if(!timeRange || timeRange === "0") {
        FixedData = new Date(GetTry.getTime() -   60 * 60 *1000) // untuk default nya mengambil atau menampilkan data sejam nya 
        console.log("fixed coba", FixedData);
    }

    else if(timeRange && !isNaN(Number(timeRange))){
        FixedData = new Date(GetTry.getTime()- Number(timeRange))
    }
    
const resultBali = await prisma.$queryRaw<AvgWeatherData[]>`
        SELECT 
        DATE_FORMAT(time,'%Y-%m-%d %H:00:00') as hour_timestampBali,
        AVG(Batt_V_Avg) as avg_Batt,
        AVG(PTemp_Max) as avg_Ptemp,
        AVG(WS_S_Avg) as avg_WS_S_Avg,
        -- AVG(WS_Std) AS avg_WS_Std,
        AVG(WS_Max) as avg_WS_Max,
        AVG(WD_Max_WS) as avg_WD_Max_WS,
        AVG(Ta_Avg) as avg_Ta_Avg,
        AVG(Ta_Max) as avg_Ta_Max,
        AVG(Ta_Min) as avg_Ta_Min,
        AVG(RH_Avg) as avg_RH_Avg,
        AVG(RH_Max) as avg_RH_Max,
        AVG(RH_Min) as avg_RH_Min,
        AVG(NR_Wm2_Avg) as avg_NR_Wm2_Avg,
        AVG(NR_Wm2_Max) as  avg_NR_Wm2_Max,
        AVG(CNR_Wm2_Min) as avg_CNR_Wm2_Min,
        AVG(CNR_Wm2_Max) as avg_CNR_Wm2_Max,
        AVG(CNR_Wm2_Avg) as avg_CNR_Wm2_Avg,
        AVG(Rain_mm_Tot) as avg_Rain_mm_Tot,
        AVG(e_Avg) as avg_e_Avg,
        AVG(e_Max) as avg_e_Max,
        AVG(e_Min) as avg_e_Min,
        COUNT(*) as jumlah_data
        FROM aws_bali
        WHERE 
            time >= ${FixedData} AND time < ${GetTry}
        GROUP BY 
            DATE_FORMAT(time, '%Y-%m-%d %H:00:00')
        ORDER BY
            hour_timestampBali ASC;
        `;        

        // console.log("resultBali", resultBali);
        return resultBali;

    }
