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
import { AvgWeatherData } from "@/types/AvgTypes";
import WeatherDataBali from "./WeatherDataBali";
import { FaLock, FaDownload } from "react-icons/fa";
import html2canvas from "html2canvas-pro";
import { applyExportMonochrome } from "@/components/ExportAnalysis/monochrome";
import jsPDF from "jspdf";
import { ExportPdfDialog, ExportConfigData } from "@/components/ExportPdfDialog";

import dynamic from "next/dynamic";
import { track } from "@vercel/analytics";

const TourGuide = dynamic(() => import("@/components/TourGuide"), { ssr: false });

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
      const startTime = performance.now();
      router.push(`${pathname}?${params.toString()}`);
      track("Filter Date Range", { region: "Bali", from: range.from, to: range.to });
    });
  };

  const handleIntervalChange = (newInterval: "hour" | "day" | "month") => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("interval", newInterval);
      router.push(`${pathname}?${params.toString()}`);
      track("Change Interval", { region: "Bali", interval: newInterval });
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

  const toGrayscale = (source: HTMLCanvasElement) => {
    const target = document.createElement("canvas");
    target.width = source.width;
    target.height = source.height;
    const ctx = target.getContext("2d");
    if (!ctx) return source;

    const ctxFilterable = ctx as CanvasRenderingContext2D & { filter?: string };
    if (typeof ctxFilterable.filter === "string") {
      ctxFilterable.filter = "grayscale(1)";
      ctx.drawImage(source, 0, 0);
      ctxFilterable.filter = "none";
      return target;
    }

    ctx.drawImage(source, 0, 0);
    const imgData = ctx.getImageData(0, 0, target.width, target.height);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const luminance = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      d[i] = luminance;
      d[i + 1] = luminance;
      d[i + 2] = luminance;
    }
    ctx.putImageData(imgData, 0, 0);
    return target;
  };

  const executeExport = async (data: {nama: string, nim: string, instansi: string}) => {
    const element = exportRef.current;
    if (!element) return;
    setExporting(true);
    await new Promise<void>((resolve) => setTimeout(resolve, 60));
    const startTime = performance.now();
    try {
      let headerHeightPx = 0;
      let exportBoundaries: number[] = [];
      const canvas = await html2canvas(element, {
        scale: 1,
        useCORS: true,
        logging: true,
        backgroundColor: "#ffffff",
        scrollY: -window.scrollY,
        onclone: (clonedDoc) => {
          clonedDoc
            .querySelectorAll("[data-export-header], [data-export-analysis], [data-export-table], [data-export-minmax], [data-export-subtitle]")
            .forEach((el) => el.classList.remove("hidden"));
          clonedDoc
            .querySelectorAll("[data-export-card]")
            .forEach((el) => el.classList.add("hidden"));
          applyExportMonochrome(clonedDoc);

          // Ukur batas-batas blok konten agar potongan halaman TIDAK memotong grafik/tabel/paragraf
          exportBoundaries = [];
          const areaEl = clonedDoc.querySelector("[data-export-area]");
          if (areaEl) {
            const areaTop = areaEl.getBoundingClientRect().top;
            const headerEl = clonedDoc.querySelector("[data-export-header]");
            if (headerEl) {
              const rect = headerEl.getBoundingClientRect();
              headerHeightPx = rect.height;
            }
            const headerBottom = headerEl ? headerEl.getBoundingClientRect().bottom - areaTop : 0;

            const blocks: Element[] = [];
            areaEl.querySelectorAll(":scope > *").forEach((child) => {
              if (child.hasAttribute("hidden") || child.classList.contains("hidden")) return;
              if (child.getAttribute("data-export-header") !== null) return;
              if (child.getAttribute("data-export-card") !== null) return;
              blocks.push(child);
            });

            const atoms: { start: number; end: number }[] = [];
            for (let i = 0; i < blocks.length; i++) {
              const el = blocks[i];
              const top = el.getBoundingClientRect().top - areaTop;
              let bottom = el.getBoundingClientRect().bottom - areaTop;
              // Judul sub-bab disatukan dengan grafik/tabel yang menyertainya
              if (el.matches("[data-export-subtitle]") && i + 1 < blocks.length) {
                const next = blocks[i + 1];
                if (
                  next.matches("[data-chart-section]") ||
                  next.matches("[data-export-table]") ||
                  next.matches("[data-export-subtitle]")
                ) {
                  bottom = next.getBoundingClientRect().bottom - areaTop;
                  i++;
                }
              }
              if (bottom - top < 2) continue;
              atoms.push({ start: Math.round(top - headerBottom), end: Math.ceil(bottom - headerBottom) + 3 });
            }

            atoms.sort((a, b) => a.start - b.start);
            exportBoundaries = atoms.map((a) => a.end).filter((v) => v > 0);
          }
        },
      });

      const A4_WIDTH = 210;
      const A4_HEIGHT = 297;
      const marginLeft = 25;
      const marginRight = 25;
      const marginTop = 15;
      const marginBottom = 25;
      const contentWidth = A4_WIDTH - marginLeft - marginRight;
      const scale = contentWidth / canvas.width;
      const headerHmm = headerHeightPx * (A4_WIDTH / canvas.width);

      const pdf = new jsPDF("p", "mm", [A4_WIDTH, A4_HEIGHT]);

      // Identitas header: selebar penuh halaman A4 (tidak mengikuti margin)
      const headerCanvas = document.createElement("canvas");
      headerCanvas.width = canvas.width;
      headerCanvas.height = Math.max(1, Math.round(headerHeightPx));
      const hctx = headerCanvas.getContext("2d");
      if (hctx) hctx.drawImage(canvas, 0, 0, headerCanvas.width, headerCanvas.height, 0, 0, headerCanvas.width, headerCanvas.height);
      pdf.addImage(toGrayscale(headerCanvas).toDataURL("image/png"), "PNG", 0, 0, A4_WIDTH, headerHmm);

      // Isi (grafik & analisis): mengikuti margin, dipotong otomatis ke beberapa halaman A4
      const bodyCanvas = document.createElement("canvas");
      bodyCanvas.width = canvas.width;
      bodyCanvas.height = Math.max(1, canvas.height - headerCanvas.height);
      const bctx = bodyCanvas.getContext("2d");
      if (bctx) bctx.drawImage(canvas, 0, headerCanvas.height, bodyCanvas.width, bodyCanvas.height, 0, 0, bodyCanvas.width, bodyCanvas.height);

      // Tinggi body (dalam piksel) yang muat per halaman A4
      const availPxPage1 = Math.max(0, Math.floor((A4_HEIGHT - headerHmm - marginTop - marginBottom) / scale));
      const availPxNext = Math.max(0, Math.floor((A4_HEIGHT - marginTop - marginBottom) / scale));

      let bodyOffsetPx = 0;
      let pageNum = 0;
      const bodyEndPx = bodyCanvas.height;
      // Berhenti di batas blok terakhir (sisa di bawahnya hanya whitespace, tidak perlu halaman kosong)
      const sliceEndPx = exportBoundaries.length > 0 ? Math.min(exportBoundaries[exportBoundaries.length - 1], bodyEndPx) : bodyEndPx;

      while (bodyOffsetPx < sliceEndPx) {
        if (pageNum === 0 && availPxPage1 <= 0) {
          pdf.addPage();
          pageNum++;
          continue;
        }
        const capacityPx = pageNum === 0 ? availPxPage1 : availPxNext;
        if (capacityPx <= 0) break;

        // Potong halaman hanya di batas blok konten, bukan di tengah grafik/tabel
        let endPx: number | null = null;
        for (const b of exportBoundaries) {
          if (b <= sliceEndPx && b > bodyOffsetPx && b - bodyOffsetPx <= capacityPx) endPx = b;
        }
        if (endPx === null) {
          // Tidak ada batas blok yang muat → terpaksa potong di kapasitas halaman
          endPx = Math.min(bodyOffsetPx + capacityPx, sliceEndPx);
        }
        if (endPx <= bodyOffsetPx) break;

        const slicePx = Math.max(1, endPx - bodyOffsetPx);
        const sliceMm = slicePx * scale;

        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = bodyCanvas.width;
        sliceCanvas.height = slicePx;
        const sctx = sliceCanvas.getContext("2d");
        if (sctx) sctx.drawImage(bodyCanvas, 0, bodyOffsetPx, bodyCanvas.width, slicePx, 0, 0, bodyCanvas.width, slicePx);

        const bodyTop = pageNum === 0 ? headerHmm + marginTop : marginTop;
        pdf.addImage(toGrayscale(sliceCanvas).toDataURL("image/png"), "PNG", marginLeft, bodyTop, contentWidth, sliceMm);

        bodyOffsetPx = endPx;
        if (bodyOffsetPx < sliceEndPx) pdf.addPage();
        pageNum++;
      }

      pdf.save(`Laporan_${data.nama}_Bali.pdf`);
      
      const duration = performance.now() - startTime;
      console.log(`[Metrics] PDF Export (Bali) took ${duration.toFixed(2)}ms`);
      track("Export PDF", { region: "Bali", durationMs: Math.round(duration) });
    } catch (error) {
      alert("Gagal unduh");
      track("Export PDF Error", { region: "Bali" });
    } finally {
      setExporting(false);
      setExportHeaderData(null);
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
      return `${from} - ${to}`;
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
      <TourGuide page="station" />
      {/* ─── Toolbar: Judul + Kalender + Interval ─── */}
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
          <div ref={locationRef} id="tour-filter-lokasi" className="relative scroll-mt-40">
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
          <div id="tour-filter-tanggal" className="relative scroll-mt-40">
            <DatePicker
              onDateChange={handleDateChange}
              initialFrom={fromParam || undefined}
              initialTo={toParam || undefined}
            />
          </div>

          {/* Interval */}
          <div id="tour-filter-interval" className="scroll-mt-40">
            <IntervalButtons currentInterval={interval} onIntervalChange={handleIntervalChange} />
          </div>

          <button
            id="tour-export-pdf"
            onClick={() => setShowExportModal(true)}
            disabled={exporting || user?.role !== "ADMIN"}
            title={user?.role !== "ADMIN" ? "Hanya Admin yang dapat mengunduh PDF" : "Unduh PDF"}
            className="flex items-center gap-2 px-3 py-2 bg-[#E63946] text-white rounded-lg shadow-sm hover:bg-[#D90429] transition-colors disabled:opacity-60 disabled:cursor-not-allowed scroll-mt-40"
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
        <div id="tour-weather-cards" className="flex flex-col gap-6 scroll-mt-40">
          <WeatherDataBali
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
            exporting={exporting}
          />
        </div>
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

