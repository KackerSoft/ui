// Drawer.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Portal } from "./portal";
import { cn } from "./helpers";
import { useViewStack } from "./context/viewstack";

export interface DrawerProps {
  children:
    | ReactNode
    | ((open: boolean, setOpen: (value: boolean) => void) => ReactNode);
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DrawerContextProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const DrawerContext = createContext<DrawerContextProps | null>(null);

export function Drawer(props: DrawerProps) {
  const [_open, _setOpen] = useState(false);
  const [viewStackIndex, setViewStackIndex] = useState<number | null>(null);

  const [viewStack, setViewStack] = useViewStack();

  const open =
    typeof props.open !== "undefined" && props.onOpenChange
      ? props.open
      : _open;

  useEffect(() => {
    if (open && viewStackIndex === null) {
      // push to view stack
      const newIndex = viewStack.length;
      setViewStackIndex(newIndex);
      setViewStack([
        ...viewStack,
        {
          component: (
            <Drawer open={true} onOpenChange={(open) => setOpen(open)}>
              {props.children}
            </Drawer>
          ),
          status: "active",
        },
      ]);
    } else {
      // pop from view stack
      if (viewStackIndex !== null) {
        const newStack = [...viewStack];
        newStack.splice(viewStackIndex, 1);
        setViewStack(newStack);
        setViewStackIndex(null);
      }
    }
  }, [open]);

  const setOpen = (value: boolean) => {
    if (typeof props.open !== "undefined" && props.onOpenChange) {
      props.onOpenChange(value);
    } else {
      _setOpen(value);
    }
  };

  const hidden =
    viewStackIndex !== null && viewStackIndex < viewStack.length - 1;

  return (
    <DrawerContext.Provider value={{ open: open && !hidden, setOpen }}>
      {typeof props.children === "function"
        ? props.children(open && !hidden, setOpen)
        : props.children}
    </DrawerContext.Provider>
  );
}

export function DrawerTrigger({ children }: { children: React.ReactElement }) {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error("DrawerTrigger must be used inside Drawer");

  // Ensure child is a valid React element
  if (!React.isValidElement(children)) {
    throw new Error("DrawerTrigger expects a single React element child");
  }

  // Merge existing onClick with ours
  const existingOnClick = (children.props as any).onClick;
  const handleClick = (e: React.MouseEvent) => {
    existingOnClick?.(e);
    ctx.setOpen(true);
  };

  return React.cloneElement(children, {
    onClick: handleClick,
  } as any);
}

export function DrawerContent({
  children,
  title,
}: {
  children: ReactNode;
  title?: ReactNode;
}) {
  const drawerContainerRef = React.useRef<HTMLDivElement>(null);

  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error("DrawerContent must be used inside Drawer");

  return (
    <Portal>
      <div
        className={cn("fixed inset-0 z-60 invisible", ctx.open && "visible")}
        onClick={(e) => {
          if (e.target === e.currentTarget) ctx.setOpen(false);
        }}
      >
        <div
          ref={drawerContainerRef}
          className={cn(
            "absolute bottom-0 inset-x-0 bg-primary-800/20 backdrop-blur-2xl rounded-t-[2.5rem] border border-secondary-950/10 shadow-lg transition-all duration-300 ease-in-out translate-y-full will-change-transform",
            ctx.open && "translate-y-0 kui-animate-bounce",
          )}
        >
          <div
            className="pt-4"
            onTouchStart={(e) => {
              const startY = e.touches[0].clientY;
              const startX = e.touches[0].clientX;

              // set transition to none to avoid jank
              if (drawerContainerRef.current) {
                drawerContainerRef.current.style.transition = "none";
              }

              const handleTouchMove = (moveEvent: TouchEvent) => {
                const currentY = moveEvent.touches[0].clientY;
                const currentX = moveEvent.touches[0].clientX;
                const deltaY = Math.max(0, currentY - startY);
                const deltaX = currentX - startX;

                // Only allow vertical dragging
                if (Math.abs(deltaY) > Math.abs(deltaX)) {
                  if (drawerContainerRef.current) {
                    const newTop = Math.min(deltaY, window.innerHeight);
                    console.log(newTop);
                    const newScale = Math.max(
                      0.95,
                      // determine scale based on how far the drawer has been dragged down, output between 0.95 and 1
                      1 - newTop / (window.innerHeight * 10),
                    );
                    drawerContainerRef.current.style.transform = `translateY(${newTop}px) scale(${newScale})`;
                  }
                }
              };
              const handleTouchEnd = (endEvent: TouchEvent) => {
                const endY = endEvent.changedTouches[0].clientY;
                const deltaY = endY - startY;

                // If dragged down more than 100px, close the drawer
                if (deltaY > 100) {
                  ctx.setOpen(false);
                }

                // Reset styles
                if (drawerContainerRef.current) {
                  drawerContainerRef.current.style.top = ``;
                  drawerContainerRef.current.style.transform = ``;
                  drawerContainerRef.current.style.transition = ``;
                }

                window.removeEventListener("touchmove", handleTouchMove);
                window.removeEventListener("touchend", handleTouchEnd);
              };

              window.addEventListener("touchmove", handleTouchMove);
              window.addEventListener("touchend", handleTouchEnd);
            }}
          >
            <div className="w-12 h-1.5 bg-secondary-950/20 rounded-full mx-auto mb-4" />
          </div>
          {title && (
            <h2 className="text-xl px-4 font-bold mb-4 text-center">{title}</h2>
          )}
          <div className="max-h-[calc(100vh-200px-var(--safe-area-inset-top))] overflow-auto pb-[calc(var(--safe-area-inset-bottom)+1rem)] ">
            {children}
          </div>
        </div>
      </div>
    </Portal>
  );
}
