import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";


export async function GET(){
    try{
        const Data = await prisma.aws_bungus.findMany({ // findmany mengambil sekumpulan data list atau array
            select:{
                id: true,
                time:true,
                Batt_V_Avg:true,
                PTemp_Max:true,
                WS_S_Avg:true,
                WD_Std:true,
                WS_Max:true,
                WD_Max_WS:true,
                Ta_Avg:true,
                Ta_Max:true,
                Ta_Min:true,
                RH_Avg:true,
                RH_Max:true,
                RH_Min:true,
                NR_Wm2_Avg:true,
                NR_Wm2_Max:true,
                NR_Wm2_Min:true,
                CNR_Wm2_Avg:true,
                CNR_Wm2_Max:true,
                CNR_Wm2_Min:true,
                Rain_mm_Tot:true,
                e_Avg:true,
                e_Max:true,
                e_Min:true,
            },
            take:20,
            orderBy:{time: 'desc'},
        });
        return NextResponse.json(
            {
                success: true,
                Data,
            },
            {status: 200});   
    } catch (error) {
        console.log("db error", error)
        return NextResponse.json(
            {
            success: false,
            Data : [],
            message: "failed fetch data"}, {status:500});
    }
}       