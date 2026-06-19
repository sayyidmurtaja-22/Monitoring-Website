// components/LocationList/LocationListClient.tsx
"use client";

import Link from "next/link";
import { type User } from "next-auth";
import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
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

const LocationListClient = ({ user, onClose }: LocationListClientProps) => {
  const [status, setStatus] = useState('loading');
  const pathname = usePathname();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch("/api/dashboard");
        const result = await res.json();
        if (result.success) {
          setStatus('online');
        } else {
          setStatus('offline');
        }
      } catch (e) {
        console.log("error", e);
        setStatus('error');
      }
    };
    checkStatus();

    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const locations = Object.values(LOCATIONS)

  const handleLocationClick = () => {
    if (onClose) onClose();
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-rose-50 to-orange-50 dark:from-slate-800 dark:to-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Lokasi AWS
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <XMarkIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
        </button>
      </div>

      {/* List Locations */}
      <div className="p-3">
        <div className="flex flex-col gap-2">
          {locations.map((loc) => {
            // Tentukan apakah item ini sedang dipilih (selected)
            const isSelected = pathname === loc.href;

            return (
              <Link
                key={loc.label}
                href={loc.href}
                onClick={handleLocationClick}
                className={`group flex items-center justify-between p-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md ${
                  isSelected
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 shadow-green-500/30 border border-green-400"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border border-transparent"
                }`}
              >
              <span className="text-white font-medium text-sm">
                {loc.label}
              </span>
              {(loc.active === true && status === "online") ? (
                <div className="flex items-center gap-2">
                  <span className="relative flex size-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex size-2.5 rounded-full bg-green-500" />
                  </span>
                  <span className="text-xs font-bold text-white/90">ONLINE</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="relative flex size-2.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex size-2.5 rounded-full bg-red-500" />
                  </span>
                  <span className="text-xs font-bold text-white/70">OFFLINE</span>
                </div>
              )}
            </Link>
          )})}
        </div>
      </div>
    </div>
  );
};

export default LocationListClient;