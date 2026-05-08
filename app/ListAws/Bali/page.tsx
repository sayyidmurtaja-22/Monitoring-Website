import { AvgHourBali } from "@/components/action/AvgHourBali";
import { getData } from "@/components/action/ExportAction";
import DashboardBali from "@/components/Dashboard/DashboardBali";
import { userSession } from "@/libs/auth-libs";
import { User } from "lucide-react";
import { redirect } from "next/navigation";

export default async function BaliPage({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}) {
  const query = await searchParams;
  const timeRange = Array.isArray(query.timeRange)
    ? query.timeRange[0]
    : query.timeRange;

  // console.log("range", range)
  const user = await userSession();
  if (!user) redirect("/api/auth/signin");

  const [getDataBali, initialData] = await Promise.all([
    AvgHourBali(timeRange),
    getData(timeRange),
  ]);
  console.log("getDataBali", getDataBali);

  return (
    <DashboardBali
      getDataBali={getDataBali}
      initialData={initialData}
      user={user}
    />
  );
}
