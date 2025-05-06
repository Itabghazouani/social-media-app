import { NextRequest } from "next/server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude, IPostsPage } from "@/lib/types";

export const GET = async (req: NextRequest) => {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const pageSize = 10;

    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: user.id,
      },
      include: {
        post: {
          include: getPostDataInclude(user.id),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor =
      bookmarks.length > pageSize ? bookmarks[pageSize].id : null;

    const data: IPostsPage = {
      posts: bookmarks.slice(0, pageSize).map((bookmark) => bookmark.post),
      nextCursor,
    };

    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};
