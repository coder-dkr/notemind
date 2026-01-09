'use client';

import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/dashboard/shell';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Sparkles, 
  Network, 
  ArrowUpRight, 
  Clock, 
  TrendingUp,
  Plus,
  AlertTriangle,
  Lightbulb,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { CognitiveOnboarding } from '@/components/onboarding/cognitive-onboarding';

export default function DashboardPage() {
  const [userName, setUserName] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, onboarding_completed')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUserName(profile.full_name);
          // Check if onboarding is completed (handle both undefined and false)
          if (profile.onboarding_completed !== true) {
            // Check if cognitive_snapshots table exists and has a completed snapshot
            const { data: snapshot } = await supabase
              .from('cognitive_snapshots')
              .select('completed_at')
              .eq('user_id', session.user.id)
              .single();
            
            if (!snapshot?.completed_at) {
              setShowOnboarding(true);
            }
          }
        }
      }
      setCheckingOnboarding(false);
    };
    checkOnboarding();
  }, []);

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return { totalThoughts: 0, totalNodes: 0, totalInsights: 0, unresolvedInsights: 0 };
      
      const [thoughtsRes, nodesRes, insightsRes, unresolvedRes] = await Promise.all([
        supabase.from('thoughts').select('id', { count: 'exact' }).eq('user_id', session.user.id),
        supabase.from('cognitive_nodes').select('id', { count: 'exact' }).eq('user_id', session.user.id),
        supabase.from('cognitive_insights').select('id', { count: 'exact' }).eq('user_id', session.user.id),
        supabase.from('cognitive_insights').select('id', { count: 'exact' }).eq('user_id', session.user.id).eq('resolved', false)
      ]);
      
      return {
        totalThoughts: thoughtsRes.count || 0,
        totalNodes: nodesRes.count || 0,
        totalInsights: insightsRes.count || 0,
        unresolvedInsights: unresolvedRes.count || 0
      };
    }
  });

  const { data: recentThoughts } = useQuery({
    queryKey: ['recent-thoughts'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];
      const { data } = await supabase
        .from('thoughts')
        .select('*')
        .eq('user_id', session.user.id)
        .order('updated_at', { ascending: false })
        .limit(3);
      return data || [];
    }
  });

  const { data: recentInsights } = useQuery({
    queryKey: ['recent-insights'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];
      const { data } = await supabase
        .from('cognitive_insights')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('resolved', false)
        .order('created_at', { ascending: false })
        .limit(3);
      return data || [];
    }
  });

  if (checkingOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return <CognitiveOnboarding onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <DashboardShell>
      <div className="space-y-10">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Cognitive Engine Online</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                Welcome back, <br />
                <span className="text-primary italic">{userName?.split(' ')[0] || 'Thinker'}</span>
              </h1>
            </div>
            <Link href="/dashboard/thought/new">
              <Button size="lg" className="h-14 px-8 rounded-2xl purple-gradient font-black uppercase tracking-wider text-xs shadow-xl shadow-primary/20 group">
                <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" />
                Capture New Thought
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { label: 'Thoughts Captured', value: stats?.totalThoughts || 0, icon: Brain, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'Cognitive Nodes', value: stats?.totalNodes || 0, icon: Network, color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'Total Insights', value: stats?.totalInsights || 0, icon: Lightbulb, color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { label: 'Active Issues', value: stats?.unresolvedInsights || 0, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group hover:border-white/10 transition-all"
            >
              <div className={`absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity`}>
                <stat.icon className="w-20 h-20" />
              </div>
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center mb-6`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-white/40 font-black uppercase tracking-widest text-[10px] mb-1">{stat.label}</p>
              <h3 className="text-4xl font-black text-white">{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          {/* Recent Thoughts */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                Recent Thoughts
              </h2>
              <Link href="/dashboard/thoughts" className="text-xs font-black uppercase tracking-widest text-white/40 hover:text-primary transition-colors">
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentThoughts?.length === 0 ? (
                <div className="p-12 glass rounded-[2.5rem] border-white/5 border-dashed text-center">
                  <p className="text-white/20 font-bold uppercase tracking-widest text-xs">No thoughts captured yet.</p>
                  <Link href="/dashboard/thought/new">
                    <Button className="mt-4 purple-gradient rounded-xl">
                      <Plus className="w-4 h-4 mr-2" />
                      Capture Your First Thought
                    </Button>
                  </Link>
                </div>
              ) : (
                recentThoughts?.map((thought) => (
                  <Link key={thought.id} href={`/dashboard/thought/${thought.id}`}>
                    <motion.div 
                      whileHover={{ x: 10 }}
                      className="group p-6 rounded-3xl glass border-white/5 hover:bg-white/5 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Brain className="w-5 h-5 text-white/40 group-hover:text-primary" />
                        </div>
                        <div>
                          <h4 className="font-black text-white group-hover:text-primary transition-colors">
                            {thought.title || 'Untitled Thought'}
                          </h4>
                          <div className="flex items-center gap-3 text-white/40 text-xs">
                            <span>{new Date(thought.updated_at).toLocaleDateString()}</span>
                            {thought.emotional_tone && (
                              <span className="px-2 py-0.5 rounded-full bg-white/5 capitalize">
                                {thought.emotional_tone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-white/20 group-hover:text-white transition-all" />
                    </motion.div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Active Insights */}
          <div className="space-y-6">
            <h2 className="text-xl font-black text-white flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              Active Insights
            </h2>
            <div className="glass p-6 rounded-[2.5rem] border-white/5 space-y-6">
              {recentInsights?.length === 0 ? (
                <div className="text-center py-8">
                  <Sparkles className="w-10 h-10 text-white/10 mx-auto mb-4" />
                  <p className="text-white/30 text-sm font-medium">No active insights yet</p>
                </div>
              ) : (
                recentInsights?.map((insight) => (
                  <div 
                    key={insight.id}
                    className="p-4 rounded-2xl bg-white/5 border border-white/5"
                  >
                    <div className="flex items-start gap-3">
                      {insight.insight_type === 'contradiction' ? (
                        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      ) : insight.insight_type === 'bias' ? (
                        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                      ) : (
                        <Lightbulb className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      )}
                      <div>
                        <h4 className="font-bold text-white text-sm">{insight.title}</h4>
                        <p className="text-white/40 text-xs mt-1 line-clamp-2">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              <Link href="/dashboard/insights">
                <Button variant="outline" className="w-full h-12 rounded-2xl border-white/10 hover:bg-white/5 text-white/60 font-black uppercase tracking-widest text-[10px]">
                  View All Insights
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
