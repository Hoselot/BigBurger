import DefaultLayout from "@/layouts/default";
import Card from "@/components/card";
import Card2 from "@/components/card2";
import Banner from "@/components/banner";

import { title} from "@/components/primitives";
import {Tabs, Tab} from "@heroui/tabs";
import { Button } from "@heroui/button";

const toggleDarkMode = () => {
  const html = document.documentElement;
  const isDark = html.classList.toggle("dark");

  // Guardamos la preferencia
  localStorage.setItem("theme", isDark ? "dark" : "light");
};

export default function IndexPage() {
  
  return (
    <DefaultLayout>
      <section className="w-full  bg-gray-900">
        <Banner/>
        
      </section>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100"><g fill="#111827"><path d="M0 100V0h1000v4L0 100z"></path><path d="M0 100V0h1000v24L0 100z" opacity=".5"></path><path d="M0 100V0h1000v44L0 100z" opacity=".4"></path><path d="M0 100V0h1000v64L0 100z" opacity=".4"></path><path d="M0 100V0h1000v84L0 100z" opacity=".2"></path></g></svg>
      <section className="px-10">
            <span className={title()}>
        Mirá nuestras <span className="bg-yellow-400 px-2 rounded">Hamburguesas</span>&nbsp;
      </span>

      
    
 

      

      </section>
      <Button onClick={toggleDarkMode}>
        Toggle Dark Mode
      </Button>

      <section className="my-10">
      <Card2/>
        {/* <Card/> */}
      </section>
      
    </DefaultLayout>
  );
}
