'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Calendar, Clock, User, Plus, CheckCircle, Eye } from 'lucide-react';
import Link from 'next/link';

interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: number;
  type: string;
  with: string;
  status: 'scheduled' | 'completed';
  agenda: string[];
  location: string;
  notes: string;
}

const typeColors = {
  'career-planning': 'bg-blue-100 text-blue-800',
  'feedback': 'bg-green-100 text-green-800',
  'development': 'bg-purple-100 text-purple-800',
  'performance': 'bg-orange-100 text-orange-800'
};

import { useTranslations } from 'next-intl';

export function OneOnOneMeetings() {
  const t = useTranslations('CareerPlan.OneOnOneMeetings');
  
  const typeLabels = {
    'career-planning': t('planning'),
    'feedback': t('feedback'),
    'development': t('development'),
    'performance': t('performance')
  };

  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const response = await fetch('/api/v1/schedule');
      const data = await response.json();
      setMeetings(data.meetings || []);
    } catch (error) {
      console.error('Erro ao carregar reuniões:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextMeeting = meetings.find(m => m.status === 'scheduled' && new Date(m.date) > new Date());
  const pastMeetings = meetings
    .filter(m => m.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (loading) {
    return (
      <Card className="rounded-2xl animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
  <Card className="rounded-xl w-full max-w-[420px] sm:max-w-full mx-auto">
      <CardHeader className="pb-2 sm:pb-4">
        <div className="flex flex-col gap-2 xs:flex-row xs:items-center xs:justify-between w-full">
          <div>
            <CardTitle className="flex items-center gap-2 text-base sm:text-xl">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-brand-primary" />
              {t('title')}
            </CardTitle>
            <CardDescription className="text-xs sm:text-base">
              {t('subtitle')}
            </CardDescription>
          </div>
          <Link href="/schedule-1-on-1">
            <Button className="bg-brand-primary hover:bg-brand-primary/90 text-xs sm:text-base px-3 sm:px-5 py-2 sm:py-3">
              <Plus className="h-4 w-4 mr-1 sm:mr-2" />
              {t('scheduleNew')}
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Próxima Reunião */}
        {nextMeeting && (
          <div className="bg-gradient-to-r from-brand-primary/10 to-brand-medium/10 rounded-lg p-3 sm:p-4 border border-brand-primary/20">
            <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
              <Calendar className="h-4 w-4 text-brand-primary" />
              <span className="font-medium text-brand-primary text-xs sm:text-base">{t('nextMeeting')}</span>
            </div>
            <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">{nextMeeting.title}</h4>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {new Date(nextMeeting.date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {nextMeeting.with}
              </div>
            </div>
            <Badge className={typeColors[nextMeeting.type as keyof typeof typeColors]}>
              {typeLabels[nextMeeting.type as keyof typeof typeLabels]}
            </Badge>
          </div>
        )}

        {/* Histórico de Reuniões */}
        <div>
          <h3 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">{t('meetingHistory')}</h3>
          {pastMeetings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t('noMeetingsYet')}</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {pastMeetings.map((meeting, index) => (
                <div key={meeting.id} className="relative">
                  {/* Linha conectora */}
                  {index < pastMeetings.length - 1 && (
                    <div className="absolute left-5 sm:left-6 top-10 sm:top-12 w-0.5 h-12 sm:h-16 bg-gray-200"></div>
                  )}
                  <div className="flex items-start gap-2 sm:gap-4">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 flex items-center justify-center border-2 border-green-200">
                      <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                    </div>
                    <div className="flex-1 bg-white border rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1 sm:mb-2">
                        <h4 className="font-semibold text-sm sm:text-base">{meeting.title}</h4>
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button variant="outline" size="sm" className="text-xs sm:text-sm px-2 sm:px-4">
                              <Eye className="h-4 w-4 mr-1" />
                              {t('details')}
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="w-full max-w-full sm:w-[540px] overflow-y-auto">
                            <SheetHeader>
                              <SheetTitle className="text-base sm:text-lg">{meeting.title}</SheetTitle>
                              <SheetDescription className="text-xs sm:text-sm">
                                {t('meetingWith', { with: meeting.with })} • {new Date(meeting.date).toLocaleDateString('pt-BR')}
                              </SheetDescription>
                            </SheetHeader>
                            <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {new Date(meeting.date).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                                <Badge className={typeColors[meeting.type as keyof typeof typeColors]}>
                                  {typeLabels[meeting.type as keyof typeof typeLabels]}
                                </Badge>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2 text-xs sm:text-base">{t('agenda')}</h4>
                                <ul className="space-y-1">
                                  {meeting.agenda.map((item, index) => (
                                    <li key={index} className="flex items-start gap-2 text-xs sm:text-sm">
                                      <div className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0"></div>
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              {meeting.notes && (
                                <div>
                                  <h4 className="font-medium mb-2 text-xs sm:text-base">{t('notes')}</h4>
                                  <p className="text-xs sm:text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg">
                                    {meeting.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          </SheetContent>
                        </Sheet>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(meeting.date).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {meeting.with}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={typeColors[meeting.type as keyof typeof typeColors]}>
                          {typeLabels[meeting.type as keyof typeof typeLabels]}
                        </Badge>
                      </div>
                      {meeting.notes && (
                        <p className="text-xs sm:text-sm text-muted-foreground mt-2 line-clamp-2">
                          {meeting.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}