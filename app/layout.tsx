import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth-context";
import { LoginButton } from "@/components/auth/LoginButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "퀴즈 앱",
  description: "퀴즈를 풀고 점수를 기록하세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen">
            <header className="border-b">
              <div className="container max-w-4xl mx-auto p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">퀴즈 앱</h1>
                <LoginButton />
              </div>
            </header>
            <main>{children}</main>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
