'use client';

import Link from 'next/link';
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
      // Get user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }
      
      const noteId = uuidv4();
      const userId = session.user.id;
      
      // Create new note
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
      
      // Navigate to the new note
      router.push(`/dashboard/note/${noteId}`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {heading && <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>}
        {text && <p className="text-muted-foreground">{text}</p>}
      </motion.div>
      
      <motion.div 
        className="flex items-center gap-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {heading === 'Dashboard' && (
          <Button onClick={createNewNote}>
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        )}
        {children}
      </motion.div>
    </div>
  );
}