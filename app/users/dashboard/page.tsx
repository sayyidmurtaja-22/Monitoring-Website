import { userSession } from "@/libs/auth-libs";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/Dashboard/DashboardClient";
// import { getData } from "@/app/dataSimulate";
import { getData } from "@/components/action/ExportAction";
import { AvgHour } from "@/components/action/AvgHour";
import { AvgWeatherData, IntervalType } from "@/types/AvgTypes";
import { differenceInDays, subDays } from "date-fns";

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

  const fromParam = query.from as string | undefined;
  const toParam = query.to as string | undefined;
  const intervalParam = query.interval as IntervalType | undefined;

  // console.log("🔍 Page - Raw params:", { fromParam, toParam, intervalParam });

  let from: Date;
  let to: Date;

  if (fromParam && toParam) {
    from = new Date(`${fromParam}T17:00:00Z`); // 17:00 UTC = 00:00 WIB
    to = new Date(`${toParam}T16:59:59Z`);

    const daysDiff = differenceInDays(to, from);

    if (daysDiff > 90) {
      console.log(`Range terlalu lama ${daysDiff} hari), di batasi 90 hari`);
      to = new Date(from);
      to.setDate(from.getDate() + 90);
    }
  } else {
    const today = new Date();
    from = subDays(today, 7);
    to = today;
  }

  let interval = intervalParam || "hour";
  const daysDiff = differenceInDays(to, from);

  if (daysDiff > 60 && interval === "hour") {
    interval = "day";
    console.log(`Range ${daysDiff} hari, auto-switch ke interval day`);
  } else if (daysDiff > 365 && interval === "day") {
    interval = "month";
    console.log(`Range ${daysDiff} hari, auto-switch ke interval month`);
  }

  let initialData: AvgWeatherData[] = [];
  let avgData: AvgWeatherData[] = [];

  try {
    const [data, avg] = await Promise.all([
      getData({ from, to }),
      AvgHour({ from, to, interval }),
    ]);

    initialData = Array.isArray(data) ? data : [];
    avgData = Array.isArray(avg) ? avg : [];
  } catch (error) {
    console.log("error", error);
  }

  return (
    <DashboardClient user={user} initialData={initialData} avgData={avgData} />
  );
}

// const timeRange = Array.isArray(query.timeRange)
//   ? query.timeRange[0]
//   : query.timeRange;

// console.log("query", query)
// console.log("HAHAHAHHA", query);
// console.log("AvgHour", AvgHour);

// const showall = hasil === 'semua';
// const showCardData = showall || hasil.includes ("card") || hasil.includes ("data");
// const showBar = showall || hasil.includes ('bar');
// const showLine = showall || hasil.includes ("line");
// const showBatt = showall || hasil.includes ("bat")
