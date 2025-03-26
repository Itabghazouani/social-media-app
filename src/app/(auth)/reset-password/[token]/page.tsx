import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import resetPasswordImage from "@/assets/login-image.jpg";
import { validatePasswordResetToken } from "@/lib/passwordReset";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset Password page",
  other: {
    "referrer-policy": "strict-origin",
  },
};

interface IResetPasswordPageProps {
  params: {
    token: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}
const ResetPasswordPage = async ({ params }: IResetPasswordPageProps) => {
  const userId = await validatePasswordResetToken(params.token);

  if (!userId) {
    redirect("/forgot-password?error=invalid-token");
  }

  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-3 text-center">
            <h1 className="text-3xl font-bold">Reset Your Password</h1>
            <p className="text-muted-foreground">
              Create a new secure password for your account.
            </p>
          </div>
          <div className="space-y-5">
            <ResetPasswordForm token={params.token} />
            <div className="flex flex-col space-y-2 text-center">
              <Link href="/login" className="hover:underline">
                Remember your password? Log in
              </Link>
            </div>
          </div>
        </div>
        <Image
          src={resetPasswordImage}
          alt="Reset Password Image"
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
};

export default ResetPasswordPage;
