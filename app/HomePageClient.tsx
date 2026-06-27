"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { useTheme } from "next-themes";
import { type User } from "next-auth";
import * as motion from "motion/react-client";
import Link from "next/link";
import Image from "next/image";
import AuthModal from "@/components/auth/AuthModal";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { MeshGradient } from "@paper-design/shaders-react";
import "./style.css";

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
            <div className="absolute inset-0 pointer-events-none bg-white/20 dark:bg-[#1D3557]/20 transition-colors duration-500" />
          </>
        )}
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full p-4 flex justify-between items-center max-w-[1200px] mx-auto bg-white/60 dark:bg-[#1D3557]/60 backdrop-blur-md transition-all duration-300 border-b border-transparent dark:border-white/10 rounded-b-2xl shadow-sm dark:shadow-none">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl md:text-2xl tracking-tighter text-[#1D3557] dark:text-white">
            Tekno<span className="text-[#457B9D] dark:text-[#A8DADC]">SEA</span>
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-[#1D3557] dark:text-slate-300">
          <a href="#home" className="hover:text-[#457B9D] dark:hover:text-white transition-colors">Home</a>
          <a href="#about" className="hover:text-[#457B9D] dark:hover:text-white transition-colors">About</a>
          <a href="#contact" className="hover:text-[#457B9D] dark:hover:text-white transition-colors">Contact</a>
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

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 dark:bg-[#1D3557]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden transition-all duration-300">
          <a href="#home" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-bold text-[#1D3557] dark:text-white font-pliant uppercase tracking-widest hover:text-[#457B9D] dark:hover:text-[#A8DADC] transition-colors">Home</a>
          <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-bold text-[#1D3557] dark:text-white font-pliant uppercase tracking-widest hover:text-[#457B9D] dark:hover:text-[#A8DADC] transition-colors">About</a>
          <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-bold text-[#1D3557] dark:text-white font-pliant uppercase tracking-widest hover:text-[#457B9D] dark:hover:text-[#A8DADC] transition-colors">Contact</a>
        </div>
      )}

      {/* Konten Utama */}
      <main id="home" className="relative z-10 flex flex-col lg:flex-row items-center justify-center pt-28 pb-12 px-6 lg:px-12 max-w-7xl mx-auto w-full gap-8 lg:gap-12 min-h-[100vh]">
        
        {/* ========== KOLOM KIRI (Teks & Tombol) ========== */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left flex-1 z-20 max-w-xl w-full">
          
          {/* Overline / Kategori */}
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
             className="mb-6 flex items-center gap-3"
          >
             <div className="w-[2px] h-4 bg-[#1D3557] dark:bg-slate-400 hidden lg:block"></div>
             <span className="text-[#1D3557] dark:text-slate-300 text-sm md:text-base font-medium tracking-wide uppercase">
                Universitas Jenderal Soedirman
             </span>
          </motion.div>

          {/* ========== JUDUL (Slogan) ========== */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-[3.5rem] font-semibold tracking-wide mb-8 leading-[1.2] text-[#1D3557] dark:text-white uppercase font-pliant flex flex-wrap items-center justify-center lg:justify-start gap-y-1 lg:gap-y-2 gap-x-4"
          >
             <span className="w-full">DYNAMIC DATA</span>
             <span className="w-full">EXPLORATION</span>
             <span className="w-full">& MONITORING</span>
             <span>DASHBOARDS.</span>

             {/* ========== TOMBOL BULAT (Elegan) ========== */}
             {user ? (
               <Link href="/users/dashboard" className="group inline-flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full border border-[#1D3557] dark:border-white/50 align-middle hover:bg-[#1D3557] dark:hover:bg-white transition-all ml-2">
                  <span className="transform -rotate-45 text-2xl font-light text-[#1D3557] dark:text-white group-hover:text-white dark:group-hover:text-slate-900 transition-colors">→</span>
               </Link>
             ) : (
               <AuthModal defaultTab="login">
                  <button className="group inline-flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full border border-[#1D3557] dark:border-white/50 align-middle hover:bg-[#1D3557] dark:hover:bg-white transition-all cursor-pointer ml-2">
                     <span className="transform -rotate-45 text-2xl font-light text-[#1D3557] dark:text-white group-hover:text-white dark:group-hover:text-slate-900 transition-colors">→</span>
                  </button>
               </AuthModal>
             )}
          </motion.h1>

          {/* Deskripsi Bawah */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base md:text-lg text-[#1D3557]/60 dark:text-white/50 max-w-md lg:max-w-lg font-light leading-relaxed font-sans"
          >
            {!user && (
              <span className="block mb-2">
                <AuthModal defaultTab="register">
                  <button className="relative inline-block text-xs lg:text-sm font-bold tracking-widest uppercase text-[#457B9D] dark:text-[#A8DADC] pb-1 group active:scale-95 transition-transform duration-150 animate-float">
                     Register New Account
                     {/* Default state: berbayang (gradient) */}
                     <span className="absolute left-0 bottom-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#457B9D] dark:via-[#A8DADC] to-transparent transition-opacity duration-300 group-hover:opacity-0"></span>
                     {/* Hover state: solid dan bergerak memanjang full */}
                     <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#457B9D] dark:bg-[#A8DADC] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
                  </button>
                </AuthModal>
              </span>
            )}
            Empowering real-time weather monitoring and dynamic climatological data visualization with absolute precision.
          </motion.p>
        </div>

        {/* ========== KOLOM KANAN (Mockup Gambar) ========== */}
        <div className="flex-1 w-full flex justify-center lg:justify-start relative z-10 mt-8 lg:mt-0 lg:-ml-10">
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
                className="w-full h-auto object-contain scale-110 lg:scale-[1.25] lg:origin-center transition-transform duration-700 ease-out lg:group-hover:scale-[1.30]"
                priority
              />
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
      </main>

      {/* ========== ABOUT SECTION ========== */}
      <section id="about" className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 py-24 min-h-[80vh] flex flex-col justify-center">
        <div className="max-w-3xl mx-auto text-center mb-16 gsap-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1D3557] dark:text-white mb-6 font-pliant uppercase tracking-wide">
            Intelligent <span className="text-[#457B9D] dark:text-[#A8DADC]">Monitoring</span>
          </h2>
          <p className="text-[#1D3557]/70 dark:text-slate-300/80 text-lg leading-relaxed">
            Discover a state-of-the-art platform designed to transform complex climatological data into 
            actionable insights. Our systems provide real-time updates and seamless exploration capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 gsap-stagger-up">
          {[
            { title: "Real-Time Tracking", desc: "Monitor weather shifts the exact moment they happen." },
            { title: "Precision Analytics", desc: "Deep dive into historical data with unparalleled accuracy." },
            { title: "Seamless Exports", desc: "Export crucial data effortlessly in multiple formats." }
          ].map((feature, idx) => (
            <div key={idx} className="gsap-item bg-white/40 dark:bg-[#1D3557]/40 backdrop-blur-md p-8 rounded-2xl border border-white/50 dark:border-white/10 shadow-xl dark:shadow-none hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 rounded-full bg-[#457B9D]/20 dark:bg-[#A8DADC]/20 flex items-center justify-center mb-6">
                <span className="text-[#457B9D] dark:text-[#A8DADC] font-bold text-lg">{idx + 1}</span>
              </div>
              <h3 className="text-xl font-bold text-[#1D3557] dark:text-white mb-3">{feature.title}</h3>
              <p className="text-[#1D3557]/70 dark:text-slate-300/70">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========== CONTACT SECTION ========== */}
      <section id="contact" className="relative z-10 w-full max-w-4xl mx-auto px-6 lg:px-12 py-24 min-h-[60vh] flex flex-col justify-center text-center gsap-fade-up">
        <div className="bg-gradient-to-b from-white/60 to-white/30 dark:from-[#1D3557]/60 dark:to-[#1D3557]/30 backdrop-blur-xl p-12 md:p-16 rounded-3xl border border-white/50 dark:border-white/10 shadow-2xl relative overflow-hidden">
          {/* Ornamen Latar Tipis */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#457B9D]/10 dark:bg-[#A8DADC]/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#1D3557]/10 dark:bg-white/5 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-[#1D3557] dark:text-white mb-6 font-pliant uppercase tracking-wide">
            Ready to <span className="text-[#457B9D] dark:text-[#A8DADC]">Explore?</span>
          </h2>
          <p className="text-[#1D3557]/70 dark:text-slate-300/80 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of researchers and institutions relying on our advanced environmental data dashboard.
          </p>
          <AuthModal defaultTab="register">
            <button className="px-10 py-4 bg-[#1D3557] hover:bg-[#457B9D] dark:bg-[#A8DADC] dark:hover:bg-white text-white dark:text-[#1D3557] font-bold rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 tracking-wider uppercase text-sm">
              Get Started Now
            </button>
          </AuthModal>
        </div>
      </section>

    </div>
  );
}