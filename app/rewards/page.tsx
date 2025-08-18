'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { Gift, Search, Star, Clock } from 'lucide-react';
import Image from 'next/image';

interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  category: string;
  available: boolean;
  image: string;
  estimatedDelivery: string;
}

const categoryColors = {
  'alimentação': 'bg-orange-100 text-orange-800',
  'educação': 'bg-blue-100 text-blue-800',
  'bem-estar': 'bg-green-100 text-green-800',
  'tempo': 'bg-purple-100 text-purple-800',
  'comodidade': 'bg-yellow-100 text-yellow-800',
  'tecnologia': 'bg-indigo-100 text-indigo-800'
};

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const { user } = useAppStore();
  const { toast } = useToast();

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const response = await fetch('/api/v1/rewards');
      const data = await response.json();
      setRewards(data.items || []);
    } catch (error) {
      console.error('Erro ao carregar recompensas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (reward: Reward) => {
    if (!user || user.score.total < reward.cost) return;

    setRedeeming(reward.id);
    try {
      const response = await fetch('/api/v1/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rewardId: reward.id,
          userId: user.id
        })
      });

      if (response.ok) {
        toast({
          title: "Recompensa resgatada!",
          description: `${reward.title} foi resgatada com sucesso!`,
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível resgatar a recompensa.",
        variant: "destructive",
      });
    } finally {
      setRedeeming(null);
    }
  };

  const filteredRewards = rewards.filter(reward => {
    const matchesSearch = reward.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reward.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || reward.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(rewards.map(r => r.category))];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, i) => (
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
        <main className="flex-1 p-6 space-y-6 max-w-7xl">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
              <Gift className="h-8 w-8 text-brand-primary" />
              Catálogo de Recompensas
            </h1>
            <p className="text-md text-muted-foreground">
              Resgate recompensas incríveis com seus pontos acumulados
            </p>
            {user && (
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">Seus pontos: {user.score.total}</span>
              </div>
            )}
          </div>

          {/* Filtros */}
          <Card className="rounded-2xl">
            <CardContent className="pt-6">
              <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar recompensas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Grid de Recompensas */}
          <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredRewards.map((reward) => {
              const canAfford = user && user.score.total >= reward.cost;
              const pointsNeeded = user ? Math.max(0, reward.cost - user.score.total) : reward.cost;

              return (
                <Card key={reward.id} className="rounded-lg overflow-hidden hover:shadow-md transition-shadow relative flex flex-col p-2 sm:p-3">
                  <div className="relative pt-[45%] sm:pt-[55%]">
                    <Image
                      src={reward.image}
                      alt={reward.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      style={{ objectFit: 'cover' }}
                      priority={true}
                    />
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                      <Badge
                        className={`text-[10px] sm:text-xs px-1.5 py-0.5 ${categoryColors[reward.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800'}`}
                      >
                        {reward.category}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-1 sm:pb-2">
                    <CardTitle className="text-[15px] text-center sm:text-base line-clamp-2 min-h-[2.5em]">{reward.title}</CardTitle>
                    <CardDescription className="text-[13px] sm:text-xs line-clamp-2 min-h-[2.5em]">
                      {reward.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                        <span className="font-bold text-md sm:text-base">{reward.cost}</span>
                        <span className="text-[13px] sm:text-md text-muted-foreground">pontos</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {reward.estimatedDelivery}
                    </div>
                    {reward.available ? (
                      canAfford ? (
                        <Button
                          onClick={() => handleRedeem(reward)}
                          disabled={redeeming === reward.id}
                          className="w-full bg-brand-primary hover:bg-brand-primary/90 text-[13px] sm:text-xs py-1.5 sm:py-2"
                        >
                          {redeeming === reward.id ? 'Resgatando...' : 'Resgatar'}
                        </Button>
                      ) : (
                        <Button
                          disabled
                          variant="outline"
                          className="w-full text-[10px] sm:text-xs py-1.5 sm:py-2"
                        >
                          Precisa de {pointsNeeded} pontos
                        </Button>
                      )
                    ) : (
                      <Button
                        disabled
                        variant="outline"
                        className="w-full text-[10px] sm:text-xs py-1.5 sm:py-2"
                      >
                        Esgotado
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredRewards.length === 0 && (
            <Card className="rounded-2xl">
              <CardContent className="pt-6 text-center py-12">
                <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma recompensa encontrada.</p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}