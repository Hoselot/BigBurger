
import DefaultLayout from "@/layouts/default";
import Card from "@/components/card";
import Banner from "@/components/banner";
export default function IndexPage() {
  return (
    <DefaultLayout>
      <section>
        <Banner/>
      </section>
      
      <section>
        <Card/>
      </section>
    </DefaultLayout>
  );
}
