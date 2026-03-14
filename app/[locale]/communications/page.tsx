'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { CommunicationCard } from '@/components/communications/communication-card';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface Communication {
  id: string;
  category: string;
  title: string;
  content: string;
  date: string;
  icon: string;
  highlight: boolean;
  author: string;
  authorRole: string;
}

export default function CommunicationsPage() {
  const t = useTranslations('Communications');
  const tCat = useTranslations('Communications.Categories');
  
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

  const [communications, setCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchCommunications();
  }, []);

  const fetchCommunications = async () => {
    try {
      const response = await fetch('/api/v1/communications');
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      setCommunications(data.posts || []);
    } catch (error) {
      console.error(t('errorLoading'), error);
      console.error('Error details:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCommunications = communications.filter(comm => {
    const matchesSearch = comm.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comm.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comm.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || comm.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(communications.map(c => c.category))];

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
                  <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
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
        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          <div className="flex flex-col items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <MessageSquare className="h-8 w-8 text-brand-primary" />
                {t('title')}
              </h1>
              <p className="text-muted-foreground">
                {t('subtitle')}
              </p>
            </div>
            <Link href="/communications/new">
              <Button className="bg-brand-primary hover:bg-brand-primary/90 pt-2 mt-3">
                <Plus className="h-4 w-4 mr-2" />
                {t('newPost')}
              </Button>
            </Link>
          </div>

          {/* Filtros */}
          <Card className="rounded-2xl">
            <CardContent className="pt-6">
              <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t('category')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('allCategories')}</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {getCategoryLabel(category)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Comunicações */}
          <div className="space-y-4">
            {filteredCommunications.length === 0 ? (
              <Card className="rounded-2xl">
                <CardContent className="pt-6 text-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">{t('notFound')}</p>
                  <Link href="/communications/new">
                    <Button className="bg-brand-primary hover:bg-brand-primary/90">
                      <Plus className="h-4 w-4 mr-2" />
                      {t('createFirst')}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              filteredCommunications.map((communication) => (
                <CommunicationCard
                  key={communication.id}
                  {...communication}
                />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}