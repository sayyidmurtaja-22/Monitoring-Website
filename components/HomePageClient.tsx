"use client";

import ButtonAuth from "@/components/auth/ButtonAuthApi";
import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import { User } from "@/libs/auth-libs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import "./style.css";
import * as motion from "motion/react-client";
import ButtonAuthApi from "@/components/auth/ButtonAuthApi";
import { Box } from "lucide-react";
import { SignIn, SignOut } from "@/components/auth-components";
import { auth } from "@/lib/auth";

interface Auth {
  user: User | null;
  session: any | null;
}

const features = [
  {
    id: 1,
    title: "Grafik Real-Time",
    description: "Pantau data cuaca secara langsung",
  },
  {
    id: 2,
    title: "Export Data",
    description: "Unduh data dalam format CSV atau Excel",
  },
  {
    id: 3,
    title: "User Friendly",
    description: "Antarmuka yang mudah digunakan",
  },
];

const circuitTransition = {
  duration: 0.8,
  ease: "circInOut",
};

export default function HomePageClient({ user, session }: Auth) {
  return (
    <>
      <div className="flex flex-col min-h-screen ">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header>
            <div className="flex justify-between px-4 py-2  items-center">
              <ModeToggle />
              <div className="flex items-center justify-center ">
                {user ? (
                  <Card className="absolute top-4 left-1/2 -translate-x-1/2 font-poppins font-light h-20 w-80 bg-green-400 flex items-center justify-center text-black font-black">
                    Welcome, {user.name}
                    <span>{user.email}</span>
                  </Card>
                ) : null}
              </div>
            </div>
          </header>
          <div className="flex flex-col justify-center items-center h-screen gap-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={circuitTransition}
              style={{ fontSize: "24px", fontWeight: "bold" }}
            >
              <h1 className="scroll-m-20 text-center text-8xl tracking-tight text-balance font-poppins font-bold ">
                TeknoWeath
              </h1>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={circuitTransition}
              style={{ fontSize: "24px", fontWeight: "bold" }}
            >
              <p className="text-2xl text-center font-poppins text-muted-foreground">
                TeknoSea Weather Monitoring System
              </p>
            </motion.p>

            {/* prisma auth nextjs */}
            <div className="min-h-screen flex items-center justify-center p-4">
              {""}
              <div className="bg-blue-950 rounded-lg p-6 max-w-xl w-full">
                {""}
                <h1>Auth.js+ Prisma</h1>
                {!session ? (
                  <div className="text-center">
                    <SignIn provider="goggle" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-gray-300 ">Signed in as:</p>
                      <p className="text-white ">{session.user?.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-300">
                        Data fethed from DB with Prisma
                      </p>
                    </div>
                    <div className="bg-neutral-900 rounded p-3">
                      {" "}
                      <pre className="text-xs text-gray-300">
                        {" "}
                        {JSON.stringify(user, null, 2)}
                      </pre>{" "}
                    </div>{" "}
                    <div>
                      <SignOut />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl px-4">
              {features.map((feature) => (
                <motion.div
                  key={feature.id}
                  className="text-xl"
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                >
                  <Card className="text-center bg-blue-900">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {feature.title}
                      </CardTitle>{" "}
                    </CardHeader>
                    <CardContent>
                      {" "}
                      {/* ✅ CardContent di luar CardTitle */}
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <ButtonAuthApi user={user} />
          </div>
        </ThemeProvider>
      </div>
    </>
  );
}
