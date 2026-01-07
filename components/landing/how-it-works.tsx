'use client';

import { motion } from 'framer-motion';
import { PenLine, Cpu, Share2 } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: <PenLine className="w-8 h-8" />,
      title: "Capture Everything",
      description: "Write, import, or speak. Notemind captures your ideas in any format without friction.",
      color: "from-blue-500 to-cyan-400"
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "AI Analysis",
      description: "Our neural engine processes your notes, extracting key insights and linking related concepts.",
      color: "from-purple-500 to-indigo-400"
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      title: "Actionable Insights",
      description: "Get summaries, project plans, and creative sparks delivered right when you need them.",
      color: "from-pink-500 to-rose-400"
    }
  ];

  return (
    <section className="w-full py-24 relative">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6">
            Simple. <span className="text-gradient">Powerful.</span> Seamless.
          </h2>
          <p className="text-white/50 text-xl font-medium max-w-2xl mx-auto">
            From raw thought to structured genius in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative group"
            >
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-[2px] bg-gradient-to-r from-primary/50 to-transparent -translate-x-12 z-0" />
              )}
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${step.color} p-[1px] mb-8 group-hover:scale-110 transition-transform duration-500 shadow-2xl shadow-primary/20`}>
                  <div className="w-full h-full rounded-3xl bg-[#0d0221] flex items-center justify-center text-white">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{step.title}</h3>
                <p className="text-white/40 text-lg font-medium leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
