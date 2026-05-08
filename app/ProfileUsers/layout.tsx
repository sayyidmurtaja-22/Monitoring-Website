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
        <header className=" h-9 shrink-0 items-center gap-2 p-4 flex w-full justify-between border-none  ">
          <div className="text-2xl gap-2 flex items-center font-black">
            <SidebarTrigger />
            Profil Users
          </div>
          <div className="text-2xl font-black">
            <ClockCard />
          </div>
          <div className=" flex items-center gap-4">
            <ModeToggle />
            <Greeting />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
