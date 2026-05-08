"use client";

import LogoutButton from "@/components/auth/LogoutButton";
import { User } from "@/libs/auth-libs";
import Image from "next/image";

interface AuthProps {
  user: User | null;
}

export default function ProfileUserClient({ user }: AuthProps) {
  return (
    <div>
      <div className="bg-blue-500 rounded-3xl list-none p-4 flex items-center justify-center flex-col">
        <div>
          <Image
          className="rounded-2xl"
            src={user.image}
            alt="ini gambar user"
            width={100}
            height={100}
          />
        </div>

        <li>Nama: {user.name}</li>
        <li>Email :{user.email}</li>
      </div>
      <div className="flex justify-center items-center p-2 ">
      <LogoutButton />
      </div>
    </div>
  );
}
