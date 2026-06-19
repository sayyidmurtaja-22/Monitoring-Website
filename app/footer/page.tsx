"use client"

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
         <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-[#F1FAEE] dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-500 dark:text-slate-400">
        
        {/* Kiri: Nama aplikasi / brand */}
        <span className="font-medium text-slate-700 dark:text-slate-300">
          TeknoSEA
        </span>
 
        {/* Tengah: Copyright */}
        <span>
          &copy; {currentYear} AWS Monitor. Universitas Jenderal Soedirman
        </span>
 
        {/* Kanan: Versi atau info tambahan */}
        <span className="text-xs text-slate-400 dark:text-slate-600">
          v1.0.0
        </span>
 
      </div>
    </footer>
    );
}