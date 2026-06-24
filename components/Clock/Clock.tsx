"use client";

import { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";

export default function ClockCard() {
  // Inisialisasi dengan nilai sementara agar tidak terjadi Hydration Mismatch
  const [date, setDate] = useState("Memuat...");
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      // Format Tanggal: Senin, 11 Juni 2026
      const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      setDate(now.toLocaleDateString("id-ID", dateOptions));

      // Format Waktu: 14:30:45
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setTime(now.toLocaleTimeString("id-ID", timeOptions));
    };

    updateClock(); // Panggil sekali langsung saat komponen di-mount
    const timerId = setInterval(updateClock, 1000); // Update setiap 1 detik

    return () => clearInterval(timerId); // Cleanup interval
  }, []); // <-- Tidak ada pemanggilan setMounted di sini

  return (
    <div 
      suppressHydrationWarning 
      className="flex items-center gap-3 bg-slate-50 dark:bg-[#1D3557]/40 px-4 py-2 rounded-xl border border-border/50 shadow-sm font-poppins min-w-[200px]"
    >
      <CalendarClock className="w-5 h-5 text-[#457B9D] dark:text-[#A8DADC] shrink-0" />
      
      <div className="flex flex-col justify-center w-full">
        <span 
          suppressHydrationWarning 
          className="text-xs font-bold text-[#1D3557] dark:text-white uppercase tracking-wide"
        >
          {date}
        </span>
        <span 
          suppressHydrationWarning 
          className="text-[11px] font-semibold text-[#457B9D] dark:text-slate-300 -mt-0.5"
        >
          {time !== "--:--:--" ? `${time} WIB` : "Menghitung..."}
        </span>
      </div>
    </div>
  );
}