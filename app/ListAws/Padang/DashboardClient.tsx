"use client";

import WeatherData from "@/app/ListAws/Padang/WeatherData";
import LocationList from "@/components/LocationList/LocationList";
import { type User } from "next-auth";
import { useRef, useState, useEffect } from "react";

import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { DatePicker } from "../../../components/Calendar/DatePicker";
import { type DateRange } from "react-day-picker";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";
import LoadingSkeleton from "@/app/skeletondots";
import {
  AvgWeatherData,
  WeatherDataTypes,
} from "@/types/AvgTypes";
import { IntervalButtons } from "../../../components/interval/intervalButton";
import { FaDownload, FaLock } from "react-icons/fa6";
import { GrLocationPin } from "react-icons/gr";
import { ExportPdfDialog, ExportConfigData } from "@/components/ExportPdfDialog";

interface AuthProps {
  user: User;
  locationName: string;
  initialData: AvgWeatherData[];
  avgData: AvgWeatherData[];
  lastData:WeatherDataTypes | null;
  initialFrom: string;
  initialTo: string;
  initialInterval: "hour" | "day" | "month";
}

export default function DashboardClient({
  user,
  locationName,
  initialData,
  avgData,
  lastData,
  initialFrom,
  initialTo,
  initialInterval,
}: AuthProps) {
  console.log("avgData didashboardclient", avgData.length)
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  console.log("panjang data", avgData.length);

  const fromParam = searchParams.get("from") || initialFrom;
  const toParam = searchParams.get("to") || initialTo;
  const interval = (searchParams.get("interval") as "hour" | "day" | "month") || initialInterval || "hour";

  const dateRange: DateRange | undefined = {
    from: fromParam ? new Date(fromParam) : undefined,
    to: toParam ? new Date(toParam) : undefined,
  };

  const exportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const locationRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationRef.current &&
        !locationRef.current.contains(event.target as Node)
      ) {
        setShowLocationDropdown(false);
      }
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setShowDateDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle perubahan tanggal dari DatePicker
  const handleDateChange = (range: { from: string; to: string }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (range.from) {
      params.set("from", range.from);
    } else {
      params.delete("from");
    }

    if (range.to) {
      params.set("to", range.to);
    } else {
      params.delete("to");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
    setShowDateDropdown(false); // Tutup dropdown setelah pilih tanggal
  };

  const handleIntervalChange = (newInterval: "hour" | "day" | "month") => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("interval", newInterval);
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const [showExportModal, setShowExportModal] = useState(false);
  const [exportHeaderData, setExportHeaderData] = useState<{nama: string, nim: string, instansi: string} | null>(null);

  const handleExportSubmit = (data: {nama: string, nim: string, instansi: string}) => {
    setExportHeaderData(data);
    setTimeout(() => {
      executeExport(data);
    }, 500);
  };

  const executeExport = async (data: {nama: string, nim: string, instansi: string}) => {
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
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? "landscape" : "portrait",
        unit: "px",
        format: [imgWidth, imgHeight],
      });

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Laporan_${data.nama}_Padang.pdf`);
    } catch (error) {
      alert("Gagal unduh");
    } finally {
      setExporting(false);
      setExportHeaderData(null);
    }
  };

  const formatDateDisplay = () => {
    if (fromParam && toParam) {
      const from = new Date(fromParam).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const to = new Date(toParam).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      return `${from} — ${to}`;
    }
    return "Pilih Tanggal";
  };

  const getIntervalLabel = (val: string) => {
    switch (val) {
      case "hour":
        return "Per Jam";
      case "day":
        return "Per Hari";
      case "month":
        return "Per Bulan";
      default:
        return val;
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-poppins text-[#1D3557] dark:text-[#457B9D]">
            AWS {locationName} Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {formatDateDisplay()} ·{" "}
            <span className="text-[#E63946] dark:text-[#A8DADC] font-medium">
              {getIntervalLabel(interval)}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3 relative flex-wrap">
          {/* Lokasi */}
          <div ref={locationRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setShowLocationDropdown(!showLocationDropdown);
                setShowDateDropdown(false);
              }}
              className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 text-slate-700 dark:text-slate-200"
            >
              <GrLocationPin className="text-[#E63946] dark:text-[#A8DADC]" cursor="pointer" />
              <span className="hidden sm:inline text-sm">Lokasi</span>
              <span className="text-xs">▼</span>
            </button>

            {showLocationDropdown && (
              <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 z-[60] origin-top-left sm:origin-top-right">
                <LocationList
                  user={user}
                  onClose={() => setShowLocationDropdown(false)}
                />
              </div>
            )}
          </div>

          {/* Tanggal - DatePicker langsung muncul tanpa dropdown tambahan */}
          <div className="relative">
            <DatePicker
              onDateChange={handleDateChange}
              initialFrom={fromParam || undefined}
              initialTo={toParam || undefined}
            />
          </div>

          {/* Interval */}
          <div>
            <IntervalButtons currentInterval={interval} onIntervalChange={handleIntervalChange} />
          </div>

          {/* Download PDF */}
          <button
            onClick={() => setShowExportModal(true)}
            disabled={exporting || user?.role !== "ADMIN"}
            title={user?.role !== "ADMIN" ? "Hanya Admin yang dapat mengunduh PDF" : "Unduh PDF"}
            className="flex items-center gap-2 px-3 py-2 bg-[#E63946] text-white rounded-lg shadow-sm hover:bg-[#D90429] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {user?.role !== "ADMIN" ? <FaLock /> : <FaDownload />}
            <span className="text-sm">
              {exporting ? "Mengunduh..." : "PDF"}
            </span>
          </button>
        </div>
      </div>

      {isPending ? (
        <div className="pt-4">
          <LoadingSkeleton />
        </div>
      ) : (
        <WeatherData
          exportRef={exportRef}
          initialData={initialData}
          avgData={avgData}
          lastData={lastData}
          dateRange={dateRange}
          interval={interval}
          exportHeaderData={exportHeaderData}
        />
      )}

      <ExportPdfDialog 
        open={showExportModal} 
        onOpenChange={setShowExportModal} 
        onExport={handleExportSubmit} 
      />

      {/* Loading Overlay saat Export PDF */}
      {exporting && (
        <div data-html2canvas-ignore="true" className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center transition-all">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-5 border border-slate-200 dark:border-slate-700 max-w-sm w-full mx-4 text-center transform scale-100 animate-in fade-in zoom-in duration-200">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-600 rounded-full"></div>
              <div className="w-12 h-12 border-4 border-[#E63946] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Menyiapkan Laporan</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Mohon tunggu sebentar, PDF sedang diproses...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
