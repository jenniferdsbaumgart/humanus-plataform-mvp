'use client';

import { useEffect } from 'react';
import { Header } from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { MoodTracker } from '@/components/dashboard/mood-tracker';
import { CommunicationFeed } from '@/components/dashboard/communication-feed';
import { useAppStore } from '@/lib/store';

export default function Dashboard() {
  const { setUser } = useAppStore();

  useEffect(() => {
    // Carregar dados do usuário
    fetch('/api/v1/users/me')
      .then(res => res.json())
      .then(user => setUser(user))
      .catch(console.error);
  }, [setUser]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6 max-w-9xl">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Acompanhe seu desenvolvimento profissional e bem-estar
            </p>
          </div>
          <StatsCards />
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <QuickActions />
            </div>
            <div className="lg:col-span-1">
              <MoodTracker />
            </div>
          </div>
          <CommunicationFeed />
        </main>
      </div>
    </div>
  );
}