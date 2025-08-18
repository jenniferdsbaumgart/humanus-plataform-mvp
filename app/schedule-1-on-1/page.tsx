'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Header } from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Send, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const scheduleSchema = z.object({
  supervisor: z.string().min(1, 'Selecione um supervisor'),
  type: z.enum(['career-planning', 'feedback', 'development', 'performance'], {
    required_error: 'Selecione o tipo de reunião'
  }),
  preferredDate: z.string().min(1, 'Selecione uma data preferencial'),
  preferredTime: z.string().min(1, 'Selecione um horário preferencial'),
  duration: z.enum(['30', '45', '60'], {
    required_error: 'Selecione a duração'
  }),
  agenda: z.string().min(10, 'Descreva a agenda com pelo menos 10 caracteres'),
  notes: z.string().optional()
});

type ScheduleForm = z.infer<typeof scheduleSchema>;

const supervisors = [
  {
    id: 'maria-santos',
    name: 'Enfermeira Chefe Maria Santos',
    role: 'Supervisora de Enfermagem',
    department: 'UTI Cardiológica',
    availability: 'Segunda a Sexta, 8h-17h',
    avatar: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: 'roberto-silva',
    name: 'Dr. Roberto Silva',
    role: 'Diretor Médico',
    department: 'Direção Médica',
    availability: 'Terça e Quinta, 14h-18h',
    avatar: 'https://images.pexels.com/photos/612608/pexels-photo-612608.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: 'ana-costa',
    name: 'Ana Costa',
    role: 'Coordenadora de RH',
    department: 'Recursos Humanos',
    availability: 'Segunda a Sexta, 9h-16h',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  }
];

const meetingTypes = [
  {
    value: 'career-planning',
    label: 'Planejamento de Carreira',
    description: 'Discussão sobre objetivos e próximos passos na carreira',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    value: 'feedback',
    label: 'Sessão de Feedback',
    description: 'Avaliação de performance e feedback construtivo',
    color: 'bg-green-100 text-green-800'
  },
  {
    value: 'development',
    label: 'Desenvolvimento Profissional',
    description: 'Identificação de oportunidades de crescimento e treinamento',
    color: 'bg-purple-100 text-purple-800'
  },
  {
    value: 'performance',
    label: 'Avaliação de Performance',
    description: 'Revisão de metas e resultados alcançados',
    color: 'bg-orange-100 text-orange-800'
  }
];

