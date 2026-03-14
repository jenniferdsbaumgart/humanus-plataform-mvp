'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CommunicationCard } from '@/components/communications/communication-card';
import { MessageSquare, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface Communication {
  id: string;
  category: string;
  title: string;
  content: string;
  date: string;
  icon: string;
  highlight: boolean;
  author: string;
  authorRole: string;
}

export function CommunicationFeed() {
  const t = useTranslations('Dashboard.CommunicationFeed');
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetchRecentCommunications();
  }, []);

  const fetchRecentCommunications = async () => {
    try {
      const response = await fetch('/api/v1/communications?limit=10');
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      setCommunications(data.posts || []);
    } catch (error) {
      console.error('Erro ao carregar comunicações recentes:', error);
      console.error('Error details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="rounded-2xl animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-brand-medium" />
              {t('title')}
            </CardTitle>
            <CardDescription>
              {t('subtitle')}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Link href="/communications/new">
              <Button size="sm" className="bg-brand-accent hover:bg-brand-accent/90">
                <Plus className="h-4 w-4 mr-1" />
                {t('create')}
              </Button>
            </Link>
            <Link href="/communications">
              <Button size="sm" variant="outline">
                {t('seeAll')}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {communications.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">{t('noCommunications')}</p>
            <Link href="/communications/new">
              <Button className="bg-brand-primary hover:bg-brand-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                {t('createFirst')}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {communications.map((communication) => (
              <CommunicationCard
                key={communication.id}
                {...communication}
                compact={true}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}