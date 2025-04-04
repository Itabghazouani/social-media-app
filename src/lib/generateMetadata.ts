import { IPageProps } from "@/app/(main)/users/[username]/page";
import { validateRequest } from "@/auth";
import { getUser } from "./getUser";
import { Metadata } from "next";

export const generateMetadata = async ({
  params: { username },
}: IPageProps): Promise<Metadata> => {
  const { user: loggedInUser } = await validateRequest();
  if (!loggedInUser) return {};

  const user = await getUser(username, loggedInUser.id);

  return {
    title: `${user.displayName} (@${user.username})`,
  };
};
