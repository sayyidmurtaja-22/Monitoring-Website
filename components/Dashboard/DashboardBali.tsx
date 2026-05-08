"use client";

import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { useRef, useState } from "react"; //import dependencies
import RefreshButton from "../Refresh/RefreshBut";
import RefreshJam from "../Refresh/RefreshJam";
import { User } from "@/lib/generated/prisma";
import WeatherDataBali from "../WeatherDataBali";
import LocationList from "../LocationList/LocationList";

interface DashBali {
  user: User;
  getDataBali: any;
  initialData: any;
  //interface a pengambilan data
}
export default function DashboardBali({
  getDataBali,
  user,
  initialData,
}: DashBali) {
  const exportRef = useRef<HTMLDivElement>(null); // useReff yang digunakan untuk mengakses nilai dom secara langsung dan menyimpan nilai yang dapat diubah
  const [exporting, setExporting] = useState(false);

  // console.log("getDataBali in Dashboard", getDataBali)
  const exportData = async () => {
    const element = exportRef.current; // digunakan untuk mengambil nilai dom lalu di ubah tanpa memicu render ulang
    if (!element) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(element, {
        // digunakan untuk mengambil screenshot
        scale: 2, // untuk mengoptimalisasi hasil gambar 2 kali lipat
        useCORS: true, // untuk memberikan izin kepada html2canvas untuk mengambil data agar data tidak hilang atau kosong di layaar
        logging: true, //ini fitur pencatatan di log console
        backgroundColor: "#ffffff", // untuk memberika backegroudn warna putih
      });
      const imgData = canvas.toDataURL("image/png"); // di gunakan untuk mengkonversi konten di html menjadi gambar

      const pdf = new jsPDF({
        //pembuatan dokumen baru pdf yang berasal dari jspdf
        orientation: "potrait",
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
      console.log("error export data", error);
      alert("gagal unduh");
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <div className="w-full flex flex-col gap-2  ">
        <div className="flex items-center gap-4 flex-wrap relative">
          <LocationList user={user} />
          <div className="ml-auto flex gap-4 absolute bottom-0 left-198">
            <button
              onClick={exportData}
              disabled={exporting}
              className="export ml-auto px-4 py-2 bg-blue-700 text-white dark:bg-blue-950"
            >
              {exporting ? "mengunduh..." : "Download PDF"}
            </button>
            <RefreshButton />
            <RefreshJam />
          </div>
        </div>
        <WeatherDataBali getDataBali={getDataBali} exportRef={exportRef} />
      </div>
    </>
  );
}
