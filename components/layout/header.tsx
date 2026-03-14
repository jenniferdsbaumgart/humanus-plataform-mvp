'use client';

import { Bell, Moon, Sun, User, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppStore } from '@/lib/store';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import { useState } from 'react';
import Sidebar from './sidebar';
import { LanguageSwitcher } from './language-switcher';

export function Header() {
  const { theme, setTheme } = useTheme();
  const { user } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-screen border-b bg-card backdrop-blur supports-[backdrop-filter]:bg-card">
      {/* Mobile Sidebar Drawer */}
      <div className="flex h-16 items-center justify-between px-4 md:px-8 w-full">
        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <Image src="/humanus.png" alt="Humanus" width={120} height={25} className="md:w-[180px] md:h-[50px]" />
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Score Badge */}
          <div className="hidden md:flex w-64 h-12 items-center gap-5 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-medium p-3 text-white">
            <div className="text-right">
              <div className="text-sm font-medium">Nível {user.score.level}</div>
              <div className="text-xs opacity-90">{user.score.total} pontos</div>
            </div>
            <div className="w-30">
              <Progress value={user.score.progress} className="h-2 bg-white/20" />
              <div className="text-xs mt-1 opacity-90">
                {user.score.nextLevelAt - user.score.total} para próximo nível
              </div>
            </div>
          </div>

          <LanguageSwitcher />

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="h-9 w-9"
          >
            <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Alternar tema</span>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="h-9 w-9 relative">
            <Bell className="h-6 w-6" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-brand-accent">
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem>
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}