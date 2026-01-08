'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';

import { ArrowLeft, FileUp, Loader2, Save, Sparkles, AlertCircle, Calendar, Zap } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { summarizeText } from '@/lib/deepseek';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface NoteEditorProps {
  id: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  revision_scheduled: boolean;
  revision_date: string | null;
  summary: string | null;
}

export function NoteEditor({ id }: NoteEditorProps) {
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNote = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/login');
          return;
        }
        
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .eq('id', id)
          .single();
            
        if (error) {
          if (error.code === 'PGRST116') {
            setError('Note not found. It may have been deleted or you may not have permission to view it.');
          } else {
            setError('Failed to load note. Please try again later.');
            console.error('Error fetching note:', error);
          }
          return;
        }
        
        if (data.user_id !== session.user.id) {
          setError('You do not have permission to view this note.');
          router.push('/dashboard');
          return;
        }
        
        setNote(data);
      } catch (error) {
        setError('An unexpected error occurred. Please try again later.');
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNote();
  }, [id, router]);

  const handleChange = (field: keyof Note, value: string | boolean) => {
    if (!note) return;
    
    const updatedNote = { ...note, [field]: value, updated_at: new Date().toISOString() };
    setNote(updatedNote);
    
    if (autoSave) {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
      
      const timeout = setTimeout(() => {
        saveNote(updatedNote);
      }, 1500);
      
      setSaveTimeout(timeout);
    }
  };

  const saveNote = async (noteToSave = note) => {
    if (!noteToSave) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('notes')
        .update({
          title: noteToSave.title,
          content: noteToSave.content,
          updated_at: new Date().toISOString(),
          revision_scheduled: noteToSave.revision_scheduled,
          revision_date: noteToSave.revision_date,
          summary: noteToSave.summary,
        })
        .eq('id', noteToSave.id);
        
      if (error) {
        console.error('Error saving note:', error);
        return;
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const generateSummary = async () => {
    if (!note || !note.content) return;
    
    setIsGeneratingSummary(true);
    try {
      const summary = await summarizeText(note.content);
      
      if (!summary) {
        throw new Error('Failed to generate summary');
      }
      
      const updatedNote = { ...note, summary, updated_at: new Date().toISOString() };
      setNote(updatedNote);
      await saveNote(updatedNote);
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
        </div>
        <p className="text-white/40 font-bold animate-pulse uppercase tracking-widest text-xs">Synchronizing Neural Data...</p>
      </div>
    );
  }

  if (error || !note) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto mt-20"
      >
        <div className="glass-card p-12 rounded-[3rem] border-destructive/20 text-center space-y-8">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white">Neural Uplink Failed</h2>
            <p className="text-white/40 font-medium text-lg leading-relaxed">
              {error || "We couldn't retrieve the requested neural data from your vault."}
            </p>
          </div>
          <Button 
            onClick={() => router.push('/dashboard')}
            className="purple-gradient h-14 px-10 rounded-2xl border-0 font-bold text-lg hover:scale-105 transition-all shadow-lg"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Return to Dashboard
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/dashboard')}
          className="w-fit text-white/40 hover:text-white hover:bg-white/5 transition-all h-12 rounded-xl group"
        >
          <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold">Back to Dashboard</span>
        </Button>
        
        <div className="flex items-center gap-6 glass px-6 py-2 rounded-2xl border-white/5">
          <div className="flex items-center gap-3">
            <Label 
              htmlFor="autosave" 
              className="text-xs font-black uppercase tracking-widest text-white/40 cursor-pointer"
            >
              Neural Sync
            </Label>
            <Checkbox 
              id="autosave"
              checked={autoSave}
              onCheckedChange={(checked) => setAutoSave(checked as boolean)}
              className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2 text-white/30">
            {isSaving ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">Saving...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">Synced</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Input
              placeholder="Title your thought..."
              value={note.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="h-20 text-4xl md:text-5xl font-black bg-transparent border-none focus:ring-0 p-0 text-white placeholder:text-white/10 selection:bg-primary/30"
            />
            <div className="flex items-center gap-4 mt-4 text-white/30">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-[10px] font-black uppercase tracking-widest">
                <Calendar className="h-3 w-3" />
                Updated {format(new Date(note.updated_at), 'MMM d, h:mm a')}
              </div>
              <div 
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 cursor-pointer group",
                  note.revision_scheduled ? "bg-primary/10 border-primary/20 text-primary" : "bg-white/5 border-white/5 text-white/20 hover:text-white/40"
                )}
                onClick={() => handleChange('revision_scheduled', !note.revision_scheduled)}
              >
                <Zap className={cn("h-3 w-3", note.revision_scheduled && "animate-pulse")} />
                <span className="text-[10px] font-black uppercase tracking-widest">Mark for Revision</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="glass-card rounded-[2.5rem] p-10 border-white/5 min-h-[500px] flex flex-col relative group">
              <Textarea
                placeholder="Unleash your mind here..."
                value={note.content}
                onChange={(e) => handleChange('content', e.target.value)}
                className="flex-1 bg-transparent border-none focus:ring-0 p-0 text-xl font-medium leading-relaxed text-white/80 placeholder:text-white/10 resize-none selection:bg-primary/30 min-h-[400px]"
              />
              
              <div className="mt-10 pt-8 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                <Button 
                  variant="outline" 
                  className="h-12 px-6 rounded-2xl bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 text-white font-bold transition-all"
                >
                  <FileUp className="mr-2 h-5 w-5 text-primary" />
                  Import Neural Data
                </Button>
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => saveNote()}
                    disabled={isSaving || autoSave}
                    className="h-12 px-6 rounded-2xl bg-white/5 border-white/5 hover:bg-white/10 text-white font-bold disabled:opacity-30 transition-all"
                  >
                    <Save className="mr-2 h-5 w-5" />
                    Save Changes
                  </Button>
                  
                  <Button 
                    onClick={generateSummary}
                    disabled={isGeneratingSummary || !note.content}
                    className="purple-gradient h-12 px-8 rounded-2xl border-0 font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                  >
                    {isGeneratingSummary ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Summarizing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        AI Summary
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-full"
          >
            <div className="glass-card rounded-[2.5rem] p-8 border-white/5 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl purple-gradient flex items-center justify-center text-white shadow-lg">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Neural Digest</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">AI Summarization</p>
                </div>
              </div>
              
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  {note.summary ? (
                    <motion.div 
                      key="summary"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      <p className="text-white/60 font-medium leading-relaxed">
                        {note.summary}
                      </p>
                      <div className="h-px w-10 bg-primary/30" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full flex flex-col items-center justify-center py-20 text-center space-y-6"
                    >
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                        <Zap className="h-8 w-8 text-white/10" />
                      </div>
                      <p className="text-white/20 font-bold leading-relaxed max-w-[200px] mx-auto">
                        Your neural digest is empty. Activate AI to synthesize your thoughts.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {note.summary && (
                <div className="mt-8">
                  <Button 
                    variant="ghost" 
                    onClick={generateSummary}
                    disabled={isGeneratingSummary}
                    className="w-full h-12 rounded-xl text-primary font-black uppercase tracking-widest text-[10px] hover:bg-primary/10 transition-all"
                  >
                    Regenerate Digest
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
