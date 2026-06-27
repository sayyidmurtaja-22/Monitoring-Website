"use client"

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
         <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-[#F1FAEE] dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-2 text-sm text-slate-500 dark:text-slate-400 text-center sm:text-left">
        
        {/* Kiri: Nama aplikasi / brand */}
        <span className="font-semibold text-base text-[#1D3557] dark:text-slate-300">
          TeknoSEA
        </span>
 
        {/* Tengah: Copyright */}
        <span className="leading-relaxed">
          &copy; {currentYear} AWS Monitoring Dashboard <br className="block sm:hidden" />
          <span className="font-bold text-slate-700 dark:text-slate-300">Universitas Jenderal Soedirman</span>
        </span>
 
        {/* Kanan: Versi atau info tambahan */}
        <span className="text-xs text-slate-400 dark:text-slate-500 mt-2 sm:mt-0">
          v1.0.0
        </span>
 
      </div>
    </footer>
    );
}