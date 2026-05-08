"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { type User } from "next-auth";
import { useEffect, useState } from "react";
import { getData } from "../action/ExportAction";

const locations = [
  { label: "Pangandaran", href: "/ListAws/Pangandaran", active: true },
  { label: "Padang", href: "/ListAws/Padang", active: true },
  { label: "Bali", href: "/ListAws/Bali", active: true },
];

interface LocationListClientProps {
  user: User;
}
const LocationListClient = ({ user }: LocationListClientProps) => {
  const [status, setStatus] = useState ('loading');

  useEffect(() => {
    const checkStatus = async () => {
    try{
        const res = await fetch("/api/dashboard");
        const result = await res.json();
        setStatus(result.status);
      } catch (e) {
        console.log("error", e)
        setStatus ('error')
      }
    };
    checkStatus();

    const interval = setInterval(checkStatus,5000)
    return () => clearInterval(interval);
  } ,[])

  return (
    <div className="flex flex-col gap-3 py-0 px-2">
      <h3 className="text-lg font-poppins font-semibold">Location AWS :</h3>

      <div className="flex flex-wrap gap-3">
        {locations.map((loc) => (
          <Link
            key={loc.label}
            href={loc.href}
            className=" export bg-blue-600 dark:bg-blue-950 rounded-2xl hover:bg-blue-500 flex items-center justify-center text-white p-3 font-poppins gap-1.5 min-w-25 text-center flex-col"
          >
              {(loc.active === true || status === "online") ?  ( // kalo misalnya database nya udah jalan ini di ubah menjadi && dan di apus tanda kurung nya  () menjadi loc.active && status === "online"
                <div className="flex items-center gap-2">
                <span className="relative flex size-3 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex size-3 rounded-full bg-green-500" />
                </span>
                  <span className="text-sm font-bold text-white">CONNECT</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="relative flex size-3 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex size-3 rounded-full bg-red-500" />
                </span>
                  <span className="text-sm font-bold text-white">DISCONNECT</span>
              </div>
            )}
            {loc.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LocationListClient;
