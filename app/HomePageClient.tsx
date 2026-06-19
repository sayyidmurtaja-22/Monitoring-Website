"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { type User } from "next-auth";
import * as motion from "motion/react-client";
import Link from "next/link";
import Image from "next/image";
import AuthModal from "@/components/auth/AuthModal";
import { useState, useEffect } from "react";
import { MeshGradient } from "@paper-design/shaders-react";
import "./style.css";

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

  // 🎨 Warna MeshGradient: Dominan Abu & Putih + Sentuhan Biru
  const grayWhiteBlueColors = [
    "#F5F5F5",  // Putih keabuan (cerah)
    "#E0E0E0",  // Abu-abu sangat muda
    "#D3D3D3",  // Abu-abu terang
    "#B0B0B0",  // Abu-abu medium
    "#A8DADC",  // Biru pucat (sentuhan biru lembut)
    "#C0C0C0",  // Abu-abu perak
  ];

  // Alternatif warna jika ingin lebih gelap (moody)
  const darkGrayBlueColors = [
    "#E8E8E8",  // Abu-abu sangat muda
    "#D4D4D4",  // Abu-abu terang
    "#B0B0B0",  // Abu-abu medium
    "#8C8C8C",  // Abu-abu gelap
    "#6C9EBF",  // Biru abu-abu (sentuhan biru)
    "#A3B5C5",  // Biru keabuan
  ];

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col font-poppins">
      
      {/* ========== MESH GRADIENT BACKGROUND ========== */}
      <div className="fixed inset-0 w-screen h-screen -z-10">
        {mounted && (
          <>
            <MeshGradient
              width={dimensions.width}
              height={dimensions.height}
              colors={grayWhiteBlueColors}  // ← warna abu-putih dengan sentuhan biru
              distortion={0.6}              // ← dikurangi agar lebih halus
              swirl={0.4}                   // ← dikurangi agar tidak terlalu ramai
              grainMixer={0}
              grainOverlay={0}
              speed={0.35}                  // ← lebih lambat & kalem
              offsetX={0.05}                // ← gerakan lebih subtle
            />
            {/* Veil overlay tipis untuk meningkatkan keterbacaan teks */}
            <div className="absolute inset-0 pointer-events-none bg-white/20" />
          </>
        )}
      </div>

      {/* Garis-garis grid halus vertikal (opsional) */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center w-full">
        <div className="w-full max-w-[1200px] h-full flex justify-between px-10">
          <div className="w-[1px] h-full bg-black/5"></div>
          <div className="w-[1px] h-full bg-black/5 hidden md:block"></div>
          <div className="w-[1px] h-full bg-black/5"></div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 w-full p-4 flex justify-between items-center max-w-[1200px] mx-auto">
        <div className="flex items-center gap-2">
          <span className="font-bold text-2xl tracking-tighter text-[#1D3557]">
            Tekno<span className="text-[#457B9D]">SEA</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="hidden sm:flex items-center text-sm px-4 py-1.5 bg-black/5 backdrop-blur-md rounded-full border border-black/10">
              <span className="text-slate-700">
                Welcome,{" "}
                <span className="font-semibold text-[#457B9D]">
                  {user.name}
                </span>
              </span>
            </div>
          ) : null}
          <ModeToggle />
        </div>
      </header>

      {/* Konten Utama */}
      <main className="relative z-10 flex-1 flex flex-col items-center pt-8 pb-12 px-4">

        {/* ========== JUDUL ========== */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={circuitTransition}
          className="text-center text-5xl sm:text-6xl md:text-[5rem] font-extrabold tracking-tight mb-4 max-w-4xl"
        >
          <span className="bg-gradient-to-r from-[#1D3557] to-[#457B9D] bg-clip-text text-transparent drop-shadow-lg">
            TeknoSEA
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...circuitTransition, delay: 0.15 }}
          className="text-center text-xl sm:text-2xl md:text-3xl font-medium mb-3 text-slate-600 drop-shadow-sm"
        >
          Weather & Marine Monitoring System
        </motion.h2>

        {/* Deskripsi */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...circuitTransition, delay: 0.3 }}
          className="text-lg sm:text-xl text-center text-slate-500 mb-6 max-w-2xl font-light"
        >
          FPIK Unsoed Weather & Marine Monitoring Dashboard. The ultimate
          destination to monitor environmental data in real-time.
        </motion.p>

        {/* ========== TOMBOL ========== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...circuitTransition, delay: 0.45 }}
          className="mb-8"
        >
          {user ? (
            <div className="relative group">
              <div className="absolute -inset-1 bg-[#457B9D]/30 rounded-2xl blur-lg opacity-50 group-hover:opacity-80 transition duration-300" />
              <Link
                href="/users/dashboard"
                className="relative inline-flex items-center justify-center px-8 py-4 bg-[#457B9D] text-white font-semibold rounded-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                  variants={shimmerAnimation}
                  initial="hidden"
                  animate="visible"
                />
                <span className="relative z-10 flex items-center gap-2">
                  Go to Dashboard
                  <motion.span animate={arrowAnimation}>→</motion.span>
                </span>
              </Link>
            </div>
          ) : (
            <div className="flex flex-row gap-3">
              {/* Tombol Register */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-emerald-500/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-80 transition duration-300" />
                <AuthModal defaultTab="register">
                  <button className="relative inline-flex items-center justify-center px-8 py-4 bg-white text-slate-900 font-semibold rounded-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden border border-slate-200">
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent -skew-x-12"
                      variants={shimmerAnimation}
                      initial="hidden"
                      animate="visible"
                    />
                    <span className="relative z-10 flex items-center gap-2">
                      Register
                      <motion.span animate={arrowAnimation}>→</motion.span>
                    </span>
                  </button>
                </AuthModal>
              </div>

              {/* Tombol Login */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-[#457B9D]/30 rounded-2xl blur-lg opacity-50 group-hover:opacity-80 transition duration-300" />
                <AuthModal defaultTab="login">
                  <button className="relative inline-flex items-center justify-center px-8 py-4 bg-[#457B9D] text-white font-semibold rounded-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden">
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                      variants={shimmerAnimation}
                      initial="hidden"
                      animate="visible"
                    />
                    <span className="relative z-10 flex items-center gap-2">
                      Login
                      <motion.span animate={arrowAnimation}>→</motion.span>
                    </span>
                  </button>
                </AuthModal>
              </div>
            </div>
          )}
        </motion.div>

        {/* ========== MOCKUP GAMBAR ========== */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...circuitTransition, delay: 0.6 }}
          className="relative w-full max-w-4xl mx-auto"
        >
          {/* Glow effect di belakang mockup (biru lembut) */}
          <motion.div
            className="absolute -inset-10 bg-[#457B9D]/20 rounded-full blur-3xl -z-10"
            animate={glowAnimation}
          />

          <motion.div animate={mockupAnimation} className="relative">
            {/* Efek bayangan */}
            <motion.div
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-4/5 h-8 bg-black/20 rounded-full blur-md"
              animate={shadowAnimation}
            />

            {/* Card Mockup */}
            <div className="relative rounded-3xl border border-white/30 shadow-[0_0_50px_rgba(0,0,0,0.08)] overflow-hidden bg-white/40 backdrop-blur-sm">
              {/* Background gradient lembut */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-cyan-500/5 rounded-3xl" />

              {/* Efek scanning */}
              <motion.div
                className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.1, 0] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              >
                <motion.div
                  className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#457B9D]/50 to-transparent"
                  animate={scanAnimation}
                />
              </motion.div>

              <Image
                src="/MockupGambar.png"
                alt="Dashboard Mockup"
                width={1200}
                height={800}
                className="w-full h-auto object-cover scale-[1.25] origin-center translate-y-[2%]"
                priority
              />
            </div>
          </motion.div>

          {/* Efek partikel */}
          <div className="absolute -top-10 -right-10 w-20 h-20">
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
        </motion.div>

      </main>
    </div>
  );
}