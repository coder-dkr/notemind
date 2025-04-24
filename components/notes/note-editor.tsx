'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { ArrowLeft, FileUp, Loader2, Save, Sparkles, AlertCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
// import { UploadDocumentDialog } from '@/components/notes/upload-document-dialog';
import { summarizeText } from '@/lib/deepseek';
import { motion, AnimatePresence } from 'framer-motion';

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
  // const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
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
            // toast({
            //   title: 'Note not found',
            //   description: 'The note you are looking for does not exist.',
            //   variant: 'destructive',
            // });
          } else {
            setError('Failed to load note. Please try again later.');
            console.error('Error fetching note:', error);
          }
          return;
        }
        
        if (data.user_id !== session.user.id) {
          setError('You do not have permission to view this note.');
          // toast({
          //   title: 'Unauthorized',
          //   description: 'You do not have permission to view this note.',
          //   variant: 'destructive',
          // });
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
      }, 1000);
      
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
        // toast({
        //   title: 'Error saving note',
        //   description: 'Failed to save your changes. Please try again.',
        //   variant: 'destructive',
        // });
        return;
      }
      
      // toast({
      //   title: 'Note saved',
      //   description: 'Your note has been saved successfully.',
      // });
    } catch (error) {
      console.error('Error:', error);
      // toast({
      //   title: 'Error',
      //   description: 'An unexpected error occurred while saving. Please try again.',
      //   variant: 'destructive',
      // });
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
      
      // toast({
      //   title: 'Summary generated',
      //   description: 'AI has summarized your note.',
      // });
    } catch (error) {
      console.error('Error generating summary:', error);
      // toast({
      //   title: 'Error generating summary',
      //   description: 'Failed to generate AI summary. Please try again later.',
      //   variant: 'destructive',
      // });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // const handleUploadContent = (content: string) => {
  //   if (!note) return;
    
  //   const updatedNote = { ...note, content, updated_at: new Date().toISOString() };
  //   setNote(updatedNote);
  //   saveNote(updatedNote);
    
  //   setIsUploadDialogOpen(false);
    
  //   // toast({
  //   //   title: 'Document uploaded',
  //   //   description: 'Your document has been added to the note.',
  //   // });
  // };

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Loading note...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto mt-8"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle>Error</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              onClick={() => router.push('/dashboard')}
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  if (!note) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto mt-8"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle>Note Not Found</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We couldn&apos;t find the note you&apos;re looking for. It may have been deleted or you might not have permission to view it.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              onClick={() => router.push('/dashboard')}
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/dashboard')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <div className="flex items-center gap-2">
          <Label 
            htmlFor="autosave" 
            className="text-sm cursor-pointer"
          >
            Auto-save
          </Label>
          <Checkbox 
            id="autosave"
            checked={autoSave}
            onCheckedChange={(checked) => setAutoSave(checked as boolean)}
          />
        </div>
      </div>
      
      <div className="grid gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Input
            placeholder="Note title"
            value={note.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="text-xl font-semibold"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle>Content</CardTitle>
                <CardDescription>Write the content of your note</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Start writing your note here..."
                  value={note.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  className="min-h-[300px] resize-y"
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    // onClick={() => setIsUploadDialogOpen(true)}
                  >
                    <FileUp className="mr-2 h-4 w-4" />
                    Import Document
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => saveNote()}
                    disabled={isSaving || autoSave}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={generateSummary}
                    disabled={isGeneratingSummary || !note.content}
                  >
                    {isGeneratingSummary ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Summarize with AI
                      </>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle>AI Summary</CardTitle>
                <CardDescription>
                  {note.summary ? 'AI-generated summary of your note' : 'Generate a summary of your note using AI'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {note.summary ? (
                    <motion.p 
                      key="summary"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm"
                    >
                      {note.summary}
                    </motion.p>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex flex-col items-center justify-center py-4 text-center space-y-4"
                    >
                      <Sparkles className="h-12 w-12 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Click the &quot;Summarize with AI&quot; button to generate a summary of your note.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-2 mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Checkbox 
            id="revision"
            checked={note.revision_scheduled}
            onCheckedChange={(checked) => handleChange('revision_scheduled', checked as boolean)}
          />
          <Label 
            htmlFor="revision" 
            className="text-sm cursor-pointer"
          >
            Mark for revision
          </Label>
        </motion.div>
      </div>
      
      {/* <UploadDocumentDialog 
        open={isUploadDialogOpen} 
        onOpenChange={setIsUploadDialogOpen} 
        onUpload={handleUploadContent}
      /> */}

    </div>
  );
}