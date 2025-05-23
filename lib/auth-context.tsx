'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { User } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithKakao: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    // 초기 세션 확인
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Initial session check:', session);
        
        if (error) {
          throw error;
        }

        if (session?.user && mounted) {
          console.log('Setting initial user:', session.user);
          setUser(session.user as User);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        if (mounted) {
          setError('세션 확인 중 오류가 발생했습니다.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkSession();

    // 인증 상태 변경 구독
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session?.user) {
        console.log('Setting user on SIGNED_IN:', session.user);
        setUser(session.user as User);
        router.push('/');  // 메인 페이지로 리다이렉트
      } else if (event === 'SIGNED_OUT') {
        console.log('Clearing user on SIGNED_OUT');
        setUser(null);
        router.push('/');
      } else if (event === 'INITIAL_SESSION') {
        if (session?.user) {
          console.log('Setting user on INITIAL_SESSION:', session.user);
          setUser(session.user as User);
        }
      }
      
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const signInWithKakao = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          redirectTo: process.env.NEXT_PUBLIC_SITE_URL 
            ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
            : `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: 'select_account',
          },
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Kakao:', error);
      setError('카카오 로그인 중 오류가 발생했습니다.');
      toast.error('카카오 로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      router.push('/');
      toast.success('로그아웃되었습니다.');
    } catch (error) {
      console.error('Error signing out:', error);
      setError('로그아웃 중 오류가 발생했습니다.');
      toast.error('로그아웃 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signInWithKakao, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 