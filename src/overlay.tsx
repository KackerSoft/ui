// Overlay.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Portal } from "./portal";
import { cn } from "./helpers";
import { registerBackHandler, usePathHash } from "./router/router";

export interface OverlayProps {
  children:
    | ReactNode
    | ((open: boolean, setOpen: (value: boolean) => void) => ReactNode);
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface OverlayContextProps {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const OverlayContext = createContext<OverlayContextProps | null>(null);

export function Overlay(props: OverlayProps) {
  const [_open, _setOpen] = useState(false);
  const [overlayId] = useState(
    "overlay-" + Math.random().toString(36).substring(2, 15),
  );
  const pathHash = usePathHash();

  const open =
    typeof props.open !== "undefined" && props.onOpenChange
      ? props.open
      : _open;

  useEffect(() => {
    if (open) {
      registerBackHandler(overlayId, () => {
        setOpen(false);
      });
    }
  }, [open]);

  const setOpen = (value: boolean) => {
    if (typeof props.open !== "undefined" && props.onOpenChange) {
      props.onOpenChange(value);
    } else {
      _setOpen(value);
    }
  };

  const hidden = pathHash !== overlayId;

  return (
    <OverlayContext.Provider
      value={{
        open: open && !hidden,
        onClose: () => window.history.back(),
        onOpen: () => setOpen(true),
      }}
    >
      {typeof props.children === "function"
        ? props.children(open && !hidden, setOpen)
        : props.children}
    </OverlayContext.Provider>
  );
}

export function OverlayTrigger({ children }: { children: React.ReactElement }) {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error("OverlayTrigger must be used inside Overlay");

  // Ensure child is a valid React element
  if (!React.isValidElement(children)) {
    throw new Error("OverlayTrigger expects a single React element child");
  }

  // Merge existing onClick with ours
  const existingOnClick = (children.props as any).onClick;
  const handleClick = (e: React.MouseEvent) => {
    existingOnClick?.(e);
    ctx.onOpen();
  };

  return React.cloneElement(children, {
    onClick: handleClick,
  } as any);
}

export function OverlayContent({
  children,
  className,
  showBackButton = true,
}: {
  children: ReactNode;
  className?: string;
  showBackButton?: boolean;
}) {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error("OverlayContent must be used inside Overlay");

  return (
    <Portal>
      <div
        className={cn(
          "fixed inset-0 z-6000 bg-primary-950/20 backdrop-blur-2xl transition-all duration-300 ease-in-out opacity-0 invisible",
          ctx.open && "opacity-100 visible",
          className,
        )}
        onClick={(e) => {
          if (e.target === e.currentTarget) ctx.onClose();
        }}
      >
        {showBackButton && (
          <button
            className="absolute top-[calc(var(--safe-area-inset-top,1rem)+1rem)] left-4 h-10 w-10 flex items-center justify-center rounded-full bg-primary-900/50 text-primary-50 hover:bg-primary-800/60 transition-colors z-10"
            onClick={ctx.onClose}
            aria-label="Close overlay"
          >
            <i className="far fa-arrow-left text-lg" />
          </button>
        )}
        <div
          className={cn(
            "w-full h-full transition-all duration-300 ease-in-out scale-95 opacity-0",
            ctx.open && "scale-100 opacity-100",
          )}
        >
          {children}
        </div>
      </div>
    </Portal>
  );
}