export default function Schedule1on1Page() {
  const [loading, setLoading] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState<string>('');
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<ScheduleForm>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      duration: '60'
    }
  });

  const selectedType = watch('type');
  const supervisor = supervisors.find(s => s.id === selectedSupervisor);

  const onSubmit = async (data: ScheduleForm) => {
    setLoading(true);
    try {
      // Simular envio da solicitação
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Solicitação enviada!",
        description: "Sua solicitação de reunião 1:1 foi enviada. Você receberá uma confirmação em breve.",
      });
      
      reset();
      router.push('/career-plan');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar a solicitação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-2 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <Link href="/career-plan" className="w-full sm:w-auto">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2 sm:gap-3">
                <Calendar className="h-7 w-7 sm:h-8 sm:w-8 text-brand-primary" />
                Agendar Nova Sessão 1:1
              </h1>
              <p className="text-xs sm:text-base text-muted-foreground">
                Solicite uma reunião individual para desenvolvimento profissional
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
            {/* Formulário Principal */}
            <div className="lg:col-span-2">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Detalhes da Reunião</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Preencha as informações para solicitar sua sessão 1:1
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                    {/* Seleção de Supervisor */}
                    <div className="space-y-1 sm:space-y-2">
                      <label className="text-xs sm:text-sm font-medium">Supervisor</label>
                      <Select onValueChange={(value) => {
                        setValue('supervisor', value);
                        setSelectedSupervisor(value);
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um supervisor" />
                        </SelectTrigger>
                        <SelectContent>
                          {supervisors.map((supervisor) => (
                            <SelectItem key={supervisor.id} value={supervisor.id}>
                              <div className="flex items-center gap-2">
                                <Image
                                  src={supervisor.avatar}
                                  alt={supervisor.name}
                                  width={32}
                                  height={32}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                                <div>
                                  <div className="font-medium">{supervisor.name}</div>
                                  <div className="text-xs text-muted-foreground">{supervisor.role}</div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.supervisor && (
                        <p className="text-sm text-red-500">{errors.supervisor.message}</p>
                      )}
                    </div>

                    {/* Tipo de Reunião */}
                    <div className="space-y-1 sm:space-y-2">
                      <label className="text-xs sm:text-sm font-medium">Tipo de Reunião</label>
                      <Select onValueChange={(value: any) => setValue('type', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de reunião" />
                        </SelectTrigger>
                        <SelectContent>
                          {meetingTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div>
                                <div className="font-medium">{type.label}</div>
                                <div className="text-xs text-muted-foreground">{type.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.type && (
                        <p className="text-sm text-red-500">{errors.type.message}</p>
                      )}
                    </div>

                    {/* Data e Hora */}
                    <div className="grid gap-2 sm:gap-4 grid-cols-1 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs sm:text-sm font-medium">Data Preferencial</label>
                        <Input
                          type="date"
                          {...register('preferredDate')}
                          min={new Date().toISOString().split('T')[0]}
                        />
                        {errors.preferredDate && (
                          <p className="text-sm text-red-500">{errors.preferredDate.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs sm:text-sm font-medium">Horário Preferencial</label>
                        <Input
                          type="time"
                          {...register('preferredTime')}
                        />
                        {errors.preferredTime && (
                          <p className="text-sm text-red-500">{errors.preferredTime.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Duração */}
                    <div className="space-y-1 sm:space-y-2">
                      <label className="text-xs sm:text-sm font-medium">Duração</label>
                      <Select onValueChange={(value: any) => setValue('duration', value)} defaultValue="60">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a duração" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutos</SelectItem>
                          <SelectItem value="45">45 minutos</SelectItem>
                          <SelectItem value="60">60 minutos</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.duration && (
                        <p className="text-sm text-red-500">{errors.duration.message}</p>
                      )}
                    </div>

                    {/* Agenda */}
                    <div className="space-y-1 sm:space-y-2">
                      <label className="text-xs sm:text-sm font-medium">Agenda da Reunião</label>
                      <Textarea
                        {...register('agenda')}
                        placeholder="Descreva os tópicos que gostaria de discutir na reunião..."
                        className="min-h-[100px]"
                      />
                      {errors.agenda && (
                        <p className="text-sm text-red-500">{errors.agenda.message}</p>
                      )}
                    </div>

                    {/* Notas Adicionais */}
                    <div className="space-y-1 sm:space-y-2">
                      <label className="text-xs sm:text-sm font-medium">Notas Adicionais (opcional)</label>
                      <Textarea
                        {...register('notes')}
                        placeholder="Informações adicionais ou contexto relevante..."
                        className="min-h-[80px]"
                      />
                    </div>

                    {/* Botão de Envio */}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-brand-primary hover:bg-brand-primary/90 text-xs sm:text-base"
                    >
                      {loading ? (
                        "Enviando solicitação..."
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Solicitar Reunião 1:1
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar com Informações */}
            <div className="space-y-4 sm:space-y-6">
              {/* Supervisor Selecionado */}
              {supervisor && (
                <Card className="rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Supervisor Selecionado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 mb-4">
                      <Image
                        src={supervisor.avatar}
                        alt={supervisor.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-sm sm:text-base">{supervisor.name}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">{supervisor.role}</div>
                        <div className="text-xs text-muted-foreground">{supervisor.department}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Disponibilidade: {supervisor.availability}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tipo de Reunião Selecionado */}
              {selectedType && (
                <Card className="rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">Tipo de Reunião</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const type = meetingTypes.find(t => t.value === selectedType);
                      return type ? (
                        <div className="space-y-2 sm:space-y-3">
                          <Badge className={type.color + ' text-xs sm:text-sm'}>
                            {type.label}
                          </Badge>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {type.description}
                          </p>
                        </div>
                      ) : null;
                    })()}
                  </CardContent>
                </Card>
              )}

              {/* Dicas */}
              <Card className="rounded-2xl bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg text-blue-800">💡 Dicas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-blue-700">
                    <li>• Seja específico sobre os tópicos que deseja discutir</li>
                    <li>• Prepare perguntas antecipadamente</li>
                    <li>• Considere seus objetivos de carreira</li>
                    <li>• Traga exemplos concretos quando relevante</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}