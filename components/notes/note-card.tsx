'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Clock, MoreVertical } from 'lucide-react';
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
    // Remove HTML tags for display
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
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card className="h-full flex flex-col overflow-hidden group">
        <CardHeader className="flex flex-row items-start justify-between p-4 pb-0">
          <Link href={`/dashboard/note/${note.id}`} className="w-full">
            <CardTitle className="line-clamp-1 hover:text-primary transition-colors">
              {note.title || 'Untitled Note'}
            </CardTitle>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/note/${note.id}`}>
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="p-4 flex-1">
          <Link href={`/dashboard/note/${note.id}`} className="block">
            <p className="text-muted-foreground text-sm line-clamp-3">
              {truncateText(note.content, 120) || 'No content'}
            </p>
          </Link>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex-wrap gap-2">
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {format(new Date(note.updated_at), 'MMM d, yyyy')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <label 
                htmlFor={`revision-${note.id}`}
                className="text-xs text-muted-foreground cursor-pointer"
              >
                Revision
              </label>
              <Checkbox 
                id={`revision-${note.id}`}
                checked={isRevisionScheduled}
                onCheckedChange={toggleRevision}
              />
            </div>
          </div>
        </CardFooter>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the note. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}