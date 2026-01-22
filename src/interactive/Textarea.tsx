import React from "react";
import { twMerge } from "tailwind-merge";

export type TextareaProps = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> & {
  right?: React.ReactNode;
  left?: React.ReactNode;
  error?: string;
  label?: React.ReactNode;
  outerClassName?: string;
};

export default function Textarea(props: TextareaProps) {
  const { error, label, className, outerClassName, ...rest } = props;

  return (
    <div className={twMerge("w-full", outerClassName)}>
      {label && <div className="text-sm mb-2 text-gray-500">{label}</div>}
      <div className="bg-primary-800/20 border border-primary-50/10 rounded-lg overflow-hidden flex items-stretch">
        {props.left && (
          <div className="bg-primary-950/10 border-r border-r-primary-50/10 px-3 flex justify-center items-center">
            {props.left}
          </div>
        )}
        <textarea
          className={twMerge(
            "w-full bg-transparent transition-all p-3 outline-0 focus:ring-2 ring-accent-500 ring-0 resize-none disabled:opacity-70",
            className,
          )}
          {...rest}
        />
        {props.right && (
          <div className="bg-primary-50/10 border-l border-l-primary-50/10 px-3 flex justify-center items-center">
            {props.right}
          </div>
        )}
      </div>
      {props.error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
}
