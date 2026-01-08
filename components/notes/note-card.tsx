'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { MoreVertical, Sparkles, Trash2, Edit2, Calendar } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  revision_scheduled: boolean;
  revision_date: string | null;
}

interface NoteCardProps {
  note: Note;
  onUpdate: () => void;
}

export function NoteCard({ note, onUpdate }: NoteCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRevisionScheduled, setIsRevisionScheduled] = useState(note.revision_scheduled);

  const truncateText = (text: string, maxLength: number) => {
    const strippedText = text.replace(/<[^>]*>/g, '');
    if (strippedText.length <= maxLength) return strippedText;
    return `${strippedText.slice(0, maxLength)}...`;
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', note.id);
        
      if (error) {
        console.error('Error deleting note:', error);
        return;
      }
      
      onUpdate();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const toggleRevision = async () => {
    try {
      const newStatus = !isRevisionScheduled;
      const { error } = await supabase
        .from('notes')
        .update({ 
          revision_scheduled: newStatus,
          revision_date: newStatus ? new Date().toISOString() : null,
        })
        .eq('id', note.id);
        
      if (error) {
        console.error('Error updating revision status:', error);
        return;
      }
      
      setIsRevisionScheduled(newStatus);
      onUpdate();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="h-full"
      >
        <Card className="h-full flex flex-col overflow-hidden glass-card border-white/5 group hover:border-primary/30 transition-all duration-500 rounded-[2rem] relative">
          {isRevisionScheduled && (
            <div className="absolute top-0 right-0 p-4">
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(139,92,246,0.5)] animate-pulse" />
            </div>
          )}

          <CardHeader className="flex flex-row items-start justify-between p-8 pb-4">
            <Link href={`/dashboard/note/${note.id}`} className="flex-1">
              <CardTitle className="text-xl font-black text-white group-hover:text-primary transition-colors line-clamp-1 leading-tight">
                {note.title || 'Untitled Note'}
              </CardTitle>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white/5 text-white/20 hover:text-white transition-all">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass border-white/10 rounded-2xl p-2 min-w-[160px]">
                <DropdownMenuItem asChild className="rounded-xl focus:bg-primary/20 focus:text-white cursor-pointer py-3">
                  <Link href={`/dashboard/note/${note.id}`} className="flex items-center gap-2 font-bold">
                    <Edit2 className="w-4 h-4" />
                    Edit Note
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="rounded-xl focus:bg-destructive/20 focus:text-destructive cursor-pointer py-3 text-destructive font-bold flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete Note
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>

          <CardContent className="px-8 py-0 flex-1">
            <Link href={`/dashboard/note/${note.id}`} className="block">
              <p className="text-white/40 font-medium text-sm leading-relaxed line-clamp-3">
                {truncateText(note.content, 150) || 'No neural data captured...'}
              </p>
            </Link>
          </CardContent>

          <CardFooter className="p-8 pt-6 flex flex-col gap-6">
            <div className="w-full h-px bg-white/5" />
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-white/30">
                <Calendar className="h-3 w-3" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {format(new Date(note.updated_at), 'MMM d, yyyy')}
                </span>
              </div>
              
              <div 
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-500 cursor-pointer group/rev",
                  isRevisionScheduled 
                    ? "bg-primary/10 border-primary/20 text-primary" 
                    : "bg-white/5 border-white/5 text-white/20 hover:text-white/40"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  toggleRevision();
                }}
              >
                <Sparkles className={cn("h-3 w-3", isRevisionScheduled && "animate-pulse")} />
                <span className="text-[10px] font-black uppercase tracking-widest">Revision</span>
                <Checkbox 
                  checked={isRevisionScheduled}
                  onCheckedChange={toggleRevision}
                  className="hidden"
                />
              </div>
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="glass border-white/10 rounded-[2rem] p-10 max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-white">Erase Thought?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/40 font-medium text-lg leading-relaxed">
              This will permanently delete the note from your neural vault. This action cannot be reversed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-4 pt-4">
            <AlertDialogCancel className="h-12 rounded-2xl glass border-white/5 hover:bg-white/5 text-white font-bold px-6">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="h-12 rounded-2xl bg-destructive hover:bg-destructive/80 text-white font-bold px-6">
              Delete Forever
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
