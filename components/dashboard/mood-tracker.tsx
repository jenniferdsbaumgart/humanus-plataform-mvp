'use client';

import { useState, useEffect } from 'react';
import { CalendarDays, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface MoodRecord {
  id: string;
  date: string;
  mood: number;
  tags: string[];
  note?: string;
}

const moodEmojis = ['😔', '😕', '😐', '😊', '😄'];

const availableTags = [
  'produtivo', 'cansado', 'estresse', 'motivado', 'plantão',
  'bem-estar', 'sobrecarga', 'colaborativo', 'neutro', 'reconhecimento',
  'aprendizado', 'desafio', 'equipe'
];

import { useTranslations } from 'next-intl';

export function MoodTracker() {
  const t = useTranslations('Dashboard.MoodTracker');
  const moodLabels = [
    t('labels.1'),
    t('labels.2'),
    t('labels.3'),
    t('labels.4'),
    t('labels.5')
  ];

  const [moods, setMoods] = useState<MoodRecord[]>([]);
  const [currentMood, setCurrentMood] = useState<number>(3);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMoods();
  }, []);

  const fetchMoods = async () => {
    try {
      const response = await fetch('/api/v1/moods');
      const data = await response.json();
      setMoods(data.records || []);
    } catch (error) {
      console.error('Erro ao carregar mood:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitMood = async () => {
    try {
      const response = await fetch('/api/v1/moods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: currentMood,
          tags: selectedTags,
          note: note.trim()
        }),
      });

      if (response.ok) {
        toast({
          title: t('successTitle'),
          description: t('successDesc'),
        });
        fetchMoods();
        setIsDialogOpen(false);
        setNote('');
        setSelectedTags([]);
        setCurrentMood(3);
      }
    } catch (error) {
      toast({
        title: t('errorTitle'),
        description: t('errorDesc'),
        variant: "destructive",
      });
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const recentMoods = moods.slice(0, 7);
  const todayMood = moods.find(m => m.date === new Date().toISOString().split('T')[0]);

  if (loading) {
    return (
      <Card className="rounded-2xl animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="h-16 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
  <Card className="rounded-2xl p-2 sm:p-4">
  <CardHeader className="p-2 sm:p-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <CalendarDays className="h-5 w-5 text-brand-medium" />
              {t('title')}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {t('subtitle')}
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-brand-accent hover:bg-brand-accent/90">
                <Plus className="h-4 w-4 mr-1" />
                {t('register')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <div className="pt-6">
                  <DialogTitle>{t('registerTitle')}</DialogTitle>
                  <DialogDescription>
                    {t('registerDesc')}
                  </DialogDescription>
                </div>
              </DialogHeader>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-3 block">{t('selectMood')}</label>
                  <div className="flex flex-wrap gap-2 overflow-x-auto">
                    {moodEmojis.map((emoji, index) => (
                      <Button
                        key={index}
                        variant={currentMood === index + 1 ? "default" : "outline"}
                        className={`flex-1 h-16 flex-col gap-1 ${
                          currentMood === index + 1 ? 'bg-brand-primary hover:bg-brand-primary/90' : ''
                        }`}
                        onClick={() => setCurrentMood(index + 1)}
                      >
                        <span className="text-2xl">{emoji}</span>
                        <span className="text-xs">{moodLabels[index]}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">{t('tagsOptional')}</label>
                  <div className="flex flex-wrap gap-2 items-center justify-center overflow-x-auto">
                    {availableTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className={`cursor-pointer transition-colors ${
                          selectedTags.includes(tag) ? 'bg-brand-accent hover:bg-brand-accent/90' : ''
                        }`}
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">{t('noteOptional')}</label>
                  <Textarea
                    placeholder={t('notePlaceholder')}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="min-h-[100px] bg-neutral-00"
                  />
                </div>

                <Button onClick={submitMood} className="w-full bg-brand-primary hover:bg-brand-primary/90">
                  {t('registerButton')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
  <CardContent className="p-2 sm:p-4">
        {todayMood ? (
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">{moodEmojis[todayMood.mood - 1]}</div>
            <p className="text-sm text-muted-foreground">
              {t('todayMood')} {moodLabels[todayMood.mood - 1]}
            </p>
            {todayMood.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1 mt-2">
                {todayMood.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center mb-4 text-muted-foreground">
            <p>{t('noMoodToday')}</p>
          </div>
        )}

        {recentMoods.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">{t('last7Days')}</p>
            <div className="flex gap-2 overflow-x-auto">
              {recentMoods.map((mood) => (
                <div key={mood.id} className="flex-shrink-0 text-center">
                  <div className="text-2xl mb-1">{moodEmojis[mood.mood - 1]}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(mood.date).toLocaleDateString('pt-BR', { 
                      day: '2-digit', 
                      month: '2-digit' 
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}