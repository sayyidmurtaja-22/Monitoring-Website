"use client";

import * as React from "react";
import { addDays, format, differenceInDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Field, FieldLabel } from "@/components/ui/field";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const MAX_RANGE_DAYS = 90; // Maksimal 90 hari

export function DatePicker() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    () => {
      if (fromParam && toParam) {
        return {
          from: fromParam ? new Date(fromParam) : undefined,
          to: toParam ? new Date(toParam) : undefined,
        };
      }

      const today = new Date();
      return {
        from: addDays(today, -7),
        to: today,
      };
    },
  );

  const [error, setError] = React.useState<string | null>(null);

  const handleDateChange = (update: DateRange | undefined) => {
    if (update?.from && update?.to) {
      const daysDiff = differenceInDays(update.to, update.from);
      if (daysDiff > MAX_RANGE_DAYS) {
        setError(`Range maksimal ${MAX_RANGE_DAYS} hari`);
        return;
      }
    }

    setError(null);
    setDateRange(update);

    const params = new URLSearchParams(searchParams.toString());
      
    // const [start, end] =  update;
    if (update?.from) {
      params.set("from", update.from.toISOString().split("T")[0]);
    } else {
      params.delete("from");
    }

    if (update?.to) {
      params.set("to", update.to.toISOString().split("T")[0]);
    } else {
      params.delete("to");
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  //   const [startDate, endDate] = dateRange;

  return (
    <Field className="mx-auto w-60">
      <FieldLabel htmlFor="date-picker-range">Date Picker Range</FieldLabel>
      <Popover>
        <PopoverTrigger>
          <Button
            variant="outline"
            id="date-picker-range"
            className="justify-start px-2.5 font-normal"
          >
            <CalendarIcon />
            {dateRange?.from ? (
              dateRange?.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
