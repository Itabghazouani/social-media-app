"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { createSessionCookie } from "@/lib/createSessionCookie";
import prisma from "@/lib/prisma";
import { loginSchema, TLoginValues } from "@/lib/validation";
import bcrypt from "bcrypt";

export const login = async (
  credentials: TLoginValues,
): Promise<{ error: string }> => {
  try {
    const { emailOrUsername, password } = loginSchema.parse(credentials);

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username: {
              equals: emailOrUsername,
              mode: "insensitive",
            },
          },
          {
            email: {
              equals: emailOrUsername,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    if (!existingUser || !existingUser.passwordHash) {
      return {
        error: "Incorrect username or password.",
      };
    }

    const validPassword = await bcrypt.compare(
      password,
      existingUser.passwordHash,
    );

    if (!validPassword) {
      return {
        error: "Incorrect username or password.",
      };
    }

    await createSessionCookie(existingUser.id);

    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Error :", error);
    return { error: "Something went wrong. Please try again." };
  }
};
