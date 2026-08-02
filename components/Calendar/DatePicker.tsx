"use client";

import * as React from "react";
import { addDays, format, differenceInDays, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { type DateRange } from "react-day-picker";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { FaCalendarAlt } from "react-icons/fa";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const MAX_RANGE_DAYS = 90;

interface Props {
  onDateChange?: (range: { from: string; to: string }) => void;
  initialFrom?: string;
  initialTo?: string;
}

export function DatePicker({ onDateChange, initialFrom, initialTo }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedRange, setSelectedRange] = React.useState<DateRange | undefined>(() => ({
    from: initialFrom ? parseISO(initialFrom) : addDays(new Date(), -7),
    to: initialTo ? parseISO(initialTo) : new Date(),
  }));

  const [tempRange, setTempRange] = React.useState<DateRange | undefined>(selectedRange);
  const [error, setError] = React.useState<string | null>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = React.useState(false);

  // Custom states for the grid views
  const [month, setMonth] = React.useState<Date>(selectedRange?.from || new Date());
  const [pickerView, setPickerView] = React.useState<"days" | "months" | "years">("days");
  const [yearPage, setYearPage] = React.useState(Math.floor(month.getFullYear() / 12) * 12);

  const monthsList = Array.from({ length: 12 }, (_, i) => 
    format(new Date(2000, i, 1), "MMM", { locale: id })
  );

  // Deteksi ukuran layar untuk responsivitas kalender
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile(); // Inisialisasi awal
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Tutup dropdown saat klik di luar
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setTempRange(selectedRange); // Reset ke pilihan terakhir
        setError(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedRange]);

  // Update saat props berubah
  React.useEffect(() => {
    if (initialFrom && initialTo) {
      const newRange = {
        from: parseISO(initialFrom),
        to: parseISO(initialTo),
      };
      setSelectedRange(newRange);
      setTempRange(newRange);
    }
  }, [initialFrom, initialTo]);

  // Sync state when popup opens
  React.useEffect(() => {
    if (isOpen) {
      const start = selectedRange?.from || new Date();
      setMonth(start);
      setPickerView("days");
      setYearPage(Math.floor(start.getFullYear() / 12) * 12);
    }
  }, [isOpen, selectedRange]);

  const handleDateChange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      const daysDiff = differenceInDays(range.to, range.from);
      if (daysDiff + 1 > MAX_RANGE_DAYS) {
        setError(`Maksimal ${MAX_RANGE_DAYS} hari`);
        return;
      }
    }
    setError(null);
    setTempRange(range);
  };

  const handleApply = () => {
    if (tempRange?.from && tempRange?.to) {
      const daysDiff = differenceInDays(tempRange.to, tempRange.from);
      if (daysDiff + 1 > MAX_RANGE_DAYS) {
        setError(`Maksimal ${MAX_RANGE_DAYS} hari`);
        return;
      }

      setSelectedRange(tempRange);
      onDateChange?.({
        from: format(tempRange.from, "yyyy-MM-dd"),
        to: format(tempRange.to, "yyyy-MM-dd"),
      });
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempRange(selectedRange);
    setError(null);
    setIsOpen(false);
  };

  const formatDateDisplay = () => {
    if (selectedRange?.from && selectedRange?.to) {
      const from = format(selectedRange.from, "dd MMM yyyy", { locale: id });
      const to = format(selectedRange.to, "dd MMM yyyy", { locale: id });
      if (from === to) return from;
      return `${from} - ${to}`;
    }
    return "Pilih Tanggal";
  };

  // CSS untuk kalender dengan background transparan
  const calendarCSS = `
    .rdp {
      --rdp-cell-size: 32px !important;
      --rdp-accent-color: #3b82f6;
      margin: 0 !important;
    }
    .rdp-months {
      display: flex !important;
      flex-direction: ${isMobile ? 'column' : 'row'} !important;
      gap: ${isMobile ? '16px' : '8px'} !important;
    }
    .rdp-month {
      margin: 0 !important;
      width: ${isMobile ? '100%' : 'auto'} !important;
    }
    .rdp-caption {
      padding: 0 0 8px 0 !important;
    }
    .rdp-caption_label {
      visibility: hidden !important;
    }
    .rdp-table {
      margin: ${isMobile ? '0 auto' : '0'} !important;
      max-width: ${isMobile ? '280px' : 'none'} !important;
    }
    .rdp-head_cell {
      font-size: 11px !important;
      height: 28px !important;
    }
    .rdp-day {
      font-size: 12px !important;
      width: 32px !important;
      height: 32px !important;
    }
    
    /* Style untuk range yang dipilih - BACKGROUND TRANSPARAN */
    .rdp-day_range_start:not(.rdp-day_range_end),
    .rdp-day_range_end:not(.rdp-day_range_start),
    .rdp-day_range_middle,
    .rdp-range_start:not(.rdp-range_end),
    .rdp-range_end:not(.rdp-range_start),
    .rdp-range_middle {
      background-color: transparent !important;
      color: #3b82f6 !important;
      font-weight: 600 !important;
    }
    
    /* Border untuk start date */
    .rdp-day_range_start:not(.rdp-day_range_end),
    .rdp-range_start:not(.rdp-range_end) {
      border-top-left-radius: 100% !important;
      border-bottom-left-radius: 100% !important;
      border-left: 2px solid #3b82f6 !important;
      background-color: transparent !important;
    }
    
    /* Border untuk end date */
    .rdp-day_range_end:not(.rdp-day_range_start),
    .rdp-range_end:not(.rdp-range_start) {
      border-top-right-radius: 100% !important;
      border-bottom-right-radius: 100% !important;
      border-right: 2px solid #3b82f6 !important;
      background-color: transparent !important;
    }
    
    /* Garis untuk middle dates */
    .rdp-day_range_middle,
    .rdp-range_middle {
      border-radius: 0 !important;
      border-left: 1px solid #93c5fd !important;
      border-right: 1px solid #93c5fd !important;
      background-color: transparent !important;
    }
    
    /* Style untuk tanggal yang dipilih (start/end yang sama) */
    .rdp-day_selected,
    .rdp-selected {
      background-color: #3b82f6 !important;
      color: white !important;
      border-radius: 100% !important;
    }
    
    /* Hover effect */
    .rdp-button:hover:not([disabled]):not(.rdp-day_selected):not(.rdp-selected) {
      background-color: #e0e7ff !important;
      border-radius: 100% !important;
    }
    
    /* Dark mode */
    .dark .rdp-day_range_middle,
    .dark .rdp-range_middle {
      border-left: 1px solid #475569 !important;
      border-right: 1px solid #475569 !important;
      color: #93c5fd !important;
    }
    
    .dark .rdp-day_range_start:not(.rdp-day_range_end),
    .dark .rdp-day_range_end:not(.rdp-day_range_start),
    .dark .rdp-range_start:not(.rdp-range_end),
    .dark .rdp-range_end:not(.rdp-range_start) {
      color: #93c5fd !important;
    }
    
    .dark .rdp-day {
      color: #cbd5e1;
    }
    
    .dark .rdp-button:hover:not([disabled]):not(.rdp-day_selected):not(.rdp-selected) {
      background-color: #334155 !important;
    }
    
    /* Scrollbar untuk sidebar preset */
    .custom-scrollbar::-webkit-scrollbar {
      height: 4px;
      width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }
    .dark .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #475569;
    }
  `;

  return (
    <div ref={dropdownRef} className="relative inline-block">
      {/* Tombol dropdown */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between sm:justify-start gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 text-slate-700 dark:text-slate-200"
      >
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-[#E63946] dark:text-[#A8DADC]" cursor="pointer" />
          <span className="text-sm font-medium">{formatDateDisplay()}</span>
        </div>
        <span className={`text-xs text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* Dropdown kalender */}
      {isOpen && (
        <>
          {/* Backdrop untuk mobile */}
          {isMobile && (
            <div 
              className="fixed inset-0 bg-black/40 z-[50]"
              onClick={() => setIsOpen(false)}
            />
          )}
          
          <div 
            className={`${
              isMobile 
                ? 'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-[340px]' 
                : 'absolute left-0 mt-2 w-auto origin-top-left'
            } z-[60] bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden`} 
          >
            <style>{calendarCSS}</style>

            <div className="flex flex-col sm:flex-row">
              {/* Sidebar Presets */}
              <div className="flex flex-row sm:flex-col gap-1 p-3 border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 overflow-x-auto sm:w-[140px] shrink-0 custom-scrollbar">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 hidden sm:block px-2">Shortcut</span>
                {[
                  { label: "Hari Ini", days: 0 },
                  { label: "7 Hari Terakhir", days: 6 },
                  { label: "30 Hari Terakhir", days: 29 },
                  { label: "Bulan Ini", type: "thisMonth" },
                  { label: "Tahun Ini", type: "thisYear" },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      const end = new Date();
                      let start = new Date();
                      if (preset.type === "thisMonth") {
                        start = new Date(end.getFullYear(), end.getMonth(), 1);
                      } else if (preset.type === "thisYear") {
                        start = new Date(end.getFullYear(), 0, 1);
                      } else {
                        start = addDays(end, -(preset.days || 0));
                      }
                      const range = { from: start, to: end };
                      setTempRange(range);
                      setSelectedRange(range);
                      onDateChange?.({
                        from: format(start, "yyyy-MM-dd"),
                        to: format(end, "yyyy-MM-dd"),
                      });
                      setIsOpen(false);
                    }}
                    className="whitespace-nowrap px-3 py-1.5 text-xs text-left font-medium text-slate-600 dark:text-slate-300 hover:bg-[#E63946]/10 hover:text-[#E63946] dark:hover:bg-[#A8DADC]/10 dark:hover:text-[#A8DADC] rounded-md transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Kalender Utama */}
              <div>
                <div className="p-3 relative w-full sm:min-w-[320px]">
                  {pickerView === "days" && (
                    <>
                      <div className="absolute top-[18px] left-10 right-10 flex justify-center items-center gap-1 z-10">
                        <button 
                          type="button"
                          onClick={() => setPickerView("months")} 
                          className="h-7 px-2 text-sm font-semibold flex items-center gap-1 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                        >
                          {format(month, "MMMM", { locale: id })}
                          <ChevronDownIcon className="h-4 w-4 opacity-70" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => setPickerView("years")} 
                          className="h-7 px-2 text-sm font-semibold flex items-center gap-1 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                        >
                          {format(month, "yyyy")}
                          <ChevronDownIcon className="h-4 w-4 opacity-70" />
                        </button>
                      </div>
                      <div className="flex justify-center">
                        <DayPicker
                          month={month}
                          onMonthChange={setMonth}
                          mode="range"
                          resetOnSelect
                          defaultMonth={tempRange?.from || new Date()}
                          selected={tempRange}
                          onSelect={handleDateChange}
                          numberOfMonths={1}
                          locale={id}
                          showOutsideDays={true}
                        />
                      </div>
                    </>
                  )}

                  {pickerView === "months" && (
                    <div className="flex flex-col gap-4 p-2 mt-1 min-h-[260px]">
                      <div className="flex justify-center items-center">
                        <button 
                          type="button"
                          onClick={() => setPickerView("days")}
                          className="h-8 px-3 text-sm font-semibold flex items-center gap-1 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                        >
                          {format(month, "yyyy")}
                          <ChevronDownIcon className="h-4 w-4 opacity-70 rotate-180" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {monthsList.map((m, i) => (
                          <button
                            type="button"
                            key={m} 
                            onClick={() => { 
                              setMonth(new Date(month.getFullYear(), i, 1)); 
                              setPickerView("days"); 
                            }}
                            className={`h-10 text-sm rounded-md font-medium transition-colors ${
                              month.getMonth() === i 
                                ? "bg-[#3b82f6] text-white" 
                                : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {pickerView === "years" && (
                    <div className="flex flex-col gap-4 p-2 mt-1 min-h-[260px]">
                      <div className="flex justify-between items-center px-1">
                        <button type="button" className="h-8 w-8 flex items-center justify-center border border-slate-200 dark:border-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors" onClick={() => setYearPage(y => y - 12)}>
                          <ChevronLeftIcon className="h-4 w-4" />
                        </button>
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {yearPage} - {yearPage + 11}
                        </span>
                        <button type="button" className="h-8 w-8 flex items-center justify-center border border-slate-200 dark:border-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors" onClick={() => setYearPage(y => y + 12)}>
                          <ChevronRightIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {Array.from({ length: 12 }, (_, i) => yearPage + i).map(y => (
                          <button
                            type="button"
                            key={y} 
                            onClick={() => { 
                              setMonth(new Date(y, month.getMonth(), 1)); 
                              setPickerView("days"); 
                            }}
                            className={`h-10 text-sm rounded-md font-medium transition-colors ${
                              month.getFullYear() === y 
                                ? "bg-[#3b82f6] text-white" 
                                : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                            }`}
                          >
                            {y}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="mt-2 p-1.5 text-xs text-red-600 bg-red-50 dark:bg-red-950/30 rounded text-center">
                      ⚠ {error}
                    </div>
                  )}

                  {/* Info jumlah hari yang dipilih sementara */}
                  {tempRange?.from && !error && pickerView === "days" && (
                    <div className="mt-3 p-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-700/50 rounded-md text-center border border-slate-100 dark:border-slate-600">
                      {tempRange.to ? (
                        <>
                          <span className="text-blue-600 dark:text-blue-400 font-bold">{differenceInDays(tempRange.to, tempRange.from) + 1}</span> hari terpilih
                        </>
                      ) : (
                        <span>Pilih tanggal akhir untuk menyelesaikan rentang</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Tombol Terapkan dan Batal */}
                <div className="flex items-center justify-end gap-2 px-3 py-2.5 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleApply}
                    className="px-4 py-1.5 text-xs font-medium text-white bg-[#E63946] border border-[#E63946] rounded-md hover:bg-[#D90429] shadow-sm transition-colors"
                  >
                    Terapkan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}