'use client';

import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <motion.div 
        className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-black" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/" className="flex items-center">
            <Brain className="h-6 w-6 mr-2" />
            <span>NoteMind</span>
          </Link>
        </div>
        <div className='flex-1 flex items-center justify-center z-20'>
        <Image src="/images/mindgif.webp" width={600} height={600} alt="mind gif" />
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
            &quot;NoteMind has transformed how I take and organize my notes. The AI summarization feature saves me hours of review time.&quot;
            </p>
            <footer className="text-sm">Sophie Knowles</footer>
          </blockquote>
        </div>
      </motion.div>
      <motion.div 
        className="lg:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex items-center justify-center lg:hidden mb-8">
            <Link href="/" className="flex items-center">
              <Brain className="h-6 w-6 mr-2" />
              <span className="font-bold">NoteMind</span>
            </Link>
          </div>
          {children}
        </div>
      </motion.div>
    </div>
  );
}