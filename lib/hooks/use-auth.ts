'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getSession() {
      setIsLoading(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setUserId(session.user.id);
        } else {
          setUserId(null);
          router.push('/login');
        }
      } catch (error) {
        console.error('Error getting session:', error);
        setUserId(null);
      } finally {
        setIsLoading(false);
      }
    }
    
    getSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setUserId(session.user.id);
        } else {
          setUserId(null);
          router.push('/login');
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return { userId, isLoading };
}