import { z } from "zod";

const requiredString = (field: string) =>
  z.string().trim().min(1, `${field} required`);

const emailOrUsername = z.string().trim().min(1, "Email or Username required");

export const signUpSchema = z.object({
  email: requiredString("Email").email("Invalid email address"),
  username: requiredString("Username").regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only letters, numbers, underscores, and hyphens are allowed",
  ),
  password: requiredString("Password")
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  emailOrUsername: emailOrUsername,
  password: requiredString("Password"),
});

export type LoginValues = z.infer<typeof loginSchema>;
