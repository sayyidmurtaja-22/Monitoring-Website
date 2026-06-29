"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { useTheme } from "next-themes";
import { type User } from "next-auth";
import * as motion from "motion/react-client";
import Link from "next/link";
import Image from "next/image";
import AuthModal from "@/components/auth/AuthModal";
import { useState, useEffect } from "react";
import { Menu, X, FileText, Table, Download, Activity, BarChart2, ChevronDown, Smartphone, Monitor } from "lucide-react";
import { MeshGradient } from "@paper-design/shaders-react";
import "./style.css";
import Footer from "@/app/footer/page";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface Auth {
  user: User | null;
  session: any | null;
}

const circuitTransition = {
  duration: 0.8,
  ease: "circInOut" as const,
};

// ✨ ANIMASI KILAP UNTUK TOMBOL
const shimmerAnimation = {
  hidden: { opacity: 0, x: -100 },
  visible: {
    opacity: [0, 1, 0],
    x: [100, 0, 100],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatDelay: 3,
      ease: "easeInOut" as const,
    },
  },
};

// 🖼️ ANIMASI MOCKUP BERGERAK KOMPLIT
const mockupAnimation = {
  y: [0, -12, 0, 12, 0],
  rotate: [0, 2, 0, -2, 0],
  scale: [1, 1.02, 1, 0.98, 1],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

// 🌑 ANIMASI BAYANGAN MOCKUP
const shadowAnimation = {
  scale: [1, 0.85, 1, 1.15, 1],
  opacity: [0.4, 0.2, 0.4, 0.25, 0.4],
  borderRadius: ["50%", "45%", "50%", "55%", "50%"],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

// 📍 ANIMASI GLOW DI BELAKANG MOCKUP
const glowAnimation = {
  scale: [1, 1.05, 1, 0.95, 1],
  opacity: [0.3, 0.5, 0.3, 0.5, 0.3],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

// ➡️ ANIMASI PANAH
const arrowAnimation = {
  x: [0, 6, 0],
  transition: {
    duration: 1,
    repeat: Infinity,
    repeatDelay: 1.5,
    ease: "easeInOut" as const,
  },
};

// 🔄 ANIMASI SCAN EFFECT PADA MOCKUP
const scanAnimation = {
  y: ["-100%", "100%"],
  opacity: [0, 0.5, 0],
  transition: {
    duration: 3.5,
    repeat: Infinity,
    repeatDelay: 2,
    ease: "easeInOut" as const,
  },
};

export default function HomePageClient({ user, session }: Auth) {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activePlatform, setActivePlatform] = useState<'desktop' | 'mobile'>('desktop');
  const { theme, resolvedTheme } = useTheme();

  useGSAP(() => {
    // GSAP Scroll Animations
    gsap.utils.toArray<HTMLElement>(".gsap-fade-up").forEach((element) => {
      gsap.from(element, {
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    });
    
    gsap.utils.toArray<HTMLElement>(".gsap-stagger-up").forEach((section) => {
      const items = section.querySelectorAll(".gsap-item");
      gsap.from(items, {
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
      });
    });
  }, { scope: undefined });

  useEffect(() => {
    setMounted(true);
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // 🎨 Warna MeshGradient: Berdasarkan palette (F1FAEE, A8DADC, 457B9D, 1D3557)
  const lightColors = [
    "#F1FAEE",  // Light
    "#A8DADC",  // Light Blue
    "#457B9D",  // Medium Blue
    "#F1FAEE",
    "#A8DADC",
    "#457B9D",
  ];

  const darkColors = [
    "#1D3557",  // Dark Blue
    "#457B9D",  // Medium Blue
    "#1D3557",
    "#1D3557",
    "#457B9D",
    "#1D3557",
  ];
  
  const currentColors = mounted && resolvedTheme === "dark" ? darkColors : lightColors;

  return (
    <div className="relative min-h-screen flex flex-col font-poppins">
      
      {/* ========== MESH GRADIENT BACKGROUND ========== */}
      <div className="fixed inset-0 w-full h-full -z-10">
        {mounted && (
          <>
            <MeshGradient
              width={dimensions.width}
              height={dimensions.height}
              colors={currentColors}  // ← warna dinamis berdasarkan mode
              distortion={0.6}              // ← dikurangi agar lebih halus
              swirl={0.4}                   // ← dikurangi agar tidak terlalu ramai
              grainMixer={0}
              grainOverlay={0}
              speed={0.35}                  // ← lebih lambat & kalem
              offsetX={0.05}                // ← gerakan lebih subtle
            />
            {/* Veil overlay tipis untuk meningkatkan keterbacaan teks */}
            <div className="absolute inset-0 pointer-events-none bg-[#F1FAEE]/40 dark:bg-[#1D3557]/50 transition-colors duration-500" />
          </>
        )}
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full p-4 flex justify-between items-center max-w-[1200px] mx-auto bg-[#F1FAEE]/70 dark:bg-[#1D3557]/70 backdrop-blur-md transition-all duration-300 border-b border-[#1D3557]/5 dark:border-[#F1FAEE]/10 rounded-b-2xl shadow-sm dark:shadow-none">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl md:text-2xl tracking-tighter text-[#1D3557] dark:text-[#F1FAEE]">
            Tekno<span className="text-[#457B9D] dark:text-[#A8DADC]">SEA</span>
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center gap-8 font-bold text-sm tracking-widest uppercase font-poppins text-[#1D3557] dark:text-[#F1FAEE]">
          <a href="#home" className="hover:text-[#457B9D] dark:hover:text-[#A8DADC] transition-colors">Home</a>
          <a href="#features" className="hover:text-[#457B9D] dark:hover:text-[#A8DADC] transition-colors">Features</a>
          <a href="#get-started" className="hover:text-[#457B9D] dark:hover:text-[#A8DADC] transition-colors">Get Started</a>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="hidden sm:flex items-center text-sm px-4 py-1.5 bg-black/5 dark:bg-white/10 backdrop-blur-md rounded-full border border-black/10 dark:border-white/20">
              <span className="text-slate-700 dark:text-slate-200">
                Welcome,{" "}
                <span className="font-semibold text-[#457B9D] dark:text-[#A8DADC]">
                  {user.name}
                </span>
              </span>
            </div>
          ) : null}
          <ModeToggle />
          
          {/* Tombol Hamburger Mobile */}
          <button 
            className="md:hidden p-2 text-[#1D3557] dark:text-white focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`fixed top-20 left-4 right-4 z-40 bg-[#F1FAEE]/95 dark:bg-[#1D3557]/95 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-[#457B9D]/20 flex flex-col items-center gap-6 md:hidden transition-all duration-300 ease-out origin-top ${
          isMobileMenuOpen 
            ? "opacity-100 pointer-events-auto scale-100 translate-y-0" 
            : "opacity-0 pointer-events-none scale-95 -translate-y-4"
        }`}
      >
        <a href="#home" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold tracking-widest uppercase font-poppins text-[#1D3557] dark:text-[#F1FAEE] hover:text-[#457B9D] dark:hover:text-[#A8DADC] transition-colors">Home</a>
        <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold tracking-widest uppercase font-poppins text-[#1D3557] dark:text-[#F1FAEE] hover:text-[#457B9D] dark:hover:text-[#A8DADC] transition-colors">Features</a>
        <a href="#get-started" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold tracking-widest uppercase font-poppins text-[#1D3557] dark:text-[#F1FAEE] hover:text-[#457B9D] dark:hover:text-[#A8DADC] transition-colors">Get Started</a>
        
        <div className="mt-2 w-full flex flex-col gap-3">
          {user ? (
            <Link href="/users/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-3 bg-[#1D3557] dark:bg-[#A8DADC] text-white dark:text-[#1D3557] rounded-xl font-bold uppercase tracking-wider text-sm shadow-md active:scale-95 transition-transform">
              Open Dashboard
            </Link>
          ) : (
            <AuthModal defaultTab="login">
              <button onClick={() => setIsMobileMenuOpen(false)} className="w-full py-3 bg-[#1D3557] dark:bg-[#A8DADC] text-white dark:text-[#1D3557] rounded-xl font-bold uppercase tracking-wider text-sm shadow-md active:scale-95 transition-transform">
                Login / Register
              </button>
            </AuthModal>
          )}
        </div>
      </div>

      {/* Konten Utama */}
      <main id="home" className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center justify-center pt-28 pb-24 px-6 lg:px-12 max-w-7xl mx-auto w-full gap-8 lg:gap-x-12 lg:gap-y-2 min-h-[90vh]">
        
        {/* ========== BAGIAN 1: SLOGAN (Atas di Mobile, Kiri Atas di Desktop) ========== */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left z-20 w-full max-w-xl mx-auto lg:mx-0 order-1 lg:col-start-1 lg:row-start-1 lg:self-end lg:pb-4">
          
          {/* Overline / Kategori */}
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
             className="mb-6 flex items-center gap-3"
          >
             <div className="w-[2px] h-4 bg-[#1D3557] dark:bg-[#A8DADC]/50 hidden lg:block"></div>
             <span className="text-[#1D3557] dark:text-[#F1FAEE]/80 text-sm md:text-base font-medium tracking-wide uppercase">
                Universitas Jenderal Soedirman
             </span>
          </motion.div>

          {/* ========== JUDUL (Slogan) ========== */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-[3.5rem] font-semibold tracking-wide mb-8 leading-[1.2] text-[#1D3557] dark:text-[#F1FAEE] uppercase font-pliant flex flex-wrap items-center justify-center lg:justify-start gap-y-1 lg:gap-y-2 gap-x-4"
          >
             <span className="w-full">DYNAMIC DATA</span>
             <span className="w-full">EXPLORATION</span>
             <span className="w-full">& MONITORING</span>
             <span>DASHBOARDS.</span>

             {/* ========== TOMBOL BULAT (Elegan) ========== */}
             {user ? (
               <Link href="/users/dashboard" className="group inline-flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full border border-[#1D3557] dark:border-[#F1FAEE]/50 align-middle hover:bg-[#1D3557] dark:hover:bg-[#F1FAEE] transition-all ml-2">
                  <span className="transform -rotate-45 text-2xl font-light text-[#1D3557] dark:text-[#F1FAEE] group-hover:text-[#F1FAEE] dark:group-hover:text-[#1D3557] transition-colors">→</span>
               </Link>
             ) : (
               <AuthModal defaultTab="login">
                  <button className="group inline-flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full border border-[#1D3557] dark:border-[#F1FAEE]/50 align-middle hover:bg-[#1D3557] dark:hover:bg-[#F1FAEE] transition-all cursor-pointer ml-2">
                     <span className="transform -rotate-45 text-2xl font-light text-[#1D3557] dark:text-[#F1FAEE] group-hover:text-[#F1FAEE] dark:group-hover:text-[#1D3557] transition-colors">→</span>
                  </button>
               </AuthModal>
             )}
          </motion.h1>
        </div>

        {/* ========== BAGIAN 3: ACTIONS & STATS (Bawah di Mobile, Kiri Bawah di Desktop) ========== */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left z-20 w-full max-w-xl mx-auto lg:mx-0 order-3 lg:col-start-1 lg:row-start-2 lg:self-start lg:pt-0">
          {/* Deskripsi Bawah */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base md:text-lg text-[#1D3557]/80 dark:text-[#F1FAEE]/90 max-w-md lg:max-w-lg font-medium leading-relaxed font-sans"
          >
            {!user && (
              <div className="block mb-6 mt-2">
                <AuthModal defaultTab="register">
                  <button className="group relative inline-flex items-center justify-center px-8 py-4 bg-[#1D3557] dark:bg-[#F1FAEE] text-[#F1FAEE] dark:text-[#1D3557] rounded-full font-bold uppercase tracking-widest text-xs lg:text-sm shadow-[0_10px_30px_-10px_rgba(29,53,87,0.5)] dark:shadow-[0_10px_30px_-10px_rgba(241,250,238,0.5)] hover:shadow-[0_0_30px_-5px_rgba(29,53,87,0.6)] dark:hover:shadow-[0_0_30px_-5px_rgba(241,250,238,0.6)] transition-all duration-300 hover:-translate-y-1 active:scale-95 overflow-hidden border border-transparent">
                     {/* Efek Kilap (Shimmer) Dinamis */}
                     <motion.div 
                       className="absolute top-0 left-0 h-full w-[150%] bg-gradient-to-r from-transparent via-white/20 dark:via-black/10 to-transparent -skew-x-12"
                       animate={{ x: ["-100%", "100%"] }}
                       transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.5 }}
                     />
                     
                     <span className="relative z-10 flex items-center gap-3">
                        {/* Ping Dot untuk menarik mata */}
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A8DADC] dark:bg-[#457B9D] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#A8DADC] dark:bg-[#457B9D]"></span>
                        </span>
                        
                        Register New Account 
                        
                        {/* Arrow dengan animasi panah */}
                        <svg className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                     </span>
                  </button>
                </AuthModal>
              </div>
            )}
            Empowering real-time weather monitoring and dynamic climatological data visualization with absolute precision.
          </motion.div>

          {/* ========== STATISTIK & LOKASI ========== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center gap-4 lg:gap-6 justify-center lg:justify-start"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-bold text-[#1D3557] dark:text-[#F1FAEE] font-poppins">3 Active Stations</span>
            </div>
            
            <div className="h-4 w-[1px] bg-[#1D3557]/20 dark:bg-[#F1FAEE]/20 hidden sm:block"></div>
            
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {['Bali', 'Pangandaran', 'Bungus'].map(station => (
                <span key={station} className="text-[11px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-[#457B9D]/10 dark:bg-[#A8DADC]/10 text-[#457B9D] dark:text-[#A8DADC] border border-[#457B9D]/20 dark:border-[#A8DADC]/20">
                  {station}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ========== KOLOM KANAN (Mockup Gambar) ========== */}
        <div className="w-full flex justify-center lg:justify-start relative z-10 order-2 lg:col-start-2 lg:row-start-1 lg:row-span-2 mt-4 mb-4 lg:mt-0 lg:-ml-10">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative w-full max-w-2xl lg:max-w-3xl xl:max-w-[850px] drop-shadow-2xl px-2 sm:px-4 group"
          >
            <motion.div animate={mockupAnimation} className="relative w-full flex justify-center">
              {/* Efek bayangan dinamis */}
              <motion.div
                className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-[85%] h-12 bg-black/20 rounded-full blur-2xl -z-10 transition-all duration-700 group-hover:bg-black/30 group-hover:blur-3xl group-hover:w-[90%]"
                animate={shadowAnimation}
              />

              <Image
                src={mounted && resolvedTheme === "dark" ? "/mockup-dark.png" : "/mockup-light.png"}
                alt="Dashboard Mockup"
                width={1200}
                height={800}
                className="relative z-10 w-full h-auto object-contain scale-100 md:scale-110 lg:scale-[1.25] lg:origin-center transition-transform duration-700 ease-out lg:group-hover:scale-[1.30] pointer-events-none"
                priority
              />

              {/* PDF Card (Top Right) */}
              <div 
                className="absolute -top-10 -right-6 sm:-top-12 sm:-right-8 md:-top-16 md:-right-12 lg:-top-24 lg:-right-24 w-40 sm:w-44 md:w-52 bg-[#F1FAEE]/95 dark:bg-[#1D3557]/95 backdrop-blur-md rounded-xl p-2.5 sm:p-3.5 shadow-lg border border-[#1D3557]/10 dark:border-[#457B9D]/30 cursor-pointer 
                z-0 opacity-95 scale-95 sm:scale-95 rotate-6
                transition-all duration-300 ease-out
                hover:z-30 hover:opacity-100 hover:scale-105 sm:hover:scale-110 hover:rotate-0 hover:-translate-y-2 hover:translate-x-1 md:hover:translate-x-2 hover:shadow-2xl"
              >
                <div className="flex items-center gap-2.5 sm:gap-3.5">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-500 shrink-0">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[#1D3557] dark:text-[#F1FAEE] text-xs sm:text-sm md:text-base leading-tight">PDF Report</span>
                    <span className="text-[9px] sm:text-[11px] md:text-xs text-[#457B9D] dark:text-[#A8DADC]/80 font-medium">Auto-generated</span>
                  </div>
                </div>
              </div>

              {/* Excel/CSV Card (Bottom Left) */}
              <div 
                className="absolute -bottom-10 -left-6 sm:-bottom-12 sm:-left-8 md:-bottom-16 md:-left-12 lg:-bottom-24 lg:-left-24 w-40 sm:w-44 md:w-52 bg-[#1D3557]/95 dark:bg-[#1D3557]/95 backdrop-blur-md rounded-xl p-2.5 sm:p-3.5 shadow-lg border border-[#457B9D]/30 cursor-pointer 
                z-0 opacity-95 scale-95 sm:scale-95 -rotate-6
                transition-all duration-300 ease-out
                hover:z-30 hover:opacity-100 hover:scale-105 sm:hover:scale-110 hover:rotate-0 hover:translate-y-2 hover:-translate-x-1 md:hover:-translate-x-2 hover:shadow-2xl"
              >
                <div className="flex items-center gap-2.5 sm:gap-3.5">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#A8DADC]/20 flex items-center justify-center text-[#A8DADC] shrink-0">
                    <Table className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-[#F1FAEE] text-xs sm:text-sm md:text-base leading-tight">Raw Data</span>
                    <span className="text-[9px] sm:text-[11px] md:text-xs text-[#A8DADC]/80 font-medium">CSV / XLSX</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Efek partikel */}
        <div className="absolute -top-10 right-0 lg:-right-10 w-20 h-20 z-0 hidden lg:block">
          <motion.div
            className="absolute w-1 h-1 bg-[#457B9D]/40 rounded-full"
            animate={{ y: [-10, -30, -10], opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="absolute w-1.5 h-1.5 bg-[#A8DADC]/50 rounded-full"
            animate={{ x: [10, 30, 10], y: [-5, -20, -5], opacity: [0, 1, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
          />
          <motion.div
            className="absolute w-0.5 h-0.5 bg-slate-400 rounded-full"
            animate={{ x: [-10, -25, -10], y: [5, -15, 5], opacity: [0, 1, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
          />
        </div>

        {/* Scroll Down Indicator (Static) */}
        <div 
          className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#1D3557]/20 dark:border-[#A8DADC]/20 bg-[#F1FAEE]/40 dark:bg-[#1D3557]/40 backdrop-blur-md opacity-80 hover:opacity-100 hover:scale-105 transition-all cursor-pointer z-30 shadow-sm"
          onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#1D3557] dark:text-[#A8DADC]">Scroll</span>
          <ChevronDown className="w-4 h-4 text-[#1D3557] dark:text-[#A8DADC]" />
        </div>
      </main>

      {/* ========== FEATURES SECTION ========== */}
      <section id="features" className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20 min-h-[70vh] flex flex-col justify-center items-center">
        <div className="w-full max-w-3xl mx-auto text-center mb-16 gsap-fade-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1D3557] dark:text-[#F1FAEE] mb-6 font-pliant uppercase tracking-wide">
            Key <span className="text-[#457B9D] dark:text-[#A8DADC]">Features</span>
          </h2>
          <p className="text-[#1D3557]/70 dark:text-[#F1FAEE]/80 text-base md:text-lg leading-relaxed">
            A cutting-edge platform designed to present climatological data comprehensively. Monitor weather in real-time with high accuracy and explore data without limits.
          </p>
        </div>

        <div className="w-full flex flex-col md:flex-row items-stretch gap-6 lg:gap-8">
          {[
            { title: "Real-Time Tracking", desc: "Monitor weather changes and climate conditions instantly as they happen.", icon: <Activity className="w-7 h-7 text-[#457B9D] dark:text-[#A8DADC]" /> },
            { title: "Precision Analytics", desc: "Explore historical data and weather trends with unparalleled accuracy.", icon: <BarChart2 className="w-7 h-7 text-[#457B9D] dark:text-[#A8DADC]" /> },
            { title: "Effortless Export", desc: "Download weather reports and data into PDF or CSV formats with a single click.", icon: <Download className="w-7 h-7 text-[#457B9D] dark:text-[#A8DADC]" /> }
          ].map((feature, idx) => (
            <div key={idx} className="group w-full md:w-1/3 bg-[#F1FAEE]/60 dark:bg-[#1D3557]/60 backdrop-blur-md p-8 rounded-2xl border border-[#1D3557]/10 dark:border-[#F1FAEE]/10 shadow-xl dark:shadow-none hover:-translate-y-2 hover:border-[#457B9D] dark:hover:border-[#A8DADC] hover:shadow-[0_0_30px_-5px_rgba(69,123,157,0.3)] dark:hover:shadow-[0_0_30px_-5px_rgba(168,218,220,0.2)] transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#457B9D]/10 dark:bg-[#A8DADC]/10 flex items-center justify-center mb-6 border border-[#457B9D]/20 dark:border-[#A8DADC]/20 shrink-0 group-hover:scale-110 group-hover:bg-[#457B9D]/20 dark:group-hover:bg-[#A8DADC]/20 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-[#1D3557] dark:text-[#F1FAEE] mb-3">{feature.title}</h3>
              <p className="text-[#1D3557]/70 dark:text-[#F1FAEE]/70 text-sm md:text-base leading-relaxed flex-1 flex flex-col justify-start">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========== RESPONSIVE SHOWCASE SECTION ========== */}
      <section id="cross-platform" className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-16 min-h-[50vh] flex flex-col justify-center items-center">
        
        {/* Title */}
        <div className="w-full text-center mb-16 gsap-fade-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1D3557] dark:text-[#F1FAEE] mb-4 font-pliant uppercase tracking-wide">
            Anywhere. <span className="text-[#457B9D] dark:text-[#A8DADC]">Any Device.</span>
          </h2>
          <p className="text-[#1D3557]/70 dark:text-[#F1FAEE]/80 text-sm md:text-lg max-w-2xl mx-auto">
            Experience full monitoring capabilities without compromise, beautifully adapted for your screen.
          </p>
        </div>

        {/* Showcase Images (Side by Side, Bottom Aligned) */}
        <div className="w-full flex flex-col md:flex-row justify-center items-center md:items-end gap-12 lg:gap-20">
          
          {/* Desktop Dashboard */}
          <div className="w-full md:w-3/5 flex flex-col items-center group gsap-fade-up">
             <div className="relative w-full max-w-[700px] transition-transform duration-700 group-hover:-translate-y-3">
                {/* Glow */}
                <div className="absolute inset-0 bg-[#457B9D]/30 dark:bg-[#A8DADC]/30 blur-3xl rounded-[2rem] scale-95 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <Image 
                   src={mounted && resolvedTheme === 'dark' ? '/dark desktop.png' : '/light desktop.png'}
                   width={800}
                   height={500}
                   alt="Desktop Dashboard"
                   className="relative z-10 w-full h-auto drop-shadow-2xl rounded-xl md:rounded-2xl border-[6px] lg:border-[8px] border-white/80 dark:border-[#1D3557]/80 backdrop-blur-sm"
                />
             </div>
             {/* Label */}
             <div className="mt-8 text-center bg-white/70 dark:bg-[#1D3557]/70 backdrop-blur-xl px-6 py-3 rounded-full border border-[#1D3557]/10 dark:border-[#F1FAEE]/10 shadow-[0_8px_30px_rgb(0,0,0,0.05)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
                <h3 className="text-sm md:text-base font-bold text-[#1D3557] dark:text-[#F1FAEE] flex items-center justify-center gap-2.5">
                  <Monitor className="w-5 h-5 text-[#457B9D] dark:text-[#A8DADC]" /> Desktop Powerhouse
                </h3>
             </div>
          </div>

          {/* Mobile Dashboard */}
          <div className="w-full md:w-2/5 flex flex-col items-center group gsap-fade-up" style={{ transitionDelay: '100ms' }}>
             <div className="relative w-[220px] sm:w-[260px] lg:w-[280px] transition-transform duration-700 group-hover:-translate-y-3">
                {/* Glow */}
                <div className="absolute inset-0 bg-[#A8DADC]/40 dark:bg-[#457B9D]/40 blur-3xl rounded-[3rem] scale-90 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <Image 
                   src={mounted && resolvedTheme === 'dark' ? '/dark mobile.png' : '/light mobile.png'}
                   width={400}
                   height={800}
                   alt="Mobile Dashboard"
                   className="relative z-10 w-full h-auto drop-shadow-2xl rounded-[2rem] lg:rounded-[2.5rem] border-[6px] lg:border-[8px] border-white/80 dark:border-[#1D3557]/80 backdrop-blur-sm"
                />
             </div>
             {/* Label */}
             <div className="mt-8 text-center bg-white/70 dark:bg-[#1D3557]/70 backdrop-blur-xl px-6 py-3 rounded-full border border-[#1D3557]/10 dark:border-[#F1FAEE]/10 shadow-[0_8px_30px_rgb(0,0,0,0.05)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
                <h3 className="text-sm md:text-base font-bold text-[#1D3557] dark:text-[#F1FAEE] flex items-center justify-center gap-2.5">
                  <Smartphone className="w-5 h-5 text-[#457B9D] dark:text-[#A8DADC]" /> Mobile Optimized
                </h3>
             </div>
          </div>
          
        </div>
      </section>

      {/* ========== GET STARTED SECTION ========== */}
      <section id="get-started" className="relative z-10 w-full max-w-4xl mx-auto px-6 lg:px-12 py-24 min-h-[50vh] flex flex-col justify-center text-center gsap-fade-up">
        <div className="bg-gradient-to-b from-[#F1FAEE]/70 to-[#F1FAEE]/30 dark:from-[#1D3557]/60 dark:to-[#1D3557]/30 backdrop-blur-xl p-10 md:p-16 rounded-3xl border border-[#1D3557]/10 dark:border-[#F1FAEE]/10 shadow-2xl relative overflow-hidden flex flex-col items-center">
          {/* Ornamen Latar Tipis */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#457B9D]/10 dark:bg-[#A8DADC]/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#1D3557]/10 dark:bg-[#F1FAEE]/5 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1D3557] dark:text-[#F1FAEE] mb-6 font-pliant uppercase tracking-wide">
            Ready to <span className="text-[#457B9D] dark:text-[#A8DADC]">Explore?</span>
          </h2>
          <p className="text-[#1D3557]/70 dark:text-[#F1FAEE]/80 text-base md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of researchers and institutions relying on our advanced environmental data dashboard to make better decisions.
          </p>
          <AuthModal defaultTab="register">
            <button className="px-10 py-4 bg-[#1D3557] hover:bg-[#457B9D] dark:bg-[#A8DADC] dark:hover:bg-[#F1FAEE] text-[#F1FAEE] dark:text-[#1D3557] font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 tracking-wider uppercase text-sm">
              Get Started Now
            </button>
          </AuthModal>
        </div>
      </section>
      <Footer />
    </div>
  );
}