'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { analyzeThought, CognitiveAnalysis } from '@/lib/cognitive-engine';
import { 
  Brain, 
  Sparkles, 
  Loader2, 
  ArrowLeft, 
  AlertTriangle,
  Target,
  Heart,
  Lightbulb,
  CheckCircle,
  Compass,
  AlertCircle,
  Save
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

interface ThoughtCaptureProps {
  existingThought?: {
    id: string;
    content: string;
    title: string | null;
    emotional_tone: string | null;
    raw_analysis: CognitiveAnalysis | null;
  };
}

const nodeTypeIcons: Record<string, React.ReactNode> = {
  belief: <Brain className="w-4 h-4" />,
  goal: <Target className="w-4 h-4" />,
  fear: <AlertTriangle className="w-4 h-4" />,
  value: <Heart className="w-4 h-4" />,
  assumption: <Lightbulb className="w-4 h-4" />,
  decision: <CheckCircle className="w-4 h-4" />,
  intention: <Compass className="w-4 h-4" />,
};

const nodeTypeColors: Record<string, string> = {
  belief: 'bg-purple-500',
  goal: 'bg-green-500',
  fear: 'bg-red-500',
  value: 'bg-amber-500',
  assumption: 'bg-indigo-500',
  decision: 'bg-blue-500',
  intention: 'bg-pink-500',
};

export function ThoughtCapture({ existingThought }: ThoughtCaptureProps) {
  const router = useRouter();
  const isEditing = !!existingThought;
  
  const [title, setTitle] = useState(existingThought?.title || '');
  const [content, setContent] = useState(existingThought?.content || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [analysis, setAnalysis] = useState<CognitiveAnalysis | null>(
    existingThought?.raw_analysis || null
  );
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!content.trim() || content.length < 20) {
      setError('Please write at least 20 characters to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeThought(content);
      if (result) {
        setAnalysis(result);
      } else {
        setError('Failed to analyze thought. Please try again.');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError('An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const thoughtId = existingThought?.id || uuidv4();
      const thoughtData = {
        id: thoughtId,
        user_id: session.user.id,
        title: title || 'Untitled Thought',
        content,
        emotional_tone: analysis?.emotionalTone || null,
        raw_analysis: analysis || null,
        updated_at: new Date().toISOString(),
      };

      if (isEditing) {
        const { error } = await supabase
          .from('thoughts')
          .update(thoughtData)
          .eq('id', thoughtId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('thoughts')
          .insert({
            ...thoughtData,
            created_at: new Date().toISOString(),
          });
        if (error) throw error;
      }

      // Save cognitive nodes if analysis exists
      if (analysis?.concepts) {
        for (const concept of analysis.concepts) {
          await supabase.from('cognitive_nodes').insert({
            user_id: session.user.id,
            thought_id: thoughtId,
            node_type: concept.type,
            content: concept.content,
            confidence: concept.confidence,
            importance: concept.importance,
          });
        }
      }

      // Save cognitive insights
      if (analysis?.contradictions) {
        for (const contradiction of analysis.contradictions) {
          await supabase.from('cognitive_insights').insert({
            user_id: session.user.id,
            thought_id: thoughtId,
            insight_type: 'contradiction',
            title: 'Internal Contradiction Detected',
            description: `${contradiction.concept1} conflicts with ${contradiction.concept2}: ${contradiction.explanation}`,
            severity: contradiction.severity,
          });
        }
      }

      if (analysis?.biases) {
        for (const bias of analysis.biases) {
          await supabase.from('cognitive_insights').insert({
            user_id: session.user.id,
            thought_id: thoughtId,
            insight_type: 'bias',
            title: bias.type,
            description: bias.description,
            severity: bias.severity,
          });
        }
      }

      router.push('/dashboard');
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save thought. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/dashboard')}
          className="text-white/40 hover:text-white hover:bg-white/5 h-12 rounded-xl group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold">Back to Dashboard</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Input
              placeholder="Give this thought a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-16 text-3xl font-black bg-transparent border-none focus:ring-0 p-0 text-white placeholder:text-white/10"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-[2.5rem] p-8 border-white/5"
          >
            <Textarea
              placeholder="Write your thought here... What's on your mind? What are you thinking about? What decisions are you facing?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[350px] bg-transparent border-none focus:ring-0 p-0 text-lg text-white/80 placeholder:text-white/20 resize-none"
            />

            {error && (
              <div className="flex items-center gap-2 text-red-400 mt-4">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-4">
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || content.length < 20}
                className="purple-gradient h-12 px-8 rounded-2xl font-bold shadow-lg shadow-primary/20"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Analyze Thought
                  </>
                )}
              </Button>

              <Button
                onClick={handleSave}
                disabled={isSaving || !content.trim()}
                variant="outline"
                className="h-12 px-8 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save Thought
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Analysis Panel */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {analysis ? (
              <motion.div
                key="analysis"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Emotional Tone */}
                <div className="glass-card rounded-[2rem] p-6 border-white/5">
                  <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4">
                    Emotional Tone
                  </h3>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="font-bold text-primary capitalize">
                      {analysis.emotionalTone}
                    </span>
                  </div>
                </div>

                {/* Extracted Concepts */}
                <div className="glass-card rounded-[2rem] p-6 border-white/5">
                  <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4">
                    Extracted Concepts ({analysis.concepts.length})
                  </h3>
                  <div className="space-y-3">
                    {analysis.concepts.map((concept, i) => (
                      <div 
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-xl bg-white/5"
                      >
                        <div className={`w-8 h-8 rounded-lg ${nodeTypeColors[concept.type]} flex items-center justify-center text-white flex-shrink-0`}>
                          {nodeTypeIcons[concept.type]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white/80 font-medium">
                            {concept.content}
                          </p>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-white/30">
                            {concept.type} • {Math.round(concept.confidence * 100)}% confidence
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Biases */}
                {analysis.biases.length > 0 && (
                  <div className="glass-card rounded-[2rem] p-6 border-amber-500/20">
                    <h3 className="text-xs font-black uppercase tracking-widest text-amber-400 mb-4">
                      Detected Biases ({analysis.biases.length})
                    </h3>
                    <div className="space-y-3">
                      {analysis.biases.map((bias, i) => (
                        <div 
                          key={i}
                          className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                            <span className="font-bold text-amber-400 text-sm">
                              {bias.type}
                            </span>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                              bias.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                              bias.severity === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                              'bg-green-500/20 text-green-400'
                            }`}>
                              {bias.severity}
                            </span>
                          </div>
                          <p className="text-sm text-white/60">{bias.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contradictions */}
                {analysis.contradictions.length > 0 && (
                  <div className="glass-card rounded-[2rem] p-6 border-red-500/20">
                    <h3 className="text-xs font-black uppercase tracking-widest text-red-400 mb-4">
                      Contradictions ({analysis.contradictions.length})
                    </h3>
                    <div className="space-y-3">
                      {analysis.contradictions.map((c, i) => (
                        <div 
                          key={i}
                          className="p-3 rounded-xl bg-red-500/10 border border-red-500/20"
                        >
                          <p className="text-sm text-white/60">{c.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Reflections */}
                <div className="glass-card rounded-[2rem] p-6 border-white/5">
                  <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4">
                    Suggested Reflections
                  </h3>
                  <div className="space-y-3">
                    {analysis.suggestedReflections.map((q, i) => (
                      <div 
                        key={i}
                        className="p-3 rounded-xl bg-white/5 text-sm text-white/60 font-medium"
                      >
                        {q}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card rounded-[2rem] p-10 border-white/5 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-10 h-10 text-white/20" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Cognitive Analysis</h3>
                <p className="text-white/40 text-sm">
                  Write your thought and click "Analyze" to extract concepts, detect biases, 
                  and discover patterns in your thinking.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
