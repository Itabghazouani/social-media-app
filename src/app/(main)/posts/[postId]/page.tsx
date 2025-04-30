import { validateRequest } from "@/auth";
import Post from "@/components/posts/Post";
import { getPost } from "@/lib/getPost";
import UserInfoSidebar from "./UserInfoSidebar";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

interface IPostPageProps {
  params: {
    postId: string;
  };
}

export const generateMetadata = async ({ params }: IPostPageProps) => {
  const { user } = await validateRequest();
  const { postId } = await params;

  if (!user) return {};

  const post = await getPost(postId, user.id);

  return {
    title: `Post ${post.user.displayName} - ${post.content.slice(0, 50)}...`,
  };
};

const PostPage = async ({ params }: IPostPageProps) => {
  const { user } = await validateRequest();

  const { postId } = await params;

  if (!user) {
    return (
      <p className="text-destructive">
        You&apos;re not authorized to view this page.
      </p>
    );
  }

  const post = await getPost(postId, user.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Post post={post} />
      </div>
      <div className="sticky top-[5.25rem] hidden h-fit w-80 flex-none lg:block">
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <UserInfoSidebar user={post.user} />
        </Suspense>
      </div>
    </main>
  );
};

export default PostPage;
