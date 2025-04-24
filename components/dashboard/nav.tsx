'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FileText, Home, Settings, PanelLeft } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export function DashboardNav() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.div 
      className={cn(
        "relative border-r bg-background h-[calc(100vh-4rem)]",
        isCollapsed ? "w-[60px]" : "w-[240px]"
      )}
      layout
      transition={{ duration: 0.2 }}
    >
      <div className="flex h-full flex-col gap-2 p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute right-2 top-2"
        >
          <PanelLeft className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
        </Button>
        
        <div className="mt-8 space-y-2">
          <Button
            variant="ghost"
            asChild
            className={cn(
              "w-full justify-start transition-all",
              pathname === '/dashboard' && "bg-muted",
              isCollapsed && "justify-center px-2"
            )}
          >
            <Link href="/dashboard">
              <Home className="mr-2 h-5 w-5" />
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
          </Button>
          
          <Button
            variant="ghost"
            asChild
            className={cn(
              "w-full justify-start transition-all",
              pathname === '/dashboard/notes' && "bg-muted",
              isCollapsed && "justify-center px-2"
            )}
          >
            <Link href="/dashboard/notes">
              <FileText className="mr-2 h-5 w-5" />
              {!isCollapsed && <span>Notes</span>}
            </Link>
          </Button>
          
          <Button
            variant="ghost"
            asChild
            className={cn(
              "w-full justify-start transition-all",
              pathname === '/dashboard/settings' && "bg-muted",
              isCollapsed && "justify-center px-2"
            )}
          >
            <Link href="/dashboard/settings">
              <Settings className="mr-2 h-5 w-5" />
              {!isCollapsed && <span>Settings</span>}
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}