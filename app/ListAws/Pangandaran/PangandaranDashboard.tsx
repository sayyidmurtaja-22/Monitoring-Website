"use client";

import { type User } from "next-auth";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";
import LoadingSkeleton from "@/app/skeletondots";
import { useRef, useState, useEffect } from "react";
import { GrLocationPin } from "react-icons/gr";
import { DatePicker } from "@/components/Calendar/DatePicker";
import { IntervalButtons } from "@/components/interval/intervalButton";
import LocationList from "@/components/LocationList/LocationList";
import CardData from "@/components/CardDataCuaca/CardData";
import { AvgWeatherData } from "@/types/AvgTypes";
import { BaliTemperatureChart } from "@/components/Chart/BaliTemperatureChart";
import { FaLock, FaDownload } from "react-icons/fa";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import WeatherDataPangandaran from "./WeatherDataPangandaran";
import { ExportPdfDialog, ExportConfigData } from "@/components/ExportPdfDialog";



interface BaliDashboardClientProps {
  user: User;
  locationName: string;
  avgData: AvgWeatherData[];
  initialData?: AvgWeatherData[];
  initialFrom: string;
  initialTo: string;
  initialInterval: "hour" | "day" | "month";
}

export default function BaliDashboardClient({
  user,
  locationName,
  avgData,
  initialData = [],
  initialFrom,
  initialTo,
  initialInterval,
}: BaliDashboardClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationRef.current &&
        !locationRef.current.contains(event.target as Node)
      ) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Ambil parameter dari URL, atau gunakan nilai awal dari server
  const fromParam = searchParams.get("from") || initialFrom;
  const toParam = searchParams.get("to") || initialTo;
  const interval =
    (searchParams.get("interval") as "hour" | "day" | "month") ||
    initialInterval ||
    "hour";

  // Callback saat user memilih rentang tanggal baru di DatePicker
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
    // Tunggu DOM merender header sebelum mengambil screenshot
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
      
      // Auto-fit: buat PDF dengan dimensi yang sama persis dengan canvas (dalam satuan pixel)
      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? "landscape" : "portrait",
        unit: "px",
        format: [imgWidth, imgHeight],
      });

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Laporan_${data.nama}_Pangandaran.pdf`);
    } catch (error) {
      alert("Gagal unduh");
    } finally {
      setExporting(false);
      setExportHeaderData(null); // Sembunyikan header setelah export
    }
  };

  // Helper: format tanggal untuk ditampilkan di header
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
    return "7 hari terakhir";
  };

  // Helper: label interval dalam bahasa Indonesia
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
      {/* ─── Toolbar: Judul + Kalender + Interval ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-poppins text-slate-800 dark:text-white">
            AWS {locationName}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {formatDateDisplay()} ·{" "}
            <span className="text-blue-500 font-medium">
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
              }}
              className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 text-slate-700 dark:text-slate-200"
            >
              <GrLocationPin className="text-[#E63946] dark:text-[#A8DADC]" cursor="pointer" />
              <span className="hidden sm:inline text-sm">Lokasi</span>
              <span className="text-xs">▼</span>
            </button>

            {showLocationDropdown && (
              <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 z-[60] origin-top-left sm:origin-top-right">
                <LocationList user={user} onClose={() => setShowLocationDropdown(false)} />
              </div>
            )}
          </div>

          {/* Kalender DatePicker */}
          <div className="relative">
            <DatePicker
              onDateChange={handleDateChange}
              initialFrom={fromParam || undefined}
              initialTo={toParam || undefined}
            />
          </div>

          {/* Interval */}
          <div className="w-full sm:w-auto mt-2 sm:mt-0 order-last sm:order-none">
            <IntervalButtons currentInterval={interval} onIntervalChange={handleIntervalChange} />
          </div>

          <button
            onClick={() => setShowExportModal(true)}
            disabled={exporting || user?.role !== "ADMIN"}
            title={user?.role !== "ADMIN" ? "Hanya Admin yang dapat mengunduh PDF" : "Unduh PDF"}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {user?.role !== "ADMIN" ? <FaLock /> : <FaDownload />}
            <span className="text-sm">
              {exporting ? "Mengunduh..." : "PDF"}
            </span>
          </button>

          {/* Tombol Refresh */}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 text-slate-700 dark:text-slate-200"
          >
            <span>↻</span>
            <span className="hidden sm:inline text-sm">Refresh</span>
          </button>
        </div>
      </div>

      {/* ─── Konten: Card + Chart Suhu ─── */}
      {isPending ? (
        <div className="pt-4">
          <LoadingSkeleton />
        </div>
      ) : avgData.length === 0 ? (
        <div className="p-10 bg-white dark:bg-slate-800/50 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
          <div className="text-slate-400 mb-2">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <p className="text-slate-500 dark:text-slate-400">
            Tidak ada data untuk rentang waktu ini.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <WeatherDataPangandaran
            exportRef={exportRef}
            initialData={initialData}
            avgData={avgData}
            dateRange={{
              from: fromParam ? new Date(fromParam) : undefined,
              to: toParam ? new Date(toParam) : undefined,
            }}
            lastData={null}
            interval={interval}
            exportHeaderData={exportHeaderData}
          />
        </div>
      )}

      <ExportPdfDialog 
        open={showExportModal} 
        onOpenChange={setShowExportModal} 
        onExport={handleExportSubmit} 
      />
    </div>
  );
}
