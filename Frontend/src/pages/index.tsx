import DefaultLayout from "@/layouts/default";
import Card from "@/components/card";
import Banner from "@/components/banner";
import  Buscador  from "@/components/search";
import { title} from "@/components/primitives";
import {Tabs, Tab} from "@heroui/tabs";
export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="w-full">
        <Banner/>
      </section>
      <section className="mt-5">
      <span className={title()}>
  Mirá nuestras <span className="bg-yellow-400 px-2 rounded">Hamburguesas</span>&nbsp;
</span>

      <div className="flex justify-between items-center">
      <Buscador/>
      <div>
      <h1 className="text-sm">Filtrá</h1>
      <Tabs aria-label="Options">
        <Tab key="photos" title="Carne"></Tab>
        <Tab key="music" title="Pollo"></Tab>
        <Tab key="asdads" title="Pescado"></Tab>
        <Tab key="masdas" title="Vegetariano"></Tab>
      </Tabs>

      </div>
    </div>
 

      

      </section>
      <section>
        <Card/>
      </section>
    </DefaultLayout>
  );
}
