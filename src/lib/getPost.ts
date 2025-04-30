import { cache } from "react";
import prisma from "./prisma";
import { getPostDataInclude } from "./types";
import { notFound } from "next/navigation";

export const getPost = cache(async (postId: string, loggedInUserId: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: getPostDataInclude(loggedInUserId),
  });

  if (!post) notFound();

  return post;
});
