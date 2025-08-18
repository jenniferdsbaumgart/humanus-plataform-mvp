'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatRelativeDate } from '@/lib/utils';

interface CommunicationCardProps {
  id: string;
  category: string;
  title: string;
  content: string;
  date: string;
  icon: string;
  highlight: boolean;
  author: string;
  authorRole: string;
  compact?: boolean;
}

const categoryColors = {
  'Direção Médica': 'border-l-red-500 bg-red-50',
  'RH': 'border-l-blue-500 bg-blue-50',
  'Coordenação': 'border-l-green-500 bg-green-50',
  'TI': 'border-l-purple-500 bg-purple-50',
  'Qualidade': 'border-l-yellow-500 bg-yellow-50',
  'Segurança': 'border-l-orange-500 bg-orange-50',
  'Eventos': 'border-l-pink-500 bg-pink-50',
  'Direção': 'border-l-indigo-500 bg-indigo-50',
  'Geral': 'border-l-gray-500 bg-gray-50'
};

export function CommunicationCard({
  category,
  title,
  content,
  date,
  icon,
  highlight,
  author,
  authorRole,
  compact = false
}: CommunicationCardProps) {
  const categoryStyle = categoryColors[category as keyof typeof categoryColors] || categoryColors['Geral'];
  
  return (
    <Card className={`rounded-2xl border-l-4 ${categoryStyle} ${highlight ? 'ring-2 ring-red-200' : ''}`}>
      <CardContent className={`${compact ? 'p-4' : 'p-6'}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs font-medium">
              {category}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatRelativeDate(date)}
          </span>
        </div>
        
        <div className="space-y-2">
          <h3 className={`font-semibold flex items-center gap-2 ${compact ? 'text-sm' : 'text-base'}`}>
            <span>{icon}</span>
            {title}
          </h3>
          
          <p className={`text-muted-foreground ${compact ? 'text-xs line-clamp-2' : 'text-sm'}`}>
            {content}
          </p>
          
          {!compact && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
              <span className="font-medium">{author}</span>
              <span>•</span>
              <span>{authorRole}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}