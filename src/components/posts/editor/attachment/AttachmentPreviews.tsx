import { cn } from "@/lib/utils";
import { IAttachment } from "../useMediaUpload";
import AttachmentPreview from "./AttachmentPreview";

interface IAttachmentPreviewsProps {
  attachments: IAttachment[];
  removeAttachment: (fileName: string) => void;
}

const AttachmentPreviews = ({
  attachments,
  removeAttachment,
}: IAttachmentPreviewsProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((attachment) => (
        <AttachmentPreview
          key={attachment.file.name}
          attachment={attachment}
          onRemoveClick={() => removeAttachment(attachment.file.name)}
        />
      ))}
    </div>
  );
};

export default AttachmentPreviews;
