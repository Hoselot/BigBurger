import { Sidebar } from '@/components/sidebar';
import { useState } from "react"
export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="relative flex flex-col h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main
        className={`container mx-auto max-w-7xl px-6 flex-grow pt-16 transition-all duration-300 ${
          collapsed ? 'ml-[90px]' : 'ml-[240px]'
        }`}
      >
        {children}
      </main>
    </div>
  );
}
