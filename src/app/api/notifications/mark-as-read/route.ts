import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

export const PATCH = async () => {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    await prisma.notification.updateMany({
      where: {
        recipientId: user.id,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return new Response();
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
