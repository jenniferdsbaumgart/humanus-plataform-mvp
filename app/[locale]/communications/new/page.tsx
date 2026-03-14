'use client';

import { Header } from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { CreatePostForm } from '@/components/communications/create-post-form';
import { useTranslations } from 'next-intl';

export default function NewCommunicationPage() {
  const t = useTranslations('Communications.NewPage');
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
            <p className="text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>
          
          <CreatePostForm />
        </main>
      </div>
    </div>
  );
}