import Image from "next/image";
import Link from "next/link";
import forgotPasswordImage from "@/assets/login-image.jpg";
import { Metadata } from "next";
import ForgotPasswordForm from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Forgot Password page",
};

const ForgotPasswordPage = () => {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-3 text-center">
            <h1 className="text-3xl font-bold">Forgot Your Password?</h1>
            <p className="text-muted-foreground">
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </p>
          </div>
          <div className="space-y-5">
            <ForgotPasswordForm />
            <div className="flex flex-col space-y-2 text-center">
              <Link href="/login" className="hover:underline">
                Remember your password? Log in
              </Link>
              <Link href="/signup" className="hover:underline">
                Don&apos;t have an account? Sign up
              </Link>
            </div>
          </div>
        </div>
        <Image
          src={forgotPasswordImage}
          alt="Forgot Password Image"
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
