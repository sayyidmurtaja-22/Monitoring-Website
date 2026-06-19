"use client";

import LogoutButton from "@/components/auth/LogoutButton";
import { User } from "@/libs/auth-libs";
import Image from "next/image";
import { UserCircle, Mail, User as UserIcon } from "lucide-react";

interface AuthProps {
  user: User | null;
}

export default function ProfileUserClient({ user }: AuthProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm flex flex-col items-center">
        <div className="mb-6 relative">
          {user?.image ? (
            <Image
              className="rounded-full object-cover border-4 border-blue-100 dark:border-slate-800 shadow-md"
              src={user.image}
              alt="Profil User"
              width={120}
              height={120}
            />
          ) : (
            <div className="w-[120px] h-[120px] rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-4 border-blue-100 dark:border-slate-700 shadow-md">
              <UserCircle className="w-16 h-16 text-slate-400" />
            </div>
          )}
        </div>

        <div className="w-full space-y-4">
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
            <UserIcon className="text-blue-500 w-5 h-5 shrink-0" />
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Nama</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">
                {user?.name || "Pengguna Tanpa Nama"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
            <Mail className="text-blue-500 w-5 h-5 shrink-0" />
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Email</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">
                {user?.email || "Tidak ada email"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 w-full flex justify-center">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
