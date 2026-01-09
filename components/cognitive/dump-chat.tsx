'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { 
  Send, 
  Sparkles, 
  Loader2, 
  Brain, 
  Target, 
  Workflow,
  List,
  Network,
  ChevronDown,
  Copy,
  Check,
  Zap,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  extraction?: ExtractedStructure | null;
}

interface ExtractedStructure {
  type: 'ideas' | 'goals' | 'flow' | 'mindmap' | 'action_items';
  title: string;
  items: StructureItem[];
  summary?: string;
}

interface StructureItem {
  id: string;
  content: string;
  type?: string;
  children?: StructureItem[];
  priority?: 'high' | 'medium' | 'low';
}

const DUMP_ANALYSIS_PROMPT = `You are KeraMind's "Dump Tingles" assistant - a cognitive helper that takes chaotic thoughts and structures them beautifully.

When a user dumps their thoughts, analyze them and:
1. Provide a helpful, conversational response
2. Extract structure from their ideas

Your response MUST be valid JSON in this format:
{
  "response": "Your conversational response here...",
  "extraction": {
    "type": "ideas|goals|flow|mindmap|action_items",
    "title": "Title for this structure",
    "items": [
      {
        "id": "1",
        "content": "Item content",
        "type": "step|idea|goal|task",
        "priority": "high|medium|low",
        "children": []
      }
    ],
    "summary": "Brief 1-sentence summary"
  }
}

Choose the structure type based on what the user is talking about:
- "ideas" for brainstorming, creative thoughts
- "goals" for objectives, targets, aspirations  
- "flow" for processes, workflows, step-by-step plans
- "mindmap" for interconnected concepts, topics with subtopics
- "action_items" for tasks, todos, things to do

Be warm, encouraging, and insightful. Help them see clarity in their chaos.
Respond ONLY with valid JSON.`;

