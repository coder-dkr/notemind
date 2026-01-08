'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { NoteCard } from '@/components/notes/note-card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Sparkles, } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  revision_scheduled: boolean;
  revision_date: string | null;
  summary: string | null;
}

export function NotesGrid() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const { data: notes, isLoading, error, refetch } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Not authenticated');
      }
      
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', session.user.id)
        .order('updated_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      return data as Note[];
    },
    staleTime: 1000 * 60 * 5,
  });

  const filteredNotes = notes?.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        note.content.toLowerCase().includes(searchQuery.toLowerCase());
                        
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'revision') return matchesSearch && note.revision_scheduled;
    
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
        </div>
        <p className="text-white/40 font-bold animate-pulse uppercase tracking-widest text-xs">Accessing Neural Vault...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 glass-card border-destructive/20 text-destructive rounded-[2rem] text-center">
        <p className="font-bold">Neural link failed. Please reconnect.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <motion.div 
        className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative w-full lg:w-[400px] group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30 group-focus-within:text-primary transition-colors" />
          <Input
            type="search"
            placeholder="Search through your thoughts..."
            className="w-full h-14 pl-12 bg-white/5 border-white/5 focus:border-primary/50 focus:ring-primary/20 rounded-2xl text-white placeholder:text-white/20 transition-all font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="all" className="w-full lg:w-auto" onValueChange={setActiveTab}>
          <TabsList className="bg-white/5 border border-white/5 p-1 rounded-2xl h-14 w-full lg:w-auto">
            <TabsTrigger value="all" className="rounded-xl px-8 h-full data-[state=active]:purple-gradient data-[state=active]:text-white data-[state=active]:shadow-lg font-bold transition-all text-white/40">
              All Notes
            </TabsTrigger>
            <TabsTrigger value="revision" className="rounded-xl px-8 h-full data-[state=active]:purple-gradient data-[state=active]:text-white data-[state=active]:shadow-lg font-bold transition-all text-white/40">
              Revision
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {filteredNotes?.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-32 glass-card rounded-[3rem] border-white/5"
          >
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-white/10" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Neural Void Detected</h3>
            <p className="text-white/40 font-medium max-w-sm mx-auto">
              {searchQuery 
                ? "No thoughts match your neural probe." 
                : "Your neural vault is empty. Capture your first thought to begin."}
            </p>
          </motion.div>
        ) : (
          <motion.div 
            className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
            layout
          >
            {filteredNotes?.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                layout
              >
                <NoteCard note={note} onUpdate={refetch} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
