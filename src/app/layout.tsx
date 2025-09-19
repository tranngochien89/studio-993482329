import type { Metadata } from 'next';
import { Alegreya } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

const alegreya = Alegreya({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-alegreya',
});

export const metadata: Metadata = {
  title: 'HR Central',
  description: 'An elegant Recruitment Management System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={cn('font-headline antialiased', alegreya.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
