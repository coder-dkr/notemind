'use client';

import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/dashboard/shell';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Sparkles, 
  Brain, 
  ArrowUpRight, 
  Clock, 
  TrendingUp,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

export default function DashboardPage() {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', session.user.id)
          .single();
        if (data) setUserName(data.full_name);
      }
    };
    fetchUser();
  }, []);

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return { totalNotes: 0, aiInsights: 0, revisions: 0 };
      
      const [notesRes, revisionRes] = await Promise.all([
        supabase.from('notes').select('id', { count: 'exact' }).eq('user_id', session.user.id),
        supabase.from('notes').select('id', { count: 'exact' }).eq('user_id', session.user.id).eq('revision_scheduled', true)
      ]);
      
      return {
        totalNotes: notesRes.count || 0,
        aiInsights: Math.floor((notesRes.count || 0) * 2.5), // Simulated AI insights
        revisions: revisionRes.count || 0
      };
    }
  });

  const { data: recentNotes } = useQuery({
    queryKey: ['recent-notes'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];
      const { data } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', session.user.id)
        .order('updated_at', { ascending: false })
        .limit(3);
      return data || [];
    }
  });

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
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">System Online</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                Welcome back, <br />
                <span className="text-primary italic">{userName?.split(' ')[0] || 'Seeker'}</span>
              </h1>
            </div>
            <Link href="/dashboard/note/new">
              <Button size="lg" className="h-14 px-8 rounded-2xl purple-gradient font-black uppercase tracking-wider text-xs shadow-xl shadow-primary/20 group">
                <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" />
                Capture New Thought
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { label: 'Neural Vault', value: stats?.totalNotes || 0, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'AI Synthesis', value: stats?.aiInsights || 0, icon: Sparkles, color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'Active Synapses', value: stats?.revisions || 0, icon: Brain, color: 'text-amber-500', bg: 'bg-amber-500/10' },
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
          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                Recent Synapses
              </h2>
              <Link href="/dashboard/notes" className="text-xs font-black uppercase tracking-widest text-white/40 hover:text-primary transition-colors">
                View All Access
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentNotes?.length === 0 ? (
                <div className="p-12 glass rounded-[2.5rem] border-white/5 border-dashed text-center">
                  <p className="text-white/20 font-bold uppercase tracking-widest text-xs">No activity detected.</p>
                </div>
              ) : (
                recentNotes?.map((note) => (
                  <Link key={note.id} href={`/dashboard/note/${note.id}`}>
                    <motion.div 
                      whileHover={{ x: 10 }}
                      className="group p-6 rounded-3xl glass border-white/5 hover:bg-white/5 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <FileText className="w-5 h-5 text-white/40 group-hover:text-primary" />
                        </div>
                        <div>
                          <h4 className="font-black text-white group-hover:text-primary transition-colors">{note.title || 'Untitled Thought'}</h4>
                          <p className="text-white/40 text-xs font-medium">{new Date(note.updated_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-white/20 group-hover:text-white transition-all" />
                    </motion.div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Neural Health / Quick Tools */}
          <div className="space-y-6">
            <h2 className="text-xl font-black text-white flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              Neural Status
            </h2>
            <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Vault Capacity</span>
                  <span className="text-xs font-black text-white">42%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '42%' }}
                    className="h-full purple-gradient" 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">AI Processor</span>
                  <span className="text-xs font-black text-white">Active</span>
                </div>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: [8, 20, 8] }}
                      transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                      className="flex-1 h-5 rounded-full bg-primary/30"
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button variant="outline" className="w-full h-12 rounded-2xl border-white/10 hover:bg-white/5 text-white/60 font-black uppercase tracking-widest text-[10px]">
                  Optimize Synapses
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
