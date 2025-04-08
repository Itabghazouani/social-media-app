import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { createUploadthing, FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

const f = createUploadthing();
const utapi = new UTApi();

export const fileRouter = {
  avatar: f({
    image: { maxFileSize: "512KB" },
  })
    .middleware(async () => {
      const { user } = await validateRequest();

      if (!user) throw new UploadThingError("Unauthorized");

      // Fetch the current user with avatarUrl
      const userWithAvatar = await prisma.user.findUnique({
        where: { id: user.id },
        select: { avatarUrl: true },
      });

      return { user, currentAvatarUrl: userWithAvatar?.avatarUrl };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const oldAvatarUrl = metadata.currentAvatarUrl;

      // Delete old avatar if it exists
      if (oldAvatarUrl) {
        try {
          // Extract the file key based on URL format
          let fileKey;

          if (oldAvatarUrl.includes("/f/")) {
            // Format: https://hiidxefiq5.ufs.sh/f/AbCdEfGh12345...
            fileKey = oldAvatarUrl.split("/f/")[1];
          } else if (
            oldAvatarUrl.includes(
              `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
            )
          ) {
            // Format: https://hiidxefiq5.ufs.sh/a/hiidxefiq5/AbCdEfGh12345...
            fileKey = oldAvatarUrl.split(
              `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
            )[1];
          }

          if (fileKey) {
            // Use the deleteFiles method as documented
            await utapi.deleteFiles(fileKey);
            console.log(`Deleted old avatar: ${fileKey}`);
          }
        } catch (error) {
          // Log error but continue with updating the avatar
          console.error("Error deleting old avatar:", error);
        }
      }

      const newAvatarUrl = file.ufsUrl;

      await prisma.user.update({
        where: { id: metadata.user.id },
        data: { avatarUrl: newAvatarUrl },
      });

      return { avatarUrl: newAvatarUrl };
    }),
} satisfies FileRouter;

export type TAppFileRouter = typeof fileRouter;
