import { userSession } from "@/libs/auth-libs";
import { Link } from "lucide-react";
import React from "react";

const Greeting = async () => {
  const session = await userSession();

  return (
    <>
      <header>
        {session ? (
          <p> Haloo, {session?.name || session?.email} </p>
        ) : (
          <Link href="/api/auth/signin" className="bg-blue-700 hover: to-blue-300">Login</Link>
        )}
      </header>

      <div></div>
    </>
  );
};

export default Greeting;
