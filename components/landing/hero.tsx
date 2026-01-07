'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Sparkles, Zap, Shield, Rocket } from 'lucide-react';

export function LandingHero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section className="w-full py-20 md:py-32 lg:py-48 overflow-hidden relative">
      <div className="container px-4 md:px-6 relative z-10">
        <motion.div 
          className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 text-primary-foreground/80 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>The Future of Intelligent Note-Taking</span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl font-black tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl/none"
            variants={itemVariants}
          >
            <span className="text-white">Note</span>
            <span className="text-gradient">mind.ai</span>
          </motion.h1>

          <motion.p 
            className="max-w-[700px] text-white/60 md:text-xl lg:text-2xl font-medium leading-relaxed"
            variants={itemVariants}
          >
            Elevate your intelligence with AI-powered notes. Capture, organize, and synthesize your thoughts with unprecedented speed and clarity.
          </motion.p>

          <motion.div 
            className="flex flex-col gap-4 min-[400px]:flex-row pt-4"
            variants={itemVariants}
          >
            <Button size="lg" className="h-14 px-10 text-lg purple-gradient border-0 hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(139,92,246,0.3)] group" asChild>
              <a href="/signup" className="flex items-center gap-2">
                Start for Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-10 text-lg glass border-white/10 hover:bg-white/5 transition-all text-white" asChild>
              <a href="/login">Explore Features</a>
            </Button>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-20 w-full"
            variants={itemVariants}
          >
            {[
              { icon: Zap, label: "Instant Summary" },
              { icon: Brain, label: "AI Insights" },
              { icon: Shield, label: "Secure Vault" },
              { icon: Rocket, label: "Hyper-Growth" }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-primary group hover:purple-gradient hover:text-white transition-all duration-500">
                  <feature.icon className="w-6 h-6" />
                </div>
                <span className="text-white/40 text-sm font-semibold tracking-wider uppercase">{feature.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/20 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-primary/10 rounded-full" />
      </div>
    </section>
  );
}
