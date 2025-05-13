import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { INotificationCountInfo } from "@/lib/types";

export const GET = async () => {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const unreadCount = await prisma.notification.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    });

    const data: INotificationCountInfo = {
      unreadCount,
    };

    return Response.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching unread notifications count:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
