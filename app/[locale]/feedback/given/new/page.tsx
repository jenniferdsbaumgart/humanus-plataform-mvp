'use client';

import { Header } from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { GiveFeedbackForm } from '@/components/feedback/give-feedback-form';
import { useTranslations } from 'next-intl';

export default function GiveFeedbackPage() {
  const t = useTranslations('Feedbacks.New');
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{t('pageTitle')}</h1>
            <p className="text-muted-foreground">
              {t('pageSubtitle')}
            </p>
          </div>
          
          <GiveFeedbackForm />
        </main>
      </div>
    </div>
  );
}