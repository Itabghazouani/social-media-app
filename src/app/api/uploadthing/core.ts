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

      const userWithAvatar = await prisma.user.findUnique({
        where: { id: user.id },
        select: { avatarUrl: true },
      });

      return { user, currentAvatarUrl: userWithAvatar?.avatarUrl };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const oldAvatarUrl = metadata.currentAvatarUrl;

      if (oldAvatarUrl) {
        try {
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
            await utapi.deleteFiles(fileKey);
          }
        } catch (error) {
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
  attachment: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    video: { maxFileSize: "64MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      const { user } = await validateRequest();

      if (!user) throw new UploadThingError("Unauthorized");

      return {};
    })
    .onUploadComplete(async ({ file }) => {
      const media = await prisma.media.create({
        data: {
          url: file.ufsUrl,
          type: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
        },
      });

      return { mediaId: media.id };
    }),
} satisfies FileRouter;

export type TAppFileRouter = typeof fileRouter;
