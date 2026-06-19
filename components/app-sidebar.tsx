"use client"; // Required for usePathname in Next.js App Router
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users } from "lucide-react";
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

interface UserProps {
  role?: "ADMIN" | "USER";
}

export function AppSidebar({ role }: UserProps) {
  const pathname = usePathname();
  const menuItems = [
    { title: "Dashboard", url: "/users/dashboard", icon: LayoutDashboard },
    { title: "Export Data", url: "/ExportData", icon: BiExport },
    { title: "Users", url: "/ProfileUsers", icon: Users },
    { title: "Logout", url: "/api/auth/signout", icon: Users },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex flex-col items-center gap-3 py-4">
              {/* Logo TeknoSEA - di atas */}
              <Link href="/" className="flex items-center justify-center">
                <span className="font-bold text-2xl tracking-tighter text-[#457B9D] font-poppins">
                  Tekno<span className="text-foreground">SEA</span>
                </span>
              </Link>
              <span className={`
                 py-1  rounded-lg text-bold font-bold text-center w-40
                ${role === "ADMIN" 
                  ? "bg-[#E63946] text-white" 
                  : "bg-[#1D3557] text-white"
                }
              `}>
                {role === "ADMIN" ? "Administrator" : "User"}
              </span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-poppins text-1xl font-bold">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {menuItems.map((item) => {
                // Perbaikan: Pastikan perbandingan URL akurat (contoh: /users vs /users/dashboard)
                const isActive = pathname === item.url;
                return (
                  
                  <SidebarMenuItem key={item.title}>
                    <Link
                      href={item.url}
                      className={cn(
                        "flex items-center w-full p-2 rounded-md transition-colors ",
                        "hover:bg-[#457B9D] hover:text-accent-foreground font-poppins",
                        isActive
                          ? "bg-[#457B9D] text-accent-foreground "
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
