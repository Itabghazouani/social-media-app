import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Image from "next/image";
import { IAttachment } from "../useMediaUpload";

interface IAttachmentPreviewProps {
  attachment: IAttachment;
  onRemoveClick: () => void;
}

const AttachmentPreview = ({
  attachment: { file, isUploading },
  onRemoveClick,
}: IAttachmentPreviewProps) => {
  const src = URL.createObjectURL(file);

  return (
    <div
      className={cn("relative mx-auto size-fit", isUploading && "opacity-50")}
    >
      {file.type.startsWith("image") ? (
        <Image
          src={src}
          alt="Attachment preview"
          width={500}
          height={500}
          className="size-fit max-h-[30rem] rounded-2xl"
        />
      ) : (
        <video controls className="size-fit max-h-[30rem] rounded-2xl">
          <source src={src} type={file.type} />
        </video>
      )}
      {!isUploading && (
        <button
          onClick={onRemoveClick}
          className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-foreground/60"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};

export default AttachmentPreview;
