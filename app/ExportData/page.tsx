import React from "react";
import { format } from "date-fns";
import { getDataExport } from "@/app/ExportData/GetDataExport";
import ExportClient from "./ExportClient";
import { auth } from "@/lib/auth";
import { LOCATIONS, LocationKey } from "@/config/Location";

interface Props {
  searchParams?: {
    from?: string;
    to?: string;
    interval?: string;
    parameter?: string;
    location?: string;
  };
}

export default async function ExportPage({ searchParams }: Props) {
  const params = await searchParams;

  const activeParameter = params?.parameter?.split(",") || [];

  const session = await auth();
  const userRole = session?.user?.role || "USER";

  // Ambil lokasi dari query string, default "padang"
  const locationKey = (params?.location || "padang") as LocationKey;
  const locationConfig = LOCATIONS[locationKey] || LOCATIONS.padang;

  const today = new Date();
  today.setDate(today.getDate() - 615);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 607);

  const from = params?.from || format(sevenDaysAgo, "yyyy-MM-dd");
  const to = params?.to || format(today, "yyyy-MM-dd");

  const rawData = await getDataExport({
    tableName: locationConfig.table,
    startDate: from,
    endDate: to,
  });

  const safeData = JSON.parse(JSON.stringify(rawData));

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <ExportClient
        data={safeData}
        initialFrom={from}
        initialTo={to}
        activeParameter={activeParameter}
        userRole={userRole}
        currentLocation={locationKey}
      />
    </div>
  );
}