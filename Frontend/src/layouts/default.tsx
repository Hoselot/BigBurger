

import { Navbar } from "@/components/navbar";

import BotonLogin from "../components/modal";

import { Footer } from "../components/footer";
export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="w-full mx-auto px-0 flex-grow pt-16">
        {children}
      </main>
      <Footer />
       <BotonLogin />
      
    </div>
  );
}
