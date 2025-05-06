import { ILikeInfo } from "@/lib/types";
import { useToast } from "../ui/use-toast";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ILikeButtonProps {
  postId: string;
  initialState: ILikeInfo;
}

const LikeButton = ({ initialState, postId }: ILikeButtonProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const queryKey: QueryKey = ["like-info", postId];
  const { data } = useQuery({
    queryKey,
    queryFn: async () =>
      kyInstance.get(`/api/posts/${postId}/likes`).json<ILikeInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isLikedByUser
        ? kyInstance.delete(`/api/posts/${postId}/likes`)
        : kyInstance.post(`/api/posts/${postId}/likes`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData<ILikeInfo>(queryKey);
      queryClient.setQueryData<ILikeInfo>(queryKey, () => ({
        likes:
          (previousState?.likes || 0) + (previousState?.isLikedByUser ? -1 : 1),
        isLikedByUser: !previousState?.isLikedByUser,
      }));

      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context?.previousState);
      console.error("Error :", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });
  return (
    <button onClick={() => mutate()} className="flex items-center gap-2">
      <Heart
        className={cn(
          "size-5",
          data.isLikedByUser && "fill-red-500 text-red-500",
        )}
      />
      <span className="text-sm font-medium tabular-nums">
        {data.likes} <span className="hidden sm:inline">likes</span>
      </span>
    </button>
  );
};

export default LikeButton;
