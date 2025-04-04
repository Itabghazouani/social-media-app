import { useSession } from "@/app/(main)/SessionProvider";
import { useToast } from "@/components/ui/use-toast";
import { IPostsPage, TPostData } from "@/lib/types";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { submitPost } from "./actions";

export const useSubmitPostMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useSession();

  const updateQueryData = async (queryKey: string[], newPost: TPostData) => {
    await queryClient.cancelQueries({ queryKey });

    queryClient.setQueriesData<InfiniteData<IPostsPage, string | null>>(
      { queryKey },
      (oldData) => {
        if (!oldData || !oldData.pages || !oldData.pages[0]) return oldData;

        const firstPage = oldData.pages[0];
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
      },
    );

    queryClient.invalidateQueries({
      queryKey,
      predicate: (query) => !query.state.data,
    });
  };

  const mutation = useMutation({
    mutationFn: submitPost,
    onSuccess: async (newPost) => {
      await updateQueryData(["post-feed", "for-you"], newPost);

      await updateQueryData(["post-feed", "user-posts", user.id], newPost);

      toast({
        description: "Post created",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to post. Please try again.",
      });
    },
  });

  return mutation;
};
