import { Navbar } from "@/layouts/navbar";

export default function CommonLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
