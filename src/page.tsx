import { Capacitor } from "@capacitor/core";
import { cn } from "./helpers";
import { goBack } from "./router/router";
import { twMerge } from "tailwind-merge";
import { useEffect, useRef, useState } from "react";

export interface PageHeaderProps {
  title: string;
  hideTitle?: boolean;
  className?: string;
  onBack?: () => void;
  action?: React.ReactNode;
}
export interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  containerClassName?: string;
  className?: string;
  header?: PageHeaderProps;
}

export function HeaderActionButton(
  props: React.HTMLAttributes<HTMLButtonElement>,
) {
  const { className, children, ...rest } = props;

  return (
    <button
      className={twMerge(
        "flex items-center justify-center w-10 aspect-square rounded-full bg-primary-900/30 border border-primary-50/10 backdrop-blur-sm",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export default function Page(props: PageProps): React.JSX.Element {
  const { className, containerClassName, children, header, ...rest } = props;

  const platform = Capacitor.getPlatform();

  return (
    <div
      {...rest}
      className={cn(
        `overflow-auto h-screen pb-[calc(var(--safe-area-inset-bottom,1rem)+3.5rem)] relative bg-primary-950`,
        !header && "pt-(--safe-area-inset-top,1rem)",
        containerClassName,
      )}
    >
      {header && (
        <div
          className={twMerge(
            "flex items-center justify-between sticky top-0 pt-(--safe-area-inset-top,1rem) z-10 inset-x-0 px-4 gap-2",
            platform === "android" &&
              "pt-[calc(var(--safe-area-inset-top,1rem)+1rem)]",
            header.className,
          )}
        >
          <div className="-z-10 bg-linear-to-b absolute inset-0 mask-[linear-gradient(black,black,transparent)] backdrop-blur-sm from-primary-950/80 to-transparent" />
          <div className="pb-3 shrink-0 absolute left-4 top-(--safe-area-inset-top,1rem) bottom-0 flex items-center">
            <button
              className="flex items-center justify-center w-10 aspect-square rounded-full border bg-primary-900/30 border-primary-50/10 backdrop-blur-sm"
              onClick={() => {
                header.onBack?.();
                goBack();
              }}
            >
              <i className="far fa-arrow-left" />
            </button>
          </div>
          <div
            className={twMerge(
              "text-center w-full px-20 font-semibold text-lg py-4 pt-1 flex-1 min-w-0 truncate transition-all opacity-100",
              header.hideTitle && "-translate-y-10 opacity-0 blur-sm",
            )}
          >
            {header.title}
          </div>
          <div className="pb-3 shrink-0 absolute right-4 top-(--safe-area-inset-top,1rem) bottom-0 flex items-center">
            {header.action}
          </div>
        </div>
      )}
      <div className={className}>{children}</div>
    </div>
  );
}

export function PageHeader(
  props: React.HTMLAttributes<HTMLDivElement>,
): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Find the nearest scrollable ancestor (the <Page> container scrolls,
    // not window), and listen to its scroll events.
    const findScrollParent = (el: HTMLElement | null): HTMLElement | Window => {
      let node: HTMLElement | null = el?.parentElement ?? null;
      while (node) {
        const style = getComputedStyle(node);
        const overflowY = style.overflowY;
        if (
          (overflowY === "auto" || overflowY === "scroll") &&
          node.scrollHeight > node.clientHeight
        ) {
          return node;
        }
        node = node.parentElement;
      }
      return window;
    };

    const scrollParent = findScrollParent(ref.current);
    const onScroll = () => {
      const top =
        scrollParent === window
          ? window.scrollY
          : (scrollParent as HTMLElement).scrollTop;
      setScrolled(top > 100);
    };

    onScroll();
    scrollParent.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      scrollParent.removeEventListener("scroll", onScroll);
    };
  }, []);

  const { children, className, ...rest } = props;
  return (
    <div
      {...rest}
      ref={ref}
      className={cn(
        "text-3xl font-semibold relative z-10",
        Capacitor.isNativePlatform() &&
          Capacitor.getPlatform() !== "ios" &&
          "mt-4",
        className,
      )}
    >
      <div
        className={cn(
          "bg-linear-to-b mask-[linear-gradient(black,black,transparent)] backdrop-blur-sm from-primary-950/50 to-transparent opacity-0 transition-all absolute inset-0 -z-10",
          scrolled && "opacity-100",
        )}
      />
      {children}
    </div>
  );
}
