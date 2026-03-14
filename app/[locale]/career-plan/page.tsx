'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { CareerLevelProgress } from '@/components/career-plan/CareerLevelProgress';
import { CareerPathTimeline } from '@/components/career-plan/CareerPathTimeline';
import { OneOnOneMeetings } from '@/components/career-plan/OneOnOneMeetings';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { CareerPlanData } from '@/types/career-plan';
import { useTranslations } from 'next-intl';

export default function CareerPlanPage() {
  const t = useTranslations('CareerPlan');
  const [careerData, setCareerData] = useState<CareerPlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCareerPlanData();
  }, []);

  const fetchCareerPlanData = async () => {
    try {
      const response = await fetch('/api/v1/career-plan');
      if (!response.ok) {
        throw new Error(t('errorFetchData'));
      }
      const data = await response.json();
      setCareerData(data);
    } catch (error) {
      console.error('Erro ao carregar plano de carreira:', error);
      setError(error instanceof Error ? error.message : t('unknownError'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-48 bg-gray-200 rounded-2xl"></div>
              <div className="h-96 bg-gray-200 rounded-2xl"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <Card className="rounded-2xl">
              <CardContent className="pt-6 text-center py-12">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">{t('errorLoadingTitle')}</h2>
                <p className="text-muted-foreground mb-4">{error}</p>
                <button
                  onClick={fetchCareerPlanData}
                  className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90"
                >
                  {t('tryAgain')}
                </button>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  if (!careerData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <Card className="rounded-2xl">
              <CardContent className="pt-6 text-center py-12">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t('noDataFound')}</p>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-2 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl">
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2 sm:gap-3">
              <TrendingUp className="h-7 w-7 sm:h-8 sm:w-8 text-brand-primary" />
              {t('title')}
            </h1>
            <p className="text-xs sm:text-base text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>

          <CareerLevelProgress careerPlan={careerData.plan} />
          <CareerPathTimeline levels={careerData.plan.levels} />
          <OneOnOneMeetings />
        </main>
      </div>
    </div>
  );
}