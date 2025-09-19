'use client';

import Link from 'next/link';
import { Briefcase, LayoutDashboard, Users, HeartHandshake } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Bảng điều khiển' },
  { href: '/candidates', icon: Users, label: 'Ứng viên' },
  { href: '/jobs', icon: Briefcase, label: 'Việc làm' },
];

function SidebarNav() {
    const pathname = usePathname();
    return (
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
    );
}

export default function AppSidebar() {
  return (
    <>
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
              <HeartHandshake className="h-6 w-6" />
              <span className="text-xl">HR Central</span>
            </Link>
          </div>
          <div className="flex-1">
            <SidebarNav />
          </div>
        </div>
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden fixed top-3 left-4 z-40">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0 w-[280px]">
            <div className="flex h-16 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
                    <HeartHandshake className="h-6 w-6" />
                    <span className="text-xl">HR Central</span>
                </Link>
            </div>
            <div className="flex-1 py-2">
                <SidebarNav />
            </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
