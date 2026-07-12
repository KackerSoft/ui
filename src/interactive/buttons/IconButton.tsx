import { twMerge } from "tailwind-merge";

export type IconButtonType = {
  icon: string;
  onClick?: () => void;
  className?: string;
};

export default function IconButton(props: IconButtonType): React.JSX.Element {
  const { icon, onClick, className } = props;

  return (
    <button
      className={twMerge(
        "h-10 aspect-square flex text-xl items-center justify-center ripple",
        className,
      )}
      onClick={onClick}
    >
      <i className={`far fa-${icon}`} />
    </button>
  );
}
