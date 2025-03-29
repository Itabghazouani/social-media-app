import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { postDataIncludes } from "@/lib/types";

export const GET = async () => {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const posts = await prisma.post.findMany({
      include: postDataIncludes,
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};
