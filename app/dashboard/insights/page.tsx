'use client';

import { useQuery } from '@tanstack/react-query';
import { DashboardShell } from '@/components/dashboard/shell';
import { DashboardHeader } from '@/components/dashboard/header';
import { InsightsPanel } from '@/components/cognitive/insights-panel';
import { supabase } from '@/lib/supabase';
import { Sparkles } from 'lucide-react';

export default function InsightsPage() {
  const { data: insights, isLoading, refetch } = useQuery({
    queryKey: ['cognitive-insights'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];
      
      const { data } = await supabase
        .from('cognitive_insights')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      return data || [];
    }
  });

  return (
    <DashboardShell>
      <DashboardHeader 
        heading="Cognitive Insights" 
        text="Contradictions, biases, and patterns detected in your thinking."
      />
      
      <div className="mt-8">
        {isLoading ? (
          <div className="w-full h-96 flex flex-col items-center justify-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
            </div>
            <p className="text-white/40 font-bold animate-pulse uppercase tracking-widest text-xs mt-4">
              Loading insights...
            </p>
          </div>
        ) : (
          <InsightsPanel insights={insights || []} onUpdate={() => refetch()} />
        )}
      </div>
    </DashboardShell>
  );
}
