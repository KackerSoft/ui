import { forwardRef, useEffect, useRef, useState } from "react";
import { cn } from "./helpers";
import { FallbackBone } from "./fallback";

const getDimensions = (
  base64: string,
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = base64;
  });
};

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
  expandable?: boolean;
}

export default forwardRef<HTMLImageElement, ImageProps>(
  function Image(props, ref) {
    const {
      src: initSrc,
      className,
      errorFallback,
      loadingFallback,
      expandable = false,
      ...rest
    } = props;

    const { src, isLoading, isError } = useImage(initSrc);
    const [expanded, setExpanded] = useState(false);
    const [imageDimensions, setImageDimensions] = useState<{
      width: number;
      height: number;
    } | null>(null);
    const [imageBounds, setImageBounds] = useState<{
      top: number;
      left: number;
      width: number;
      height: number;
      borderRadius: number;
    } | null>(null);

    const internalRef = useRef<HTMLImageElement>(null);
    const imgRef = ref || internalRef;

    // The most beautiful animation ive ever made in my life
    useEffect(() => {
      if (imgRef && "current" in imgRef && imgRef.current) {
        const rect = imgRef.current.getBoundingClientRect();
        if (expanded) {
          setImageBounds({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            borderRadius:
              parseFloat(getComputedStyle(imgRef.current).borderRadius) || 0,
          });
          window.history.pushState({}, "", "#image=expanded");
          setTimeout(() => {
            setImageBounds({
              top: 0,
              left: 0,
              width: window.innerWidth,
              height: window.innerHeight,
              borderRadius: 0,
            });
          }, 10);
        } else {
          setImageBounds({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            borderRadius:
              parseFloat(getComputedStyle(imgRef.current).borderRadius) || 0,
          });
          setTimeout(() => {
            setImageBounds(null);
          }, 500);
        }
      }
    }, [expanded, imgRef]);

    useEffect(() => {
      if (src) {
        getDimensions(src).then((dimensions) => {
          setImageDimensions(dimensions);
        });
      }
    }, [src]);

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

    // using image dimensions, calculate the max width and height to fit in the screen while maintaining aspect ratio
    const getMaxImageDimensions = () => {
      if (!imageDimensions) return null;
      const safeAreaInsetTop =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--safe-area-inset-top",
          ),
        ) || 0;
      const safeAreaInsetBottom =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--safe-area-inset-bottom",
          ),
        ) || 0;
      const screenWidth = window.innerWidth;
      const screenHeight =
        window.innerHeight - safeAreaInsetTop - safeAreaInsetBottom - 80;
      const imageAspectRatio = imageDimensions.width / imageDimensions.height;
      let width = screenWidth;
      let height = screenWidth / imageAspectRatio;

      if (height > screenHeight) {
        height = screenHeight;
        width = screenHeight * imageAspectRatio;
      }

      return { width, height };
    };

    const maxImageDimensions = getMaxImageDimensions();
    const safeAreaInsetBottom =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--safe-area-inset-bottom",
        ),
      ) || 0;

    const safeAreaInsetTop =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--safe-area-inset-top",
        ),
      ) || 0;

    const shouldControlsBeFixed =
      (window.innerHeight - (maxImageDimensions?.height || 0)) / 2 >
      80 + safeAreaInsetTop;

    return (
      <>
        <img
          ref={imgRef}
          src={
            src ||
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII="
          }
          className={cn(className)}
          onClick={() => {
            if (!expandable) return;
            setExpanded(true);
          }}
          {...rest}
        />
        {expandable && src && imageBounds && (
          <div
            className={cn(
              "fixed transition-all z-100 duration-500 ease-in-out overflow-hidden flex flex-col",
              expanded && "bg-primary-900/40 backdrop-blur-2xl",
            )}
            style={{
              ...imageBounds,
            }}
          >
            <div
              className={cn(
                "pt-0 max-h-0 transition-all overflow-hidden px-4 delay-100 shrink-0",
                imageBounds.top === 0 &&
                  "max-h-[calc(80px+var(--safe-area-inset-top,1rem))] pt-[var(--safe-area-inset-top,1rem)] pb-4",
                shouldControlsBeFixed && "fixed top-0 left-0 right-0",
              )}
            >
              <button
                className="flex items-center justify-center w-8 text-xl aspect-square rounded-lg "
                onClick={() => {
                  setExpanded(false);
                }}
              >
                <i className="far fa-arrow-left" />
              </button>
            </div>
            <div className="flex items-center justify-center flex-1">
              <div
                className="transition-all duration-500 ease-in-out overflow-hidden"
                style={{
                  width:
                    imageBounds.top === 0
                      ? maxImageDimensions?.width + "px"
                      : imageBounds.width + "px",
                  height:
                    imageBounds.top === 0
                      ? maxImageDimensions?.height + "px"
                      : imageBounds.height + "px",
                  borderRadius: imageBounds.top === 0 ? "15px" : "0px",
                }}
              >
                <img src={src} className="w-full h-full object-cover" />
              </div>
            </div>
            <div
              className={cn(
                "h-0 transition-all overflow-hidden delay-100 shrink-0",
                imageBounds.top === 0 &&
                  "h-[var(--safe-area-inset-bottom,1rem)]",
                shouldControlsBeFixed && "fixed bottom-0 left-0 right-0",
              )}
            />
          </div>
        )}
      </>
    );
  },
);
