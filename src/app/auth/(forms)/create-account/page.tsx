import { CreateAccountForm } from "@/components/auth/create-account-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a new account",
};

export default function CreateAccountPage() {
  return <CreateAccountForm />;
}
