'use client';

import { useQuery } from '@tanstack/react-query';
import { DashboardShell } from '@/components/dashboard/shell';
import { DashboardHeader } from '@/components/dashboard/header';
import { CognitiveMap } from '@/components/cognitive/cognitive-map';
import { supabase } from '@/lib/supabase';
import { Sparkles } from 'lucide-react';

export default function CognitiveMapPage() {
  const { data: nodes, isLoading: nodesLoading } = useQuery({
    queryKey: ['cognitive-nodes'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];
      
      const { data } = await supabase
        .from('cognitive_nodes')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      return data || [];
    }
  });

  const { data: edges, isLoading: edgesLoading } = useQuery({
    queryKey: ['cognitive-edges'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];
      
      const { data } = await supabase
        .from('cognitive_edges')
        .select('*')
        .eq('user_id', session.user.id);
      
      return data || [];
    }
  });

  const isLoading = nodesLoading || edgesLoading;

  return (
    <DashboardShell>
      <DashboardHeader 
        heading="Cognitive Map" 
        text="Visualize your beliefs, goals, fears, and how they connect."
      />
      
      <div className="mt-8 h-[calc(100vh-250px)] min-h-[500px]">
        {isLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
            </div>
            <p className="text-white/40 font-bold animate-pulse uppercase tracking-widest text-xs mt-4">
              Building cognitive map...
            </p>
          </div>
        ) : (
          <CognitiveMap nodes={nodes || []} edges={edges || []} />
        )}
      </div>
    </DashboardShell>
  );
}
