"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getCommentDataInclude, TPostData } from "@/lib/types";
import { createCommentSchema } from "@/lib/validation";

export const submitComment = async ({
  post,
  content,
}: {
  post: TPostData;
  content: string;
}) => {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { content: contentValidated } = createCommentSchema.parse({
    content,
  });

  const newComment = await prisma.comment.create({
    data: {
      content: contentValidated,
      postId: post.id,
      userId: user.id,
    },
    include: getCommentDataInclude(user.id),
  });

  return newComment;
};

export const deleteComment = async (id: string) => {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) throw new Error("Comment not found");

  if (comment.userId !== user.id) throw new Error("Unauthorized");

  const deletedComment = await prisma.comment.delete({
    where: { id },
    include: getCommentDataInclude(user.id),
  });

  return deletedComment;
};
