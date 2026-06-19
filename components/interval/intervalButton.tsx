// components/IntervalButtons.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type IntervalType = 'hour' | 'day' | 'month';

interface IntervalButtonsProps {
  currentInterval: IntervalType;
}

export function IntervalButtons({ currentInterval }: IntervalButtonsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleIntervalChange = (interval: IntervalType) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("interval", interval);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const baseClass = "px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 flex items-center gap-2";
  const activeClass = "bg-[#E63946] text-white shadow-md hover:bg-[#D90429] dark:hover:bg-white dark:text-black";
  const inactiveClass = "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:shadow-md";

  return (
    <div className="flex gap-2 bg-transparent rounded-lg">
      <button
        onClick={() => handleIntervalChange('hour')}
        className={`${baseClass} ${currentInterval === 'hour' ? activeClass : inactiveClass}`}
      >
        Per Jam
      </button>
      <button
        onClick={() => handleIntervalChange('day')}
        className={`${baseClass} ${currentInterval === 'day' ? activeClass : inactiveClass}`}
      >
        Per Hari
      </button>
      <button
        onClick={() => handleIntervalChange('month')}
        className={`${baseClass} ${currentInterval === 'month' ? activeClass : inactiveClass}`}
      >
        Per Bulan
      </button>
    </div>
  );
}