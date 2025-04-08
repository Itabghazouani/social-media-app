import { z } from "zod";

const requiredString = (field: string) =>
  z.string().trim().min(1, `${field} required`);

const emailOrUsername = z.string().trim().min(1, "Email or Username required");

const createPasswordValidation = () =>
  requiredString("Password")
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    );

export const signUpSchema = z
  .object({
    email: requiredString("Email").email("Invalid email address"),
    username: requiredString("Username").regex(
      /^[a-zA-Z0-9_-]+$/,
      "Only letters, numbers, underscores, and hyphens are allowed",
    ),
    password: createPasswordValidation(),
    confirmPassword: requiredString("Confirm Password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type TSignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  emailOrUsername: emailOrUsername,
  password: requiredString("Password"),
});

export type TLoginValues = z.infer<typeof loginSchema>;

export const verificationSchema = z.object({
  code: z
    .string()
    .min(6, "Verification code must be 6 characters long")
    .max(6, "Verification code must be 6 characters long"),
});

export type TVerificationValues = z.infer<typeof verificationSchema>;

export const requestPasswordResetSchema = z.object({
  email: requiredString("Email").email("Invalid email address"),
});

export type TRequestPasswordResetValues = z.infer<
  typeof requestPasswordResetSchema
>;

export const resetPasswordSchema = z
  .object({
    password: createPasswordValidation(),
    confirmPassword: requiredString("Confirm Password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type TResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export const createPostSchema = z.object({
  content: requiredString("Content"),
});

export const updateUserProfileSchema = z.object({
  displayName: requiredString("Display Name"),
  bio: z.string().max(1000, "Must be at most 1000 characters").optional(),
});

export type TUpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;
