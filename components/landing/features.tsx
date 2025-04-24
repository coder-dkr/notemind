'use client';

import { motion } from 'framer-motion';
import { Brain, FileText, Layers, Upload } from 'lucide-react';

export function LandingFeatures() {
  const features = [
    {
      icon: <Brain className="h-10 w-10" />,
      title: "AI-Powered Summaries",
      description: "Get instant summaries of your notes powered by advanced AI technology."
    },
    {
      icon: <Layers className="h-10 w-10" />,
      title: "Organize Your Thoughts",
      description: "Easily organize your notes and schedule them for revision."
    },
    {
      icon: <Upload className="h-10 w-10" />,
      title: "Import Documents",
      description: "Import notes from Microsoft Word documents and PDF files."
    },
    {
      icon: <FileText className="h-10 w-10" />,
      title: "Rich Text Editing",
      description: "Create beautifully formatted notes with our rich text editor."
    }
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Features That Make a Difference</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Everything you need to take your note-taking to the next level
            </p>
          </motion.div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-12">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="flex flex-col items-center space-y-4 rounded-lg p-6 bg-card shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="text-primary">{feature.icon}</div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-center text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}