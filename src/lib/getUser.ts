import { cache } from "react";
import { notFound } from "next/navigation";
import { getUserDataSelect } from "./types";
import prisma from "./prisma";

export const getUser = cache(
  async (username: string, loggedInUserId: string) => {
    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
      select: getUserDataSelect(loggedInUserId),
    });
    if (!user) notFound();
    return user;
  },
);
