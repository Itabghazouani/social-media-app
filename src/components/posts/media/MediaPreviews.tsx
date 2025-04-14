import { Media } from "@prisma/client";
import MediaPreview from "./MediaPreview";

interface IMediaPreviewsProps {
  attachments: Media[];
}

const MediaPreviews = ({ attachments }: IMediaPreviewsProps) => {
  // Separate images and videos
  const images = attachments.filter((media) => media.type === "IMAGE");
  const videos = attachments.filter((media) => media.type === "VIDEO");
  const hasImages = images.length > 0;
  const hasVideos = videos.length > 0;

  return (
    <div className="flex flex-col gap-3">
      {hasVideos && (
        <div className="flex flex-col gap-3">
          {videos.map((video) => (
            <MediaPreview key={video.id} media={video} layout="full" />
          ))}
        </div>
      )}

      {hasImages && (
        <div className="images-container">
          {images.length === 1 && (
            <MediaPreview media={images[0]} layout="full" />
          )}

          {images.length === 2 && (
            <div className="grid grid-cols-2 gap-1">
              {images.map((image) => (
                <MediaPreview key={image.id} media={image} layout="equal" />
              ))}
            </div>
          )}

          {images.length === 3 && (
            <div className="grid grid-cols-3 gap-1">
              {images.map((image) => (
                <MediaPreview key={image.id} media={image} layout="equal" />
              ))}
            </div>
          )}

          {images.length === 4 && (
            <div className="grid grid-cols-2 gap-1">
              {images.map((image) => (
                <MediaPreview key={image.id} media={image} layout="equal" />
              ))}
            </div>
          )}

          {images.length >= 5 && (
            <div className="flex flex-col gap-1">
              <div className="grid grid-cols-2 gap-1">
                <MediaPreview media={images[0]} layout="equal" />
                <MediaPreview media={images[1]} layout="equal" />
              </div>

              <div className="grid grid-cols-3 gap-1">
                <MediaPreview media={images[2]} layout="equal" />
                <MediaPreview media={images[3]} layout="equal" />
                <div className="relative">
                  <MediaPreview media={images[4]} layout="equal" />
                  {images.length > 5 && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 text-2xl font-semibold text-white">
                      +{images.length - 5}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaPreviews;
