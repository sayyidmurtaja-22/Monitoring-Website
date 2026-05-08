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

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // Pilih weight yang dibutuhkan
  variable: "--font-poppins",
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <nav className="sticky top-0 z-50 h-9 shrink-0 items-center gap-2 p-4 flex w-full justify-between bg-background rounded-3xl">
          <div className="text-2xl flex flex-row gap-2 font-black">
            <SidebarTrigger />
            Dashboard
          </div>
            <div className="text-2xl font-black">
            <ClockCard />
            </div>
          <div className=" flex items-center gap-4">
            <ModeToggle />
            <Greeting />
          </div>
        </nav>
        <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
