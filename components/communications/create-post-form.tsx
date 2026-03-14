'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/lib/store';
import { MessageSquarePlus, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useTranslations } from 'next-intl';

// Criamos uma função para retornar o schema validado já com as traduções dinâmicas
const getPostSchema = (t: any) => z.object({
  category: z.string().min(1, t('validationCat')),
  title: z.string().min(3, t('validationTitle')),
  content: z.string().min(10, t('validationContent')),
  icon: z.string().optional(),
  highlight: z.boolean().optional()
});

type PostForm = z.infer<ReturnType<typeof getPostSchema>>;

const categories = [
  'Direção Médica',
  'RH',
  'Coordenação',
  'TI',
  'Qualidade',
  'Segurança',
  'Eventos',
  'Direção',
  'Geral'
];

export function CreatePostForm() {
  const t = useTranslations('Communications.Form');
  const tCat = useTranslations('Communications.Categories');
  const tIcon = useTranslations('Communications.Icons');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAppStore();
  const router = useRouter();
  
  const iconOptions = [
    { value: '📢', label: tIcon('announcement') },
    { value: '🎉', label: tIcon('celebration') },
    { value: '📚', label: tIcon('education') },
    { value: '💻', label: tIcon('tech') },
    { value: '⭐', label: tIcon('highlight') },
    { value: '🛡️', label: tIcon('safety') },
    { value: '🎊', label: tIcon('event') },
    { value: '📈', label: tIcon('results') },
    { value: '📝', label: tIcon('info') },
    { value: '🚨', label: tIcon('urgent') },
    { value: '💡', label: tIcon('tip') },
    { value: '🏆', label: tIcon('achievement') }
  ];

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'Direção Médica': return tCat('medical');
      case 'RH': return tCat('hr');
      case 'Coordenação': return tCat('coordination');
      case 'TI': return tCat('it');
      case 'Qualidade': return tCat('quality');
      case 'Segurança': return tCat('safety');
      case 'Eventos': return tCat('events');
      case 'Direção': return tCat('direction');
      case 'Geral': return tCat('general');
      default: return category;
    }
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<PostForm>({
    resolver: zodResolver(getPostSchema(t)),
    defaultValues: {
      icon: '📝',
      highlight: false
    }
  });

  const onSubmit = async (data: PostForm) => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          author: user?.name || 'Usuário',
          authorRole: user?.role || 'Profissional'
        })
      });

      if (response.ok) {
        toast({
          title: t('successTitle'),
          description: t('successDesc'),
        });
        reset();
        router.push('/communications');
      } else {
        throw new Error('Erro ao criar postagem');
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
          Nova Postagem
        </CardTitle>
        <CardDescription>
          Compartilhe informações importantes com toda a equipe
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Categoria */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('selectCat')}</label>
            <Select onValueChange={(value) => setValue('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('selectCat')} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {getCategoryLabel(category)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>

          {/* Ícone */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('iconLabel')}</label>
            <Select onValueChange={(value) => setValue('icon', value)} defaultValue="📝">
              <SelectTrigger>
                <SelectValue placeholder={t('selectIcon')} />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((icon) => (
                  <SelectItem key={icon.value} value={icon.value}>
                    {icon.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

          {/* Conteúdo */}
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

          {/* Destacar */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="highlight"
              {...register('highlight')}
            />
            <label
              htmlFor="highlight"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t('highlight')}
            </label>
          </div>

          {/* Botão de Envio */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-brand-primary hover:bg-brand-primary/90"
            >
              {loading ? (
                t('publishing')
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {t('publish')}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}