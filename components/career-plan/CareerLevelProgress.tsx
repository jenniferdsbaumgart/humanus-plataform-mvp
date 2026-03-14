'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, Target } from 'lucide-react';
import { CareerPlan } from '@/types/career-plan';
import { useTranslations } from 'next-intl';

interface CareerLevelProgressProps {
  careerPlan: CareerPlan;
}

export function CareerLevelProgress({ careerPlan }: CareerLevelProgressProps) {
  const t = useTranslations('CareerPlan.CareerLevelProgress');
  const currentLevel = careerPlan.levels.find(level => level.id === careerPlan.currentLevelId);
  const nextLevel = careerPlan.levels.find(level => level.id === careerPlan.nextLevelId);
  
  const experienceYears = Math.floor(careerPlan.totalExperience / 12);
  const experienceMonths = careerPlan.totalExperience % 12;

  return (
    <Card className="rounded-xl bg-gradient-to-br from-brand-primary/5 to-brand-medium/5 border-brand-primary/20 w-full max-w-[410px] sm:max-w-[90vw] flex flex-col p-2 sm:p-0">
      <CardHeader className="p-3 sm:p-6 pb-2">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col xs:flex-row xs:justify-between gap-1 w-full">
            <div className="text-left">
              <CardTitle className="text-lg sm:text-2xl font-bold text-brand-primary leading-tight">
                {t('currentLevel')} {careerPlan.currentLevel}
              </CardTitle>
              <CardDescription className="text-sm sm:text-base mt-1 sm:mt-2">
                {currentLevel?.description}
              </CardDescription>
            </div>
            <div className="text-left xs:text-right mt-1 xs:mt-0">
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-1">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>
                  {experienceYears > 0 && t('experienceYears', { years: experienceYears, suffixY: experienceYears > 1 ? 's' : '' })}
                  {experienceYears > 0 && experienceMonths > 0 && t('experienceAnd')}
                  {experienceMonths > 0 && t('experienceMonths', { months: experienceMonths, suffixM: experienceMonths > 1 ? 'es' : '' })}
                  {t('experienceOf')}
                </span>
              </div>
              {careerPlan.specializations.length > 0 && (
                <div className="flex gap-1 flex-wrap justify-start xs:justify-end">
                  {careerPlan.specializations.map((spec) => (
                    <Badge key={spec} variant="secondary" className="text-[10px] sm:text-xs px-2 py-0.5">
                      {spec}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-3 sm:p-6 pt-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 sm:gap-2">
              <Target className="h-4 w-4 sm:h-5 sm:w-5 text-brand-medium" />
              <span className="font-medium text-xs sm:text-base">{t('progressTo', { nextLevel: careerPlan.nextLevel })}</span>
            </div>
            <span className="text-xs sm:text-sm font-medium text-brand-primary">
              {careerPlan.overallProgress}%
            </span>
          </div>
          <Progress 
            value={careerPlan.overallProgress} 
            className="h-2 sm:h-3 bg-gray-200"
          />
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t('percentToNext', { percent: 100 - careerPlan.overallProgress })}
          </p>
        </div>
        {nextLevel && (
          <div className="bg-white/60 rounded-lg p-3 sm:p-4 border border-brand-primary/10">
            <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-brand-accent" />
              <span className="font-medium text-brand-primary text-xs sm:text-base">{t('nextGoal')}</span>
            </div>
            <h4 className="font-semibold mb-1 sm:mb-2 text-xs sm:text-base">{nextLevel.name}</h4>
            <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">{nextLevel.description}</p>
            <div className="space-y-1 sm:space-y-2">
              <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t('keyRequirements')}
              </p>
              <div className="flex flex-wrap gap-1">
                {nextLevel.requirements.slice(0, 3).map((req, index) => (
                  <Badge key={index} variant="outline" className="text-[10px] sm:text-xs px-2 py-0.5">
                    {req}
                  </Badge>
                ))}
                {nextLevel.requirements.length > 3 && (
                  <Badge variant="outline" className="text-[10px] sm:text-xs px-2 py-0.5">
                    {t('moreReqs', { count: nextLevel.requirements.length - 3 })}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}