'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Search, Star, Clock, User } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Feedback {
  id: string;
  from: string;
  fromRole: string;
  date: string;
  title: string;
  content: string;
  tags: string[];
  isRead: boolean;
  rating: number;
}

export default function ReceivedFeedback() {
  const t = useTranslations('Feedbacks');
  const tReceived = useTranslations('Feedbacks.Received');
  
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch('/api/v1/feedback?type=received');
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      setFeedbacks(result.data || []);
    } catch (error) {
      console.error(t('errorLoadingReceived'), error);
      console.error('Error details:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (feedbackId: string) => {
    setFeedbacks(prev =>
      prev.map(feedback =>
        feedback.id === feedbackId
          ? { ...feedback, isRead: true }
          : feedback
      )
    );
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedPeriod === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return matchesSearch && new Date(feedback.date) >= weekAgo;
    }
    
    if (selectedPeriod === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return matchesSearch && new Date(feedback.date) >= monthAgo;
    }
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
  <main className="flex-1 p-2 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl">
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{tReceived('title')}</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {tReceived('subtitle')}
            </p>
          </div>

          {/* Filtros */}
          <Card className="rounded-2xl">
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 items-center">
                <div className="flex-1 relative w-full">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('searchPlaceholderReceived')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 text-sm"
                  />
                </div>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-full sm:w-[180px] text-sm">
                    <SelectValue placeholder={t('period')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('all')}</SelectItem>
                    <SelectItem value="week">{t('week')}</SelectItem>
                    <SelectItem value="month">{t('month')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lista de feedbacks */}
          <div className="space-y-2 sm:space-y-4">
            {filteredFeedbacks.length === 0 ? (
              <Card className="rounded-2xl">
                <CardContent className="pt-6 text-center py-12">
                  <p className="text-muted-foreground">{tReceived('notFound')}</p>
                </CardContent>
              </Card>
            ) : (
              filteredFeedbacks.map((feedback) => (
                <Card key={feedback.id} className={`rounded-2xl transition-colors ${!feedback.isRead ? 'border-brand-primary/50 bg-brand-primary/5' : ''}`}>
                  <CardContent className="p-3 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-0">
                      <div className="space-y-2 sm:space-y-3 flex-1">
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-sm sm:text-base">{feedback.from}</span>
                            <span className="text-xs sm:text-sm text-muted-foreground">• {feedback.fromRole}</span>
                          </div>
                          {!feedback.isRead && (
                            <Badge variant="secondary" className="bg-brand-primary text-white text-xs sm:text-sm">
                              {t('newBadge')}
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold text-base sm:text-lg">{feedback.title}</h3>
                        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground flex-wrap">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {new Date(feedback.date).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{feedback.rating}/5</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground line-clamp-2 text-xs sm:text-base">
                          {feedback.content}
                        </p>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {feedback.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs sm:text-sm px-2 sm:px-4"
                            onClick={() => markAsRead(feedback.id)}
                          >
                            {t('seeFull')}
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-full max-w-full sm:w-[540px] overflow-y-auto">
                          <SheetHeader>
                            <SheetTitle>{feedback.title}</SheetTitle>
                            <SheetDescription>
                              {tReceived('feedbackFrom', { from: feedback.from, role: feedback.fromRole })}
                            </SheetDescription>
                          </SheetHeader>
                          <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                {new Date(feedback.date).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </div>
                              <div className="flex items-center gap-1 sm:gap-2">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs sm:text-sm">{feedback.rating}/5</span>
                              </div>
                            </div>
                            <div className="prose prose-sm max-w-none">
                              <p className="whitespace-pre-line">{feedback.content}</p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">{t('tags')}</h4>
                              <div className="flex flex-wrap gap-1 sm:gap-2">
                                {feedback.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}