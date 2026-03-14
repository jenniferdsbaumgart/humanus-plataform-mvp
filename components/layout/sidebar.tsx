'use client';

import { 
  BarChart3,
  BookOpen,
  Calendar,
  Gift,
  Home,
  MessageSquare,
  Settings,
  TrendingUp,
  Users,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { useTranslations } from 'next-intl';

export default function Sidebar({ mobileOpen, onMobileClose }: { mobileOpen?: boolean; onMobileClose?: () => void }) {
  const t = useTranslations('Navigation');
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navigation = [
    {
      name: t('dashboard'),
      href: '/',
      icon: Home,
    },
    {
      name: t('feedback'),
      icon: MessageSquare,
      children: [
        { name: t('feedbackReceived'), href: '/feedback/received' },
        { name: t('feedbackGiven'), href: '/feedback/given' },
        { name: t('feedbackNew'), href: '/feedback/given/new' },
      ],
    },
    {
      name: t('training'),
      href: '/training',
      icon: BookOpen,
    },
    {
      name: t('communications'),
      icon: MessageSquare,
      children: [
        { name: t('communicationsWall'), href: '/communications' },
        { name: t('communicationsNew'), href: '/communications/new' },
      ],
    },
    {
      name: t('careerPlan'),
      href: '/career-plan',
      icon: TrendingUp,
    },
    {
      name: t('rewards'),
      href: '/rewards',
      icon: Gift,
    },
    {
      name: t('settings'),
      href: '/settings',
      icon: Settings,
    },
  ];

  const handleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  // Sidebar content as a function for reuse
  const sidebarContent = (
    <ScrollArea className="flex-1 px-3 py-4">
      <nav className="space-y-2">
        {navigation.map((item) => {
          if (item.children) {
            const isOpen = openDropdown === item.name;
            return (
              <div key={item.name} className="space-y-1">
                <button
                  type="button"
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 text-sm font-medium w-full text-neutral-950 hover:bg-primary/90 hover:text-white rounded-md transition',
                    isOpen && 'bg-muted/30 text-brand-primary'
                  )}
                  onClick={() => handleDropdown(item.name)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                  <span className="ml-auto">
                    {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </span>
                </button>
                {isOpen && (
                  <div className="ml-6 space-y-1 animate-fade-in">
                    {item.children.map((child) => (
                      <Link key={child.href} href={child.href}>
                        <Button
                          variant={pathname === child.href ? 'secondary' : 'ghost'}
                          className={cn(
                            'w-full justify-start text-sm',
                            pathname === child.href && 'bg-brand-primary text-white hover:bg-brand-primary/90'
                          )}
                        >
                          {child.name}
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3',
                  pathname === item.href && 'bg-brand-primary text-white hover:bg-brand-primary/90'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </nav>
    </ScrollArea>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Sheet open={mobileOpen} onOpenChange={onMobileClose}>
        <SheetContent side="left" className="p-0 w-64 block md:hidden">
          {sidebarContent}
        </SheetContent>
      </Sheet>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full w-64 flex-col border-r bg-muted/10">
        {sidebarContent}
      </div>
    </>
  );
}