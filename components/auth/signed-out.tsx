'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function SignedOut({ children }: { children: React.ReactNode }) {
  const [isSignedOut, setIsSignedOut] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const { data } = await supabase.auth.getSession();
      setIsSignedOut(!data.session);
    }
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsSignedOut(!session);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isSignedOut) {
    return <>{children}</>;
  }

  return null;
}