"use client";

import {
  requestPasswordResetSchema,
  RequestPasswordResetValues,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

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
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { requestPasswordReset } from "./actions";

const ForgotPasswordForm = () => {
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<RequestPasswordResetValues>({
    resolver: zodResolver(requestPasswordResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: RequestPasswordResetValues) => {
    setError(undefined);
    setSuccess(false);

    startTransition(async () => {
      const { error, success } = await requestPasswordReset(values);
      if (error) setError(error);
      if (success) {
        setSuccess(true);
        form.reset();
      }
    });
  };

  if (success) {
    return (
      <div className="rounded-md bg-green-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckCircle2
              className="h-5 w-5 text-green-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Reset link sent
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p>
                If an account exists with that email, we&#39;ve sent a password
                reset link. Please check your inbox and follow the instructions.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle
                  className="h-5 w-5 text-red-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email address"
                  type="email"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton type="submit" className="w-full" loading={isPending}>
          Send Reset Link
        </LoadingButton>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;
