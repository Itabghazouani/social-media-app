"use client";

import { Loader2 } from "lucide-react";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { IPostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";

const FollowingFeed = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "following"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/posts/following`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<IPostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "success" && posts.length === 0 && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        No posts available. Follow some users to see their posts.
      </p>
    );
  }
  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occured while loading posts: {error.message}
      </p>
    );
  }
  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
};

export default FollowingFeed;
