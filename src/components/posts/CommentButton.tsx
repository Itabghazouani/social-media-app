"use client";

import { TPostData } from "@/lib/types";
import { MessageSquare } from "lucide-react";

interface ICommentButtonProps {
  post: TPostData;
  onClick: () => void;
}

const CommentButton = ({ onClick, post }: ICommentButtonProps) => {
  return (
    <button onClick={onClick} className="flex items-center gap-2">
      <MessageSquare className="size-5" />
      <span className="text-sm font-medium tabular-nums">
        {post._count.comments}
      </span>
      <span className="hidden sm:inline">comments</span>
    </button>
  );
};

export default CommentButton;
