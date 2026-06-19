"use client";

import { useEffect, useState } from "react";

export default function ClockCard() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

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
      setDate(now.toLocaleDateString('id-ID', dateOptions));

      // Format Waktu: 14:30:45
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setTime(now.toLocaleTimeString('id-ID', timeOptions));
    };

    updateClock();
    const timerId = setInterval(updateClock, 1000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <nav>
      <div className="  ">
        <div className="font-poppins text-sm font-bold flex flex-col items-center gap-0.5">
          <span className="font-heading font-poppins text-[#1D3557] dark:text-white">{date}</span>
          <span className="text-xs opacity-70 text-[#38557e] dark:text-white">{time} WIB</span>
        </div>
      </div>
    </nav>
  );
}