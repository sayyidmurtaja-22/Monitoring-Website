"use client";

import * as React from "react";
import { addDays, format, differenceInDays, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { type DateRange } from "react-day-picker";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { FaCalendarAlt } from "react-icons/fa";


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

  const handleDateChange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      const daysDiff = differenceInDays(range.to, range.from);
      if (daysDiff > MAX_RANGE_DAYS) {
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
      if (daysDiff > MAX_RANGE_DAYS) {
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
      const from = format(selectedRange.from, "dd/MM/yyyy");
      const to = format(selectedRange.to, "dd/MM/yyyy");
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
      flex-direction: row !important;
      gap: 8px !important;
    }
    .rdp-month {
      margin: 0 !important;
    }
    .rdp-caption {
      padding: 0 0 8px 0 !important;
    }
    .rdp-table {
      margin: 0 !important;
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
    .rdp-day_range_middle {
      background-color: transparent !important;
      color: #3b82f6 !important;
      font-weight: 600 !important;
    }
    
    /* Border untuk start date */
    .rdp-day_range_start:not(.rdp-day_range_end) {
      border-top-left-radius: 100% !important;
      border-bottom-left-radius: 100% !important;
      border-left: 2px solid #3b82f6 !important;
      background-color: transparent !important;
    }
    
    /* Border untuk end date */
    .rdp-day_range_end:not(.rdp-day_range_start) {
      border-top-right-radius: 100% !important;
      border-bottom-right-radius: 100% !important;
      border-right: 2px solid #3b82f6 !important;
      background-color: transparent !important;
    }
    
    /* Garis untuk middle dates */
    .rdp-day_range_middle {
      border-radius: 0 !important;
      border-left: 1px solid #93c5fd !important;
      border-right: 1px solid #93c5fd !important;
      background-color: transparent !important;
    }
    
    /* Style untuk tanggal yang dipilih (start/end yang sama) */
    .rdp-day_selected {
      background-color: #3b82f6 !important;
      color: white !important;
      border-radius: 100% !important;
    }
    
    /* Hover effect */
    .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
      background-color: #e0e7ff !important;
      border-radius: 100% !important;
    }
    
    /* Dark mode */
    .dark .rdp-day_range_middle {
      border-left: 1px solid #475569 !important;
      border-right: 1px solid #475569 !important;
      color: #93c5fd !important;
    }
    
    .dark .rdp-day_range_start:not(.rdp-day_range_end),
    .dark .rdp-day_range_end:not(.rdp-day_range_start) {
      color: #93c5fd !important;
    }
    
    .dark .rdp-day {
      color: #cbd5e1;
    }
    
    .dark .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
      background-color: #334155 !important;
    }
  `;

  return (
    <div ref={dropdownRef} className="relative inline-block">
      {/* Tombol dropdown */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-150 text-slate-700 dark:text-slate-200"
      >
        <FaCalendarAlt className="text-white" cursor="pointer" />
        <span className="text-sm">{formatDateDisplay()}</span>
        <span className={`text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* Dropdown kalender */}
      {isOpen && (
        <div className="absolute right-0 mt-2 z-50 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden" style={{ width: 'auto', minWidth: '380px' }}>
          <style>{calendarCSS}</style>

          <div className="p-3">
            <DayPicker
              mode="range"
              defaultMonth={tempRange?.from || new Date()}
              selected={tempRange}
              onSelect={handleDateChange}
              numberOfMonths={2}
              locale={id}
              showOutsideDays={true}
            />

            {error && (
              <div className="mt-2 p-1.5 text-xs text-red-600 bg-red-50 dark:bg-red-950/30 rounded text-center">
                ⚠ {error}
              </div>
            )}

            {/* Info jumlah hari yang dipilih sementara */}
            {tempRange?.from && tempRange?.to && !error && (
              <div className="mt-2 p-1.5 text-xs text-blue-600 bg-blue-50 dark:bg-blue-950/30 rounded text-center">
                {differenceInDays(tempRange.to, tempRange.from)} hari terpilih
              </div>
            )}
          </div>

          {/* Tombol Terapkan dan Batal */}
          <div className="flex items-center justify-end gap-2 px-3 py-2 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
            <button
              onClick={handleCancel}
              className="px-3 py-1 text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleApply}
              className="px-3 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            >
              Terapkan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}