import { userSession } from "@/libs/auth-libs";
import { redirect } from "next/navigation";
import { IntervalType, AvgWeatherData } from "@/types/AvgTypes";
import { differenceInDays } from "date-fns";
import BaliDashboardClient from "@/app/ListAws/Bali/BaliDashboardClient";
import { AvgGeneralHour, ExportGeneric } from "@/components/action/AvgGeneralHour";
import { LOCATIONS } from "@/config/Location";

// Format tanggal WIB (UTC+7) untuk UI kalender & batas query
const wibDateStr = (d: Date) => {
  const w = new Date(d.getTime() + 7 * 3600 * 1000);
  return `${w.getUTCFullYear()}-${String(w.getUTCMonth() + 1).padStart(2, "0")}-${String(w.getUTCDate()).padStart(2, "0")}`;
};

export default async function BaliPage({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}) {
  // ── Autentikasi: redirect ke login jika belum masuk ──
  const user = await userSession();
  if (!user) redirect("/api/auth/signin");

  // ── Baca search params dari URL ──
  const query = await searchParams;

  const fromParam = query.from as string | undefined;
  const toParam = query.to as string | undefined;
  const intervalParam = query.interval as IntervalType | undefined;

  // ── Tentukan rentang waktu ──
  let from: Date;
  let to: Date;

  if (fromParam && toParam) {
    from = new Date(`${fromParam}T00:00:00+07:00`);
    to = new Date(`${toParam}T23:59:59+07:00`);

    const daysDiff = Math.abs(differenceInDays(to, from));

    if (daysDiff >= 90) {
      const maxToDate = new Date(from.getTime() + 90 * 24 * 3600 * 1000);
      to = new Date(`${wibDateStr(maxToDate)}T23:59:59+07:00`);
    }
  } else {
    // Tentukan waktu fallback default ke November 2024 (1 November 2024 - 30 November 2024)
    from = new Date("2024-11-01T00:00:00+07:00");
    to = new Date("2024-11-30T23:59:59+07:00");
  }

  // ── Auto-switch interval berdasarkan rentang hari ──
  let interval = intervalParam || "day";
  const finalDaysDiff = Math.abs(differenceInDays(to, from));

  if (!intervalParam) {
    if (finalDaysDiff > 60) {
      interval = "month";
    } else if (finalDaysDiff > 7) {
      interval = "day";
    }
  }

  // ── Fetch data dari database aws_bali ──
  let avgData: AvgWeatherData[] = [];
  let initialData: AvgWeatherData[] = [];

  try {
    const [data, avg] = await Promise.all([
      AvgGeneralHour({ from, to, interval, table: LOCATIONS.bali.table }),
      ExportGeneric({ from, to, interval, table:LOCATIONS.bali.table }),
    ]);
    initialData = Array.isArray(data) ? data : [];
    avgData = Array.isArray(avg) ? avg : [];
  } catch (error) {
    console.error("Error fetching Bali dashboard data:", error);
  }

  // ── Kirim string tanggal ke client agar kalender sinkron ──
  const activeFromStr = wibDateStr(from);
  const activeToStr = wibDateStr(to);

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto">
        <BaliDashboardClient
          user={user}
          locationName={LOCATIONS.bali.label}
          avgData={avgData}
          initialData={initialData}
          initialFrom={activeFromStr}
          initialTo={activeToStr}
          initialInterval={interval}
        />
      </div>
    </div>
  );
}
