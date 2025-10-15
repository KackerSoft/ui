// Drawer.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Portal } from "./portal";
import { cn } from "./helpers";

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
  const [open, setOpen] = useState(false);

  return (
    <DrawerContext.Provider
      value={
        typeof props.open !== "undefined" && props.onOpenChange
          ? { open: props.open, setOpen: props.onOpenChange }
          : { open, setOpen }
      }
    >
      {typeof props.children === "function"
        ? props.children(open, setOpen)
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

export function DrawerContent({ children }: { children: ReactNode }) {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error("DrawerContent must be used inside Drawer");

  return (
    <Portal>
      <div
        className={cn("fixed inset-0 z-10 invisible", ctx.open && "visible")}
        onClick={(e) => {
          if (e.target === e.currentTarget) ctx.setOpen(false);
        }}
      >
        <div
          className={cn(
            "absolute pt-4 bottom-0 inset-x-0 bg-primary-800/20 backdrop-blur-2xl rounded-t-[2.5rem] border border-secondary-950/10 shadow-lg transition-all duration-300 ease-in-out pb-[calc(var(--safe-area-inset-bottom)+1rem)] translate-y-full",
            ctx.open && "translate-y-0 kui-animate-bounce",
          )}
        >
          {children}
        </div>
      </div>
    </Portal>
  );
}

export function DrawerTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-xl px-4 font-bold mb-4 text-center">{children}</h2>
  );
}
