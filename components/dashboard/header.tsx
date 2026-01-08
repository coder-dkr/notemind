'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

interface DashboardHeaderProps {
  heading?: string;
  text?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({
  heading,
  text,
  children,
}: DashboardHeaderProps) {
  const router = useRouter();

  const createNewNote = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }
      
      const noteId = uuidv4();
      const userId = session.user.id;
      
      const { error } = await supabase
        .from('notes')
        .insert({
          id: noteId,
          title: 'Untitled Note',
          content: '',
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          revision_scheduled: false,
        });
        
      if (error) {
        console.error('Error creating note:', error);
        return;
      }
      
      router.push(`/dashboard/note/${noteId}`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-10">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {heading && (
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2">
            {heading}<span className="text-primary">.</span>
          </h1>
        )}
        {text && <p className="text-white/40 font-medium text-lg">{text}</p>}
      </motion.div>
      
      <motion.div 
        className="flex items-center gap-3"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {heading === 'Dashboard' && (
          <Button 
            onClick={createNewNote}
            className="purple-gradient h-12 px-6 rounded-2xl border-0 shadow-lg shadow-primary/20 hover:scale-105 transition-all duration-300 font-bold"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create Note
          </Button>
        )}
        {children}
      </motion.div>
    </div>
  );
}
