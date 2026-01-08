'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AvatarSelection } from '@/components/auth/avatar-selection';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, LogOut, User, Palette, Shield, Bell, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { THEMES, ThemeOption } from '@/lib/themes';
import { cn } from '@/lib/utils';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  theme: string;
}

export function UserSettings() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [theme, setTheme] = useState<ThemeOption>('light');

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/login');
          return;
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }
        
        setProfile(data);
        setFullName(data.full_name || '');
        setAvatarUrl(data.avatar_url || '');
        setTheme(data.theme as ThemeOption || 'light');
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [router]);

  const saveProfile = async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id);
        
      if (error) throw error;
      await supabase.auth.updateUser({
        data: { full_name: fullName, avatar_url: avatarUrl },
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const saveTheme = async (newTheme: ThemeOption) => {
    if (!profile) return;
    setIsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { error } = await supabase
        .from('profiles')
        .update({ theme: newTheme, updated_at: new Date().toISOString() })
        .eq('id', session.user.id);
      if (error) throw error;
      setTheme(newTheme);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Syncing Neural Identity...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <Tabs defaultValue="profile" className="w-full">
        <div className="flex flex-col lg:flex-row gap-10">
          <TabsList className="flex lg:flex-col h-auto bg-transparent border-none p-0 gap-2 lg:w-64">
            {[
              { id: 'profile', label: 'Identity', icon: User },
              { id: 'appearance', label: 'Neural Aesthetic', icon: Palette },
              { id: 'security', label: 'Vault Access', icon: Shield },
              { id: 'notifications', label: 'Synapse Alerts', icon: Bell },
            ].map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center justify-start gap-4 px-6 py-4 rounded-2xl w-full text-left font-bold text-white/40 data-[state=active]:bg-white/5 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all border border-transparent data-[state=active]:border-white/5"
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
            
            <div className="mt-auto pt-6 px-2">
              <Button 
                variant="ghost" 
                onClick={handleSignOut}
                className="w-full justify-start gap-4 h-14 rounded-2xl text-destructive hover:text-destructive hover:bg-destructive/10 font-bold"
              >
                <LogOut className="w-5 h-5" />
                Disconnect
              </Button>
            </div>
          </TabsList>

          <div className="flex-1">
            <TabsContent value="profile" className="mt-0 focus-visible:outline-none">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass border-white/5 rounded-[3rem] p-10 lg:p-12 space-y-10"
              >
                <div className="flex flex-col md:flex-row items-center gap-10">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/40 transition-colors" />
                    <Avatar className="h-32 w-32 border-4 border-white/10 relative z-10">
                      <AvatarImage src={avatarUrl} alt={fullName || 'Avatar'} />
                      <AvatarFallback className="bg-white/5 text-2xl font-black">
                        {fullName ? fullName.substring(0, 2).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 space-y-2 text-center md:text-left">
                    <h3 className="text-2xl font-black text-white">Neural Identification</h3>
                    <p className="text-white/40 font-medium italic">Your digital footprint within the Mind network.</p>
                  </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Vault Key (Email)</Label>
                    <Input value={profile?.email} disabled className="h-14 rounded-2xl bg-white/5 border-white/10 text-white font-bold opacity-50" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Designation (Full Name)</Label>
                    <Input 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)} 
                      className="h-14 rounded-2xl bg-white/5 border-white/10 text-white font-bold focus:border-primary/50" 
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <Label className="text-sm font-black text-white">Avatar Synthesis</Label>
                  </div>
                  <AvatarSelection value={avatarUrl} onChange={setAvatarUrl} />
                </div>

                <div className="pt-6 border-t border-white/5 flex justify-end">
                  <Button 
                    onClick={saveProfile}
                    disabled={isSaving}
                    className="h-14 px-10 rounded-2xl purple-gradient font-black uppercase tracking-wider text-xs shadow-xl shadow-primary/20"
                  >
                    {isSaving ? <Loader2 className="animate-spin" /> : 'Update Identity'}
                  </Button>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="appearance" className="mt-0 focus-visible:outline-none">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass border-white/5 rounded-[3rem] p-10 lg:p-12 space-y-10"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white">Visual Frequency</h3>
                  <p className="text-white/40 font-medium italic">Adjust the neural interface to match your cognitive style.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {(Object.keys(THEMES) as ThemeOption[]).map((themeKey) => {
                    const themeInfo = THEMES[themeKey];
                    const isActive = theme === themeKey;
                    return (
                      <motion.div
                        key={themeKey}
                        onClick={() => saveTheme(themeKey)}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          "relative rounded-[2rem] cursor-pointer border-2 transition-all p-4 group",
                          isActive ? 'border-primary bg-primary/5 shadow-2xl shadow-primary/10' : 'border-white/5 hover:border-white/20'
                        )}
                      >
                        <div 
                          className="h-24 rounded-2xl mb-4 overflow-hidden relative border border-white/5"
                          style={{ background: themeInfo.bgColor }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center opacity-40">
                             <div className="w-12 h-12 rounded-full blur-xl" style={{ background: themeInfo.primaryColor }} />
                          </div>
                          <div className="relative h-full flex items-center justify-center">
                            <div className="w-10 h-10 rounded-xl shadow-lg" style={{ background: themeInfo.primaryColor }} />
                          </div>
                        </div>
                        <div className="text-center">
                          <span className={cn(
                            "text-sm font-black tracking-tight uppercase",
                            isActive ? "text-primary" : "text-white/60"
                          )}>
                            {themeInfo.name}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
