'use client';

import { Header } from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { GiveFeedbackForm } from '@/components/feedback/give-feedback-form';

export default function GiveFeedbackPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Dar Feedback</h1>
            <p className="text-muted-foreground">
              Compartilhe feedback construtivo com seus colegas e contribua para o desenvolvimento da equipe
            </p>
          </div>
          
          <GiveFeedbackForm />
        </main>
      </div>
    </div>
  );
}