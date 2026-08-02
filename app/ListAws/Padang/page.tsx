import { userSession } from "@/libs/auth-libs";
import { redirect } from "next/navigation";
import DashboardClient from "@/app/ListAws/Padang/DashboardClient";
import { AvgWeatherData, IntervalType, WeatherData, WeatherDataTypes } from "@/types/AvgTypes";
import { differenceInDays } from "date-fns";
import {
  AvgGeneralHour,
  ExportGeneric,
  LastData,
} from "@/components/action/AvgGeneralHour";
import { LOCATIONS } from "@/config/Location";
import { console } from "inspector";
import { log } from "console";

// Format tanggal WIB (UTC+7) untuk UI kalender & batas query
const wibDateStr = (d: Date) => {
  const w = new Date(d.getTime() + 7 * 3600 * 1000);
  return `${w.getUTCFullYear()}-${String(w.getUTCMonth() + 1).padStart(2, "0")}-${String(w.getUTCDate()).padStart(2, "0")}`;
};

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}) {
  const user = await userSession();
  if (!user) redirect("/api/auth/signin");

  const query = await searchParams;
  console.log("tipe query", { query });

  const fromParam = query.from as string | undefined;
  console.log("fromParam tipe", { fromParam });
  const toParam = query.to as string | undefined;
  console.log("toParam", { toParam });
  const intervalParam = query.interval as IntervalType | undefined;

  let from: Date;
  let to: Date;

  // 1. Tentukan rentang waktu dasar
  if (fromParam && toParam) {
    from = new Date(`${fromParam}T00:00:00+07:00`);
    console.log(from, "from"); // 00:00 WIB
    to = new Date(`${toParam}T23:59:59+07:00`);
    console.log("to", to);

    // Gunakan Math.abs untuk mengantisipasi kesalahan hitung selisih hari akibat fraksi jam
    const daysDiff = Math.abs(differenceInDays(to, from));
    if (daysDiff >= 90) {
      console.log(`Range terlalu lama (${daysDiff} hari), dibatasi ke 90 hari`);
      // Membuat objek baru agar tidak merusak format jam asli
      const maxToDate = new Date(from.getTime() + 90 * 24 * 3600 * 1000);
      to = new Date(`${wibDateStr(maxToDate)}T23:59:59+07:00`);
    }
  } else {
    // Tentukan waktu fallback default ke November 2024 (1 November 2024 - 30 November 2024)
    from = new Date("2024-11-01T00:00:00+07:00");
    to = new Date("2024-11-30T23:59:59+07:00");
  }

  // 2. Logika Auto-Switch Interval berdasarkan Rentang Hari Aktif
  let interval = intervalParam || "day";
  const finalDaysDiff = Math.abs(differenceInDays(to, from));

  // Auto-switch hanya jika user TIDAK memilih interval secara manual
  if (!intervalParam) {
    if (finalDaysDiff > 60) {
      interval = "month";
      console.log(`Range ${finalDaysDiff} hari, auto-switch ke interval month`);
    } else if (finalDaysDiff > 7) {
      interval = "day";
      console.log(`Range ${finalDaysDiff} hari, auto-switch ke interval day`);
    }
  }

  let initialData: AvgWeatherData[] = [];
  console.log("initialData", typeof initialData);
  let avgData: AvgWeatherData[] = [];
  let lastData: WeatherDataTypes | null = null;


  
  
  try {
    // 3. Ambil data secara paralel
    
    const [data, avg,last ] = await Promise.all([
      AvgGeneralHour({ from, to, interval, table: LOCATIONS.padang.table }),
      ExportGeneric({ from, to, interval, table: LOCATIONS.padang.table }),
      LastData({table:LOCATIONS.padang.table})
    ]);
    
    
    
    
    //     console.log("hasil AvgGeneralHour:", {
      //       length: Array.isArray(data) ? data.length : 0,
      //       sample: Array.isArray(data) ? data[0] : null
      //     });
      //     console.log("hasil ExportGeneric (avgData):", {
        //       length: Array.isArray(avg) ? avg.length : 0,
        //       sample: Array.isArray(avg) ? avg[0] : null
        //     });
        
        initialData = Array.isArray(data) ? data : [];
        avgData = Array.isArray(avg) ? avg : [];
        lastData = last ?? null
        
        console.log("initialData", initialData)
        
        //     console.log("✅ Final initialData length:", initialData.length);
        //     console.log("✅ Final avgData length:", avgData.length);
      } catch (error) {
        console.error("❌ Error fetching dashboard data:", error);
      }

  // console.log("avg", avgData.length)

  // 4. Konversi kembali objek Date aktif menjadi string YYYY-MM-DD untuk UI Kalender di Client
  const activeFromStr = wibDateStr(from);
  
  // console.log("acativefrom",typeof activeFromStr)
  const activeToStr = wibDateStr(to);





  return (
    <DashboardClient
      user={user}
      locationName={LOCATIONS.padang.label} // ← "Padang" dari config
      initialData={initialData}
      avgData={avgData}
      lastData={lastData}
      initialFrom={activeFromStr} // Kirim ke client agar kalender sinkron
      initialTo={activeToStr} // Kirim ke client agar kalender sinkron
      initialInterval={interval} // Kirim interval aktif yang sudah lolos auto-switch
    />
  );
}
