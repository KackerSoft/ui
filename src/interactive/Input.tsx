import { cn } from "@/helpers";
import React, { useEffect, useLayoutEffect } from "react";
import { twMerge } from "tailwind-merge";

export type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  right?: React.ReactNode;
  left?: React.ReactNode;
  error?: string;
  outerClassName?: string;
  errorClassName?: string;
};

export default function Input(props: InputProps) {
  const {
    error,
    className,
    onInput,
    onChange,
    onFocus,
    onBlur,
    outerClassName,
    errorClassName,
    placeholder,
    ...rest
  } = props;

  const inputRef = React.useRef<HTMLInputElement>(null);

  // 1) Track focus
  const [inputIsActive, setIsActive] = React.useState(false);

  // 2) Track whether there is any content (works for both controlled/uncontrolled)
  const initialHasValue =
    (rest.value !== undefined && String(rest.value) !== "") ||
    (rest.defaultValue !== undefined && String(rest.defaultValue) !== "");

  const [hasValue, setHasValue] = React.useState(initialHasValue);

  // If controlled, update when `value` changes
  useLayoutEffect(() => {
    if (rest.value !== undefined) setHasValue(String(rest.value ?? "") !== "");
  }, [rest.value]);

  // If uncontrolled, check the DOM value after mount
  useEffect(() => {
    if (rest.value === undefined && inputRef.current) {
      setHasValue(inputRef.current.value !== "");
    }
  }, [rest.value]);

  const isActive = inputIsActive || hasValue;

  return (
    <div className={twMerge(`w-full`, outerClassName)}>
      <div
        className={twMerge(
          `bg-primary-800/50 border-2 border-secondary-950/5 rounded-xl overflow-hidden flex items-stretch transition-all ring-0`,
          inputIsActive && "border-accent-500",
          error && "border-red-500",
        )}
      >
        {props.left && (
          <div
            className={twMerge(
              "bg-secondary-950/5 border-r border-r-secondary-950/5 px-3 flex justify-center items-center",
              inputIsActive && "bg-accent-500 text-primary-950",
              error && "bg-red-500 text-primary-950",
            )}
          >
            {props.left}
          </div>
        )}

        <div className="w-full relative">
          {!!placeholder && (
            <div
              className={twMerge(
                "absolute top-2.75 flex items-center justify-center left-3 opacity-60 transition-all",
                isActive && "top-1.5 text-[10px]",
                inputIsActive && "opacity-100 text-accent-500",
                error && "opacity-100 text-red-500",
              )}
            >
              {placeholder}
            </div>
          )}

          <input
            ref={inputRef}
            className={twMerge(
              "w-full bg-transparent transition-all px-3 py-2.75 outline-0 disabled:opacity-70",
              className,
              isActive && placeholder && "pt-4 pb-1.5",
            )}
            // Keep your numeric sanitization and also keep hasValue in sync
            onInput={(e) => {
              const el = e.target as HTMLInputElement;
              if (rest.type === "number") {
                const cleaned = el.value.replace(/[^0-9.]/g, "");
                if (cleaned !== el.value) el.value = cleaned;
              }
              // Update hasValue for uncontrolled inputs
              if (rest.value === undefined) setHasValue(el.value !== "");
              onInput?.(e);
            }}
            onChange={(e) => {
              // Update hasValue for uncontrolled inputs on change, too
              if (rest.value === undefined) {
                const el = e.target as HTMLInputElement;
                setHasValue(el.value !== "");
              }
              onChange?.(e);
            }}
            onFocus={(e) => {
              setIsActive(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsActive(false);
              // For uncontrolled, ensure final value is reflected
              if (rest.value === undefined) {
                const el = e.target as HTMLInputElement;
                setHasValue(el.value !== "");
              }
              onBlur?.(e);
            }}
            {...rest}
          />
        </div>

        {props.right && (
          <div
            className={cn(
              "bg-secondary-950/5 border-l border-l-secondary-950/5 px-3 flex justify-center items-center",
              inputIsActive && "bg-accent-500 text-primary-950",
              error && "bg-red-500 text-primary-950",
            )}
          >
            {props.right}
          </div>
        )}
      </div>

      {props.error && (
        <div className={twMerge("text-red-500 text-xs mt-1", errorClassName)}>
          {error}
        </div>
      )}
    </div>
  );
}
