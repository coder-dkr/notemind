'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Github, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { motion } from 'framer-motion';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid neural address',
  }),
  password: z.string().min(8, {
    message: 'Access key must be at least 8 characters',
  }),
});

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) return;

      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    try {
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-8">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-3xl font-black tracking-tight text-white">Welcome Back</h1>
        <p className="text-sm font-medium text-white/40">Enter your credentials to access your vault</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Neural Address</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
                    <Input 
                      placeholder="name@nexus.ai" 
                      {...field} 
                      className="h-12 pl-12 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-xl text-white placeholder:text-white/20 transition-all font-medium"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-[10px] font-bold text-destructive" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <FormLabel className="text-xs font-black uppercase tracking-widest text-white/40">Access Key</FormLabel>
                  <Link
                    href="/reset-password"
                    className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                  >
                    Lost Key?
                  </Link>
                </div>
                <FormControl>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      {...field} 
                      className="h-12 pl-12 bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-xl text-white placeholder:text-white/20 transition-all font-medium"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-[10px] font-bold text-destructive" />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full h-12 purple-gradient border-0 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Synchronizing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Access Vault
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/5" />
        </div>
        <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]">
          <span className="bg-[#120326] px-4 text-white/20">
            External Uplink
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button 
          variant="outline" 
          type="button" 
          className="w-full h-12 bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl font-bold transition-all" 
          onClick={() => handleOAuthLogin('google')}
          disabled={isLoading}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 488 512">
            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
          </svg>
          Google
        </Button>
        <Button 
          variant="outline" 
          type="button" 
          className="w-full h-12 bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl font-bold transition-all" 
          onClick={() => handleOAuthLogin('github')}
          disabled={isLoading}
        >
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </Button>
      </div>

      <p className="text-center text-sm font-medium text-white/40">
        New explorer?{' '}
        <Link href="/signup" className="text-primary hover:text-primary/80 font-black transition-colors underline underline-offset-4">
          Create Identity
        </Link>
      </p>
    </div>
  );
}
