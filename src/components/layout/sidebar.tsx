'use client';

import Link from 'next/link';
import { Briefcase, LayoutDashboard, Users, HeartHandshake } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Bảng điều khiển' },
  { href: '/candidates', icon: Users, label: 'Ứng viên' },
  { href: '/jobs', icon: Briefcase, label: 'Việc làm' },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
            <HeartHandshake className="h-6 w-6" />
            <span className="text-xl">HR Central</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-4 text-sm font-medium">
            {navItems.map(({ href, icon: Icon, label }) => {
              const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:text-primary',
                    { 'bg-muted text-primary': isActive }
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
