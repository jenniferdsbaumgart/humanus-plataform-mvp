'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { useLocale } from 'next-intl';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const handleLanguageChange = (value: string) => {
    // pathname here is like /pt-BR/dashboard or /dashboard. 
    // We can simply replace the locale prefix using string manipulation or router APIs.
    // However, with next-intl middleware, we can just replace the first segments if they match the locales.
    
    let newPath = pathname;
    if (pathname.startsWith(`/${currentLocale}`)) {
      newPath = pathname.replace(`/${currentLocale}`, `/${value}`);
    } else {
      newPath = `/${value}${pathname}`;
    }

    router.push(newPath);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={currentLocale} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[120px] h-8 text-xs bg-transparent border-muted">
          <SelectValue placeholder="Idioma" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pt-BR">🇧🇷 PT-BR</SelectItem>
          <SelectItem value="en-GB">🇬🇧 EN-GB</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
