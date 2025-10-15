import React from "react";
import { twMerge } from "tailwind-merge";

export type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  right?: React.ReactNode;
  left?: React.ReactNode;
  error?: string;
  label?: React.ReactNode;
  outerClassName?: string;
};

export default function Input(props: InputProps) {
  const { error, label, className, onInput, outerClassName, ...rest } = props;

  return (
    <div className={twMerge(`w-full`, outerClassName)}>
      {label && <div className="text-sm mb-2 text-gray-500">{label}</div>}
      <div className="bg-primary-800/20 border border-secondary-950/10 rounded-lg overflow-hidden flex items-stretch">
        {props.left && (
          <div className="bg-secondary-950/10 border-r border-r-secondary-950/10 px-3 flex justify-center items-center">
            {props.left}
          </div>
        )}
        <input
          className={twMerge(
            "w-full bg-transparent transition-all p-3 outline-0 focus:ring-2 ring-accent-500 ring-0 disabled:opacity-70",
            className,
          )}
          onInput={(e) => {
            if (rest.type === "number") {
              const input = e.target as HTMLInputElement;
              const cleaned = input.value.replace(/[^0-9.]/g, "");
              input.value = cleaned;
            }
            onInput?.(e);
          }}
          {...rest}
        />
        {props.right && (
          <div className="bg-secondary-950/10 border-l border-l-secondary-950/10 px-3 flex justify-center items-center">
            {props.right}
          </div>
        )}
      </div>
      {props.error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
}
