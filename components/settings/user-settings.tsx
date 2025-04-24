'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AvatarSelection } from '@/components/auth/avatar-selection';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { THEMES, ThemeOption } from '@/lib/themes';

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
      
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id);
        
      if (error) {
        console.error('Error updating profile:', error);
        // toast({
        //   title: 'Error updating profile',
        //   description: error.message,
        //   variant: 'destructive',
        // });
        return;
      }
      
      // Update user metadata
      await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          avatar_url: avatarUrl,
        },
      });
      
      // toast({
      //   title: 'Profile updated',
      //   description: 'Your profile has been updated successfully.',
      // });
    } catch (error) {
      console.error('Error:', error);
      // toast({
      //   title: 'Error',
      //   description: 'Something went wrong. Please try again.',
      //   variant: 'destructive',
      // });
    } finally {
      setIsSaving(false);
    }
  };

  const saveTheme = async (newTheme: ThemeOption) => {
    if (!profile) return;
    
    setIsSaving(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }
      
      // Update theme in database
      const { error } = await supabase
        .from('profiles')
        .update({
          theme: newTheme,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id);
        
      if (error) {
        console.error('Error updating theme:', error);
        // toast({
        //   title: 'Error updating theme',
        //   description: error.message,
        //   variant: 'destructive',
        // });
        return;
      }
      
      setTheme(newTheme);
      
      // toast({
      //   title: 'Theme updated',
      //   description: 'Your theme preference has been updated.',
      // });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        return;
      }
      
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded-md">
        Error loading profile. Please try again.
      </div>
    );
  }

  return (
    <Tabs defaultValue="profile" className="max-w-3xl mx-auto">
      <TabsList className="grid grid-cols-2">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile" className="mt-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile details and how others see you on the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={profile.email} disabled />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input 
                      id="fullName" 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)} 
                    />
                  </div>
                </div>
                
                <div className="w-full sm:w-auto">
                  <div className="flex flex-col items-center space-y-2">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={avatarUrl} alt={fullName || 'Avatar'} />
                      <AvatarFallback>
                        {fullName ? fullName.substring(0, 2).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">Your avatar</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Profile Picture</Label>
                <AvatarSelection 
                  value={avatarUrl} 
                  onChange={setAvatarUrl} 
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="destructive" 
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
              <Button 
                onClick={saveProfile}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </TabsContent>
      
      <TabsContent value="appearance" className="mt-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how NoteMind looks for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label>Select Theme</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {(Object.keys(THEMES) as ThemeOption[]).map((themeKey) => {
                    const themeInfo = THEMES[themeKey];
                    return (
                      <div
                        key={themeKey}
                        onClick={() => saveTheme(themeKey)}
                        className={`relative overflow-hidden rounded-lg cursor-pointer transition-all border-2 ${
                          theme === themeKey ? 'border-primary ring-2 ring-primary' : 'border-border'
                        }`}
                      >
                        <div 
                          className="h-20"
                          style={{ background: themeInfo.bgColor }}
                        >
                          <div className="h-1/2 flex items-center justify-center">
                            <div 
                              className="w-8 h-8 rounded-full"
                              style={{ background: themeInfo.primaryColor }}
                            ></div>
                          </div>
                        </div>
                        <div className="p-2 text-center bg-background">
                          <span className="text-sm font-medium">{themeInfo.name}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </TabsContent>
    </Tabs>
  );
}