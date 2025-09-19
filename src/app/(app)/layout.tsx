import AppHeader from '@/components/layout/header';
import AppSidebar from '@/components/layout/sidebar';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden md:block">
        <AppSidebar />
      </div>
      <div className="flex flex-col">
        {/* The header is rendered on the client, so it's not here */}
        <main className="flex flex-1 flex-col gap-4 bg-muted/20 p-4 md:gap-8 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
