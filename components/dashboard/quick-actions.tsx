'use client';

import Link from 'next/link';
import { MessageSquarePlus, Eye, Calendar, BookOpen, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

export function QuickActions() {
  const t = useTranslations('Dashboard.QuickActions');

  const actions = [
    {
      title: t('giveFeedback'),
      description: t('giveFeedbackDesc'),
      icon: MessageSquarePlus,
      href: '/feedback/given/new',
      color: 'bg-gray-300 hover:bg-gray-400 text-gray-900',
    },
    {
      title: t('viewFeedbacks'),
      description: t('viewFeedbacksDesc'),
      icon: Eye,
      href: '/feedback/received',
      color: 'bg-slate-300 hover:bg-slate-400 text-slate-900',
    },
    {
      title: t('schedule1on1'),
      description: t('schedule1on1Desc'),
      icon: Calendar,
      href: '/schedule-1-on-1',
      color: 'bg-emerald-200 hover:bg-emerald-300 text-emerald-900',
    },
    {
      title: t('training'),
      description: t('trainingDesc'),
      icon: BookOpen,
      href: '/training',
      color: 'bg-blue-200 hover:bg-blue-300 text-blue-900',
    },
    {
      title: t('store'),
      description: t('storeDesc'),
      icon: Gift,
      href: '/rewards',
      color: 'bg-fuchsia-200 hover:bg-fuchsia-300 text-fuchsia-900',
    },
  ];

  return (
    <Card className="rounded-2xl lg:h-[265px] lg:py-2">
      <CardHeader className='pb-1'>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>
          {t('subtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent>
  <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {actions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Button
                variant="secondary"
                className={`h-24 lg:h-32 mt-4 w-full flex-col gap-2 ${action.color} transition-all duration-200 hover:scale-105 border border-gray-200 shadow-sm`}
              >
                <action.icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs opacity-90 break-words whitespace-normal max-w-full">{action.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}