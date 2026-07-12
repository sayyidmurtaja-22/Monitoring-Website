"use client"; // Required for usePathname in Next.js App Router
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LayoutDashboard, Users, LogOut, ChevronDown, ChevronRight, MapPin, BarChart2 } from "lucide-react";
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
import { useState, useEffect } from "react";

interface UserProps {
  role?: "ADMIN" | "USER";
  user?: any;
}

export function AppSidebar({ role, user }: UserProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  // Auto-buka menu yang sedang aktif saat pertama load
  useEffect(() => {
    if (pathname.includes("/ListAws") || pathname.includes("/dashboard")) {
      setOpenMenus(prev => ({ ...prev, "Dashboard": true }));
    }
    if (pathname.includes("/ExportData")) {
      setOpenMenus(prev => ({ ...prev, "Export Data": true }));
    }
  }, [pathname]);

  const toggleMenu = (title: string) => {
    setOpenMenus(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const isUrlActive = (url: string) => {
    if (!url) return false;
    if (url.includes('?')) {
      const [path, query] = url.split('?');
      if (pathname !== path) return false;
      const urlParams = new URLSearchParams(query);
      for (const [key, value] of urlParams.entries()) {
        // Khusus untuk ExportData, default location adalah padang jika kosong
        const currentParam = searchParams.get(key);
        if (key === "location" && !currentParam && value === "padang") return true;
        if (currentParam !== value) return false;
      }
      return true;
    }
    return pathname === url;
  };

  type MenuItem = {
    title: string;
    icon: React.ElementType;
    url?: string;
    subItems?: { title: string; url: string; icon: React.ElementType }[];
  };

  const menuItems: MenuItem[] = [
    { 
      title: "Dashboard", 
      icon: LayoutDashboard,
      subItems: [
        { title: "Overview", url: "/users/dashboard", icon: BarChart2 },
        { title: "Pangandaran", url: "/ListAws/Pangandaran", icon: MapPin },
        { title: "Bali", url: "/ListAws/Bali", icon: MapPin },
        { title: "Padang", url: "/ListAws/Padang", icon: MapPin },
      ]
    },
    { 
      title: "Export Data", 
      icon: BiExport,
      subItems: [
        { title: "Pangandaran", url: "/ExportData?location=pangandaran", icon: MapPin },
        { title: "Bali", url: "/ExportData?location=bali", icon: MapPin },
        { title: "Padang", url: "/ExportData?location=padang", icon: MapPin },
      ]
    },
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
              <span
                className={`
                 py-1  rounded-lg text-bold font-bold text-center w-40
                ${
                  role === "ADMIN"
                    ? "bg-[#E63946] text-white"
                    : "bg-[#1D3557] text-white"
                }
              `}
              >
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
          <SidebarGroupContent id="tour-menu-sidebar">
            <SidebarMenu className="gap-2">
              {menuItems.map((item) => {
                const isActive = item.url ? isUrlActive(item.url) : item.subItems?.some(sub => isUrlActive(sub.url));
                const isOpen = openMenus[item.title];

                return (
                  <SidebarMenuItem key={item.title} className="flex flex-col">
                    {item.subItems ? (
                      <>
                        <div
                          onClick={() => toggleMenu(item.title)}
                          className={cn(
                            "flex items-center justify-between w-full p-2.5 rounded-lg transition-all duration-200 cursor-pointer select-none group",
                            isOpen ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-50 dark:hover:bg-slate-800/50",
                            "font-poppins font-medium"
                          )}
                        >
                          <div className="flex items-center">
                            <div className={cn(
                              "p-1.5 rounded-md mr-3 transition-colors",
                              isOpen || isActive ? "bg-[#457B9D] text-white" : "bg-transparent text-slate-500 group-hover:text-[#457B9D]"
                            )}>
                              <item.icon className="h-4 w-4" />
                            </div>
                            <span className={cn(
                              "text-sm transition-colors",
                              isOpen || isActive ? "text-[#1D3557] dark:text-white font-bold" : "text-slate-600 dark:text-slate-300 group-hover:text-[#1D3557] dark:group-hover:text-white"
                            )}>
                              {item.title}
                            </span>
                          </div>
                          {isOpen ? (
                            <ChevronDown className="h-4 w-4 text-slate-400" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                          )}
                        </div>
                        
                        {/* Dropdown Content */}
                        <div className={cn(
                          "grid transition-all duration-300 ease-in-out",
                          isOpen ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"
                        )}>
                          <div className="overflow-hidden">
                            <div className="ml-[22px] pl-4 border-l-2 border-slate-100 dark:border-slate-800 flex flex-col gap-1 py-1">
                              {item.subItems.map((sub) => {
                                const isSubActive = isUrlActive(sub.url);
                                return (
                                  <Link
                                    key={sub.title}
                                    href={sub.url}
                                    className={cn(
                                      "flex items-center w-full py-2 px-3 rounded-md text-sm transition-all duration-200 group",
                                      "font-poppins relative overflow-hidden",
                                      isSubActive
                                        ? "bg-gradient-to-r from-[#457B9D]/10 to-transparent text-[#1D3557] dark:text-white font-bold shadow-sm"
                                        : "text-slate-500 dark:text-slate-400 hover:text-[#1D3557] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                    )}
                                  >
                                    {isSubActive && (
                                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#457B9D] rounded-r-full" />
                                    )}
                                    <sub.icon className={cn(
                                      "h-3.5 w-3.5 mr-2 transition-colors",
                                      isSubActive ? "text-[#E63946]" : "text-slate-400 group-hover:text-[#457B9D]"
                                    )} />
                                    {sub.title}
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <Link
                        href={item.url || "#"}
                        className={cn(
                          "flex items-center w-full p-2.5 rounded-lg transition-all duration-200 group",
                          "hover:bg-slate-50 dark:hover:bg-slate-800/50 font-poppins font-medium",
                          isActive
                            ? "bg-slate-100 dark:bg-slate-800"
                            : "transparent",
                        )}
                      >
                        <div className={cn(
                          "p-1.5 rounded-md mr-3 transition-colors",
                          isActive ? "bg-[#457B9D] text-white" : "bg-transparent text-slate-500 group-hover:text-[#457B9D]"
                        )}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        <span className={cn(
                          "text-sm transition-colors",
                          isActive ? "text-[#1D3557] dark:text-white font-bold" : "text-slate-600 dark:text-slate-300 group-hover:text-[#1D3557] dark:group-hover:text-white"
                        )}>
                          {item.title}
                        </span>
                      </Link>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 pb-6">
        <div id="tour-user-logout" className="flex flex-col gap-3 bg-[#1D3557]/5 p-4 rounded-xl border border-border/50">
          <div className="flex items-center gap-3">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-[#457B9D] flex items-center justify-center text-white font-bold shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold truncate text-[#1D3557] font-poppins">
                {user?.name || "Guest"}
              </span>
              <span className="text-xs text-muted-foreground truncate font-poppins">
                {user?.email || "No email"}
              </span>
            </div>
          </div>
          <button
            onClick={async () => {
              // 1. Matikan redirect bawaan NextAuth dan tunggu proses penghapusan session selesai
              await signOut({ redirect: false });

              // 2. Paksa browser melakukan hard-reload ke halaman utama
              window.location.href = "/";
            }}
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
