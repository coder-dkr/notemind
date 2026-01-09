'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard/shell';
import { ThoughtCapture } from '@/components/cognitive/thought-capture';
import { supabase } from '@/lib/supabase';
import { Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { use } from 'react';

export default function ThoughtPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [thought, setThought] = useState<{
    id: string;
    content: string;
    title: string | null;
    emotional_tone: string | null;
    raw_analysis: unknown;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThought = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('thoughts')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            setError('Thought not found.');
          } else {
            setError('Failed to load thought.');
          }
          return;
        }

        if (data.user_id !== session.user.id) {
          setError('You do not have permission to view this thought.');
          return;
        }

        setThought(data);
      } catch (err) {
        console.error('Error:', err);
        setError('An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchThought();
  }, [id, router]);

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="w-full h-96 flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
          </div>
          <p className="text-white/40 font-bold animate-pulse uppercase tracking-widest text-xs">
            Loading thought...
          </p>
        </div>
      </DashboardShell>
    );
  }

  if (error || !thought) {
    return (
      <DashboardShell>
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
              <h2 className="text-3xl font-black text-white">Thought Not Found</h2>
              <p className="text-white/40 font-medium text-lg leading-relaxed">
                {error || "We couldn't find the requested thought."}
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
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <ThoughtCapture existingThought={thought as { id: string; content: string; title: string | null; emotional_tone: string | null; raw_analysis: import('@/lib/cognitive-engine').CognitiveAnalysis | null }} />
    </DashboardShell>
  );
}
