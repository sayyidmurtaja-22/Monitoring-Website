"use client";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Thermometer,
  Droplets,
  Gauge,
  Wind,
  CloudRain,
  SlidersHorizontal,
  X,
  ListFilter,
} from "lucide-react";

type ParameterOption = {
  key: string;
  label: string;
  unit: string;
  group: string;
};

// Semua parameter yang tersedia, dikelompokkan per kategori
const allParameters: ParameterOption[] = [
  // Data Suhu
  { key: "avg_Ta_Avg", label: "Suhu Rata-rata", unit: "°C", group: "Data Suhu" },
  // Data Kelembapan
  { key: "avg_RH_Avg", label: "Kelembapan Rata-rata", unit: "%", group: "Data Kelembapan" },
  // Data Tekanan Uap Air
  { key: "avg_e_Avg", label: "Tekanan Uap Air Rata-rata", unit: "hPa", group: "Data Tekanan Uap Air" },
  // Data Angin
  { key: "avg_WS_S_Avg", label: "Kecepatan Angin Rata-rata", unit: "m/s", group: "Data Angin" },
  // Data Curah Hujan
  { key: "avg_Rain_mm_Tot", label: "Curah Hujan", unit: "mm", group: "Data Curah Hujan" },
];

// Export agar bisa dipakai di komponen lain
export { allParameters };
export type { ParameterOption };

// Icon mapping per group
const groupIcons: Record<string, React.ReactNode> = {
  "Data Suhu": <Thermometer className="size-4" />,
  "Data Kelembapan": <Droplets className="size-4" />,
  "Data Tekanan Uap Air": <Gauge className="size-4" />,
  "Data Angin": <Wind className="size-4" />,
  "Data Curah Hujan": <CloudRain className="size-4" />,
};

// Color mapping per group
const groupColors: Record<string, string> = {
  "Data Suhu": "text-red-500",
  "Data Kelembapan": "text-blue-500",
  "Data Tekanan Uap Air": "text-purple-500",
  "Data Angin": "text-teal-500",
  "Data Curah Hujan": "text-sky-500",
};

interface CheckboxBtnProps {
  selectedKeys: string[];
  onChange: (selectedKeys: string[]) => void;
}

export default function CheckboxBtn({ selectedKeys, onChange }: CheckboxBtnProps) {
  const [open, setOpen] = useState(false);
  // Local draft state so changes only apply on "Apply"
  const [draftKeys, setDraftKeys] = useState<string[]>(selectedKeys);

  // Sync draft when popover opens
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setDraftKeys(selectedKeys);
    }
    setOpen(isOpen);
  };

  // Kelompokkan parameter berdasarkan group
  const groups = allParameters.reduce<Record<string, ParameterOption[]>>((acc, param) => {
    if (!acc[param.group]) acc[param.group] = [];
    acc[param.group].push(param);
    return acc;
  }, {});

  const handleToggle = (key: string, checked: boolean) => {
    if (checked) {
      setDraftKeys([...draftKeys, key]);
    } else {
      setDraftKeys(draftKeys.filter((k) => k !== key));
    }
  };

  const handleClearAll = () => {
    setDraftKeys([]);
  };

  const handleApply = () => {
    onChange(draftKeys);
    setOpen(false);
  };

  const groupEntries = Object.entries(groups);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm cursor-pointer"
      >
        <SlidersHorizontal className="size-4" />
        Filter
        {selectedKeys.length > 0 && (
          <span className="ml-1 inline-flex items-center justify-center size-5 rounded-full bg-blue-600 text-[10px] font-bold text-white">
            {selectedKeys.length}
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={8}
        className="!w-[480px] !p-0 !rounded-2xl !gap-0 border border-slate-200 dark:border-slate-700 shadow-xl bg-white dark:bg-slate-800 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Filter Parameter
          </h3>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="max-h-[420px] overflow-y-auto px-5 py-3 space-y-1">
          {groupEntries.map(([groupName, params], idx) => (
            <div key={groupName}>
              {/* Group label */}
              <div className="flex items-center gap-2 py-3">
                <span className={groupColors[groupName] || "text-slate-500"}>
                  {groupIcons[groupName]}
                </span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {groupName}
                </span>
              </div>

              {/* Checkboxes grid */}
              <div className="grid grid-cols-3 gap-x-3 gap-y-2.5 pb-4">
                {params.map((item) => {
                  const isChecked = draftKeys.includes(item.key);
                  return (
                    <label
                      key={item.key}
                      htmlFor={`param-${item.key}`}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-colors ${
                        isChecked
                          ? "bg-blue-50 dark:bg-blue-500/10"
                          : "hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      }`}
                    >
                      <Checkbox
                        id={`param-${item.key}`}
                        checked={isChecked}
                        onCheckedChange={(checked) => handleToggle(item.key, !!checked)}
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300 select-none leading-tight">
                        {item.label}
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 ml-1">
                          ({item.unit})
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* Separator between groups */}
              {idx < groupEntries.length - 1 && (
                <div className="border-b border-slate-100 dark:border-slate-700" />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80">
          <button
            type="button"
            onClick={handleClearAll}
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-sm"
          >
            <ListFilter className="size-4" />
            Apply Filters ({draftKeys.length})
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
