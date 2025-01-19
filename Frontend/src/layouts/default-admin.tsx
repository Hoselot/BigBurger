import {Sidebar} from '@/components/sidebar'

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Sidebar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16 ml-[100px]">
        {children}
      </main>
      
      
      
      
    </div>
  );
}


