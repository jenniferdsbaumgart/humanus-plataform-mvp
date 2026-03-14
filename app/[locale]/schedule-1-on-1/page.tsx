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
import { useTranslations } from 'next-intl';

const getScheduleSchema = (t: any) => z.object({
  supervisor: z.string().min(1, t('valSupervisor')),
  type: z.enum(['career-planning', 'feedback', 'development', 'performance'], {
    required_error: t('valType')
  }),
  preferredDate: z.string().min(1, t('valDate')),
  preferredTime: z.string().min(1, t('valTime')),
  duration: z.enum(['30', '45', '60'], {
    required_error: t('valDuration')
  }),
  agenda: z.string().min(10, t('valAgenda')),
  notes: z.string().optional()
});

type ScheduleForm = z.infer<ReturnType<typeof getScheduleSchema>>;

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
  const t = useTranslations('Schedule');
  const tSup = useTranslations('Schedule.Supervisors');
  const tTypes = useTranslations('Schedule.Types');
  
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
    resolver: zodResolver(getScheduleSchema(t)),
    defaultValues: {
      duration: '60'
    }
  });

  const selectedType = watch('type');
  const supervisor = supervisors.find(s => s.id === selectedSupervisor);

  const getSupervisorI18n = (id: string, defItem: any) => {
    switch (id) {
      case 'maria-santos': return { ...defItem, role: tSup('sup1Role'), department: tSup('sup1Dept'), availability: tSup('sup1Avail')};
      case 'roberto-silva': return { ...defItem, role: tSup('sup2Role'), department: tSup('sup2Dept'), availability: tSup('sup2Avail')};
      case 'ana-costa': return { ...defItem, role: tSup('sup3Role'), department: tSup('sup3Dept'), availability: tSup('sup3Avail')};
      default: return defItem;
    }
  }

  const getTypeI18n = (id: string, defItem: any) => {
    switch (id) {
      case 'career-planning': return { ...defItem, label: tTypes('t1Label'), description: tTypes('t1Desc') };
      case 'feedback': return { ...defItem, label: tTypes('t2Label'), description: tTypes('t2Desc') };
      case 'development': return { ...defItem, label: tTypes('t3Label'), description: tTypes('t3Desc') };
      case 'performance': return { ...defItem, label: tTypes('t4Label'), description: tTypes('t4Desc') };
      default: return defItem;
    }
  }

  const onSubmit = async (data: ScheduleForm) => {
    setLoading(true);
    try {
      // Simular envio da solicitação
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: t('successTitle'),
        description: t('successDesc'),
      });
      
      reset();
      router.push('/career-plan');
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
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-2 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <Link href="/career-plan" className="w-full sm:w-auto">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('backBtn')}
              </Button>
            </Link>
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2 sm:gap-3">
                <Calendar className="h-7 w-7 sm:h-8 sm:w-8 text-brand-primary" />
                {t('title')}
              </h1>
              <p className="text-xs sm:text-base text-muted-foreground">
                {t('subtitle')}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
            {/* Formulário Principal */}
            <div className="lg:col-span-2">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">{t('cardDetailsTitle')}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    {t('cardDetailsDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                    {/* Seleção de Supervisor */}
                    <div className="space-y-1 sm:space-y-2">
                      <label className="text-xs sm:text-sm font-medium">{t('supervisorLabel')}</label>
                      <Select onValueChange={(value) => {
                        setValue('supervisor', value);
                        setSelectedSupervisor(value);
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder={t('supervisorPlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          {supervisors.map((s) => {
                            const supInfo = getSupervisorI18n(s.id, s);
                            return (
                              <SelectItem key={s.id} value={s.id}>
                                <div className="flex items-center gap-2">
                                  <Image
                                    src={supInfo.avatar}
                                    alt={supInfo.name}
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                  <div>
                                    <div className="font-medium">{supInfo.name}</div>
                                    <div className="text-xs text-muted-foreground">{supInfo.role}</div>
                                  </div>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      {errors.supervisor && (
                        <p className="text-sm text-red-500">{errors.supervisor.message}</p>
                      )}
                    </div>

                    {/* Tipo de Reunião */}
                    <div className="space-y-1 sm:space-y-2">
                      <label className="text-xs sm:text-sm font-medium">{t('typeLabel')}</label>
                      <Select onValueChange={(value: any) => setValue('type', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder={t('typePlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          {meetingTypes.map((tItem) => {
                            const mtInfo = getTypeI18n(tItem.value, tItem);
                            return (
                              <SelectItem key={tItem.value} value={tItem.value}>
                                <div>
                                  <div className="font-medium">{mtInfo.label}</div>
                                  <div className="text-xs text-muted-foreground">{mtInfo.description}</div>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      {errors.type && (
                        <p className="text-sm text-red-500">{errors.type.message}</p>
                      )}
                    </div>

                    {/* Data e Hora */}
                    <div className="grid gap-2 sm:gap-4 grid-cols-1 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs sm:text-sm font-medium">{t('dateLabel')}</label>
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
                        <label className="text-xs sm:text-sm font-medium">{t('timeLabel')}</label>
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
                      <label className="text-xs sm:text-sm font-medium">{t('durationLabel')}</label>
                      <Select onValueChange={(value: any) => setValue('duration', value)} defaultValue="60">
                        <SelectTrigger>
                          <SelectValue placeholder={t('durationPlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">{t('durationMins', { time: '30' })}</SelectItem>
                          <SelectItem value="45">{t('durationMins', { time: '45' })}</SelectItem>
                          <SelectItem value="60">{t('durationMins', { time: '60' })}</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.duration && (
                        <p className="text-sm text-red-500">{errors.duration.message}</p>
                      )}
                    </div>

                    {/* Agenda */}
                    <div className="space-y-1 sm:space-y-2">
                      <label className="text-xs sm:text-sm font-medium">{t('agendaLabel')}</label>
                      <Textarea
                        {...register('agenda')}
                        placeholder={t('agendaPlaceholder')}
                        className="min-h-[100px]"
                      />
                      {errors.agenda && (
                        <p className="text-sm text-red-500">{errors.agenda.message}</p>
                      )}
                    </div>

                    {/* Notas Adicionais */}
                    <div className="space-y-1 sm:space-y-2">
                      <label className="text-xs sm:text-sm font-medium">{t('notesLabel')}</label>
                      <Textarea
                        {...register('notes')}
                        placeholder={t('notesPlaceholder')}
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
                        t('submittingBtn')
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          {t('submitBtn')}
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
                    <CardTitle className="text-base sm:text-lg">{t('selectedSupTitle')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const supInfo = getSupervisorI18n(supervisor.id, supervisor);
                      return (
                        <>
                          <div className="flex items-center gap-3 mb-4">
                            <Image
                              src={supInfo.avatar}
                              alt={supInfo.name}
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-medium text-sm sm:text-base">{supInfo.name}</div>
                              <div className="text-xs sm:text-sm text-muted-foreground">{supInfo.role}</div>
                              <div className="text-xs text-muted-foreground">{supInfo.department}</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{t('availabilityLabel', { time: supInfo.availability })}</span>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}

              {/* Tipo de Reunião Selecionado */}
              {selectedType && (
                <Card className="rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">{t('selectedTypeTitle')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const baseType = meetingTypes.find(mt => mt.value === selectedType);
                      if (!baseType) return null;
                      const type = getTypeI18n(baseType.value, baseType);
                      return (
                        <div className="space-y-2 sm:space-y-3">
                          <Badge className={type.color + ' text-xs sm:text-sm'}>
                            {type.label}
                          </Badge>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {type.description}
                          </p>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}

              {/* Dicas */}
              <Card className="rounded-2xl bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg text-blue-800">{t('tipsTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-blue-700">
                    <li>{t('tip1')}</li>
                    <li>{t('tip2')}</li>
                    <li>{t('tip3')}</li>
                    <li>{t('tip4')}</li>
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