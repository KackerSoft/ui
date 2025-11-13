import { twMerge } from "tailwind-merge";

export type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  loading?: boolean;
  children: React.ReactNode;
  variant?: "accent" | "secondary" | "hollow" | "opaque" | "danger" | "warning";
};

export default function Button(props: ButtonProps) {
  const {
    loading,
    children,
    variant = "secondary",
    className,
    disabled,
    type,
    ...rest
  } = props;

  let displayClass = "";

  switch (variant) {
    case "accent":
      displayClass =
        "bg-accent-500 border-2 border-secondary-950/10 text-primary-950";
      break;
    case "secondary":
      displayClass =
        "bg-secondary-950/10 border-2 border-secondary-950/5 text-secondary-950";
      break;
    case "hollow":
      displayClass = "bg-transparent border border-accent text-accent";
      break;
    case "opaque":
      displayClass =
        "bg-accent-400/10 border border-accent-400/10 text-accent-800 ";
      break;
    case "danger":
      displayClass = "bg-red-500/20 border-2 border-red-500/10 text-red-500";
      break;
    case "warning":
      displayClass =
        "bg-yellow-400/20 border-2 border-yellow-400/10 text-yellow-400";
      break;
  }

  return (
    <button
      type={type || "button"}
      className={twMerge(
        `ripple flex items-center gap-2 justify-center rounded-lg py-2 px-3 transition-all`,
        displayClass,
        className,
        loading || disabled ? "grayscale" : "",
      )}
      disabled={loading || disabled}
      {...rest}
    >
      {loading ? (
        <i className="fas fa-spinner-third animate-spin " />
      ) : (
        children
      )}
    </button>
  );
}
