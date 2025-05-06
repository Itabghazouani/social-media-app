import { Prisma } from "@prisma/client";

export const getUserDataSelect = (loggedInUserId: string) => {
  return {
    id: true,
    username: true,
    displayName: true,
    avatarUrl: true,
    bio: true,
    createdAt: true,
    followers: {
      where: {
        followerId: loggedInUserId,
      },
      select: {
        followerId: true,
      },
    },
    _count: {
      select: {
        posts: true,
        followers: true,
      },
    },
  } satisfies Prisma.UserSelect;
};

export type TUserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;

export const getPostDataInclude = (loggedInUserId: string) => {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
    attachments: true,
    likes: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    bookmarks: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
    _count: {
      select: {
        likes: true,
      },
    },
  } satisfies Prisma.PostInclude;
};

export type TPostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
}>;

export interface IPostsPage {
  posts: TPostData[];
  nextCursor: string | null;
}

export interface IFollowerInfo {
  followers: number;
  isFollowedByUser: boolean;
}

export interface ILikeInfo {
  likes: number;
  isLikedByUser: boolean;
}

export interface IBookmarkInfo {
  isBookmarkedByUser: boolean;
}
