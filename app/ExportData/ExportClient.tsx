"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AvgWeatherData } from "../../types/AvgTypes";
import { CSVLink } from "react-csv";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { DatePicker } from "@/components/Calendar/DatePicker";
import { useEffect, useRef, useState } from "react";
import CheckboxBtn, { allParameters } from "@/components/CheckBoxParams/CheckboxBtn";
import { FaDownload, FaLock } from "react-icons/fa6";
import { GrLocationPin } from "react-icons/gr";
import { LOCATIONS, LocationKey } from "@/config/Location";
import dynamic from "next/dynamic";

const TourGuide = dynamic(() => import("@/components/TourGuide"), { ssr: false });

interface dataProps {
  data?: AvgWeatherData[];
  initialFrom: string;
  initialTo: string;
  activeParameter: string[];
  userRole?: string;
  currentLocation: LocationKey;
}

// Definisi parameter per kategori (SATU TABLE SATU PARAMETER)
const parameterGroups = [
  {
    name: "Data Suhu",
    params: [
      { key: "avg_Ta_Avg", label: "Suhu Rata-rata", unit: "°C" },
    ]
  },
  {
    name: "Data Kelembapan",
    params: [
      { key: "avg_RH_Avg", label: "Kelembapan Rata-rata", unit: "%" },
    ]
  },
  {
    name: "Data Tekanan Uap Air",
    params: [
      { key: "avg_e_Avg", label: "Tekanan Uap Air Rata-rata", unit: "hPa" },
    ]
  },
  {
    name: "Data Angin",
    params: [
      { key: "avg_WS_S_Avg", label: "Kecepatan Angin Rata-rata", unit: "m/s" },
    ]
  },
  {
    name: "Data Curah Hujan",
    params: [
      { key: "avg_Rain_mm_Tot", label: "Curah Hujan", unit: "mm" },
    ]
  }
];

function formatValue(value: any): string {
  if (value === null || value === undefined) return "-";
  if (typeof value === "number") return value.toFixed(2);
  return String(value);
}

const formatDateTime = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  // Format baku/formal: 01 Oktober 2024
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",  // Menghasilkan tanggal 2 digit (01, 02, dst)
    month: "long",   // Menghasilkan nama bulan utuh (Januari, Februari, dst)
    year: "numeric", // Menghasilkan tahun 4 digit (2024, 2026, dst)
  }).format(date);
};

