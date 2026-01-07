'use client';

import { DashboardShell } from '@/components/dashboard/shell';
import { DashboardHeader } from '@/components/dashboard/header';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Zap, MessageSquare, Wand2, Search, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AIPage() {
  const aiFeatures = [
    {
      title: "Neural Synthesis",
      description: "Convert long recordings into structured, actionable insights instantly.",
      icon: Brain,
      color: "from-purple-500 to-indigo-500",
      status: "Active"
    },
    {
      title: "Pattern Discovery",
      description: "Find hidden connections across your entire note history.",
      icon: Search,
      color: "from-blue-500 to-cyan-500",
      status: "Processing"
    },
    {
      title: "Smart Summaries",
      description: "Get the gist of any note with AI-generated key takeaways.",
      icon: Zap,
      color: "from-amber-500 to-orange-500",
      status: "Active"
    },
    {
      title: "Conversational Recall",
      description: "Ask questions about your notes and get direct answers.",
      icon: MessageSquare,
      color: "from-pink-500 to-rose-500",
      status: "Beta"
    }
  ];

  return (
    <DashboardShell>
      <DashboardHeader 
        heading="AI Assistant" 
        text="Harness the power of neural processing for your thoughts."
      />
      
      <div className="mt-10 space-y-12">
        {/* Hero AI Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[3rem] p-12 glass border-white/5 bg-primary/5"
        >
          <div className="absolute top-0 right-0 p-8">
            <Cpu className="w-24 h-24 text-primary/10 animate-pulse" />
          </div>
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-black uppercase tracking-widest text-primary">Neural Link Active</span>
            </div>
            <h2 className="text-4xl font-black text-white mb-6 leading-tight">
              Ready to amplify your <span className="text-primary">intelligence?</span>
            </h2>
            <p className="text-white/40 text-lg font-medium mb-10 leading-relaxed">
              Your AI assistant has indexed 12 recent thoughts. Use the tools below to synthesize new insights or explore patterns.
            </p>
            <Button size="lg" className="h-14 px-10 rounded-2xl purple-gradient font-black uppercase tracking-wider text-sm shadow-xl shadow-primary/20">
              Launch Global Probe
            </Button>
          </div>
        </motion.div>

        {/* AI Capabilities Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {aiFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 rounded-[2.5rem] glass border-white/5 hover:border-primary/30 transition-all duration-500 cursor-pointer"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-black text-xl text-white">{feature.title}</h3>
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-white/5 text-white/40">
                  {feature.status}
                </span>
              </div>
              <p className="text-white/40 text-sm font-medium leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Quick Tools Section */}
        <div className="pt-8">
          <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
            <Wand2 className="w-5 h-5 text-primary" />
            Active Neural Modules
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            {['Semantic Search', 'Contextual Linking', 'Sentiment Analysis'].map((tool) => (
              <div key={tool} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5">
                <span className="font-bold text-white/60">{tool}</span>
                <div className="w-12 h-6 rounded-full bg-primary/20 relative">
                  <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-primary shadow-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
