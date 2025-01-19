import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default-admin";
import  TableCrud  from "@/components/table";
export default function DocsPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-start justify-start">
          <h1 className={title()}>About</h1>
            <TableCrud/>
        </div>
      </section>
    </DefaultLayout>
  );
}
