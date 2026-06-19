"use client";

import * as motion from "motion/react-client";

export default function DashboardTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 30, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
      transition={{ 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1], // Custom kubik bezier untuk efek perlambatan dramatis
      }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}
