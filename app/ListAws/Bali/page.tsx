import { userSession } from "@/libs/auth-libs";
import { redirect } from "next/navigation";
import { IntervalType, AvgWeatherData } from "@/types/AvgTypes";
import { differenceInDays, format } from "date-fns";
import BaliDashboardClient from "@/app/ListAws/Bali/BaliDashboardClient";
import { AvgGeneralHour, ExportGeneric } from "@/components/action/AvgGeneralHour";
import { LOCATIONS } from "@/config/Location";

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
    from = new Date(`${fromParam}T17:00:00Z`);
    to = new Date(`${toParam}T16:59:59Z`);

    const daysDiff = Math.abs(differenceInDays(to, from));

    if (daysDiff > 90) {
      const maxToDate = new Date(from);
      maxToDate.setDate(maxToDate.getDate() + 90);
      to = new Date(`${format(maxToDate, "yyyy-MM-dd")}T16:59:59Z`);
    }
  } else {
    // Tentukan waktu fallback default ke November 2024 (1 November 2024 - 30 November 2024)
    from = new Date("2024-11-01T17:00:00Z");
    to = new Date("2024-11-30T16:59:59Z");
  }

  // ── Auto-switch interval berdasarkan rentang hari ──
  let interval = intervalParam || "hour";
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
  const activeFromStr = format(from, "yyyy-MM-dd");
  const activeToStr = format(to, "yyyy-MM-dd");

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
