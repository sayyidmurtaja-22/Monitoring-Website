// components/SimpleDateRangePicker.jsx
"use client";
import { useState } from "react";
import { DateRange } from "react-day-picker";

interface SimpleDateRangePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

export function SimpleDateRangePicker({
  dateRange,
  onDateRangeChange,
}: SimpleDateRangePickerProps) {
  const [fromDate, setFromDate] = useState<string>(
    dateRange?.from ? dateRange.from.toISOString().split("T")[0] : ""
  );
  const [toDate, setToDate] = useState<string>(
    dateRange?.to ? dateRange.to.toISOString().split("T")[0] : ""
  );

  const handleFromChange = (value: string) => {
    setFromDate(value);
    const newFrom = value ? new Date(value) : undefined;
    const newTo = toDate ? new Date(toDate) : undefined;
    
    if (newFrom && newTo && newFrom > newTo) {
      alert("Tanggal 'Dari' tidak boleh lebih besar dari 'Sampai'");
      return;
    }
    
    onDateRangeChange({
      from: newFrom,
      to: newTo,
    });
  };

  const handleToChange = (value: string) => {
    setToDate(value);
    const newFrom = fromDate ? new Date(fromDate) : undefined;
    const newTo = value ? new Date(value) : undefined;
    
    if (newFrom && newTo && newFrom > newTo) {
      alert("Tanggal 'Dari' tidak boleh lebih besar dari 'Sampai'");
      return;
    }
    
    onDateRangeChange({
      from: newFrom,
      to: newTo,
    });
  };

  const handleClear = () => {
    setFromDate("");
    setToDate("");
    onDateRangeChange(undefined);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dari Tanggal
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => handleFromChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sampai Tanggal
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => handleToChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={handleClear}
          className="px-3 py-2 text-red-600 hover:text-red-800"
        >
          Reset
        </button>
      </div>
      
      {/* Quick selection buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            const today = new Date();
            const lastWeek = new Date();
            lastWeek.setDate(today.getDate() - 7);
            setFromDate(lastWeek.toISOString().split("T")[0]);
            setToDate(today.toISOString().split("T")[0]);
            onDateRangeChange({ from: lastWeek, to: today });
          }}
          className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
        >
          7 Hari Terakhir
        </button>
        <button
          onClick={() => {
            const today = new Date();
            const lastMonth = new Date();
            lastMonth.setMonth(today.getMonth() - 1);
            setFromDate(lastMonth.toISOString().split("T")[0]);
            setToDate(today.toISOString().split("T")[0]);
            onDateRangeChange({ from: lastMonth, to: today });
          }}
          className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
        >
          30 Hari Terakhir
        </button>
        <button
          onClick={() => {
            const today = new Date();
            const lastYear = new Date();
            lastYear.setFullYear(today.getFullYear() - 1);
            setFromDate(lastYear.toISOString().split("T")[0]);
            setToDate(today.toISOString().split("T")[0]);
            onDateRangeChange({ from: lastYear, to: today });
          }}
          className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
        >
          1 Tahun Terakhir
        </button>
      </div>
    </div>
  );
}