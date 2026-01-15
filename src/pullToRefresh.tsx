import { ReactNode, useRef, useState, useEffect } from "react";

export interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  loadingIcon?: ReactNode;
  threshold?: number;
  maxPullDistance?: number;
  resistance?: number;
  disabled?: boolean;
  className?: string;
}

export default function PullToRefresh({
  children,
  onRefresh,
  loadingIcon,
  threshold = 80,
  maxPullDistance = 150,
  resistance = 2.5,
  disabled = false,
  className = "",
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canPull, setCanPull] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    if (disabled) return;

    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Only allow pull if at the top of the scroll container
      const scrollTop = container.scrollTop;
      if (scrollTop === 0 && !isRefreshing) {
        setCanPull(true);
        startY.current = e.touches[0].clientY;
        isDragging.current = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!canPull || isRefreshing) return;

      currentY.current = e.touches[0].clientY;
      const diff = currentY.current - startY.current;

      if (diff > 0) {
        isDragging.current = true;

        // Prevent default scrolling when pulling down
        e.preventDefault();

        // Apply resistance and cap at max distance
        const distance = Math.min(diff / resistance, maxPullDistance);
        setPullDistance(distance);
      }
    };

    const handleTouchEnd = () => {
      if (!canPull || !isDragging.current) {
        setCanPull(false);
        setPullDistance(0);
        return;
      }

      isDragging.current = false;
      setCanPull(false);

      if (pullDistance >= threshold) {
        setIsRefreshing(true);
        setPullDistance(threshold);

        onRefresh().finally(() => {
          setIsRefreshing(false);
          setPullDistance(0);
        });
      } else {
        setPullDistance(0);
      }
    };

    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    container.addEventListener("touchcancel", handleTouchEnd, {
      passive: true,
    });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [
    canPull,
    disabled,
    isRefreshing,
    maxPullDistance,
    onRefresh,
    pullDistance,
    resistance,
    threshold,
  ]);

  const showLoader = pullDistance > 0 || isRefreshing;
  const loaderOpacity = Math.min(pullDistance / threshold, 1);
  const loaderScale = Math.min(pullDistance / threshold, 1);
  const isOverThreshold = pullDistance >= threshold;

  return (
    <div
      ref={containerRef}
      className={`relative h-full overflow-auto ${className}`}
      style={{
        WebkitOverflowScrolling: "touch",
        touchAction: disabled ? "auto" : "pan-y",
      }}
    >
      {/* Loader container */}
      <div
        className="absolute left-0 right-0 flex items-center justify-center transition-all pointer-events-none"
        style={{
          top: 0,
          height: `${pullDistance}px`,
          opacity: showLoader ? loaderOpacity : 0,
          transform: `translateY(-${threshold - pullDistance}px)`,
        }}
      >
        <div
          className="flex items-center justify-center"
          style={{
            transform: `scale(${loaderScale}) rotate(${isRefreshing ? "0deg" : pullDistance * 2}deg)`,
            transition: isRefreshing ? "transform 0.3s ease" : "none",
          }}
        >
          {loadingIcon || (
            <div className="relative w-8 h-8">
              <div
                className="absolute inset-0 border-4 border-primary-200 rounded-full"
                style={{
                  borderTopColor: isOverThreshold
                    ? "var(--color-accent-500)"
                    : "var(--color-primary-400)",
                  animation: isRefreshing ? "spin 1s linear infinite" : "none",
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition:
            canPull && isDragging.current ? "none" : "transform 0.3s ease",
        }}
      >
        {children}
      </div>
    </div>
  );
}
