'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { StarRating } from './star-rating';
import { useToast } from '@/hooks/use-toast';
import { MessageSquarePlus, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';

const getFeedbackSchema = (t: any) => z.object({
  to: z.string().min(1, t('valColleague')),
  toRole: z.string().min(1, t('valRole')),
  type: z.enum(['positivo', 'construtivo'], {
    required_error: t('valType')
  }),
  rating: z.number().min(1).max(5),
  title: z.string().min(3, t('valTitle')),
  content: z.string().min(10, t('valContent')),
  tags: z.array(z.string()).optional(),
  anonymous: z.boolean().optional()
});

type FeedbackForm = z.infer<ReturnType<typeof getFeedbackSchema>>;

interface Colleague {
  id: string;
  name: string;
  role: string;
  department: string;
}

const availableTags = [
  'comunicação', 'liderança', 'proatividade', 'organização', 'trabalho em equipe',
  'adaptação', 'conhecimento técnico', 'empatia', 'pontualidade', 'criatividade',
  'resolução de problemas', 'mentoria', 'colaboração', 'inovação', 'dedicação'
];

export function GiveFeedbackForm() {
  const t = useTranslations('Feedbacks.Form');
  const [colleagues, setColleagues] = useState<Colleague[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<FeedbackForm>({
    resolver: zodResolver(getFeedbackSchema(t)),
    defaultValues: {
      rating: 5,
      type: 'positivo',
      anonymous: false
    }
  });

  const selectedColleague = watch('to');
  const rating = watch('rating');

  useEffect(() => {
    fetchColleagues();
  }, []);

  const fetchColleagues = async () => {
    try {
      const response = await fetch('/api/v1/colleagues');
      const data = await response.json();
      setColleagues(data.colleagues || []);
    } catch (error) {
      console.error('Erro ao carregar colegas:', error);
    }
  };

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    setValue('tags', newTags);
  };

  const onSubmit = async (data: FeedbackForm) => {
    setLoading(true);
    try {
      const selectedCol = colleagues.find(c => c.name === data.to);
      
      const response = await fetch('/api/v1/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          toRole: selectedCol?.role || '',
          tags: selectedTags
        })
      });

      if (response.ok) {
        toast({
          title: t('successTitle'),
          description: t('successDesc'),
        });
        reset();
        setSelectedTags([]);
      } else {
        throw new Error('Erro ao enviar feedback');
      }
    } catch (error) {
      toast({
        title: t('errorTitle'),
        description: t('errorDesc'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="rounded-2xl max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquarePlus className="h-6 w-6 text-brand-primary" />
          {t('formTitle')}
        </CardTitle>
        <CardDescription>
          {t('formDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Seleção de Colega */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('colleagueLabel')}</label>
            <Select onValueChange={(value) => setValue('to', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('selectColleague')} />
              </SelectTrigger>
              <SelectContent>
                {colleagues.map((colleague) => (
                  <SelectItem key={colleague.id} value={colleague.name}>
                    <div className="flex flex-col">
                      <span>{colleague.name}</span>
                      <span className="text-xs text-muted-foreground">{colleague.role}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.to && (
              <p className="text-sm text-red-500">{errors.to.message}</p>
            )}
          </div>

          {/* Tipo de Feedback */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('typeLabel')}</label>
            <Select onValueChange={(value: 'positivo' | 'construtivo') => setValue('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('selectType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="positivo">{t('typePositive')}</SelectItem>
                <SelectItem value="construtivo">{t('typeConstructive')}</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          {/* Avaliação */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('ratingLabel')}</label>
            <div className="flex items-center gap-2">
              <StarRating
                rating={rating}
                onRatingChange={(newRating) => setValue('rating', newRating)}
              />
              <span className="text-sm text-muted-foreground">
                {t('starsCount', { rating })}
              </span>
            </div>
            {errors.rating && (
              <p className="text-sm text-red-500">{errors.rating.message}</p>
            )}
          </div>

          {/* Título */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('titleLabel')}</label>
            <Input
              {...register('title')}
              placeholder={t('titlePlaceholder')}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Mensagem */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('contentLabel')}</label>
            <Textarea
              {...register('content')}
              placeholder={t('contentPlaceholder')}
              className="min-h-[120px]"
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content.message}</p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('tagsLabel')}</label>
            <div className="flex flex-wrap gap-2">
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

          {/* Enviar Anonimamente */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous"
              {...register('anonymous')}
            />
            <label
              htmlFor="anonymous"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t('anonLabel')}
            </label>
          </div>

          {/* Botão de Envio */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-primary hover:bg-brand-primary/90"
          >
            {loading ? (
              t('sending')
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {t('sendBtn')}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}