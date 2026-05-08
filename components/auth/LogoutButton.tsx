"use client"; // Pastikan ini ada di paling atas

import React, { useState } from "react";
import { signOut } from "next-auth/react";

const LogoutButton = () => {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/", redirect:true });
  };

  return (
    <button
      onClick={handleSignOut}
      className={`bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-red-700 transition `}
    >
      Sign Out
    </button>
  );
};

export default LogoutButton;
