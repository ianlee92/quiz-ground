'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { User } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  signInWithKakao: () => Promise<void>;
  signOut: () => Promise<void>;
}>({
  user: null,
  loading: true,
  signInWithKakao: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error initializing auth:', error);
        toast.error('인증 상태를 확인하는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithKakao = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: 'https://fvyoxbdhaaavsewktbdc.supabase.co/auth/v1/callback',
          queryParams: {
            scope: 'profile_nickname profile_image',
          },
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Kakao:', error);
      toast.error('카카오 로그인에 실패했습니다.');
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/');
      toast.success('로그아웃되었습니다.');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('로그아웃에 실패했습니다.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithKakao, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 