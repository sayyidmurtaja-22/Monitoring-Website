"use client";

import * as React from "react";
import { format, subDays, subYears } from "date-fns";
import { Calendar as CalendarIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { id } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SimpleDateRangePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  className?: string;
}

export function SimpleDateRangePicker({
  dateRange,
  onDateRangeChange,
  className,
}: SimpleDateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  // Custom states for the grid views
  const [month, setMonth] = React.useState<Date>(dateRange?.from || new Date());
  const [pickerView, setPickerView] = React.useState<"days" | "months" | "years">("days");
  const [yearPage, setYearPage] = React.useState(Math.floor(month.getFullYear() / 12) * 12);

  // Sync state when popup opens
  React.useEffect(() => {
    if (isOpen) {
      const start = dateRange?.from || new Date();
      setMonth(start);
      setPickerView("days");
      setYearPage(Math.floor(start.getFullYear() / 12) * 12);
    }
  }, [isOpen, dateRange]);

  const handleSelect = (range: DateRange | undefined) => {
    onDateRangeChange(range);
  };

  const setPreset = (days: number) => {
    const today = new Date();
    onDateRangeChange({
      from: subDays(today, days),
      to: today,
    });
    setIsOpen(false);
  };

  const setPresetYears = (years: number) => {
    const today = new Date();
    onDateRangeChange({
      from: subYears(today, years),
      to: today,
    });
    setIsOpen(false);
  };

  const monthsList = Array.from({ length: 12 }, (_, i) => 
    format(new Date(2000, i, 1), "MMM", { locale: id })
  );

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger
          render={
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[280px] md:w-[320px] justify-start text-left font-normal border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-all hover:bg-slate-50 dark:hover:bg-slate-700",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "dd MMM y", { locale: id })} -{" "}
                    {format(dateRange.to, "dd MMM y", { locale: id })}
                  </>
                ) : (
                  format(dateRange.from, "dd MMM y", { locale: id })
                )
              ) : (
                <span>Pilih rentang tanggal</span>
              )}
            </Button>
          }
        />
        <PopoverContent 
          className="w-auto p-0 flex flex-col md:flex-row dark:bg-slate-800 dark:border-slate-700 shadow-xl overflow-hidden rounded-xl" 
          align="start"
        >
          {/* Preset Buttons */}
          <div className="flex flex-col gap-1.5 p-4 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 px-2 uppercase tracking-wider">
              Pilihan Cepat
            </p>
            <Button
              variant="ghost"
              className="justify-start font-medium text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              onClick={() => setPreset(7)}
            >
              7 Hari Terakhir
            </Button>
            <Button
              variant="ghost"
              className="justify-start font-medium text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              onClick={() => setPreset(30)}
            >
              30 Hari Terakhir
            </Button>
            <Button
              variant="ghost"
              className="justify-start font-medium text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              onClick={() => setPresetYears(1)}
            >
              1 Tahun Terakhir
            </Button>
            <div className="flex-1 min-h-[40px]" />
            <Button
              variant="destructive"
              className="justify-center font-semibold text-sm w-full transition-colors"
              onClick={() => {
                onDateRangeChange(undefined);
                setIsOpen(false);
              }}
            >
              Reset Pilihan
            </Button>
          </div>
          
          <div className="p-3 w-[290px] relative">
            {pickerView === "days" && (
              <>
                <div className="absolute top-[14px] left-12 right-12 flex justify-center z-10">
                  <Button 
                    variant="ghost" 
                    onClick={() => setPickerView("months")} 
                    className="h-8 px-2 text-sm font-semibold flex items-center gap-1 hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    {format(month, "MMMM yyyy", { locale: id })}
                    <ChevronDownIcon className="h-4 w-4 opacity-50" />
                  </Button>
                </div>
                <Calendar
                  month={month}
                  onMonthChange={setMonth}
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={handleSelect}
                  numberOfMonths={1}
                  locale={id}
                  className="dark:text-slate-200 pt-0"
                  captionLayout="label"
                  classNames={{
                    caption_label: "invisible",
                  }}
                />
              </>
            )}

            {pickerView === "months" && (
              <div className="flex flex-col gap-4 p-2 mt-1">
                <div className="flex justify-center items-center">
                  <Button 
                    variant="ghost" 
                    onClick={() => setPickerView("years")}
                    className="h-8 px-3 text-sm font-semibold flex items-center gap-1 hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    {format(month, "yyyy")}
                    <ChevronDownIcon className="h-4 w-4 opacity-50" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {monthsList.map((m, i) => (
                    <Button 
                      key={m} 
                      variant={month.getMonth() === i ? "default" : "ghost"} 
                      onClick={() => { 
                        setMonth(new Date(month.getFullYear(), i, 1)); 
                        setPickerView("days"); 
                      }}
                      className={cn("h-10 text-sm", month.getMonth() === i && "bg-[#E63946] hover:bg-[#D90429] text-white")}
                    >
                      {m}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {pickerView === "years" && (
              <div className="flex flex-col gap-4 p-2 mt-1">
                <div className="flex justify-between items-center px-1">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setYearPage(y => y - 12)}>
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-semibold">
                    {yearPage} - {yearPage + 11}
                  </span>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setYearPage(y => y + 12)}>
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {Array.from({ length: 12 }, (_, i) => yearPage + i).map(y => (
                    <Button 
                      key={y} 
                      variant={month.getFullYear() === y ? "default" : "ghost"} 
                      onClick={() => { 
                        setMonth(new Date(y, month.getMonth(), 1)); 
                        setPickerView("months"); 
                      }}
                      className={cn("h-10 text-sm", month.getFullYear() === y && "bg-[#E63946] hover:bg-[#D90429] text-white")}
                    >
                      {y}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}