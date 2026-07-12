"use client";

import React, { useState, useEffect } from "react";
import { Joyride, Step } from "react-joyride";

interface TourGuideProps {
  page?: 'dashboard' | 'station' | 'export';
  isAdmin?: boolean;
}

export default function TourGuide({ page = 'dashboard', isAdmin = false }: TourGuideProps) {
  const [run, setRun] = useState(false);

  // Gunakan key berbeda untuk tiap halaman agar tour bisa muncul sekali di dashboard dan sekali di station
  const storageKey = 
    page === 'dashboard' ? 'hasSeenDashboardTour' : 
    page === 'export' ? 'hasSeenExportTour' : 
    'hasSeenStationTourV2';

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
      content: 'Gunakan navigasi ini untuk menjelajah. Menu Dashboard dan Export Data kini dilengkapi dengan Dropdown elegan untuk langsung melompat ke stasiun wilayah spesifik (Pangandaran, Bali, Padang) hanya dengan sekali klik.',
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
      content: 'Tentukan rentang tanggal spesifik. Kini Anda dapat menggunakan Shortcut Cepat (7 Hari, Bulan Ini, dll) di sebelah kiri kalender tanpa repot memilih satu-satu.',
      skipBeacon: true,
    },
    {
      target: '#tour-filter-interval', 
      content: 'Pilih interval waktu (Per Jam, Per Hari, atau Per Bulan) untuk meringkas dan menyesuaikan tampilan grafik.',
      skipBeacon: true,
    },
    {
      target: '#tour-export-pdf', 
      content: 'Klik tombol ini untuk mengunduh laporan data cuaca. PDF kini di-generate dalam 1 halaman panjang utuh sehingga grafik tidak lagi terpotong secara paksa!',
      skipBeacon: true,
    },
    {
      target: '#tour-weather-cards', 
      content: 'Bagian ini menampilkan ringkasan data cuaca harian dan 10 susunan grafik pergerakan elemen cuaca.',
      skipBeacon: true,
    },
    {
      target: '#tour-new-charts', 
      content: 'BARU! Grafik Curah Hujan kini ditampilkan menggunakan Bar Chart (Grafik Batang) untuk memudahkan Anda mengamati intensitas hujan.',
      skipBeacon: true,
    }
  ];

  const exportSteps: Step[] = [
    {
      target: '#tour-export-tanggal', 
      content: 'Pertama, tentukan rentang tanggal data yang ingin Anda lihat atau ekspor ke dalam tabel.',
      skipBeacon: true,
    },
    {
      target: '#tour-export-parameter', 
      content: 'Kedua, klik menu ini untuk memilih parameter cuaca apa saja (Suhu, Angin, Curah Hujan, dll.) yang ingin Anda tampilkan.',
      skipBeacon: true,
    },
    {
      target: '#tour-export-csv', 
      content: 'Terakhir, klik tombol ini untuk mengunduh data yang telah Anda saring ke dalam format CSV agar bisa dibuka di Excel.',
      skipBeacon: true,
    }
  ];

  const steps = 
    page === 'dashboard' ? dashboardSteps : 
    page === 'export' ? exportSteps : 
    stationSteps;

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
      onEvent={handleJoyrideCallback}
      locale={{
        back: 'Kembali',
        close: 'Tutup',
        last: 'Selesai',
        next: 'Lanjut',
        skip: 'Lewati',
      }}
      options={{
        showProgress: true,
        skipBeacon: true, // Nonaktifkan lingkaran berdenyut untuk semua langkah
        skipScroll: page === 'dashboard', // Disable scroll for main dashboard page
        scrollOffset: 150, // Hindari tertutup navbar sticky di atas
        primaryColor: "#E63946",
        zIndex: 10000,
        buttons: ['back', 'close', 'primary', 'skip'], // Menampilkan tombol skip
      }}
    />
  );
}
