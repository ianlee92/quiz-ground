'use client';

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export function LoginButton() {
  const { user, signInWithKakao, signOut } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm">
          {user.user_metadata.full_name || '사용자'}님
        </span>
        <Button variant="outline" onClick={signOut}>
          로그아웃
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={signInWithKakao}>
      카카오로 로그인
    </Button>
  );
} 