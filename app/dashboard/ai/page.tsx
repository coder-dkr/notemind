'use client';

import { DashboardShell } from '@/components/dashboard/shell';
import { DashboardHeader } from '@/components/dashboard/header';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Zap, MessageSquare, Search, Cpu, AlertTriangle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AIPage() {
  const aiFeatures = [
    {
      title: "Concept Extraction",
      description: "Extract beliefs, goals, fears, values, and assumptions from your thoughts automatically.",
      icon: Brain,
      color: "from-purple-500 to-indigo-500",
      status: "Active"
    },
    {
      title: "Contradiction Detection",
      description: "Find conflicting ideas and beliefs across your cognitive graph.",
      icon: AlertTriangle,
      color: "from-red-500 to-rose-500",
      status: "Active"
    },
    {
      title: "Bias Detection",
      description: "Identify cognitive biases like confirmation bias, sunk cost fallacy, and more.",
      icon: Eye,
      color: "from-amber-500 to-orange-500",
      status: "Active"
    },
    {
      title: "Pattern Recognition",
      description: "Discover recurring themes and patterns in your thinking over time.",
      icon: Search,
      color: "from-blue-500 to-cyan-500",
      status: "Coming Soon"
    }
  ];

  return (
    <DashboardShell>
      <DashboardHeader 
        heading="Cognitive Engine" 
        text="AI-powered analysis to help you think more clearly."
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
              <span className="text-xs font-black uppercase tracking-widest text-primary">Cognitive Analysis Active</span>
            </div>
            <h2 className="text-4xl font-black text-white mb-6 leading-tight">
              Ready to amplify your <span className="text-primary">clarity?</span>
            </h2>
            <p className="text-white/40 text-lg font-medium mb-10 leading-relaxed">
              KeraMind analyzes every thought you capture to extract concepts, detect biases, 
              and find contradictions. Start by capturing a new thought.
            </p>
            <Link href="/dashboard/thought/new">
              <Button size="lg" className="h-14 px-10 rounded-2xl purple-gradient font-black uppercase tracking-wider text-sm shadow-xl shadow-primary/20">
                Capture New Thought
              </Button>
            </Link>
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
              className="group p-8 rounded-[2.5rem] glass border-white/5 hover:border-primary/30 transition-all duration-500"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-black text-xl text-white">{feature.title}</h3>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                  feature.status === 'Active' 
                    ? 'bg-green-500/10 text-green-400' 
                    : 'bg-white/5 text-white/40'
                }`}>
                  {feature.status}
                </span>
              </div>
              <p className="text-white/40 text-sm font-medium leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-white flex items-center gap-3">
            <Zap className="w-5 h-5 text-primary" />
            How Cognitive Analysis Works
          </h3>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Capture Thought',
                description: 'Write freely about what\'s on your mind - goals, decisions, concerns, ideas.'
              },
              {
                step: '02',
                title: 'AI Analysis',
                description: 'KeraMind extracts concepts, identifies biases, and detects contradictions.'
              },
              {
                step: '03',
                title: 'Gain Clarity',
                description: 'Review insights, resolve contradictions, and improve your thinking patterns.'
              }
            ].map((item) => (
              <div 
                key={item.step} 
                className="p-6 rounded-2xl bg-white/5 border border-white/5"
              >
                <span className="text-4xl font-black text-primary/30">{item.step}</span>
                <h4 className="font-bold text-white mt-2 mb-2">{item.title}</h4>
                <p className="text-sm text-white/40">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Active Modules */}
        <div className="pt-8">
          <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-primary" />
            Analysis Modules
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { name: 'Semantic Analysis', active: true },
              { name: 'Emotional Tone Detection', active: true },
              { name: 'Cognitive Bias Scanning', active: true },
              { name: 'Contradiction Detection', active: true },
              { name: 'Pattern Recognition', active: false },
              { name: 'Growth Tracking', active: false },
            ].map((module) => (
              <div key={module.name} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5">
                <span className="font-bold text-white/60">{module.name}</span>
                <div className={`w-12 h-6 rounded-full relative transition-colors ${
                  module.active ? 'bg-primary/20' : 'bg-white/10'
                }`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full shadow-sm transition-all ${
                    module.active 
                      ? 'right-1 bg-primary' 
                      : 'left-1 bg-white/30'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
