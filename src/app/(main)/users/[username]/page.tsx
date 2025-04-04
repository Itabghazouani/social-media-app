import { validateRequest } from "@/auth";
import TrendsSidebar from "@/components/sidebar/TrendsSidebar";
import { getUser } from "@/lib/getUser";
import UserProfile from "./UserProfile";
import UserPostsFeed from "./UserPostsFeed";

export interface IPageProps {
  params: { username: string };
}

const Page = async ({ params: { username } }: IPageProps) => {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return <p>You&apos;re not authorized to view this page.</p>;
  }

  const user = await getUser(username, loggedInUser.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile loggedInUserId={loggedInUser.id} user={user} />
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold">
            {user.displayName}&apos;s posts
          </h2>
        </div>
        <UserPostsFeed userId={user.id} />
      </div>
      <TrendsSidebar />
    </main>
  );
};
export default Page;
