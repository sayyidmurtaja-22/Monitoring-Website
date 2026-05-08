"use client"; // Required for usePathname in Next.js App Router
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Command, LayoutDashboard, Users } from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"; // Adjust imports to your project structure
import { cn } from "@/lib/utils"; // Assuming shadcn utils
import { BiExport } from "react-icons/bi";

export function AppSidebar() {
  const pathname = usePathname();
  const menuItems = [
    { title: "Dashboard", url: "/users/dashboard", icon: LayoutDashboard },
    { title: "Export Data", url: "/ExportData", icon: BiExport },
    { title: "Users", url:"/ProfileUsers", icon: Users },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 p-2">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Command className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <Link href="/">
                  <span className="truncate font-semibold font-poppins">
                    TeknoWeath
                  </span>
                </Link>
                <span className="truncate text-xs font-poppins">
                  TeknoSea Weather
                </span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-poppins">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                // Perbaikan: Pastikan perbandingan URL akurat (contoh: /users vs /users/dashboard)
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <Link
                      href={item.url}
                      className={cn(
                        "flex items-center w-full p-2 rounded-md transition-colors",
                        "hover:bg-accent hover:text-accent-foreground font-poppins",
                        isActive
                          ? "bg-accent text-accent-foreground "
                          : "text-muted-foreground",
                      )}
                    >
                      {/* PERBAIKAN: Hapus kata 'fon' yang salah */}
                      <item.icon className="h-4 w-4 mr-3" />
                      {item.title}
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
