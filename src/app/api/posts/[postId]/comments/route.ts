import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getCommentDataInclude, ICommentsPage } from "@/lib/types";
import { NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  { params: { postId } }: { params: { postId: string } },
) => {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const pageSize = 5;

    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const comments = await prisma.comment.findMany({
      where: { postId },
      include: getCommentDataInclude(user.id),
      orderBy: { createdAt: "asc" },
      take: -pageSize - 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const previousCursor = comments.length > pageSize ? comments[0].id : null;

    const data: ICommentsPage = {
      comments: comments.length > pageSize ? comments.slice(1) : comments,
      previousCursor,
    };

    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};
