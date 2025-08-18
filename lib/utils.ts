import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeDate(dateIso: string): string {
  const date = new Date(dateIso);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMin = Math.round(diffMs / 60000);

  const absMin = Math.abs(diffMin);
  if (!Number.isFinite(absMin)) return 'data inválida';

  if (absMin < 60) return diffMin >= 0 ? `em ${absMin} min` : `${absMin} min atrás`;

  const diffHours = Math.round(absMin / 60);
  if (diffHours < 24) return diffMin >= 0 ? `em ${diffHours} h` : `${diffHours} h atrás`;

  const diffDays = Math.round(diffHours / 24);
  return diffMin >= 0 ? `em ${diffDays} d` : `${diffDays} d atrás`;
}
