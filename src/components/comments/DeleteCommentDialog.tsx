import { TCommentData } from "@/lib/types";
import { useDeleteCommentMutation } from "./mutation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import LoadingButton from "../LoadingButton";
import { Button } from "../ui/button";

interface IDeleteCommentDialogProps {
  comment: TCommentData;
  open: boolean;
  onClose: () => void;
}

const DeleteCommentDialog = ({
  comment,
  onClose,
  open,
}: IDeleteCommentDialogProps) => {
  const mutation = useDeleteCommentMutation();
  const handleOpenChange = (open: boolean) => {
    if (!open || !mutation.isPending) {
      onClose();
    }
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete comment?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this comment? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            variant="destructive"
            onClick={() => mutation.mutate(comment.id, { onSuccess: onClose })}
            loading={mutation.isPending}
            className="outline-none focus:outline-none active:outline-none"
          >
            Delete
          </LoadingButton>
          <Button
            variant={"outline"}
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCommentDialog;
