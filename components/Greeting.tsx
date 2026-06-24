import { userSession } from "@/libs/auth-libs";
import React from "react";
import GreetingClient from "./GreetingClient";

const Greeting = async () => {
  // Hanya ambil data di server
  const session = await userSession();
  const role = session?.role;

  // Lempar datanya ke Client Component
  return <GreetingClient session={session} role={role} />;
};

export default Greeting;