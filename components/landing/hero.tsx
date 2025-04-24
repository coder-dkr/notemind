'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Edit3, FileText } from 'lucide-react';

export function LandingHero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <motion.div 
            className="flex flex-col justify-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-2">
              <motion.h1 
                className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Transform Your Notes with AI
              </motion.h1>
              <motion.p 
                className="max-w-[600px] text-muted-foreground md:text-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Create, organize, and summarize your notes with the power of AI. Never miss important information again.
              </motion.p>
            </div>
            <motion.div 
              className="flex flex-col gap-2 min-[400px]:flex-row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Button size="lg" asChild>
                <a href="/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/login">Login</a>
              </Button>
            </motion.div>
          </motion.div>
          <motion.div 
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="grid grid-cols-2 gap-4 md:grid-cols-2">
              <div className="grid gap-4">
                <div className="rounded-lg bg-card p-8 shadow-lg">
                  <Edit3 className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold">Smart Note-Taking</h3>
                  <p className="text-muted-foreground">Create and edit notes with a beautiful interface</p>
                </div>
                <div className="rounded-lg bg-card p-8 shadow-lg">
                  <FileText className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold">Import Documents</h3>
                  <p className="text-muted-foreground">Import notes from DOCX and PDF files</p>
                </div>
              </div>
              <div className="grid gap-4">
                <div className="rounded-lg bg-card p-8 shadow-lg">
                  <Brain className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold">AI Summaries</h3>
                  <p className="text-muted-foreground">Get instant summaries of your notes with AI</p>
                </div>
                <div className="rounded-lg bg-card p-8 shadow-lg">
                  <svg
                    className="h-12 w-12 text-primary mb-4"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect height="12" rx="2" width="12" x="6" y="6" />
                    <path d="M15 3v2" />
                    <path d="M19 7h2" />
                    <path d="M19 15h2" />
                    <path d="M15 19v2" />
                    <path d="M7 19v2" />
                    <path d="M3 15h2" />
                    <path d="M3 7h2" />
                    <path d="M7 3v2" />
                  </svg>
                  <h3 className="text-xl font-bold">Custom Themes</h3>
                  <p className="text-muted-foreground">Personalize your experience with custom themes</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}