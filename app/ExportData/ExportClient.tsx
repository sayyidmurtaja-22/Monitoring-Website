"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { WeatherData } from "../types/weather";
import RefreshButton from "@/components/Refresh/RefreshBut";
import jsPDF from "jspdf";
import { useState, useRef } from "react";
import html2canvas from "html2canvas-pro";
import { AvgWeatherData } from "../../types/AvgTypes";
import { CSVLink } from "react-csv";
import { useSearchParams } from "next/navigation";

interface dataProps {
  data?: AvgWeatherData[];
  avgData: AvgWeatherData[];
}

const formatHeader = (key: string) => {// mengformat header dan menghaous spasi dari tiap kanan kiri 
  return key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

function formatValue(value: any): string {
  if (value === null || value === undefined) return "-";
  if (typeof value === "number") {
    return value.toFixed(2);
  }
  return String(value);
}

const columnWidth = "w-[150px]";

const columnsData = [
  { key: "hour_timestampBali", label: "Waktu Data" },
  { key: "avg_Ta_Max", label: "Suhu tertinggi" },
  { key: "avg_Ta_Min", label: "Suhu Terendah" },
  { key: "avg_Ta_Avg", label: "Suhu Rata-rata" },
  //   { key: "avg_RH_Min", label: "Kelembapan Terendah" },
  // { key: "avg_RH_Max", label: "Kelembapan Tertinggi" },
];
const columnsData2 = [
  { key: "hour_timestampBali", label: "Waktu Data" },
  { key: "avg_RH_Max", label: "Kelembapan Tertinggi" },
  { key: "avg_RH_Avg", label: "Kelembapan Rata-rata" },
  { key: "avg_RH_Min", label: "Kelembapan Terendah" },
];

const columnsData3 = [
  { key: "hour_timestampBali", label: "Waktu Data" },
  { key: "avg_e_Max", label: "Tekanan Uap Air Max" },
  { key: "avg_e_Avg", label: "Tekanan Uap Air Avg" },
  { key: "avg_e_Min", label: "Tekanan Uap Air Min" },
];

const formatDateTime = (dateString: string) => {
  if (!dateString) return "-";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    // hour12: false, // Gunakan format 24 jam
  }).format(date);
};

