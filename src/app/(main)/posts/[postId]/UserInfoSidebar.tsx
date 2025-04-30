import { validateRequest } from "@/auth";
import FollowButton from "@/components/follow/FollowButton";
import Linkify from "@/components/linkify/Linkify";
import UserAvatar from "@/components/user/UserAvatar";
import UserTooltip from "@/components/user/UserTooltip";
import { TUserData } from "@/lib/types";
import Link from "next/link";

interface IUserInfoSidebarProps {
  user: TUserData;
}

const UserInfoSidebar = async ({ user }: IUserInfoSidebarProps) => {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return null;
  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">About this user</div>
      <UserTooltip user={user}>
        <Link
          href={`/users/${user.username}`}
          className="flex items-center gap-3"
          suppressHydrationWarning
        >
          <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
          <div>
            <p className="line-clamp-1 break-all font-semibold hover:underline">
              {user.displayName}
            </p>
            <p className="line-clamp-1 break-all text-muted-foreground">
              @{user.username}
            </p>
          </div>
        </Link>
      </UserTooltip>
      <Linkify>
        <div className="line-clamp-6 whitespace-pre-line break-words text-muted-foreground">
          {user.bio}
        </div>
      </Linkify>
      {user.id !== loggedInUser.id && (
        <FollowButton
          userId={user.id}
          initialState={{
            followers: user._count.followers,
            isFollowedByUser: user.followers.some(
              ({ followerId }) => followerId === loggedInUser.id,
            ),
          }}
        />
      )}
    </div>
  );
};

export default UserInfoSidebar;
