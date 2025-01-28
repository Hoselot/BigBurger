
import DefaultLayout from "@/layouts/default-admin";
import  TableCrud  from "@/components/table-element";
export default function DocsPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 ml-20 px-1 py-8 md:py-10">
        <div className="inline-block w-full text-start justify-start ">
          
          <TableCrud/>
        </div>
      </section>
    </DefaultLayout>
  );
}
