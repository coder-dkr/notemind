'use client';

import { motion } from 'framer-motion';
import { Brain, Sparkles, Zap, Shield, Cpu, Workflow, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export function LandingFeatures() {
  const features = [
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Dump Tingles",
      description: "Chat freely, dump your chaotic thoughts. AI structures them into flows, action items, goals, and visual mind maps.",
      size: "large",
      gradient: "from-amber-500/20 to-orange-500/20",
      highlight: true,
      link: "/dashboard/dump"
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Cognitive Graph",
      description: "Build a visual map of your beliefs, goals, and decisions. See how your thoughts connect and evolve.",
      size: "small",
      gradient: "from-purple-500/20 to-indigo-500/20"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Contradiction Detection",
      description: "Automatically identify conflicting beliefs and goals in your thinking patterns.",
      size: "small",
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Bias Detection",
      description: "Uncover cognitive biases and blind spots that may be affecting your decisions.",
      size: "small",
      gradient: "from-pink-500/20 to-rose-500/20"
    },
    {
      icon: <Workflow className="h-6 w-6" />,
      title: "Concept Extraction",
      description: "AI extracts key concepts, values, and assumptions from your thoughts automatically.",
      size: "small",
      gradient: "from-amber-500/20 to-orange-500/20"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Private & Secure",
      description: "Your cognitive data is encrypted and owned by you. No training on your data ever.",
      size: "small",
      gradient: "from-emerald-500/20 to-teal-500/20"
    },
    {
      icon: <Cpu className="h-6 w-6" />,
      title: "Persistent Memory",
      description: "Unlike stateless AI chats, KeraMind remembers your goals, values, and past decisions.",
      size: "large",
      gradient: "from-violet-500/20 to-fuchsia-500/20"
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

    return (
    <section className="w-full py-24 md:py-32 relative overflow-hidden">
      <div className="container px-4 md:px-6">

        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold tracking-wide uppercase mb-4">
              The Ecosystem
            </div>
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-white">
              Think <span className="text-gradient">Clearly</span>
            </h2>
            <p className="max-w-[700px] text-white/50 text-xl font-medium mx-auto leading-relaxed">
              A cognitive operating system that helps you understand and improve your thinking.
            </p>
          </motion.div>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => {
            const isHighlight = 'highlight' in feature && feature.highlight;
            const hasLink = 'link' in feature && feature.link;
            
            const CardContent = (
              <>
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} ${isHighlight ? 'opacity-50' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-500`} />
                
                {isHighlight && (
                  <div className="absolute top-4 right-4 z-20">
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-amber-500 text-white shadow-lg">
                      ✨ Featured
                    </span>
                  </div>
                )}
                
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 border shadow-xl transition-all duration-500 ${
                    isHighlight 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 border-amber-400/30' 
                      : 'bg-white/5 border-white/10 group-hover:bg-primary'
                  }`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-black mb-3 text-white tracking-tight">{feature.title}</h3>
                  <p className={`leading-relaxed font-medium text-lg transition-colors ${
                    isHighlight ? 'text-white/70' : 'text-white/40 group-hover:text-white/60'
                  }`}>
                    {feature.description}
                  </p>
                </div>
                
                <div className={`relative z-10 mt-4 flex items-center gap-2 transition-all duration-500 ${
                  isHighlight 
                    ? 'text-white opacity-100' 
                    : 'text-primary opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0'
                }`}>
                  <span className="text-sm font-bold uppercase tracking-wider">
                    {isHighlight ? 'Try It Now' : 'Explore Feature'}
                  </span>
                  <Zap className="w-4 h-4" />
                </div>
              </>
            );
            
            return (
              <motion.div 
                key={index}
                className={`glass-card group p-8 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-between transition-all duration-500 ${
                  feature.size === 'large' ? 'md:col-span-2' : 'md:col-span-1'
                } ${
                  isHighlight 
                    ? 'border-2 border-amber-500/50 hover:border-amber-400' 
                    : 'border-white/5 hover:border-primary/30'
                }`}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                {hasLink ? (
                  <Link href={feature.link as string} className="contents">
                    {CardContent}
                  </Link>
                ) : (
                  CardContent
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
