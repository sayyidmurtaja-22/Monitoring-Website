// components/LocationList/LocationListClient.tsx
"use client";

import Link from "next/link";
import { type User } from "next-auth";
import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { GrLocationPin } from "react-icons/gr";
import { LOCATIONS } from "@/config/Location";

import { usePathname } from "next/navigation";

// const locations = [
//   { label: "Pangandaran", href: "/ListAws/Pangandaran", active: true },
//   { label: "Padang", href: "/ListAws/Padang", active: true },
//   { label: "Bali", href: "/ListAws/Bali", active: true },
// ];

interface LocationListClientProps {
  user: User;
  onClose?: () => void;
}

interface StationStatus {
  key: string;
  label: string;
  region: string;
  href: string;
  latestTime: string | null;
  ageMinutes: number | null;
  isOnline: boolean;
}

// Penyegaran status: 1 jam sekali
const STATUS_REFRESH_MS = 3600000;

function formatLastTime(t: string | null): string {
  if (!t) return "—";
  const d = new Date(t);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const LocationListClient = ({ user, onClose }: LocationListClientProps) => {
  const [status, setStatus] = useState<'loading' | 'online' | 'offline'>('loading');
  const [stations, setStations] = useState<StationStatus[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch("/api/dashboard");
        const result = await res.json();
        if (result.success) {
          setStatus('online');
          setStations(result.stations ?? []);
        } else {
          setStatus('offline');
          setStations([]);
        }
      } catch (e) {
        console.log("error", e);
        setStatus('offline');
        setStations([]);
      }
    };
    checkStatus();

    const interval = setInterval(checkStatus, STATUS_REFRESH_MS);
    return () => clearInterval(interval);
  }, []);

  const locations = Object.values(LOCATIONS)

  const handleLocationClick = () => {
    if (onClose) onClose();
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
            Pilih Lokasi
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md hover:bg-white dark:hover:bg-slate-700 transition-colors text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 shadow-sm border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* List Locations */}
      <div className="p-3">
        <div className="flex flex-col gap-2">
          {locations.map((loc) => {
            const isSelected = pathname === loc.href;
            const st = stations.find((s) => s.key === loc.table);
            const isOnline = st?.isOnline ?? false;
            const lastStr = formatLastTime(st?.latestTime ?? null);

            return (
              <Link
                key={loc.label}
                href={loc.href}
                onClick={handleLocationClick}
                className={`group flex items-center justify-between p-3.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md ${
                  isSelected
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 shadow-green-500/30 border border-green-400 text-white"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border border-blue-500 text-white"
                }`}
              >
                <div>
                  <span className="font-semibold text-sm block">
                    {loc.label}
                  </span>
                  <span className="text-white/70 text-xs font-medium">
                    {loc.region || "Stasiun AWS"}
                  </span>
                </div>

                {/* Status Indicator */}
                {(loc.active === true && status === "online" && isOnline) ? (
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide shadow-sm ${
                    isSelected 
                      ? "bg-white text-green-700" 
                      : "bg-white/20 text-white border border-white/30"
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-green-500" : "bg-green-400"} animate-pulse`} />
                    ONLINE
                  </div>
                ) : (
                  <div className="flex flex-col items-end gap-0.5">
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide shadow-sm ${
                      isSelected 
                        ? "bg-white/20 text-white border border-white/30" 
                        : "bg-white/20 text-white border border-white/30"
                    }`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      OFFLINE
                    </div>
                    {status === "online" && (
                      <span className="text-[9px] text-white/60 font-medium">
                        Terakhir {lastStr}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LocationListClient;