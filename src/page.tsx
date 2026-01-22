import { Capacitor } from "@capacitor/core";
import { cn } from "./helpers";
import { goBack } from "./router/router";
import { twMerge } from "tailwind-merge";

export interface PageHeaderProps {
  title: string;
  transparent?: boolean;
  onBack?: () => void;
  action?: React.ReactNode;
}
export interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  containerClassName?: string;
  className?: string;
  header?: PageHeaderProps;
}

export default function Page(props: PageProps) {
  const { className, containerClassName, children, header, ...rest } = props;

  const platform = Capacitor.getPlatform();

  return (
    <div
      {...rest}
      className={cn(
        `overflow-auto h-screen pb-[calc(var(--safe-area-inset-bottom,1rem)+3.5rem)] relative bg-primary-950`,
        !header && "pt-[var(--safe-area-inset-top,1rem)]",
        containerClassName,
      )}
    >
      {header && (
        <div
          className={twMerge(
            "flex items-center justify-between sticky top-0 pt-[var(--safe-area-inset-top,1rem)] z-10 inset-x-0 backdrop-blur-2xl px-4 rounded-b-2xl",
            platform === "android" &&
              "pt-[calc(var(--safe-area-inset-top,1rem)+1rem)]",
            header.transparent
              ? "fixed bg-linear-to-b from-primary-950/70 to-transparent backdrop-blur-none"
              : "bg-primary-950/50",
          )}
        >
          <div className="pb-3">
            <button
              className="flex items-center justify-center w-8 aspect-square rounded-lg"
              onClick={() => {
                header.onBack?.();
                goBack();
              }}
            >
              <i className="far fa-arrow-left" />
            </button>
          </div>
          <div className="text-left w-full font-semibold text-lg p-4 pt-1">
            {header.title}
          </div>
          <div className="pb-3">{header.action}</div>
        </div>
      )}
      <div className={className}>{children}</div>
    </div>
  );
}

export function PageHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  const { children, className, ...rest } = props;
  return (
    <div
      {...rest}
      className={cn(
        "text-3xl font-black",
        Capacitor.isNativePlatform() &&
          Capacitor.getPlatform() !== "ios" &&
          "mt-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
