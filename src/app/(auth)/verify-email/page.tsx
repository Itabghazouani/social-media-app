import { redirect } from "next/navigation";
import { validateRequest } from "@/auth";
import { Metadata } from "next";
import EmailVerificationForm from "./EmailVerificationForm";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email to continue.",
};

const VerifyEmailPage = async () => {
  const { user } = await validateRequest();

  if (!user) redirect("/login");

  if (user.emailVerified) redirect("/");

  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-card p-8 shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Verify Your Email</h1>
          <p className="text-muted-foreground">
            We&apos;ve sent a verification code to{" "}
            <span className="font-medium">{user.email}</span>. Please enter the
            code below to verify your email address.
          </p>
        </div>
        <EmailVerificationForm userEmail={user.email || ""} />
      </div>
    </main>
  );
};

export default VerifyEmailPage;
