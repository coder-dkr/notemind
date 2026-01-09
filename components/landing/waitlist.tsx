'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Sparkles, Loader2, CheckCircle2 } from 'lucide-react';

export function LandingWaitlist() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatus('idle');

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') {
          setStatus('success');
          setMessage("You're already on the list! We'll be in touch soon.");
        } else {
          throw error;
        }
      } else {
        setStatus('success');
        setMessage("Welcome to the future of cognitive clarity. We'll be in touch soon!");
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setMessage('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="waitlist" className="w-full py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="container px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto glass-card p-12 md:p-20 rounded-[3rem] border-white/5 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-bold tracking-wider uppercase">Early Access</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6">
              Ready to <span className="text-gradient">Think</span> Better?
            </h2>
            <p className="text-white/50 text-xl font-medium mb-12 max-w-2xl mx-auto">
              Be the first to experience cognitive intelligence that helps you understand and improve your thinking. Join our exclusive waitlist.
            </p>

            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 text-green-400"
              >
                <CheckCircle2 className="w-16 h-16" />
                <p className="text-2xl font-bold">{message}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:ring-primary/50 focus:border-primary px-6"
                  required
                />
                <Button 
                  disabled={loading}
                  className="h-14 px-10 purple-gradient border-0 text-white font-bold rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl shadow-primary/20 flex-shrink-0"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Join Waitlist'
                  )}
                </Button>
              </form>
            )}
            
            {status === 'error' && (
              <p className="mt-4 text-red-400 font-medium">{message}</p>
            )}

            <p className="mt-8 text-white/30 text-sm font-medium">
              Join 2,000+ early adopters already on the list.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
