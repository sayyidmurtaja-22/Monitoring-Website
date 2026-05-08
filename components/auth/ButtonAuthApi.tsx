// components/auth/ButtonAuthApi.tsx
"use client";

import Link from "next/link";
import { User } from "@/libs/auth-libs";
import { toast } from "sonner";

interface ButtonAuthApiProps {
  user: User | null;
}

export default function ButtonAuthApi({ user }: ButtonAuthApiProps) {
  const actionLabel = user ? "Sign Out" : "Sign In";
  const actionUrl = user ? "/api/auth/signout" : "/api/auth/signin";
  
  const handleAuth = () => {
    if (user) {
      toast.info("Selamat, Semoga hari anda menyenangkan....");
    } else {
      toast.success("Selamat telah login ", {
        duration: 4000,
      });
    }
  };

  return (
    <div className="flex justify-center gap-2 py-1 font-poppins font-semibold">
      {user ? (
        <Link
          href="/users/dashboard"
          className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Dashboard
        </Link>
      ) : null}

      <Link
        href={actionUrl}
        className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        onClick={handleAuth}
      >
        {actionLabel}
      </Link>
    </div>
  );
}
