"use client"; // Required for usePathname in Next.js App Router
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter,
} from "@/components/ui/sidebar"; // Adjust imports to your project structure
import { cn } from "@/lib/utils"; // Assuming shadcn utils
import { BiExport } from "react-icons/bi";
import { signOut } from "next-auth/react";

interface UserProps {
  role?: "ADMIN" | "USER";
  user?: any;
}

export function AppSidebar({ role, user }: UserProps) {
  const pathname = usePathname();
  const menuItems = [
    { title: "Dashboard", url: "/users/dashboard", icon: LayoutDashboard },
    { title: "Export Data", url: "/ExportData", icon: BiExport },
    { title: "Users", url: "/ProfileUsers", icon: Users },
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
                          ? "bg-[#457B9D] text-white "
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
      <SidebarFooter className="p-4 pb-6">
        <div className="flex flex-col gap-3 bg-[#1D3557]/5 p-4 rounded-xl border border-border/50">
          <div className="flex items-center gap-3">
            {user?.image ? (
              <img src={user.image} alt={user.name || "User"} className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-[#457B9D] flex items-center justify-center text-white font-bold shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold truncate text-[#1D3557] font-poppins">{user?.name || "Guest"}</span>
              <span className="text-xs text-muted-foreground truncate font-poppins">{user?.email || "No email"}</span>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/", redirect: true })}
            className="flex items-center justify-center w-full p-2 mt-1 rounded-md transition-colors bg-[#E63946]/10 text-[#E63946] hover:bg-[#E63946] hover:text-white font-poppins text-sm font-bold"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