export default function ExportClient({ data, avgData }: dataProps) {
  const refTekananUap = useRef<HTMLDivElement>(null!);
  const refSuhu = useRef<HTMLDivElement>(null!);
  const refKelembapan = useRef<HTMLDivElement>(null!);

  const [exporting, setExporting] = useState(false);

  const searchParams = useSearchParams();

  if (!data || data.length === 0) {
    return (
      <div>
        <h2>data tidak di temukan</h2>
      </div>
    );
  }
  const formattedCSv = data.map((item) => {
    return { avg_Data: item.avg_Ta_Avg?.toFixed(2).toString() };
  });
  console.log("formattedcsv", formattedCSv);

  // const columms = Object.keys(data[0]);

  const exportData = async (
    exportRef: React.RefObject<HTMLDivElement>,
    fileName: string,
  ) => {
    const element = exportRef.current;
    if (!element) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#FFFFFF",
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

      const ratio = Math.min(
        (pdfWidth - 20) / imgWidth,
        (pdfHeight - 20) / imgHeight,
      );

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`laporan ${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.log("error export data", error);
      alert("gagal unduh");
    } finally {
      setExporting(false);
    }
  };

  console.log("data", data);

  // const formatted = data.map((item => ))

  // const latest = data && data.length > 0 ? data[0] : null;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 p-4">
        <div>Daftar Data Cuaca</div>

        <div className="bg bg-blue-500 rounded-3xl p-2 flex items-center  justify-between font-black"></div>
        <div className="bg-blue-500 rounded-3xl p-2 flex shadow-md items-center justify-between font-black  z-50 ">
          <h3>Data Suhu</h3>
          <div className="flex gap-2 ">
            {/* <button
              onClick={() => exportData(refSuhu, "Laporan suhu")}
              disabled={exporting}
              className="bg-green-800 px-3 py-1 rounded-lg text-xs"
            >
              {exporting ? "mengunduh..." : "PDF Suhu"}
            </button> */}

            <CSVLink
              data={formattedCSv}
              asyncOnClick={true}
              onClick={(event, done) => {
                console.log("you klik link");
              }}
            >
              <h1 className="bg-green-800 px-3 py-1 rounded-lg text-xs">
                download
              </h1>
            </CSVLink>

            <RefreshButton />
          </div>
        </div>

        <div ref={refSuhu} className="rounded-md border bg-blue-400 text-black">
          <Table>
            <TableCaption></TableCaption>
            <TableHeader className="bg-blue-500 rounded-3xl border dark:bg-blue-500 ">
              <TableRow className="">
                {columnsData.map((item) => (
                  <TableHead key={item.key} className={columnWidth}>
                    {formatHeader(item.label)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {/* 3. Pastikan urutan sel sama dengan header */}
                  {columnsData.map((col) => (
                    <TableCell key={col.key}>
                      {col.key === "hour_timestamp"
                        ? formatDateTime(row[col.key])
                        : formatValue(row[col.key])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="bg-blue-500 rounded-3xl p-2 flex shadow-md items-center justify-between font-black  z-50 ">
          <div>
            <h3>Data Kelembapan</h3>
          </div>
          <div className="flex gap-2">
            {/* <button
              onClick={() => exportData(refKelembapan, "Laporan_Kelembapan")}
              className="bg-green-800 px-3 py-1 rounded-lg text-xs"
            >
              {exporting ? "..." : "PDF Kelembapan"}
            </button> */}
            {/* <RefreshButton /> */}
          </div>
        </div>
        <div
          ref={refKelembapan}
          className="rounded-md border bg-blue-400 text-black"
        >
          <Table>
            {/* <TableCaption>Table Data AWS Bungus</TableCaption> */}
            <TableHeader className="bg-blue-500 dark:bg-blue-500">
              <TableRow>
                {columnsData2.map((item) => (
                  <TableHead key={item.key} className={columnWidth}>
                    {formatHeader(item.label)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columnsData2.map((col) => (
                    <TableCell key={col.key}>
                      {col.key === "hour_timestamp"
                        ? formatDateTime(row[col.key])
                        : formatValue(row[col.key])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="bg-blue-500 rounded-3xl p-2 flex shadow-md items-center justify-between font-black  z-50 ">
          <h3>Data Tekanan Uap Air</h3>
          <div className="flex gap-2">
            {/* <button
              onClick={() => exportData(refTekananUap, "Laporan_Kelembapan")}
              className="bg-green-800 px-3 py-1 rounded-lg text-xs"
            >
              {exporting ? "..." : "PDF Tekanan Uap Air"}
            </button> */}
            {/* <RefreshButton /> */}
          </div>
        </div>
        <div
          ref={refTekananUap}
          className="rounded-md border bg-blue-400 text-black "
        >
          <Table>
            {/* <TableCaption>Table Data AWS Bungus</TableCaption> */}
            <TableHeader className="bg-blue-500 dark:bg-blue-500">
              <TableRow>
                {columnsData3.map((item) => (
                  <TableHead key={item.key} className={columnWidth}>
                    {formatHeader(item.label)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columnsData3.map((col) => (
                    <TableCell key={col.key}>
                      {col.key === "hour_timestamp"
                        ? formatDateTime(row[col.key])
                        : formatValue(row[col.key])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}

// Helper function to handle parsing, formatting, and limiting string length
// function formatValue(value: any): string {
//   if (value === null || value === undefined) return "N/A";

//   // Convert to number, then string, then take first 4 characters
//   return parseFloat(String(value)).toString().substring(0, 4);
// }
