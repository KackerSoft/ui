import { cn } from "@/helpers";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const SnapScrollContext = createContext<{
  alignment: "start" | "center" | "end";
} | null>(null);

export function SnapScroll(props: {
  children: React.ReactNode;
  alignment?: "start" | "center" | "end";
  initialIndex?: number;
  className?: string;
  onChange?: (selectedIndex: number | null) => void;
}) {
  const { alignment = "start" } = props;
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    props.initialIndex ?? null,
  );

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // find out the snapped element
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;

    let closestElement: HTMLElement | null = null;
    let closestOffset = Infinity;

    const items = container.querySelectorAll<HTMLElement>(
      "[data-snap-scroll-item]",
    );

    items.forEach((item) => {
      const itemLeft = item.offsetLeft;
      const itemWidth = item.clientWidth;

      let itemCenter = itemLeft + itemWidth / 2;
      let containerCenter = scrollLeft + containerWidth / 2;

      if (alignment === "start") {
        itemCenter = itemLeft;
        containerCenter = scrollLeft;
      } else if (alignment === "end") {
        itemCenter = itemLeft + itemWidth;
        containerCenter = scrollLeft + containerWidth;
      }

      const offset = Math.abs(itemCenter - containerCenter);
      if (offset < closestOffset) {
        closestOffset = offset;
        closestElement = item;
      }
    });

    if (closestElement) {
      const index = Array.from(items).indexOf(closestElement);
      setSelectedIndex(index);
    }
  };

  useEffect(() => {
    if (props.initialIndex !== undefined && containerRef.current) {
      const container = containerRef.current;
      const items = container.querySelectorAll<HTMLElement>(
        "[data-snap-scroll-item]",
      );
      const item = items[props.initialIndex];

      if (item) {
        let scrollLeft = item.offsetLeft;
        const containerWidth = container.clientWidth;
        const itemWidth = item.clientWidth;

        if (alignment === "center") {
          scrollLeft = item.offsetLeft + itemWidth / 2 - containerWidth / 2;
        } else if (alignment === "end") {
          scrollLeft = item.offsetLeft + itemWidth - containerWidth;
        }

        container.scrollTo({ left: scrollLeft, behavior: "instant" });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    props.onChange?.(selectedIndex);
  }, [selectedIndex]);

  return (
    <SnapScrollContext.Provider value={{ alignment }}>
      <div
        ref={containerRef}
        className={cn(
          "flex gap-2 overflow-auto snap-x snap-mandatory scroll-p-4",
          props.className,
          alignment === "start" && "pl-4 pr-[50%]",
          alignment === "center" && "px-[50%]",
          alignment === "end" && "pr-4 pl-[50%]",
        )}
        onScroll={handleScroll}
      >
        {props.children}
      </div>
    </SnapScrollContext.Provider>
  );
}

export function SnapScrollItem(props: {
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
}) {
  const context = useContext(SnapScrollContext);

  if (!context) {
    throw new Error("SnapScrollItem must be used within a SnapScroll");
  }

  return (
    <div
      data-snap-scroll-item
      className={cn(
        "flex-shrink-0",
        context.alignment === "start" && "snap-start",
        context.alignment === "center" && "snap-center",
        context.alignment === "end" && "snap-end",
        props.className,
      )}
    >
      {props.children}
    </div>
  );
}
