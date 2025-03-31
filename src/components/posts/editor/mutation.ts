import { useToast } from "@/components/ui/use-toast";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { submitPost } from "./actions";
import { IPostsPage } from "@/lib/types";

export const useSubmitPostMutation = () => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitPost,
    onSuccess: async (newPost) => {
      const queryFilter: QueryFilters<
        InfiniteData<IPostsPage, string | null>,
        Error,
        InfiniteData<IPostsPage, string | null>,
        readonly unknown[]
      > = {
        queryKey: ["post-feed", "for-you"],
      };
      await queryClient.cancelQueries(queryFilter);
      queryClient.setQueriesData<InfiniteData<IPostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          const firstPage = oldData?.pages[0];
          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  posts: [newPost, ...firstPage.posts],
                  nextCursor: firstPage.nextCursor,
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        },
      );

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return !query.state.data;
        },
      });

      toast({
        title: "Post submitted",
        description: "Your post has been submitted successfully.",
      });
    },
    onError(error) {
      console.error("Error :", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong while submitting your post.",
      });
    },
  });

  return mutation;
};
