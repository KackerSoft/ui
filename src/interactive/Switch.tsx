import { cn } from "@/helpers";
import { useEffect, useState } from "react";

export type SwitchOption<T extends string = string> = {
  label: React.ReactNode;
  value: T;
};

export type SwitchProps<T extends string = string> = {
  onChange?: (value: T) => void;
  options: SwitchOption<T>[];
  name?: string;
  value: T;
  error?: string;
  containerClassName?: string;
};

export default function Switch<T extends string>(props: SwitchProps<T>) {
  const { onChange, options, value, error, containerClassName } = props;
  const valueIndex = options.findIndex((option) => option.value === value);

  return (
    <>
      <div
        className={cn(
          "flex justify-between items-stretch  p-2 rounded-xl relative bg-primary-800/50 border-2 border-primary-50/5 overflow-hidden",
          containerClassName,
        )}
      >
        {options.map((option, index) => (
          <button
            type={"button"}
            className={cn(
              "flex-1 p-2 z-10 ripple rounded-lg transition-all",
              value === option.value && "",
            )}
            key={index}
            onClick={() => onChange?.(option.value)}
          >
            {option.label}
          </button>
        ))}
        <div
          className="bg-primary-500/20 rounded-xl absolute top-2 bottom-2 transition-all border border-primary-50/10 overflow-hidden"
          style={{
            width: `calc(${100 / options.length}% - 1rem)`,
            left: `calc(${(valueIndex * 100) / options.length}% + 0.5rem)`,
          }}
        ></div>
      </div>
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </>
  );
}
