import { Footer } from "@/layouts/footer";
import { Navbar } from "@/layouts/navbar";

export default function CommonLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl space-y-24 px-4 lg:px-6">
        {children}
      </main>
      <Footer />
    </>
  );
}
