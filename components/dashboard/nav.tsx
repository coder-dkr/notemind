'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Brain, Settings, PanelLeft, Sparkles, LayoutDashboard, Network, Lightbulb, Zap } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function DashboardNav() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/dump', label: 'Dump Tingles', icon: Zap, highlight: true },
    { href: '/dashboard/thoughts', label: 'Thought Vault', icon: Brain },
    { href: '/dashboard/cognitive-map', label: 'Cognitive Map', icon: Network },
    { href: '/dashboard/insights', label: 'Insights', icon: Lightbulb },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <motion.div 
      className={cn(
        "relative border-r border-white/5 bg-background/50 backdrop-blur-xl h-[calc(100vh-4rem)] flex flex-col",
        isCollapsed ? "w-[80px]" : "w-[280px]"
      )}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex-1 flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between mb-6 px-2">
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs font-black uppercase tracking-widest text-white/30"
            >
              Menu
            </motion.span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          >
            <PanelLeft className={cn("h-5 w-5 transition-transform duration-500", isCollapsed && "rotate-180")} />
          </Button>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const isHighlight = 'highlight' in item && item.highlight;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300 group cursor-pointer relative",
                    isActive 
                      ? "text-white" 
                      : isHighlight
                        ? "text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/20"
                        : "text-white/40 hover:text-white hover:bg-white/5"
                  )}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="nav-active"
                      className={cn(
                        "absolute inset-0 rounded-2xl -z-10 shadow-lg",
                        isHighlight 
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-500/20" 
                          : "purple-gradient shadow-primary/20"
                      )}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <item.icon className={cn(
                    "h-5 w-5 transition-colors duration-300",
                    isActive ? "text-white" : isHighlight ? "text-amber-400" : "group-hover:text-primary"
                  )} />
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="font-bold tracking-tight"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isHighlight && !isActive && !isCollapsed && (
                    <span className="ml-auto text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                      New
                    </span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-white/5">
        {!isCollapsed ? (
          <div className="glass rounded-3xl p-4 border-primary/20 bg-primary/5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-white uppercase tracking-tight">Cognitive Pro</span>
            </div>
            <p className="text-[10px] text-white/40 font-medium leading-tight mb-3">
              Unlock advanced cognitive analysis and deeper insights.
            </p>
            <Button size="sm" className="w-full text-[10px] h-8 purple-gradient font-black uppercase tracking-wider">
              Upgrade Now
            </Button>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-2xl purple-gradient flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
