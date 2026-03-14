"use client";

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { NextIntlClientProvider } from 'next-intl';

export function Providers({ 
  children,
  locale,
  messages
}: { 
  children: React.ReactNode;
  locale: string;
  messages: any;
}) {
  const { setUser } = useAppStore();
  
  // Carregar usuário globalmente (client only)
  useEffect(() => {
    fetch('/api/v1/users/me')
      .then(res => res.json())
      .then(user => {
        if (user && user.id) setUser(user);
      })
      .catch(() => {});
  }, [setUser]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
