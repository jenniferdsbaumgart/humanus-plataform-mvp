"use client";

import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';


  // Carregar usuário globalmente (client only)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { setUser } = useAppStore();
  useEffect(() => {
    fetch('/api/v1/users/me')
      .then(res => res.json())
      .then(user => {
        if (user && user.id) setUser(user);
      })
      .catch(() => {});
  }, [setUser]);

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
      </head>
      <body style={{ fontFamily: 'Inter, sans-serif' }}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}