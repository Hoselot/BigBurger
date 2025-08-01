import { Sidebar } from '@/components/sidebar';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Sidebar /> {/* ✅ sin props */}
      <main
        className="container mx-auto max-w-7xl px-6 flex-grow pt-16 md:pt-4 md:ml-[240px]"
      >
        {children}
      </main>
    </div>
  );
}