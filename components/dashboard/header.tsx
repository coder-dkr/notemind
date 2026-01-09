'use client';

import { motion } from 'framer-motion';

interface DashboardHeaderProps {
  heading?: string;
  text?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({
  heading,
  text,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-10">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {heading && (
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2">
            {heading}<span className="text-primary">.</span>
          </h1>
        )}
        {text && <p className="text-white/40 font-medium text-lg">{text}</p>}
      </motion.div>
      
      <motion.div 
        className="flex items-center gap-3"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