export default function ExportClient({ data, initialFrom, initialTo, activeParameter, userRole, currentLocation }: dataProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeData = Array.isArray(data) ? data : [];
  
  const [dateRange, setDateRange] = useState({ from: initialFrom, to: initialTo });
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);
  
  // State untuk parameter yang dipilih via checkbox
  const [selectedKeys, setSelectedKeys] = useState<string[]>(() => {
    if (activeParameter.length > 0) return activeParameter;
    return [];
  });

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateChange = (range: { from: string; to: string }) => {
    setDateRange(range);
    const params = new URLSearchParams(searchParams.toString());
    if (range.from) params.set("from", range.from);
    if (range.to) params.set("to", range.to);
    
    router.push(`${pathname}?${params.toString()}`);
  };

  // Navigasi ke lokasi lain, mempertahankan filter tanggal & parameter
  const handleLocationChange = (key: LocationKey) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("location", key);
    router.push(`${pathname}?${params.toString()}`);
    setShowLocationDropdown(false);
  };

  // Filter parameterGroups berdasarkan yang diceklis
  const filteredGroups = parameterGroups
    .map((group) => ({
      ...group,
      params: group.params.filter((p) => selectedKeys.includes(p.key)),
    }))
    .filter((group) => group.params.length > 0);

  // Generate CSV HANYA untuk parameter yang dipilih
  const generateFilteredCSV = () => {
    const csvRows: any[] = [];
    
    activeData.forEach((item) => {
      const row: any = {
        "Waktu Data": formatDateTime(item.period),
      };
      
      filteredGroups.forEach((group) => {
        group.params.forEach((param) => {
          row[`${param.label} (${param.unit})`] = formatValue(item[param.key as keyof AvgWeatherData]);
        });
      });
      
      csvRows.push(row);
    });
    
    return csvRows;
  };

  // Render satu tabel untuk satu group parameter
  const renderParameterTable = (group: typeof parameterGroups[0]) => {
    return (
      <div key={group.name} className="mb-6">
        <div className="bg-[#1d3557] rounded-t-xl px-4 py-2">
          <h3 className="text-white font-semibold">{group.name}</h3>
        </div>
        <div className="border border-[#a8dadc]/30 dark:border-slate-700 rounded-b-xl overflow-x-auto bg-[#f1faee] dark:bg-slate-800">
          <Table>
            <TableHeader className="bg-[#a8dadc]/20 dark:bg-slate-700">
              <TableRow>
                <TableHead className="font-bold text-slate-700 dark:text-slate-200">Waktu Data</TableHead>
                {group.params.map((param) => (
                  <TableHead key={param.key} className="font-bold text-slate-700 dark:text-slate-200">
                    {param.label} <span className="text-xs font-normal">({param.unit})</span>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeData.length > 0 ? (
                activeData.map((row, idx) => (
                  <TableRow key={idx} className="border-b border-slate-200 dark:border-slate-700 hover:bg-[#a8dadc]/10 dark:hover:bg-slate-700/50">
                    <TableCell className="whitespace-nowrap font-medium">
                      {formatDateTime(row.period)}
                    </TableCell>
                    {group.params.map((param) => (
                      <TableCell key={param.key} className="whitespace-nowrap">
                        {formatValue(row[param.key as keyof AvgWeatherData])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={group.params.length + 1} className="text-center py-8 text-slate-500">
                    Tidak ada data untuk periode {dateRange.from} - {dateRange.to}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  const csvData = generateFilteredCSV();
  const currentLocationConfig = LOCATIONS[currentLocation];
  const locations = Object.entries(LOCATIONS) as [LocationKey, typeof LOCATIONS[LocationKey]][];

  return (
    <div className="p-4 bg-[#f1faee] dark:bg-[#091524]">
      <TourGuide page="export" isAdmin={userRole === "ADMIN"} />

      {/* Header dengan nama lokasi */}
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-extrabold font-poppins text-[#1D3557] dark:text-[#457B9D]">
          Export Data — AWS {currentLocationConfig.label}
        </h1>
        <p className="text-sm text-[slate-500] dark:text-slate-400 mt-1">
          Region: {currentLocationConfig.region} · Tabel: <span className="font-mono text-xs text-[#e63946]">{currentLocationConfig.table}</span>
        </p>
      </div>

      {/* Header Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 bg-[#f1faee] dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Pilih Lokasi */}
          <div ref={locationRef} className="relative">
            <button
              type="button"
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 text-slate-700 dark:text-slate-200"
            >
              <GrLocationPin className="text-[#E63946]" />
              <span className="text-sm font-medium">{currentLocationConfig.label}</span>
              <span className="text-xs">▼</span>
            </button>

            {showLocationDropdown && (
              <div className="absolute left-0 mt-2 w-64 z-50 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {/* Header Dropdown */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-rose-50 to-orange-50 dark:from-slate-800 dark:to-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                      Pilih Lokasi AWS
                    </h3>
                  </div>
                </div>

                {/* List Locations */}
                <div className="p-3 flex flex-col gap-2">
                  {locations.map(([key, loc]) => {
                    const isSelected = key === currentLocation;
                    return (
                      <button
                        key={key}
                        onClick={() => handleLocationChange(key)}
                        className={`group flex items-center justify-between p-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md w-full text-left ${
                          isSelected
                            ? "bg-gradient-to-r from-emerald-500 to-green-600 shadow-green-500/30 border border-green-400"
                            : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border border-transparent"
                        }`}
                      >
                        <div>
                          <span className="text-white font-medium text-sm">{loc.label}</span>
                          <span className="block text-white/70 text-xs">{loc.region}</span>
                        </div>
                        {isSelected && (
                          <span className="text-xs font-bold text-white/90">✓ AKTIF</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Tanggal */}
          <div id="tour-export-tanggal" className="flex items-center gap-2 scroll-mt-40">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filter Tanggal:</span>
            <DatePicker 
              onDateChange={handleDateChange}
              initialFrom={dateRange.from}
              initialTo={dateRange.to}
            />
          </div>
          {/* Filter Parameter Popover */}
          <div id="tour-export-parameter" className="scroll-mt-40">
            <CheckboxBtn
              selectedKeys={selectedKeys}
              onChange={setSelectedKeys}
            />
          </div>
        </div>
        
        <div id="tour-export-csv" className="scroll-mt-40">
          {userRole === "ADMIN" ? (
            <CSVLink
              data={csvData}
              filename={`Data_Cuaca_${currentLocationConfig.label}_${dateRange.from}_to_${dateRange.to}.csv`}
              className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors flex items-center gap-2 ${
                selectedKeys.length === 0
                  ? "bg-gray-400 cursor-not-allowed pointer-events-none"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              <FaDownload className="text-white" cursor="pointer"/> Export CSV ({selectedKeys.length} parameter)
            </CSVLink>
          ) : (
            <button
              disabled
              title="Hanya Admin yang dapat mengunduh data"
              className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors flex items-center gap-2 bg-gray-400 cursor-not-allowed"
            >
              <FaLock className="text-white" /> Export CSV ({selectedKeys.length} parameter)
            </button>
          )}
        </div>
      </div>



      {/* Tabel per kategori parameter (hanya yang dipilih) */}
      {filteredGroups.length > 0 ? (
        <div className="space-y-6">
          {filteredGroups.map((group) => renderParameterTable(group))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400 text-lg">📋</p>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Pilih minimal satu parameter untuk menampilkan data
          </p>
        </div>
      )}
    </div>
  );
}