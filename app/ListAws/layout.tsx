import { ThemeProvider } from "@/components/theme-provider";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { userSession } from "@/libs/auth-libs";
import { Poppins } from "next/font/google";
import ClockCard from "@/components/Clock/Clock";
import Greeting from "@/components/Greeting";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await userSession(); // ✅ di dalam async function

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
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

          <div className="flex flex-col gap-4 p-2">
            {/* Location & Calendar */}

            <main className="flex flex-1 flex-col gap-4">{children}</main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
