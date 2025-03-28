import PostEditor from "@/components/posts/editor/PostEditor";
import Post from "@/components/posts/Post";
import prisma from "@/lib/prisma";
import { postDataIncludes } from "@/lib/types";

const Home = async () => {
  const posts = await prisma.post.findMany({
    include: postDataIncludes,
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <main className="in-w-0 w-full">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
};

export default Home;
