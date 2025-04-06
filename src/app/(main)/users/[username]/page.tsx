import { validateRequest } from "@/auth";
import TrendsSidebar from "@/components/sidebar/TrendsSidebar";
import { getUser } from "@/lib/getUser";
import UserProfile from "./UserProfile";
import UserPostsFeed from "./UserPostsFeed";
import { Metadata } from "next";

export interface IPageProps {
  params: { username: string };
}

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

const Page = async ({ params }: IPageProps) => {
  const { username } = params;
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
