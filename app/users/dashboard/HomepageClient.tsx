"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MapPinIcon, SignalIcon } from "@heroicons/react/24/outline";
import { LOCATIONS } from "@/config/Location";
import dynamic from "next/dynamic";

const TourGuide = dynamic(() => import("@/components/TourGuide"), { ssr: false });

// const locations = [
//   { label: "Pangandaran", href: "/ListAws/Pangandaran", region: "Jawa Barat" },
//   { label: "Padang",      href: "/ListAws/Padang",      region: "Sumatera Barat" },
//   { label: "Bali",        href: "/ListAws/Bali",        region: "Bali" },
// ];

interface HomePageProps {
  user: string;
  role?: string;
}

export default function HomePage({ user, role }: HomePageProps) {
  const [status, setStatus] = useState<"loading" | "online" | "offline">("loading");
  const [time, setTime] = useState("");
  
  const firstName = user?.split(" ")[0] ?? "User";

  const locations = Object.values(LOCATIONS)

  // Cek status API
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch("/api/dashboard");
        const result = await res.json();
        setStatus(result.success ? "online" : "offline");
      } catch {
        setStatus("offline");
      }
    };
    checkStatus();
    const iv = setInterval(checkStatus, 5000);
    return () => clearInterval(iv);
  }, []);

  // Jam real-time
  useEffect(() => {
    const fmt = () => {
      const now = new Date();
      setTime(
        now.toLocaleDateString("id-ID", {
          weekday: "long", day: "numeric", month: "long", year: "numeric",
        }) + ` · ${now.toLocaleTimeString("id-ID")}`
      );
    };
    fmt();
    const iv = setInterval(fmt, 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <main className="h-screen bg-background flex flex-col overflow-y-auto">
      <TourGuide isAdmin={role === "ADMIN"} />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="flex flex-col items-center text-center px-6 pt-12 pb-6 relative shrink-0">

        {/* Greeting (H2 for Hierarchy) */}
        <div className="mb-2 px-2">
          <h2 className="text-base sm:text-lg font-medium text-[#1D3557] dark:text-[#F1FAEE] opacity-90 font-poppins tracking-wide leading-snug">
            Welcome back,{" "}
            <span className="font-bold text-[#457B9D] dark:text-[#A8DADC] block sm:inline mt-1 sm:mt-0">
              {user}
            </span>
          </h2>
        </div>

        {/* Logo / Main Title (H1 for SEO) */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-extrabold text-[#1D3557] dark:text-[#F1FAEE] leading-tight font-poppins tracking-tighter mb-6">
          AWS <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#457B9D] to-[#1D3557] dark:from-[#A8DADC] dark:to-[#F1FAEE] drop-shadow-sm">Monitoring Dashboard</span>
        </h1>

        {/* Description */}
        <p className="max-w-md text-[#1D3557] dark:text-[#F1FAEE] opacity-80 text-sm sm:text-base leading-relaxed font-poppins font-medium mb-8">
          Monitor real-time weather conditions from all connected AWS stations. 
          Select a location below to view detailed data.
        </p>

        {/* Status badge */}
        <div id="tour-status-server" className="scroll-mt-64 mt-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1D3557] dark:bg-[#457B9D] shadow-sm text-xs text-[#F1FAEE] ">
          {status === "loading" && (
            <>
              <span className="w-2 h-2 rounded-full bg-[#A8DADC] animate-pulse font-poppins font-medium" />
              Connecting to server…
            </>
          )}
          {status === "online" && (
            <>
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-green-500" />
              </span>
              Server connected — all stations active
            </>
          )}
          {status === "offline" && (
            <>
              <span className="w-2 h-2 rounded-full bg-[#E63946]" />
              Server unreachable
            </>
          )}
        </div>
      </section>

      {/* ── Location Cards ───────────────────────────────────────────── */}
      <section className="flex-1 px-6 pb-6">
        <div className="max-w-3xl mx-auto">

          {/* Label */}
          <div className="flex items-center gap-2 mb-5">
            <MapPinIcon className="w-4 h-4 text-[#1D3557] dark:text-[#A8DADC]" />
            <span className="text-xs font-semibold text-[#1D3557] dark:text-[#A8DADC] uppercase tracking-widest">
              Select Station Location
            </span>
          </div>

          {/* Grid */}
          <div id="tour-lokasi-stasiun" className="scroll-mt-64 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {locations.map((loc) => (
              <Link
                key={loc.label}
                href={loc.href}
                className="group flex flex-col gap-4 p-5 rounded-3xl border border-[#457B9D] bg-[#A8DADC] dark:bg-[#1D3557] transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 hover:border-transparent"
              >
                {/* Icon */}
                <SignalIcon className="w-6 h-6 text-[#1D3557] dark:text-[#A8DADC]" />

                {/* Label + Nama + Region */}
                <div>
                  <p className="text-sm text-[#1D3557] dark:text-[#F1FAEE] opacity-80 mb-1 font-poppins font-bold uppercase tracking-widest text-[11px]">
                    AWS Station
                  </p>
                  <p className="text-2xl font-bold text-[#1D3557] dark:text-[#F1FAEE] group-hover:text-[#457B9D] dark:group-hover:text-[#A8DADC] transition-colors duration-200">
                    {loc.label}
                  </p>
                  <p className="text-sm text-[#1D3557] dark:text-[#F1FAEE] opacity-80 mt-0.5 font-poppins font-bold">
                    {loc.region}
                  </p>
                </div>

                {/* Status */}
                {status === "loading" && (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#A8DADC] animate-pulse" />
                    <span className="text-xs font-bold text-[#1D3557] dark:text-[#A8DADC]">LOADING</span>
                  </div>
                )}
                {status === "online" && (
                  <div className="flex items-center gap-2">
                    <span className="relative flex w-2 h-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                      <span className="relative inline-flex w-2 h-2 rounded-full bg-green-500" />
                    </span>
                    <span className="text-xs font-bold text-green-400">ONLINE</span>
                  </div>
                )}
                {status === "offline" && (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#E63946]" />
                    <span className="text-xs font-bold text-[#E63946]">OFFLINE</span>
                  </div>
                )}
              </Link>
            ))}
          </div>

          {/* Hint */}
          <p className="mt-6 text-center text-xs text-[#1D3557] dark:text-[#A8DADC] opacity-80 font-poppins">
            Click on a station to view complete weather data
          </p>
        </div>
      </section>
    </main>
  );
}