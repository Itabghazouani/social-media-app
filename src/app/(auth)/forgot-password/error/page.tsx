import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password Reset Error",
  description: "Forgot Password Error page",
};

const ForgotPasswordErrorPage = ({
  searchParams,
}: {
  searchParams: { error?: string };
}) => {
  const errorMessage =
    searchParams.error === "invalid-token"
      ? "The password reset link is invalid or has expired."
      : "Something went wrong with your password reset request.";
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="max-w-md rounded-lg bg-card p-8 shadow-lg">
        <div className="mb-6 flex items-center justify-center">
          <div className="rounded-full bg-destructive/10 p-3">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
        </div>
        <h1 className="mb-2 text-center text-2xl font-bold">
          Password Reset Error
        </h1>
        <p className="mb-6 text-center text-muted-foreground">{errorMessage}</p>
        <div className="flex flex-col space-y-3">
          <Link
            href="/forgot-password"
            className="w-full rounded-md bg-primary px-4 py-2 text-center text-primary-foreground hover:bg-primary/90"
          >
            Try Again
          </Link>
          <Link
            href="/login"
            className="w-full rounded-md border border-input bg-background px-4 py-2 text-center hover:bg-accent hover:text-accent-foreground"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ForgotPasswordErrorPage;
