'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 bg-background overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] -z-10" />

      <motion.div 
        className="relative hidden h-full flex-col p-12 text-white lg:flex border-r border-white/5 bg-white/[0.02] backdrop-blur-3xl"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative z-20 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl purple-gradient flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-primary/20">
              <span className="text-white font-black text-xl">K</span>
            </div>
            <span className="text-2xl font-black tracking-tight text-white">KeraMind<span className="text-primary">.ai</span></span>
          </Link>
        </div>
        
        <div className='flex-1 flex flex-col items-center justify-center z-20 space-y-12'>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
            <Image 
              src="/images/mindgif.webp" 
              width={500} 
              height={500} 
              alt="mind gif" 
              className="relative z-10 drop-shadow-[0_0_50px_rgba(139,92,246,0.3)]"
            />
          </motion.div>
          
          <div className="text-center space-y-4 max-w-md">
            <h2 className="text-3xl font-black tracking-tight text-white leading-tight">
              Think With <span className="text-gradient">Clarity</span>
            </h2>
            <p className="text-white/40 font-medium text-lg">
              Understand, structure, and improve your thinking over time with cognitive intelligence.
            </p>
          </div>
        </div>

        <div className="relative z-20 mt-auto">
          <div className="glass-card p-8 rounded-[2rem] border-white/10">
            <blockquote className="space-y-4">
              <p className="text-lg font-medium text-white/80 leading-relaxed italic">
                &quot;KeraMind helped me see contradictions in my thinking I never noticed. It&apos;s like having a cognitive mirror.&quot;
              </p>
              <footer className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full purple-gradient flex items-center justify-center font-bold text-xs">SK</div>
                <div>
                  <div className="text-sm font-black text-white">Sophie Knowles</div>
                  <div className="text-xs font-bold text-primary uppercase tracking-widest">Decision Scientist</div>
                </div>
              </footer>
            </blockquote>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="flex items-center justify-center p-8 lg:p-12 h-full"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        <div className="mx-auto flex w-full flex-col justify-center space-y-10 sm:w-[450px]">
          <div className="flex flex-col items-center lg:hidden mb-8 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl purple-gradient flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-2xl">K</span>
              </div>
              <span className="text-3xl font-black tracking-tight text-white">KeraMind<span className="text-primary">.ai</span></span>
            </Link>
          </div>
          <div className="glass-card p-10 rounded-[3rem] border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
