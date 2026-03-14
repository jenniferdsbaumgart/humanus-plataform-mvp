"use client";

import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { NextIntlClientProvider } from 'next-intl';

  // Carregar usuário globalmente (client only)
export default function RootLayout({ 
  children,
  params: { locale },
  messages
}: { 
  children: React.ReactNode;
  params: { locale: string };
  messages: any;
}) {
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
    <html lang={locale} suppressHydrationWarning>
      <head>
      </head>
      <body style={{ fontFamily: 'Inter, sans-serif' }}>
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
      </body>
    </html>
  );
}