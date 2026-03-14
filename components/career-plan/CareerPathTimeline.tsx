'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { CheckCircle, Clock, Target, Hourglass, Eye } from 'lucide-react';
import { CareerLevel } from '@/types/career-plan';

interface CareerPathTimelineProps {
  levels: CareerLevel[];
}

const statusConfig = {
  completed: {
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200'
  },
  'in-progress': {
    icon: Clock,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200'
  },
  next: {
    icon: Target,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-200'
  },
  future: {
    icon: Hourglass,
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200'
  }
};

import { useTranslations } from 'next-intl';

export function CareerPathTimeline({ levels }: CareerPathTimelineProps) {
  const t = useTranslations('CareerPlan.CareerPathTimeline');
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return t('completed');
      case 'in-progress': return t('inProgress');
      case 'next': return t('nextObjective');
      case 'future': return t('futureGoal');
      default: return status;
    }
  };
  return (
  <Card className="rounded-xl w-full max-w-[490px] sm:max-w-full mx-auto">
      <CardHeader className="pb-2 sm:pb-4">
        <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
          <Target className="h-6 w-6 sm:h-7 sm:w-7 text-brand-primary" />
          {t('timelineTitle')}
        </CardTitle>
        <CardDescription className="text-sm sm:text-lg">
          {t('timelineSubtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 sm:pt-0">
        <div className="space-y-4 sm:space-y-6">
          {levels.map((level, index) => {
            const config = statusConfig[level.status as keyof typeof statusConfig];
            const Icon = config.icon;
            const label = getStatusLabel(level.status);
            return (
              <div
                key={level.id}
                className={`flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-4 p-4 sm:p-6 rounded-lg sm:rounded-xl border-2 transition-all hover:shadow-md ${config.borderColor} ${config.bgColor}`}
              >
                <div className={`flex-shrink-0 w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${config.bgColor} border-2 ${config.borderColor}`}>
                  <Icon className={`h-4 w-4 sm:h-6 sm:w-6 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                    <h3 className="font-semibold text-md sm:text-xl">{level.name}</h3>
                    <Badge variant="outline" className={`text-[10px] sm:text-xs px-1.5 py-0.5 ${config.color}`}>{label}</Badge>
                  </div>
                  <p className="text-muted-foreground text-[13px] sm:text-sm mb-1 sm:mb-2">{level.description}</p>
                  <div className="flex flex-wrap items-center gap-1 sm:gap-4 text-[12px] sm:text-lg text-muted-foreground">
                    {level.completedDate && (
                      <span>{t('completedOn')} {new Date(level.completedDate).toLocaleDateString('pt-BR')}</span>
                    )}
                    {level.progressPercent !== undefined && (
                      <span>{t('percentCompleted', { percent: level.progressPercent })}</span>
                    )}
                    <span>{t('reqs', { count: level.requirements.length })}</span>
                    <span>{t('skillsCount', { count: level.skills.length })}</span>
                  </div>
                </div>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="text-[10px] sm:text-xs px-2 sm:px-4">
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      {t('details')}
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-full max-w-full sm:w-[540px] overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle className="flex items-center gap-1 sm:gap-2 text-xs sm:text-base">
                        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${config.color}`} />
                        {level.name}
                      </SheetTitle>
                      <SheetDescription className="text-[11px] sm:text-sm">
                        {level.description}
                      </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-2 sm:space-y-6 mt-2 sm:mt-6">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Badge variant="secondary" className={`text-[10px] sm:text-xs ${config.color}`}>{label}</Badge>
                        {level.completedDate && (
                          <span className="text-[10px] sm:text-sm text-muted-foreground">
                            {t('completedOn')} {new Date(level.completedDate).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                        {level.progressPercent !== undefined && (
                          <span className="text-[10px] sm:text-sm text-muted-foreground">
                            {t('percentCompleted', { percent: level.progressPercent })}
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 sm:mb-3 text-xs sm:text-base">{t('requirements')}</h4>
                        <div className="space-y-1 sm:space-y-2">
                          {level.requirements.map((req, index) => (
                            <div key={index} className="flex items-center gap-1 sm:gap-2">
                              <div className="w-2 h-2 rounded-full bg-brand-primary"></div>
                              <span className="text-[11px] sm:text-sm">{req}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 sm:mb-3 text-xs sm:text-base">{t('coreSkills')}</h4>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {level.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-[10px] sm:text-xs px-2 py-0.5">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 sm:mb-3 text-xs sm:text-base">{t('responsibilities')}</h4>
                        <div className="space-y-1 sm:space-y-2">
                          {level.responsibilities.map((resp, index) => (
                            <div key={index} className="flex items-start gap-1 sm:gap-2">
                              <div className="w-2 h-2 rounded-full bg-brand-accent mt-2 flex-shrink-0"></div>
                              <span className="text-[11px] sm:text-sm">{resp}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}