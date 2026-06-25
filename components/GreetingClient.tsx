"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { UserCircle, Users } from "lucide-react";

interface GreetingClientProps {
  session: any;
  role: "ADMIN" | "USER" | string | undefined;
}

export default function GreetingClient({ session, role }: GreetingClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fungsi untuk menutup menu saat user men-tap area di luar card
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!session) {
    return (
      <Link
        href="/api/auth/signin"
        className="px-4 py-1.5 md:px-5 md:py-2 text-sm font-bold text-white bg-[#457B9D] rounded-lg hover:bg-[#1D3557] transition-colors font-poppins"
      >
        Login
      </Link>
    );
  }

  return (
    <div ref={menuRef} className="relative z-50 font-poppins">
      {/* Tombol Trigger (Bisa di-klik di HP & PC) */}
      <button
        id="tour-user-profile"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 md:gap-3 p-1.5 md:p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
      >
        {/* Avatar User */}
        {session?.image ? (
          <img
            src={session.image}
            alt="Profile"
            className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover border-2 border-[#457B9D]"
          />
        ) : (
          <UserCircle className="w-9 h-9 md:w-10 md:h-10 text-[#457B9D]" />
        )}

        {/* Sapaan Singkat */}
        <p className="text-sm font-bold hidden md:block text-[#1D3557] dark:text-white">
          Halo, {session?.name?.split(" ")[0] || "User"}
        </p>
      </button>

      {/* DROPDOWN MENU CARD */}
      <div
        className={`absolute right-0 top-full mt-2 w-[240px] sm:w-64 p-3 md:p-4 bg-background border border-border shadow-xl rounded-2xl transition-all duration-200 origin-top-right flex flex-col gap-3 md:gap-4 ${
          isOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
        }`}
      >
        {/* Info Profil Utama */}
        <div className="flex items-center gap-3 border-b border-border pb-3">
          {session?.image ? (
            <img src={session.image} alt="Profile" className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover" />
          ) : (
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-[#457B9D] flex items-center justify-center text-white font-bold shrink-0 text-lg md:text-xl">
              {session?.name ? session.name.charAt(0).toUpperCase() : "U"}
            </div>
          )}
          <div className="flex flex-col overflow-hidden text-left">
            <span className="font-bold text-sm text-[#1D3557] dark:text-white truncate">
              {session?.name || "Guest"}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {session?.email || "No email"}
            </span>
          </div>
        </div>

        {/* Menu Khusus Administrator */}
        {role === "ADMIN" && (
          <div className="flex flex-col gap-2 text-left">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Admin Panel
            </span>
            <Link
              href="/ProfileUsers"
              onClick={() => setIsOpen(false)} // Tutup menu saat diklik
              className="flex items-center gap-3 text-sm p-2 rounded-lg bg-[#1D3557]/5 text-[#1D3557] dark:text-white hover:bg-[#457B9D] hover:text-white transition-colors font-semibold active:bg-[#1D3557] active:text-white"
            >
              <Users className="w-4 h-4" />
              Daftar Pengguna Aktif
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}