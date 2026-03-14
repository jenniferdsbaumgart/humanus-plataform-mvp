'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { TrainingModal } from '@/components/training/training-modal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, Star, Play } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface Training {
  id: string;
  title: string;
  description: string;
  duration: number;
  points: number;
  tags: string[];
  difficulty: string;
  progress: number;
  thumbnail: string;
  content: string;
  quiz: Array<{
    question: string;
    options: string[];
    correct: number;
  }>;
}

export default function TrainingPage() {
  const t = useTranslations('Training');
  const tDiff = useTranslations('Training.Difficulty');
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const response = await fetch('/api/v1/training');
      const data = await response.json();
      setTrainings(data.courses || []);
    } catch (error) {
      console.error(t('errorLoading'), error);
    } finally {
      setLoading(false);
    }
  };

  const openTraining = (training: Training) => {
    setSelectedTraining(training);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTraining(null);
  };

  const difficultyColors = {
    'básico': 'bg-green-100 text-green-800',
    'intermediário': 'bg-yellow-100 text-yellow-800',
    'avançado': 'bg-red-100 text-red-800'
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'básico': return tDiff('basic');
      case 'intermediário': return tDiff('intermediate');
      case 'avançado': return tDiff('advanced');
      default: return difficulty;
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
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 bg-gray-200 rounded-2xl"></div>
                ))}
              </div>
            </div>
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
        <main className="flex-1 p-6 space-y-6 max-w-6xl">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-brand-primary" />
              {t('title')}
            </h1>
            <p className="text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trainings.map((training) => (
              <Card key={training.id} className="flex flex-col justify-between rounded-2xl overflow-hidden hover:shadow-lg transition-shadow relative">
                <CardHeader className="pb-3">
                  <div className="relative h-32 w-full">
                  <Image
                    src={training.thumbnail}
                    alt={training.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    priority={true}
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className={difficultyColors[training.difficulty as keyof typeof difficultyColors]}>
                      {getDifficultyLabel(training.difficulty)}
                    </Badge>
                  </div>
                </div>
                  <CardTitle className="text-lg">{training.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {training.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {t('duration', { duration: training.duration })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {t('points', { points: training.points })}
                    </div>
                  </div>

                  {training.progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{t('progress')}</span>
                        <span>{training.progress}%</span>
                      </div>
                      <Progress value={training.progress} className="h-2" />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {training.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {training.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{training.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <Button
                    onClick={() => openTraining(training)}
                    className="w-full bg-gradient-to-r from-brand-primary to-brand-medium hover:from-brand-primary/90 hover:to-brand-medium/90"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {training.progress > 0 ? t('continueBtn') : t('startBtn')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {trainings.length === 0 && (
            <Card className="rounded-2xl">
              <CardContent className="pt-6 text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t('notFound')}</p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      <TrainingModal
        training={selectedTraining}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}