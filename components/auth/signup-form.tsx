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
import { Github } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AvatarSelection } from '@/components/auth/avatar-selection';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters',
  }),
  fullName: z.string().min(2, {
    message: 'Name must be at least 2 characters',
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

      if (error) {
        // toast({
        //   title: 'Error',
        //   description: error.message,
        //   variant: 'destructive',
        // });
        return;
      }

      // Create profile entry
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: values.email,
            full_name: values.fullName,
            avatar_url: values.avatarUrl || null,
            theme: 'light',
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }

      // toast({
      //   title: 'Account created!',
      //   description: 'Your account has been created successfully.',
      // });

      router.push('/dashboard');
      router.refresh();
      
    } catch (error) {
      console.error(error)
      // toast({
      //   title: 'Error',
      //   description: 'Something went wrong. Please try again.',
      //   variant: 'destructive',
      // });
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        // toast({
        //   title: 'Error',
        //   description: error.message,
        //   variant: 'destructive',
        // });
      }
    } catch (error) {
      console.error(error)
      // toast({
      //   title: 'Error',
      //   description: 'Something went wrong with Google signup.',
      //   variant: 'destructive',
      // });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignUp = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        // toast({
        //   title: 'Error',
        //   description: error.message,
        //   variant: 'destructive',
        // });
      }
    } catch (error) {
      console.error(error)
      // toast({
      //   title: 'Error',
      //   description: 'Something went wrong with GitHub signup.',
      //   variant: 'destructive',
      // });
    } finally {
      setIsLoading(false);
    }
  };

  if (avatarStep) {
    return (
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choose Your Avatar</FormLabel>
                  <FormControl>
                    <AvatarSelection value={field.value ? field.value : ""} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setAvatarStep(false)}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Complete Sign Up'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Next: Choose Avatar'}
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          type="button" 
          className="w-full" 
          onClick={handleGoogleSignUp}
          disabled={isLoading}
        >
          <svg
            className="mr-2 h-4 w-4"
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="google"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
          >
            <path
              fill="currentColor"
              d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
            ></path>
          </svg>
          Google
        </Button>
        <Button 
          variant="outline" 
          type="button" 
          className="w-full" 
          onClick={handleGithubSignUp}
          disabled={isLoading}
        >
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </Button>
      </div>
    </div>
  );
}