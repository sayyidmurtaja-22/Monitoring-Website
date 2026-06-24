import { userSession } from "@/libs/auth-libs";
import Link from "next/link"; // Perbaikan: Gunakan next/link, bukan dari lucide-react
import React from "react";
import { UserCircle, Users } from "lucide-react";

const Greeting = async () => {
  const session = await userSession();
  
  // Mengambil role dari session, pastikan struktur ini sesuai dengan backend/auth kamu
  const role = session?.role;

  return (
    <header className="relative group z-50 font-poppins">
      {session ? (
        <div className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          
          {/* Avatar User */}
          {session?.image ? (
            <img 
              src={session.image} 
              alt="Profile" 
              className="w-10 h-10 rounded-full object-cover border-2 border-[#457B9D]" 
            />
          ) : (
            <UserCircle className="w-10 h-10 text-[#457B9D]" />
          )}
          
          {/* Sapaan Singkat (Tersembunyi di layar sangat kecil) */}
          <p className="text-sm font-bold hidden md:block text-[#1D3557] dark:text-white">
            Halo, {session?.name?.split(" ")[0] || "User"}
          </p>
          {/* HOVER CARD (Akan muncul saat profile di-hover) */}
          <div className="absolute right-0 top-full mt-2 w-64 p-4 bg-background border border-border shadow-lg rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col gap-4">
            
            {/* Info Profil Utama */}
            <div className="flex items-center gap-3 border-b border-border pb-3">
              {session?.image ? (
                  <img src={session.image} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-[#457B9D] flex items-center justify-center text-white font-bold shrink-0 text-xl">
                    {session?.name ? session.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                <div className="flex flex-col overflow-hidden">
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
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Admin Panel
                </span>
                <Link 
                  href="/ProfileUsers" 
                  className="flex items-center gap-3 text-sm p-2 rounded-lg bg-[#1D3557]/5 text-[#1D3557] dark:text-white hover:bg-[#457B9D] hover:text-white transition-colors font-semibold"
                >
                  <Users className="w-4 h-4" />
                  Daftar Pengguna Aktif
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Link 
          href="/api/auth/signin" 
          className="px-5 py-2 text-sm font-bold text-white bg-[#457B9D] rounded-lg hover:bg-[#1D3557] transition-colors"
        >
          Login
        </Link>
      )}
    </header>
  );
};

export default Greeting;