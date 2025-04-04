"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataIncludes } from "@/lib/types";

import { createPostSchema } from "@/lib/validation";

export const submitPost = async (input: string) => {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { content } = createPostSchema.parse({
    content: input,
  });

  const newPost = await prisma.post.create({
    data: {
      content,
      userId: user.id,
    },
    include: getPostDataIncludes(user.id),
  });

  return newPost;
};
