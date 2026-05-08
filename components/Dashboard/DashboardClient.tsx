"use client";

import WeatherData from "@/components/WeatherData";
import LocationList from "@/components/LocationList/LocationList";
import { type User } from "next-auth";
import { useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { DatePicker } from "../Calendar/DatePicker";
import { type DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { useSearchParams } from "next/navigation";
import { AvgWeatherData } from "@/types/AvgTypes";
import { IntervalButtons } from "../interval/intervalButton";

// import RefreshButton from "../Refresh/RefreshBut";
// import RefreshJam from "../Refresh/RefreshJam";

interface AuthProps {
  user: User;
  initialData: AvgWeatherData[]; // ✅ Bukan WeatherDataType
  avgData: AvgWeatherData[]; // ✅ Langsung pakai nama type
}

export default function DashboardClient({
  user,
  initialData,
  avgData,
}: AuthProps) {
  //   console.log("🔍 DashboardClient - initialData:", initialData);
  // console.log("🔍 DashboardClient - avgData:", avgData);
  // console.log("🔍 DashboardClient - jumlah initialData:", initialData?.length);
  // console.log("🔍 DashboardClient - jumlah avgData:", avgData?.length);
  const searchParams = useSearchParams();
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");
  const interval =
    (searchParams.get("interval") as "hour" | "day" | "month") || "hour";

  const dateRange: DateRange | undefined = {
    from: fromParam ? new Date(fromParam) : undefined,
    to: toParam ? new Date(toParam) : undefined,
  };

  // console.log("avgDatadidashboard", avgData);

  const exportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const exportData = async () => {
    const element = exportRef.current;
    if (!element) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      pdf.addImage(imgData, "PNG", 0, 10, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`laporan ${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      // console.log("error export data", error);
      alert("gagal unduh");
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <LocationList user={user} />
          {/* <Calendar2 /> */}
          <div className="flex flex-wrap items-center gap-3 ml-auto">
            <button
              onClick={exportData}
              disabled={exporting}
              className="export ml-auto px-4 py-2 bg-blue-700 text-white dark:bg-blue-950 "
            >
              {exporting ? "Mengunduh.." : "Download PDF"}
            </button>
            <DatePicker />
            <IntervalButtons currentInterval={interval} />

            {/* <RefreshButton />
            <RefreshJam /> */}
          </div>
        </div>
        <WeatherData
          exportRef={exportRef}
          initialData={initialData}
          avgData={avgData}
          dateRange={dateRange}
          interval={interval}
        />
      </div>
    </>
  );
}
