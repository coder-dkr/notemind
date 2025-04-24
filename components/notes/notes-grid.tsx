'use client';

import {  useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { NoteCard } from '@/components/notes/note-card';
// import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

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
    staleTime: 1000 * 60 * 5, // 5 minutes
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
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-muted mb-4"></div>
          <div className="h-4 w-32 bg-muted rounded mb-2"></div>
          <div className="h-3 w-24 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded-md">
        Error loading notes. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search notes..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Notes</TabsTrigger>
            <TabsTrigger value="revision">To Revise</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filteredNotes?.length === 0 ? (
        <div className="text-center p-12 border rounded-lg">
          <h3 className="text-lg font-medium mb-2">No notes found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery 
              ? "No notes match your search query." 
              : "You don't have any notes yet. Create your first note to get started!"}
          </p>
        </div>
      ) : (
        <motion.div 
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredNotes?.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <NoteCard note={note} onUpdate={refetch} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}