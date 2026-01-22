import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

type OTPProps = {
  length: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  className?: string;
  disabled?: boolean;
};

export default function OTP({
  length,
  value,
  onChange,
  onComplete,
  className,
  disabled,
}: OTPProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const otp = value.padEnd(length, "").slice(0, length);

  useEffect(() => {
    if (otp.length === length) {
      onComplete?.(otp);
    }
  }, [otp]);

  const focusInput = (index: number) => {
    inputsRef.current[index]?.focus();
  };

  const handleChange = (index: number, char: string) => {
    if (disabled || !/^[a-zA-Z0-9]?$/.test(char)) return;

    const next = otp.split("");
    next[index] = char;

    const nextValue = next.join("");
    onChange(nextValue.toUpperCase());

    if (char && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled) return;
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, length);

    if (!pasted) return;

    onChange(pasted.padEnd(length, ""));
    focusInput(Math.min(pasted.length, length - 1));
  };

  return (
    <div className={twMerge("flex gap-2 justify-between", className)}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          value={otp[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          type="text"
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          className="
            h-12 w-12
            bg-primary-800/50 border-2 border-primary-50/5 rounded-xl 
            text-center text-lg font-semibold
            focus:border-accent-500 focus:ring-2 focus:ring-accent-500
            outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        />
      ))}
    </div>
  );
}
