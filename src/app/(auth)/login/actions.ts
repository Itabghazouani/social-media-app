"use server";

import { createSessionCookie } from "@/lib/createSessionCookie";
import prisma from "@/lib/prisma";
import { loginSchema, LoginValues } from "@/lib/validation";
import { verify } from "@node-rs/argon2";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

export const login = async (
  credentials: LoginValues,
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

    const validPassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

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
