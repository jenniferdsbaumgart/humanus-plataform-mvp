'use client';

import { useEffect, useState, useRef } from 'react';
import { TrendingDown, TrendingUp, MessageSquare, GraduationCap, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

interface Stats {
  turnover: {
    current: number;
    previous: number;
    trend: 'up' | 'down';
  };
  feedbacks: {
    received: number;
    given: number;
    monthlyTarget: number;
  };
  training: {
    completed: number;
    inProgress: number;
    totalAvailable: number;
  };
  sessions: {
    scheduled: number;
    completed: number;
    thisMonth: number;
  };
}

export function StatsCards() {
  const t = useTranslations('Dashboard.StatsCards');
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/v1/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex gap-4 overflow-x-auto md:grid md:gap-6 md:grid-cols-2 lg:grid-cols-4 scrollbar-hide pb-2">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="min-w-[220px] max-w-[220px] w-[220px] animate-pulse md:min-w-0 md:max-w-none md:w-auto">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mt-2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const turnoverChange = ((stats.turnover.current - stats.turnover.previous) / stats.turnover.previous * 100);
  const feedbackProgress = (stats.feedbacks.received / stats.feedbacks.monthlyTarget) * 100;
  const trainingProgress = (stats.training.completed / stats.training.totalAvailable) * 100;

  return (
    <div className="flex gap-4 overflow-x-auto md:grid md:gap-6 md:grid-cols-2 lg:grid-cols-4 scrollbar-hide pb-2">
      <Card className="min-w-[160px] max-w-[160px] w-[160px] rounded-2xl md:min-w-0 md:max-w-none md:w-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('turnover')}</CardTitle>
          {stats.turnover.trend === 'down' ? (
            <TrendingDown className="h-6 w-6 text-green-600" />
          ) : (
            <TrendingUp className="h-6 w-6 text-red-600" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.turnover.current}%</div>
          <p className="text-xs text-muted-foreground">
            {stats.turnover.trend === 'down' ? t('reduction') : t('increase')} de {Math.abs(turnoverChange).toFixed(1)}% {t('vsPrevious')}
          </p>
        </CardContent>
      </Card>

      <Card className="min-w-[160px] max-w-[160px] w-[160px] rounded-2xl md:min-w-0 md:max-w-none md:w-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('feedbacksMonth')}</CardTitle>
          <MessageSquare className="h-6 w-6 text-brand-medium" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.feedbacks.received}</div>
          <p className="text-xs text-muted-foreground">
            {feedbackProgress.toFixed(0)}% {t('ofMonthlyTarget')} ({stats.feedbacks.monthlyTarget})
          </p>
        </CardContent>
      </Card>

      <Card className="min-w-[160px] max-w-[160px] w-[160px] rounded-2xl md:min-w-0 md:max-w-none md:w-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('trainings')}</CardTitle>
          <GraduationCap className="h-6 w-6 text-brand-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.training.completed}</div>
          <p className="text-xs text-muted-foreground">
            {stats.training.inProgress} {t('inProgress')} • {trainingProgress.toFixed(0)}% {t('completed')}
          </p>
        </CardContent>
      </Card>

      <Card className="min-w-[160px] max-w-[160px] w-[160px] rounded-2xl md:min-w-0 md:max-w-none md:w-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('sessions1on1')}</CardTitle>
          <Calendar className="h-6 w-6 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.sessions.scheduled}</div>
          <p className="text-xs text-muted-foreground">
            {stats.sessions.thisMonth} {t('heldThisMonth')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}