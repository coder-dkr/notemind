'use client';

import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  AlertCircle, 
  Lightbulb, 
  TrendingUp,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { CognitiveInsight } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

interface InsightsPanelProps {
  insights: CognitiveInsight[];
  onUpdate?: () => void;
}

const insightTypeConfig: Record<string, { icon: React.ReactNode; color: string; bgColor: string }> = {
  contradiction: {
    icon: <AlertCircle className="w-5 h-5" />,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10 border-red-500/20',
  },
  bias: {
    icon: <AlertTriangle className="w-5 h-5" />,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10 border-amber-500/20',
  },
  pattern: {
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/20',
  },
  blind_spot: {
    icon: <Eye className="w-5 h-5" />,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10 border-purple-500/20',
  },
  growth_opportunity: {
    icon: <Lightbulb className="w-5 h-5" />,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10 border-green-500/20',
  },
};

const severityColors = {
  high: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-green-500',
};

export function InsightsPanel({ insights, onUpdate }: InsightsPanelProps) {
  const handleResolve = async (insightId: string, resolved: boolean) => {
    try {
      await supabase
        .from('cognitive_insights')
        .update({ 
          resolved, 
          resolved_at: resolved ? new Date().toISOString() : null 
        })
        .eq('id', insightId);
      
      onUpdate?.();
    } catch (error) {
      console.error('Error updating insight:', error);
    }
  };

  const unresolvedInsights = insights.filter(i => !i.resolved);
  const resolvedInsights = insights.filter(i => i.resolved);

  if (insights.length === 0) {
    return (
      <div className="glass-card rounded-[2.5rem] p-12 border-white/5 text-center">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
          <Lightbulb className="w-10 h-10 text-white/20" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Insights Yet</h3>
        <p className="text-white/40 max-w-md mx-auto">
          Start capturing thoughts to receive cognitive insights. KeraMind will analyze 
          your thinking and surface contradictions, biases, and patterns.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Unresolved Insights */}
      {unresolvedInsights.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-white/40">
            Active Insights ({unresolvedInsights.length})
          </h3>
          <div className="space-y-4">
            {unresolvedInsights.map((insight, index) => {
              const config = insightTypeConfig[insight.insight_type];
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`glass-card rounded-[2rem] p-6 border ${config.bgColor}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.color} bg-white/5`}>
                        {config.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-white">{insight.title}</h4>
                          {insight.severity && (
                            <span className={`w-2 h-2 rounded-full ${severityColors[insight.severity]}`} />
                          )}
                          <span className="text-[10px] font-bold uppercase tracking-wider text-white/30">
                            {insight.insight_type.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-white/60 leading-relaxed">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleResolve(insight.id, true)}
                      className="h-10 w-10 rounded-xl hover:bg-green-500/20 text-white/40 hover:text-green-400"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Resolved Insights */}
      {resolvedInsights.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-white/40">
            Resolved ({resolvedInsights.length})
          </h3>
          <div className="space-y-3">
            {resolvedInsights.slice(0, 5).map((insight) => (
              <div
                key={insight.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-white/40 line-through">{insight.title}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleResolve(insight.id, false)}
                  className="h-8 w-8 rounded-lg hover:bg-red-500/20 text-white/20 hover:text-red-400"
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
