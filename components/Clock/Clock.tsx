"use client";

import { useEffect, useState } from "react";

export default function ClockCard() {
  const [date, setDate] = useState("");
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      const option: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      setDate(now.toLocaleDateString('id-ID', option));
    };
    updateClock();

    const timerId = setInterval(updateClock, 1000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <nav>
        <div className="border py-2 px-4 rounded-2xl bg-transparent">
      <div className="font-poppins text-sm">{date}</div>
        </div>
    </nav>
  );
}
