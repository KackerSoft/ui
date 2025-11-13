import { forwardRef, useEffect, useState } from "react";
import { cn } from "./helpers";
import { FallbackBone } from "./fallback";

export const useImage = (imageUrl?: string) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [loadingPercent, setLoadingPercent] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!imageUrl) {
      setImgSrc(null);
      setLoadingPercent(null);
      setError(false);
      return;
    }

    // Reset states for the new image URL
    setImgSrc(null);
    setLoadingPercent(0);
    setError(false);

    let objectUrl: string | null = null;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", imageUrl, true);
    xhr.responseType = "blob";

    xhr.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setLoadingPercent(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const blob = xhr.response;

        // Verify if it's an image by checking the MIME type
        if (!blob.type.startsWith("image/")) {
          setError(true);
          setLoadingPercent(null);
          setImgSrc(null);
          return;
        }

        objectUrl = URL.createObjectURL(blob);
        setImgSrc(objectUrl);
        setLoadingPercent(null);
        setError(false);
      } else {
        // HTTP error (e.g., 404, 500)
        setError(true);
        setLoadingPercent(null);
        setImgSrc(null);
      }
    };

    xhr.onerror = () => {
      // Network error or other errors before/during request
      setError(true);
      setLoadingPercent(null); // Reset loading percent on error
      setImgSrc(null);
    };

    xhr.send();

    return () => {
      xhr.abort(); // Abort ongoing request
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl); // Clean up the created blob URL
      }
    };
  }, [imageUrl]); // Re-run effect if imageUrl changes

  return {
    src: imgSrc,
    loadingPercent,
    isLoading: loadingPercent !== null,
    isSuccess: loadingPercent === 100 && imgSrc !== null,
    isError: error,
  };
};

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  errorFallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
}

export default forwardRef<HTMLImageElement, ImageProps>(
  function Image(props, ref) {
    const {
      src: initSrc,
      className,
      errorFallback,
      loadingFallback,
      ...rest
    } = props;

    const { src, isLoading, isError } = useImage(initSrc);

    if (isLoading) {
      return loadingFallback || <FallbackBone width={"100%"} height={"100%"} />;
    }

    if (isError) {
      return (
        errorFallback || (
          <div
            ref={ref}
            className={
              "flex flex-col h-full w-full items-center justify-center text-secondary-950/50 gap-4 text-xs bg-primary-800"
            }
          >
            <i className="fas fa-image-slash text-2xl " />
            Could not load this image
          </div>
        )
      );
    }

    return (
      <img
        ref={ref}
        src={
          src ||
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII="
        }
        className={cn(className)}
        {...rest}
      />
    );
  },
);
