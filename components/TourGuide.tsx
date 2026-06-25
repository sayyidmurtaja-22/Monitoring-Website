"use client";

import React, { useState, useEffect } from "react";
import { Joyride, Step } from "react-joyride";

interface TourGuideProps {
  page?: 'dashboard' | 'station';
  isAdmin?: boolean;
}

export default function TourGuide({ page = 'dashboard', isAdmin = false }: TourGuideProps) {
  const [run, setRun] = useState(false);

  // Gunakan key berbeda untuk tiap halaman agar tour bisa muncul sekali di dashboard dan sekali di station
  const storageKey = page === 'dashboard' ? 'hasSeenDashboardTour' : 'hasSeenStationTour';

  useEffect(() => {
    // Only run on mount
    const hasSeenTour = localStorage.getItem(storageKey);
    if (!hasSeenTour) {
      // Delay slightly to ensure everything is rendered
      const timer = setTimeout(() => {
        setRun(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [storageKey]);

  const dashboardSteps: Step[] = [
    {
      target: '#tour-status-server', 
      content: 'Indikator ini menunjukkan status koneksi server pusat. Pastikan sistem terhubung dan seluruh stasiun aktif sebelum melakukan pemantauan.',
      skipBeacon: true,
    },
    {
      target: '#tour-lokasi-stasiun', 
      content: 'Ini adalah daftar stasiun AWS yang tersedia. Klik salah satu kartu stasiun (misalnya Padang atau Bali) untuk masuk dan melihat data cuaca secara detail.',
      skipBeacon: true,
    },
    {
      target: '#tour-menu-sidebar', 
      content: 'Gunakan navigasi ini untuk mengakses fitur lain. Anda bisa kembali ke halaman ini melalui menu Dashboard, atau mengunduh laporan di menu Export Data.',
      skipBeacon: true,
    },
    {
      target: '#tour-top-menu', 
      content: 'Di sini Anda dapat melihat jam secara real-time dan menekan ikon bulan untuk beralih antara Mode Gelap (Dark Mode) atau Terang (Light Mode).',
      skipBeacon: true,
    },
    ...(isAdmin ? [{
      target: '#tour-user-profile',
      content: 'Sebagai Admin, Anda dapat mengklik profil Anda di sini untuk melihat daftar siapa saja yang sudah mendaftar di sistem ini.',
      skipBeacon: true,
    } as Step] : []),
    {
      target: '#tour-user-logout', 
      content: 'Di sudut ini terdapat detail akun Anda. Klik tombol Logout jika Anda sudah selesai melakukan pemantauan.',
      skipBeacon: true,
    }
  ];

  const stationSteps: Step[] = [
    {
      target: '#tour-filter-lokasi', 
      content: 'Gunakan menu ini untuk berpindah ke dashboard stasiun AWS di wilayah lain dengan cepat.',
      skipBeacon: true,
    },
    {
      target: '#tour-filter-tanggal', 
      content: 'Tentukan rentang tanggal spesifik untuk melihat data cuaca historis.',
      skipBeacon: true,
    },
    {
      target: '#tour-filter-interval', 
      content: 'Pilih interval waktu (Per Jam, Per Hari, atau Per Bulan) untuk meringkas dan menyesuaikan tampilan grafik.',
      skipBeacon: true,
    },
    {
      target: '#tour-export-pdf', 
      content: 'Klik tombol ini untuk mengunduh laporan data cuaca beserta grafik saat ini ke dalam format PDF.',
      skipBeacon: true,
    },
    {
      target: '#tour-weather-cards', 
      content: 'Bagian ini menampilkan ringkasan data cuaca harian dan grafik pergerakan elemen cuaca.',
      skipBeacon: true,
    }
  ];

  const steps = page === 'dashboard' ? dashboardSteps : stationSteps;

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    const finishedStatuses = ['finished', 'skipped'];
    
    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem(storageKey, "true");
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      disableScrolling={page === 'dashboard'} // Disable scroll for main dashboard page
      skipBeacon={true} // Nonaktifkan lingkaran berdenyut untuk semua langkah
      scrollOffset={150} // Hindari tertutup navbar sticky di atas
      callback={handleJoyrideCallback}
      primaryColor="#E63946"
      zIndex={10000}
      locale={{
        back: 'Kembali',
        close: 'Tutup',
        last: 'Selesai',
        next: 'Lanjut',
        skip: 'Lewati',
      }}
    />
  );
}
