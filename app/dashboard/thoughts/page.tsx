'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardShell } from '@/components/dashboard/shell';
import { DashboardHeader } from '@/components/dashboard/header';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Sparkles, 
  Brain, 
  Calendar, 
  Trash2, 
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function ThoughtsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: thoughts, isLoading, refetch } = useQuery({
    queryKey: ['thoughts'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];
      
      const { data } = await supabase
        .from('thoughts')
        .select('*')
        .eq('user_id', session.user.id)
        .order('updated_at', { ascending: false });
      
      return data || [];
    }
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      await supabase.from('thoughts').delete().eq('id', deleteId);
      refetch();
    } catch (error) {
      console.error('Error deleting thought:', error);
    } finally {
      setDeleteId(null);
    }
  };

  const filteredThoughts = thoughts?.filter(thought => 
    thought.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thought.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  return (
    <DashboardShell>
      <DashboardHeader 
        heading="Thought Vault" 
        text="All your captured thoughts and cognitive data."
      >
        <Link href="/dashboard/thought/new">
          <Button className="purple-gradient h-12 px-6 rounded-2xl border-0 shadow-lg shadow-primary/20 hover:scale-105 transition-all duration-300 font-bold">
            <Plus className="mr-2 h-5 w-5" />
            New Thought
          </Button>
        </Link>
      </DashboardHeader>

      <div className="space-y-8 mt-8">
        {/* Search */}
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30 group-focus-within:text-primary transition-colors" />
          <Input
            type="search"
            placeholder="Search through your thoughts..."
            className="w-full h-14 pl-12 bg-white/5 border-white/5 focus:border-primary/50 focus:ring-primary/20 rounded-2xl text-white placeholder:text-white/20 transition-all font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
            </div>
            <p className="text-white/40 font-bold animate-pulse uppercase tracking-widest text-xs mt-4">
              Loading thoughts...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredThoughts?.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 glass-card rounded-[3rem] border-white/5"
          >
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="w-10 h-10 text-white/10" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">
              {searchQuery ? 'No matching thoughts' : 'Your vault is empty'}
            </h3>
            <p className="text-white/40 font-medium max-w-sm mx-auto mb-6">
              {searchQuery 
                ? 'Try a different search term.' 
                : 'Start capturing your thoughts to build your cognitive map.'}
            </p>
            {!searchQuery && (
              <Link href="/dashboard/thought/new">
                <Button className="purple-gradient rounded-xl">
                  <Plus className="w-4 h-4 mr-2" />
                  Capture Your First Thought
                </Button>
              </Link>
            )}
          </motion.div>
        )}

        {/* Thoughts Grid */}
        <AnimatePresence mode="popLayout">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredThoughts?.map((thought, index) => (
              <motion.div
                key={thought.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <div className="h-full glass-card rounded-[2rem] border-white/5 hover:border-primary/30 transition-all duration-500 overflow-hidden">
                  <Link href={`/dashboard/thought/${thought.id}`} className="block p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Brain className="w-6 h-6 text-white/40 group-hover:text-primary" />
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-white/20 group-hover:text-white transition-all opacity-0 group-hover:opacity-100" />
                    </div>
                    
                    <h3 className="text-xl font-black text-white group-hover:text-primary transition-colors mb-2 line-clamp-1">
                      {thought.title || 'Untitled Thought'}
                    </h3>
                    
                    <p className="text-white/40 text-sm line-clamp-3 mb-4">
                      {truncateContent(thought.content)}
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-white/30">
                        <Calendar className="h-3 w-3" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          {format(new Date(thought.updated_at), 'MMM d, yyyy')}
                        </span>
                      </div>
                      {thought.emotional_tone && (
                        <div className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest capitalize">
                          {thought.emotional_tone}
                        </div>
                      )}
                    </div>
                  </Link>
                  
                  <div className="px-8 pb-6 pt-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        setDeleteId(thought.id);
                      }}
                      className="text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-xl w-full"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="glass border-white/10 rounded-[2rem] p-10 max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-white">Delete Thought?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/40 font-medium text-lg leading-relaxed">
              This will permanently delete this thought and all associated cognitive nodes. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-4 pt-4">
            <AlertDialogCancel className="h-12 rounded-2xl glass border-white/5 hover:bg-white/5 text-white font-bold px-6">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="h-12 rounded-2xl bg-destructive hover:bg-destructive/80 text-white font-bold px-6"
            >
              Delete Forever
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardShell>
  );
}
