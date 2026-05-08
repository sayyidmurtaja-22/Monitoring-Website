import prisma from "@/libs/prisma";
import { AvgWeatherData } from "@/types/AvgTypes";



const startfilter = new Date(),
const endFilter = new Date (),

const result = await prisma.aws_bungus.findMany({
    where :{
        time:{
            gte:startfilter ,
            lte:endFilter,
        }
    },
    select:{
        id: true,
  avg_Batt: true,
  avg_Ptemp: true,
  avg_WS_S_Avg: true,
  // avg_WS_Std: number | null;
  avg_WS_Max: true,
  avg_WD_Max_WS: true,
  avg_Ta_Avg: true,
  avg_Ta_Max: true,
  avg_Ta_Min: true,
  avg_RH_Avg: true,
  avg_RH_Max: true,
  avg_RH_Min: true,
  avg_NR_Wm2_Avg: true,
  avg_NR_Wm2_Max: true,
  avg_CNR_Wm2_Min: true,
  avg_CNR_Wm2_Max: true,
  avg_CNR_Wm2_Avg: true,
  avg_Rain_mm_Tot: true,
  avg_e_Avg: true,
  avg_e_Max: true,
  avg_e_Min: true,
  jumlah_data: true,
    }
})


