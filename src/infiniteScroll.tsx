import { useEffect } from "react";

export interface InfiniteScrollProps {
  children: React.ReactNode;
  onLoadMore: () => void;
  hasMore: boolean;
  moreLoading: boolean;
  scrollableTarget: string;
  loadingIndicator?: React.ReactNode;
}

export default function InfiniteScroll(props: InfiniteScrollProps) {
  const {
    children,
    onLoadMore,
    hasMore,
    moreLoading,
    scrollableTarget,
    loadingIndicator,
  } = props;

  useEffect(() => {
    const handleScroll = () => {
      const container = document.getElementById(scrollableTarget);
      if (!container || moreLoading || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - scrollTop <= clientHeight + 100) {
        onLoadMore();
      }
    };

    const container = document.getElementById(scrollableTarget);
    container?.addEventListener("scroll", handleScroll);

    // Call onLoadMore if container is not scrollable but hasMore
    if (container && hasMore && !moreLoading) {
      const { scrollHeight, clientHeight } = container;
      if (scrollHeight <= clientHeight + 100) {
        onLoadMore();
      }
    }

    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [onLoadMore, hasMore, moreLoading, scrollableTarget]);

  return (
    <>
      {children}
      {moreLoading && loadingIndicator}
    </>
  );
}
