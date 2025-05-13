import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { INotificationsPage, notificationsInclude } from "@/lib/types";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const pageSize = 5;

    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: user.id,
      },
      include: notificationsInclude,
      orderBy: {
        createdAt: "desc",
      },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor =
      notifications.length > pageSize ? notifications[pageSize].id : null;

    const data: INotificationsPage = {
      notifications: notifications.slice(0, pageSize),
      nextCursor,
    };
    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};
