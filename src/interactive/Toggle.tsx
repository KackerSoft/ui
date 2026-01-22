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
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "type" | "onChange"
  > {
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
  {
    track: string;
    thumb: string;
    translate: string;
  }
> = {
  sm: {
    track: "w-9 h-5",
    thumb: "w-4 h-4",
    translate: "translate-x-[14px]",
  },
  md: {
    track: "w-11 h-6",
    thumb: "w-5 h-5",
    translate: "translate-x-[18px]",
  },
  lg: {
    track: "w-14 h-7",
    thumb: "w-6 h-6",
    translate: "translate-x-[26px]",
  },
};

const variantOnBg: Record<ToggleVariant, string> = {
  accent: "bg-accent-500 border-accent-500",
  secondary: "bg-primary-50/30 border-primary-50/30",
  hollow: "bg-transparent border-accent-500/5",
  opaque: "bg-accent-400/20 border-accent-400/20",
  danger: "bg-red-500/20 border-red-500/20",
  success: "bg-green-500 border-green-500/50",
  warning: "bg-yellow-400/20 border-yellow-400/20",
};

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  {
    checked,
    defaultChecked,
    onChange,
    disabled = false,
    size = "lg",
    variant = "accent",
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
        "inline-flex focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-full disabled:opacity-60 disabled:cursor-not-allowed",
        className,
      )}
      {...rest}
    >
      {/* Track */}
      <span
        className={cn(
          "relative inline-flex items-center rounded-full border transition-colors duration-200",
          styles.track,
          currentChecked
            ? variantOnBg[variant]
            : "bg-transparent border-gray-500/50",
        )}
      >
        {/* Thumb */}
        <span
          className={cn(
            "absolute left-0.5 bg-white rounded-full shadow transition-transform duration-200 ease-in-out",
            styles.thumb,
            currentChecked && styles.translate,
          )}
        />
      </span>
    </button>
  );
});

export default Toggle;
