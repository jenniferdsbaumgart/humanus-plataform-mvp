'use client';

import { Header } from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { CreatePostForm } from '@/components/communications/create-post-form';

export default function NewCommunicationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Nova Comunicação</h1>
            <p className="text-muted-foreground">
              Crie uma nova postagem para compartilhar com toda a equipe
            </p>
          </div>
          
          <CreatePostForm />
        </main>
      </div>
    </div>
  );
}