export function DumpChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;
      if (!apiKey) {
        throw new Error('API key not configured');
      }

      // Build conversation history for context
      const conversationHistory = messages.map(m => ({
        role: m.role,
        content: m.role === 'assistant' && m.extraction 
          ? JSON.stringify({ response: m.content, extraction: m.extraction })
          : m.content
      }));

      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: DUMP_ANALYSIS_PROMPT },
            ...conversationHistory,
            { role: 'user', content: input.trim() }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      let assistantContent = content;
      let extraction: ExtractedStructure | null = null;

      try {
        const parsed = JSON.parse(content);
        assistantContent = parsed.response || content;
        extraction = parsed.extraction || null;
      } catch {
        // If not valid JSON, use raw response
        assistantContent = content;
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
        extraction,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Save thought to database if extraction exists
      if (extraction) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await supabase.from('thoughts').insert({
            user_id: session.user.id,
            title: extraction.title,
            content: input.trim(),
            raw_analysis: { extraction, messages: [...messages, userMessage, assistantMessage].slice(-10) },
          });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "Oops! I had trouble processing that. Could you try again?",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderExtraction = (extraction: ExtractedStructure, messageId: string) => {
    const typeIcons = {
      ideas: <Sparkles className="w-4 h-4" />,
      goals: <Target className="w-4 h-4" />,
      flow: <Workflow className="w-4 h-4" />,
      mindmap: <Network className="w-4 h-4" />,
      action_items: <List className="w-4 h-4" />,
    };

    const typeColors = {
      ideas: 'from-pink-500 to-rose-500',
      goals: 'from-green-500 to-emerald-500',
      flow: 'from-blue-500 to-cyan-500',
      mindmap: 'from-purple-500 to-indigo-500',
      action_items: 'from-amber-500 to-orange-500',
    };

    const priorityColors = {
      high: 'bg-red-500/20 text-red-400 border-red-500/30',
      medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      low: 'bg-green-500/20 text-green-400 border-green-500/30',
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 glass rounded-2xl border border-white/10 overflow-hidden"
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${typeColors[extraction.type]} p-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">
                {typeIcons[extraction.type]}
              </div>
              <div>
                <h4 className="font-bold text-white">{extraction.title}</h4>
                <span className="text-xs text-white/70 uppercase tracking-wider font-bold">
                  {extraction.type.replace('_', ' ')}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(
                extraction.items.map(i => `• ${i.content}`).join('\n'),
                messageId
              )}
              className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 text-white"
            >
              {copiedId === messageId ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {extraction.type === 'flow' ? (
            // Flow visualization
            <div className="space-y-2">
              {extraction.items.map((item, index) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                      {index + 1}
                    </div>
                    {index < extraction.items.length - 1 && (
                      <div className="w-0.5 h-8 bg-primary/20 mt-1" />
                    )}
                  </div>
                  <div className="flex-1 p-3 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-white/80 text-sm">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : extraction.type === 'mindmap' ? (
            // Mindmap visualization
            <div className="space-y-3">
              {extraction.items.map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/20">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-white font-medium">{item.content}</span>
                  </div>
                  {item.children && item.children.length > 0 && (
                    <div className="ml-6 space-y-1">
                      {item.children.map((child) => (
                        <div key={child.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                          <ChevronDown className="w-3 h-3 text-white/40" />
                          <span className="text-white/60 text-sm">{child.content}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // List visualization (ideas, goals, action_items)
            <div className="space-y-2">
              {extraction.items.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
                >
                  <div className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0",
                    extraction.type === 'action_items' ? 'bg-amber-500/20' : 'bg-primary/20'
                  )}>
                    {extraction.type === 'action_items' ? (
                      <Zap className="w-3 h-3 text-amber-400" />
                    ) : extraction.type === 'goals' ? (
                      <Target className="w-3 h-3 text-green-400" />
                    ) : (
                      <Sparkles className="w-3 h-3 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white/80 text-sm">{item.content}</p>
                  </div>
                  {item.priority && (
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border",
                      priorityColors[item.priority]
                    )}>
                      {item.priority}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {extraction.summary && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-white/40 text-xs italic">{extraction.summary}</p>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        {messages.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex flex-col items-center justify-center text-center space-y-6"
          >
            <div className="w-24 h-24 rounded-3xl purple-gradient flex items-center justify-center shadow-2xl shadow-primary/30">
              <Zap className="w-12 h-12 text-white" />
            </div>
            <div className="space-y-2 max-w-md">
              <h2 className="text-3xl font-black text-white">Dump Tingles</h2>
              <p className="text-white/40 text-lg">
                Dump your chaotic thoughts here. I'll help you find structure, clarity, 
                and turn your ideas into actionable insights.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              {[
                { icon: Sparkles, label: 'Brainstorm ideas' },
                { icon: Target, label: 'Define goals' },
                { icon: Workflow, label: 'Plan workflows' },
                { icon: List, label: 'Create action items' },
              ].map((item, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5"
                >
                  <item.icon className="w-5 h-5 text-primary" />
                  <span className="text-white/60 text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={cn(
                  "flex gap-4",
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <div className="w-10 h-10 rounded-xl purple-gradient flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className={cn(
                  "max-w-[80%] space-y-2",
                  message.role === 'user' ? 'items-end' : 'items-start'
                )}>
                  <div className={cn(
                    "rounded-2xl p-4",
                    message.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'glass border border-white/5 rounded-tl-none'
                  )}>
                    <p className={cn(
                      "text-sm leading-relaxed whitespace-pre-wrap",
                      message.role === 'user' ? 'text-white' : 'text-white/80'
                    )}>
                      {message.content}
                    </p>
                  </div>
                  
                  {message.extraction && renderExtraction(message.extraction, message.id)}
                  
                  <span className="text-[10px] text-white/30 font-medium px-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {message.role === 'user' && (
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">You</span>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4"
          >
            <div className="w-10 h-10 rounded-xl purple-gradient flex items-center justify-center shadow-lg shadow-primary/20">
              <Brain className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="glass rounded-2xl rounded-tl-none p-4 border border-white/5">
              <div className="flex items-center gap-2 text-white/40">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Structuring your thoughts...</span>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-white/5">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Dump your thoughts here... I'll help you make sense of them"
              className="min-h-[60px] max-h-[200px] resize-none bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-white/30 pr-14 focus:border-primary/50"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 bottom-2 h-10 w-10 p-0 rounded-xl purple-gradient shadow-lg disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          {messages.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setMessages([])}
              className="h-auto px-4 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 text-white/60"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          )}
        </div>
        <p className="text-center text-[10px] text-white/20 mt-3 font-medium">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
