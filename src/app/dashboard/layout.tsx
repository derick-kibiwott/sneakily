import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your account from one place",
};

export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return <div>{children}</div>;
}
