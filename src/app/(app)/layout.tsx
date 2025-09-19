
export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* The sidebar is rendered on the client so it's not here */}
      <div className="flex flex-col">
        {children}
      </div>
    </div>
  );
}
