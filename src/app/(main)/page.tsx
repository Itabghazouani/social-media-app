import PostEditor from "@/components/posts/editor/PostEditor";
import TrendsSidebar from "@/components/sidebar/TrendsSidebar";
import ForYourFeed from "./ForYourFeed";

const Home = () => {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <ForYourFeed />
      </div>
      <TrendsSidebar />
    </main>
  );
};

export default Home;
