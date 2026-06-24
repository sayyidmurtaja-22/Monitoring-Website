import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  Sidebar,
} from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { Poppins } from "next/font/google";
import Greeting from "@/components/Greeting";
import ClockCard from "@/components/Clock/Clock";
import { userSession } from "@/libs/auth-libs";
import { Suspense } from "react";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // Pilih weight yang dibutuhkan
  variable: "--font-poppins",
});

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const session = await userSession()

    const role = session?.role === "ADMIN" ? "ADMIN" : "USER";

  return (
    <SidebarProvider>
      <AppSidebar role={role || "USER"} user={session} />
      <SidebarInset>
        <nav className="sticky top-0 z-50 shrink-0 items-center gap-2 p-4 flex w-full justify-between bg-background rounded-3xl flex-wrap">
          <div className="text-lg md:text-2xl flex flex-row gap-2 font-black items-center">
            <SidebarTrigger />
            Dashboard
          </div>
          <div className="text-2xl font-black hidden md:block">
            <ClockCard />
          </div>
          <div className="flex items-center justify-center gap-2">
            <ModeToggle />
            <Greeting />
          </div>
        </nav>
        <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
