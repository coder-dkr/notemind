'use client';

import { motion } from 'framer-motion';
import { Brain, Sparkles, Zap, Shield, Cpu, Workflow } from 'lucide-react';

export function LandingFeatures() {
  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Neural Synapse",
      description: "AI that understands context, not just keywords. It links your thoughts across all your notes.",
      size: "large",
      gradient: "from-purple-500/20 to-indigo-500/20"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Instant Digest",
      description: "Convert 2-hour meetings into 2-minute actionable summaries instantly.",
      size: "small",
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Creative Catalyst",
      description: "Get AI-powered brainstorming partners that help you expand on half-baked ideas.",
      size: "small",
      gradient: "from-pink-500/20 to-rose-500/20"
    },
    {
      icon: <Workflow className="h-6 w-6" />,
      title: "Automated Flow",
      description: "Automatically tag, categorize, and organize your digital life without lifting a finger.",
      size: "small",
      gradient: "from-amber-500/20 to-orange-500/20"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Vault Security",
      description: "Military-grade encryption for your most private thoughts. Your data, your rules.",
      size: "small",
      gradient: "from-emerald-500/20 to-teal-500/20"
    },
    {
      icon: <Cpu className="h-6 w-6" />,
      title: "Deep Search",
      description: "Find that one obscure idea from 3 years ago using semantic natural language search.",
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
              Unleash Your <span className="text-gradient">Potential</span>
            </h2>
            <p className="max-w-[700px] text-white/50 text-xl font-medium mx-auto leading-relaxed">
              Experience the power of a second brain that works as fast as you do.
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
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className={`glass-card group p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden flex flex-col justify-between hover:border-primary/30 transition-all duration-500 ${
                feature.size === 'large' ? 'md:col-span-2' : 'md:col-span-1'
              }`}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-6 border border-white/10 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black mb-3 text-white tracking-tight">{feature.title}</h3>
                <p className="text-white/40 leading-relaxed font-medium text-lg group-hover:text-white/60 transition-colors">
                  {feature.description}
                </p>
              </div>
              
              <div className="relative z-10 mt-4 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-10px] group-hover:translate-x-0">
                <span className="text-sm font-bold uppercase tracking-wider">Explore Feature</span>
                <Zap className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
