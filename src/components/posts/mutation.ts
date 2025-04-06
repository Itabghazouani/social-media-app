import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { IPostsPage } from "@/lib/types";
import { useToast } from "../ui/use-toast";
import { deletePost } from "./actions";

export const useDeletePostMutation = () => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const router = useRouter();
  const pathname = usePathname();

  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: async (deletedPost) => {
      const queryFilter: QueryFilters<
        InfiniteData<IPostsPage, string | null>,
        Error,
        InfiniteData<IPostsPage, string | null>,
        readonly unknown[]
      > = { queryKey: ["post-feed"] };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<IPostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.filter((post) => post.id !== deletedPost.id),
            })),
          };
        },
      );

      toast({
        title: "Post deleted",
        description: "Your post has been deleted successfully.",
      });

      if (pathname === `/posts/${deletedPost.id}`) {
        router.push(`/users/${deletedPost.user.username}`);
      }
    },
    onError: (error) => {
      console.error("Error :", error);
      toast({
        title: "Error deleting post",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return mutation;
};
