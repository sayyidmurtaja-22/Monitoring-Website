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

  return (
    <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
      <button
        onClick={() => handleIntervalChange('hour')}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
          currentInterval === 'hour'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-gray-600 hover:bg-gray-200'
        }`}
      >
        Per Jam
      </button>
      <button
        onClick={() => handleIntervalChange('day')}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
          currentInterval === 'day'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-gray-600 hover:bg-gray-200'
        }`}
      >
        Per Hari
      </button>
      <button
        onClick={() => handleIntervalChange('month')}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
          currentInterval === 'month'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-gray-600 hover:bg-gray-200'
        }`}
      >
        Per Bulan
      </button>
    </div>
  );
}