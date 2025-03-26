"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verificationSchema, VerificationValues } from "@/lib/validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components";
import { useTransition } from "react";
import { verifyEmail, resendVerificationCode } from "./actions";
import { useRouter } from "next/navigation";

const EmailVerificationForm = ({ userEmail }: { userEmail: string }) => {
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [isPending, startVerifyTransition] = useTransition();
  const [isResending, startResendTransition] = useTransition();
  const router = useRouter();

  const form = useForm<VerificationValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = (values: VerificationValues) => {
    setError(undefined);
    setSuccess(undefined);
    startVerifyTransition(async () => {
      const result = await verifyEmail(values.code);
      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        // Set success message before redirecting
        setSuccess("Email verified successfully! Redirecting...");
        // Manual redirect after a short delay to show success message
        if (result.redirectUrl) {
          // Use Next.js router for client-side navigation
          router.push(result.redirectUrl);
        }
      }
    });
  };

  const handleResendCode = () => {
    setError(undefined);
    setSuccess(undefined);
    startResendTransition(async () => {
      const result = await resendVerificationCode();
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess("A new verification code has been sent to your email");
      }
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-center text-sm text-muted-foreground">
        A verification code has been sent to{" "}
        <span className="font-medium">{userEmail}</span>
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {error && <p className="text-center text-destructive">{error}</p>}
          {success && <p className="text-center text-green-500">{success}</p>}
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter 6-digit code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <LoadingButton type="submit" className="w-full" loading={isPending}>
            Verify Email
          </LoadingButton>
        </form>
      </Form>

      <div className="text-center">
        <button
          onClick={handleResendCode}
          className="text-sm text-primary hover:underline"
          disabled={isResending}
        >
          {isResending ? "Sending..." : "Didn't receive a code? Send again"}
        </button>
      </div>
    </div>
  );
};

export default EmailVerificationForm;
