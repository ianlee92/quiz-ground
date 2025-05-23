'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // URL에서 토큰 파라미터 제거
        const hash = window.location.hash;
        if (hash) {
          // 현재 URL에서 해시 부분 제거
          window.history.replaceState(null, '', window.location.pathname);
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (session) {
          router.push('/');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setError('로그인 처리 중 오류가 발생했습니다.');
        toast.error('로그인에 실패했습니다.');
        router.push('/');
      }
    };

    handleAuthCallback();
  }, [router]);

  if (error) {
    return (
      <div className="container max-w-2xl mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">{error}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-4 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold">로그인 중...</h2>
      </div>
    </div>
  );
} 