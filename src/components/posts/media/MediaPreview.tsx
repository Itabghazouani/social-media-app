import { Media } from "@prisma/client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface IMediaPreviewProps {
  media: Media;
  layout?: "full" | "equal" | "small";
}

const MediaPreview = ({ media, layout = "equal" }: IMediaPreviewProps) => {
  const [mediaError, setMediaError] = useState(false);

  if (media.type === "IMAGE") {
    const imageContainerClasses = cn(
      "overflow-hidden rounded-2xl",
      layout === "full" && "max-h-[30rem]",
      layout === "equal" && "aspect-square",
      layout === "small" && "aspect-square",
      mediaError && "bg-gray-100 flex items-center justify-center",
    );

    const imageClasses = cn(
      "mx-auto rounded-2xl object-cover",
      layout === "full" && "max-h-[30rem] w-full",
      layout === "equal" && "aspect-square h-full w-full object-cover",
      layout === "small" && "aspect-square h-full w-full object-cover",
    );

    return (
      <div className={imageContainerClasses}>
        {mediaError ? (
          <div className="p-4 text-center">
            <p className="text-muted-foreground">Image unavailable</p>
          </div>
        ) : (
          <Image
            src={media.url}
            alt="Image"
            width={500}
            height={500}
            className={imageClasses}
            onError={() => setMediaError(true)}
          />
        )}
      </div>
    );
  }

  if (media.type === "VIDEO") {
    const videoContainerClasses = cn(
      "rounded-2xl",
      layout === "full" && "w-full",
      (layout === "equal" || layout === "small") && "h-full w-full",
      mediaError && "bg-gray-100 flex items-center justify-center",
    );

    const videoClasses = cn(
      "mx-auto rounded-2xl w-full",
      layout === "full" && "max-h-[30rem]",
      (layout === "equal" || layout === "small") && "object-contain",
    );

    return (
      <div className={videoContainerClasses}>
        {mediaError ? (
          <div className="flex h-full items-center justify-center p-4 text-center">
            <p className="text-muted-foreground">Video unavailable</p>
          </div>
        ) : (
          <video
            src={media.url}
            controls
            className={videoClasses}
            preload="metadata"
            onError={() => setMediaError(true)}
          />
        )}
      </div>
    );
  }

  return <p className="text-destructive">Unsupported media type.</p>;
};
export default MediaPreview;
