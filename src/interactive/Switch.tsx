import { cn } from "@/helpers";
import { useEffect, useState } from "react";

export type SwitchOption = {
  label: React.ReactNode;
  value: string;
};

export type SwitchProps = {
  onChange?: (value: string) => void;
  options: SwitchOption[];
  defaultValue: SwitchOption["value"];
  name?: string;
};

export default function Switch(props: SwitchProps) {
  const { onChange, options, defaultValue } = props;

  const [value, setValue] = useState<SwitchOption["value"]>(defaultValue);

  const valueIndex = options.findIndex((option) => option.value === value);

  useEffect(() => {
    onChange?.(value);
  }, [value, onChange]);

  return (
    <div className="flex justify-between items-stretch gap-2 p-2 border rounded-lg relative bg-primary-800/20 border-secondary-950/10 overflow-hidden">
      <input type="hidden" name={props.name} value={value} />
      {options.map((option, index) => (
        <button
          type={"button"}
          className={cn(
            "flex-1 p-2 z-10 ripple rounded-lg transition-all",
            value === option.value && "text-accent-500",
          )}
          key={index}
          onClick={() => setValue(`${option.value}`)}
        >
          {option.label}
        </button>
      ))}
      <div
        className="bg-accent-500/20 rounded-lg absolute top-2 bottom-2 transition-all border border-secondary-950/10 overflow-hidden"
        style={{
          width: `calc(${100 / options.length}% - 1rem)`,
          left: `calc(${(valueIndex * 100) / options.length}% + 0.5rem)`,
        }}
      >
        <div
          className={
            "absolute -inset-4 pointer-events-none opacity-30 -translate-y-0 transition-all"
          }
          style={{
            background:
              "radial-gradient(60% 60% at 50% 20%, var(--color-accent-400), rgba(255, 255, 255, 0) 70%)",
          }}
        />
      </div>
    </div>
  );
}
