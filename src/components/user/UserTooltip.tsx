"use client";

import Link from "next/link";
import { useSession } from "@/app/(main)/SessionProvider";
import { IFollowerInfo, TUserData } from "@/lib/types";
import { PropsWithChildren } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import UserAvatar from "./UserAvatar";
import FollowButton from "../follow/FollowButton";
import Linkify from "../linkify/Linkify";
import FollowerCount from "../follow/FollowerCount";

interface IUserTooltipProps extends PropsWithChildren {
  user: TUserData;
}

const UserTooltip = ({ user, children }: IUserTooltipProps) => {
  const { user: loggedInUser } = useSession();

  const followerState: IFollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: !!user.followers.some(
      ({ followerId }) => followerId === loggedInUser.id,
    ),
  };
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <div className="flex max-w-80 flex-col gap-3 break-words px-1 py-2.5 md:min-w-52">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/users/${user.username}`}>
                <UserAvatar avatarUrl={user.avatarUrl} size={70} />
              </Link>
              {loggedInUser.id !== user.id && (
                <FollowButton userId={user.id} initialState={followerState} />
              )}
            </div>
            <div className="">
              <Link href={`/users/${user.username}`}>
                <div className="text-lg font-semibold hover:underline">
                  {user.displayName}
                </div>
                <div className="text-muted-foreground">@{user.username}</div>
              </Link>
            </div>
            {user.bio && (
              <Linkify>
                <div className="line-clamp-4 whitespace-pre-line">
                  {user.bio}
                </div>
              </Linkify>
            )}
            <FollowerCount userId={user.id} initialState={followerState} />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UserTooltip;
