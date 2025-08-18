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

const postSchema = z.object({
  category: z.string().min(1, 'Selecione uma categoria'),
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  content: z.string().min(10, 'Conteúdo deve ter pelo menos 10 caracteres'),
  icon: z.string().optional(),
  highlight: z.boolean().optional()
});

type PostForm = z.infer<typeof postSchema>;

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

const iconOptions = [
  { value: '📢', label: '📢 Anúncio' },
  { value: '🎉', label: '🎉 Celebração' },
  { value: '📚', label: '📚 Educação' },
  { value: '💻', label: '💻 Tecnologia' },
  { value: '⭐', label: '⭐ Destaque' },
  { value: '🛡️', label: '🛡️ Segurança' },
  { value: '🎊', label: '🎊 Evento' },
  { value: '📈', label: '📈 Resultados' },
  { value: '📝', label: '📝 Informação' },
  { value: '🚨', label: '🚨 Urgente' },
  { value: '💡', label: '💡 Dica' },
  { value: '🏆', label: '🏆 Conquista' }
];

export function CreatePostForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAppStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<PostForm>({
    resolver: zodResolver(postSchema),
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
          title: "Postagem criada!",
          description: "Sua comunicação foi publicada no mural com sucesso.",
        });
        reset();
        router.push('/communications');
      } else {
        throw new Error('Erro ao criar postagem');
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar a postagem. Tente novamente.",
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
            <label className="text-sm font-medium">Categoria</label>
            <Select onValueChange={(value) => setValue('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
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
            <label className="text-sm font-medium">Ícone</label>
            <Select onValueChange={(value) => setValue('icon', value)} defaultValue="📝">
              <SelectTrigger>
                <SelectValue placeholder="Selecione um ícone" />
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
            <label className="text-sm font-medium">Título</label>
            <Input
              {...register('title')}
              placeholder="Ex: Reunião Geral - Sexta-feira"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Conteúdo */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Conteúdo</label>
            <Textarea
              {...register('content')}
              placeholder="Descreva os detalhes da comunicação..."
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
              Destacar postagem (borda vermelha)
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
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-brand-primary hover:bg-brand-primary/90"
            >
              {loading ? (
                "Publicando..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Publicar
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}