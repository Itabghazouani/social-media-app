"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";

import {
  updateUserProfileSchema,
  TUpdateUserProfileValues,
} from "@/lib/validation";

export const updateUserProfile = async (values: TUpdateUserProfileValues) => {
  const validatedValues = updateUserProfileSchema.parse(values);

  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: validatedValues,
    select: getUserDataSelect(user.id),
  });

  return updatedUser;
};
