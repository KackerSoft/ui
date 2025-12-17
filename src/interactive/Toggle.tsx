import { cn } from "@/helpers";
import React, { forwardRef, useCallback } from "react";

export type ToggleSize = "sm" | "md" | "lg";
export type ToggleVariant =
  | "accent"
  | "secondary"
  | "hollow"
  | "opaque"
  | "danger"
  | "success"
  | "warning";

  export interface ToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  size?: ToggleSize;
  variant?: ToggleVariant;
  "aria-label"?: string;
  className?: string;
  id?: string;
}

const sizeStyles: Record<
  ToggleSize,
  { track: string; thumb: string; translate: string; thumbTranslateY?: string }
> = {
  sm: {
    track: "w-9 h-5",
    thumb: "w-4 h-4",
    translate: "translate-x-4",
    thumbTranslateY: "-translate-y-1/2",
  },
  md: {
    track: "w-11 h-6",
    thumb: "w-5 h-5",
    translate: "translate-x-5",
    thumbTranslateY: "-translate-y-1/2",
  },
  lg: {
    track: "w-14 h-8",
    thumb: "w-6 h-6",
    translate: "translate-x-6",
    thumbTranslateY: "-translate-y-1/2",
  },
};

const variantOnBg: Record<ToggleVariant, string> = {
  accent: "bg-accent-500 border-accent-500",
  secondary: "bg-secondary-950/30 border-secondary-950/30",
  hollow: "bg-transparent border-accent-500/5",
  opaque: "bg-accent-400/20 border-accent-400/20",
  danger: "bg-red-500/20 border-red-500/20",
  success: "bg-green-500 border-gray-500/50",
  warning: "bg-yellow-400/20 border-yellow-400/20",
};

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  {
    checked,
    defaultChecked,
    onChange,
    disabled = false,
    size = "md",
    variant = "secondary",
    className = "",
    id,
    ...rest
  },
  ref,
) {
  // Controlled vs uncontrolled
  const isControlled = typeof checked === "boolean";
  const [internalChecked, setInternalChecked] = React.useState<boolean>(() =>
    Boolean(defaultChecked),
  );

  React.useEffect(() => {
    // if moving to controlled mode keep internal in sync
    if (isControlled) setInternalChecked(Boolean(checked));
  }, [checked, isControlled]);

  const currentChecked = isControlled ? Boolean(checked) : internalChecked;
  const styles = sizeStyles[size];

  const handleToggle = useCallback(() => {
    if (disabled) return;
    const next = !currentChecked;
    if (!isControlled) setInternalChecked(next);
    onChange?.(next);
  }, [currentChecked, disabled, isControlled, onChange]);

  const onKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
    // support Space and Enter toggling
    if (e.key === " " || e.key === "Spacebar" || e.key === "Enter") {
      e.preventDefault();
      handleToggle();
    }
  };

  // base track for unchecked + checked variant
  const trackBase =
    "relative inline-block rounded-full transition-colors duration-200 ease-in-out border";

  const checkedTrackBg = variantOnBg[variant];

  return (
    <button
      id={id}
      ref={ref}
      role="switch"
      aria-checked={currentChecked}
      aria-disabled={disabled || undefined}
      onClick={handleToggle}
      onKeyDown={onKeyDown}
      type="button"
      disabled={disabled}
      className={cn(
        `inline-flex items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed ${className}`,
      )}
      {...rest}
    >
      <span
        // track
        className={cn(
          trackBase,
          styles.track,
          currentChecked ? checkedTrackBg : "bg-transparent border-gray-500/50",
        )}
      >
        {/* thumb */}
        <span
          className={cn(
            "absolute top-1/2 -translate-y-1/2 left-1 transition-transform duration-200 ease-in-out transform bg-white rounded-full shadow",
            styles.thumb,
            currentChecked ? styles.translate : "translate-x-0",
          )}
        />
      </span>
    </button>
  );
});

export default Toggle;
