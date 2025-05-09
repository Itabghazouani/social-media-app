import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import signUpImage from "@/assets/cookingsignup.jpg";
import SignUpForm from "./SignUpForm";
export const metadata: Metadata = {
  title: "Sign Up",
};

const SignUpPage = () => {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">Sign Up to PlateMates</h1>
            <p className="text-muted-foreground">Cooking is better together.</p>
          </div>
          <div className="space-y-5">
            <SignUpForm />
            <Link href="/login" className="block text-center hover:underline">
              Already have an account? Log in
            </Link>
          </div>
        </div>
        <Image
          src={signUpImage}
          alt="Sign Up Image"
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
};

export default SignUpPage;
