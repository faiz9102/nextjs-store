import AuthForm from "@/app/components/auth/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account | Login / Signup",
};

export default function AccountPage() {
  return (
    <div className="pt-24 sm:pt-28 md:pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Account</h1>
        <p className="text-gray-600 mb-6">Login to your account or create a new one.</p>
        <AuthForm />
      </div>
    </div>
  );
}
