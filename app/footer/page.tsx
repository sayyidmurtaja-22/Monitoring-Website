"use client"

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
      <footer className="w-full relative z-10 border-t border-[#1D3557]/10 dark:border-white/10 bg-[#F1FAEE]/80 dark:bg-[#1D3557]/80 backdrop-blur-md mt-auto py-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Left: Brand & Copyright */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="font-bold text-lg tracking-tighter text-[#1D3557] dark:text-[#F1FAEE]">
              Tekno<span className="text-[#457B9D] dark:text-[#A8DADC]">SEA</span>
            </span>
            <span className="text-xs text-[#1D3557]/70 dark:text-[#F1FAEE]/70 mt-1 font-medium font-poppins">
              &copy; {currentYear} AWS Monitoring Dashboard <br className="block sm:hidden" />
              <span className="font-bold text-[#1D3557] dark:text-[#F1FAEE]">Universitas Jenderal Soedirman</span>.
            </span>
          </div>
          
          {/* Right: Version */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <span className="text-[10px] text-[#1D3557]/50 dark:text-[#F1FAEE]/40 font-bold tracking-widest uppercase mt-4 md:mt-0">
              v1.0.0
            </span>
          </div>
          
        </div>
      </footer>
    );
}