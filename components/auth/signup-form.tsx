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
import { Github, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AvatarSelection } from '@/components/auth/avatar-selection';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid neural address',
  }),
  password: z.string().min(8, {
    message: 'Access key must be at least 8 characters',
  }),
  fullName: z.string().min(2, {
    message: 'Identity label must be at least 2 characters',
  }),
  avatarUrl: z.string().optional(),
});

export function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [avatarStep, setAvatarStep] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
      avatarUrl: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!avatarStep) {
      setAvatarStep(true);
      return;
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
            avatar_url: values.avatarUrl,
          },
        },
      });

      if (error) return;

      if (data.user) {
        await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: values.email,
            full_name: values.fullName,
            avatar_url: values.avatarUrl || null,
            theme: 'dark',
          });
      }

      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleOAuthSignUp = async (provider: 'google' | 'github') => {
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
        <h1 className="text-3xl font-black tracking-tight text-white">
          {avatarStep ? 'Personalize Identity' : 'Create Identity'}
        </h1>
        <p className="text-sm font-medium text-white/40">
          {avatarStep ? 'Select your neural avatar' : 'Join the future of cognitive intelligence'}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {avatarStep ? (
          <motion.div
            key="avatar-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="avatarUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <AvatarSelection value={field.value || ""} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold text-destructive" />
                    </FormItem>
                  )}
                />
                <div className="flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="h-12 px-6 bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl font-bold transition-all"
                    onClick={() => setAvatarStep(false)}
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 h-12 purple-gradient border-0 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Finalize Identity'}
                  </Button>
                </div>
              </form>
            </Form>
          </motion.div>
        ) : (
          <motion.div
            key="form-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Identity Label</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
                          <Input 
                            placeholder="John Doe" 
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
                      <FormLabel className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Access Key</FormLabel>
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
                <Button type="submit" className="w-full h-12 purple-gradient border-0 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                  Next: Neural Profile
                  <ArrowRight className="ml-2 w-4 h-4" />
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
                onClick={() => handleOAuthSignUp('google')}
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
                onClick={() => handleOAuthSignUp('github')}
                disabled={isLoading}
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-center text-sm font-medium text-white/40">
        Already have an identity?{' '}
        <Link href="/login" className="text-primary hover:text-primary/80 font-black transition-colors underline underline-offset-4">
          Access Vault
        </Link>
      </p>
    </div>
  );
}
