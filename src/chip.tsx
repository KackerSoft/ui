import { twMerge } from "tailwind-merge";

export default function Chip(
  props: React.HTMLProps<HTMLDivElement> & {
    icon?: string;
    content: React.ReactNode;
  },
) {
  const { className, icon, content, ...rest } = props;

  return (
    <div
      {...rest}
      className={twMerge(
        "rounded-md overflow-hidden z-10 relative p-1 px-2 before:absolute before:inset-0 before:-z-10 before:opacity-20 inline-flex items-center gap-2 text-sm",
        className,
      )}
    >
      {!!icon && <i className={`fas fa-${icon}`} />}
      {content}
    </div>
  );
}
