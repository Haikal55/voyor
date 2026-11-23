import type { Metadata } from "next";
import { getCurrentUserAction } from "../actions/auth";
import { redirect } from "next/navigation";
import { LoginClientPage } from "./LoginClientPage";

export const metadata: Metadata = {
  title: "Sign In or Register | VOYOR Official Online Boutique",
  description:
    "Sign in to your VOYOR client account to view order history, manage private atelier appointments, and curate your personal collection.",
};

export default async function LoginPage() {
  const user = await getCurrentUserAction();

  if (user) {
    redirect("/account");
  }

  return <LoginClientPage />;
}
