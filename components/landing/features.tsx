'use client';

import { motion } from 'framer-motion';
import { Brain, FileText, Layers, Upload, Sparkles, Search, Globe, Lock } from 'lucide-react';

export function LandingFeatures() {
  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI-Powered Summaries",
      description: "Get instant, high-quality summaries of your long notes using state-of-the-art AI models."
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: "Semantic Organization",
      description: "Our AI automatically categorizes and tags your notes based on their actual meaning and context."
    },
    {
      icon: <Upload className="h-6 w-6" />,
      title: "Smart Import",
      description: "Seamlessly import Word documents, PDFs, and even images. We handle the extraction for you."
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Content Generation",
      description: "Stuck? Let our AI help you expand your thoughts or generate new ideas based on your existing notes."
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "Contextual Search",
      description: "Find exactly what you need with AI-driven search that understands what you're looking for, not just keywords."
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Cross-Device Sync",
      description: "Your notes are always with you. Sync seamlessly across all your devices in real-time."
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Enterprise Security",
      description: "Your data is encrypted and private. We use industry-standard security to keep your thoughts safe."
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Rich Export",
      description: "Export your notes and summaries in various formats including Markdown, PDF, and HTML."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="w-full py-24 md:py-32 bg-[#0d0221]/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h2 className="text-3xl font-black tracking-tighter sm:text-5xl md:text-6xl text-white">
              Unleash Your <span className="text-gradient">Productivity</span>
            </h2>
            <p className="max-w-[800px] text-white/50 md:text-xl font-medium mx-auto">
              Notemind.ai isn't just a note-taking app. It's an extension of your brain, powered by the most advanced AI.
            </p>
          </motion.div>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="glass-card group p-8 rounded-[2rem] hover:bg-primary/5 transition-all duration-500 cursor-default border-white/5 hover:border-primary/20"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="w-12 h-12 rounded-2xl purple-gradient flex items-center justify-center text-white mb-6 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-primary transition-colors">{feature.title}</h3>
              <p className="text-white/40 leading-relaxed font-medium">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
