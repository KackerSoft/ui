import { cn } from "./helpers";
import { SwitchOption } from "./interactive/Switch";

export interface MenuItem {
  label: React.ReactNode;
  className?: string;
  icon: string;
  disabled?: boolean;
  onClick?: () => void;
}

export interface MenuProps {
  options: MenuItem[];
}

export default function Menu(props: MenuProps) {
  const { options } = props;

  return (
    <div>
      {options.map((option, index) => (
        <button
          key={index}
          type="button"
          disabled={option.disabled}
          onClick={() => {
            option.onClick?.();
          }}
          className={cn(
            "w-full text-left px-4 py-3 hover:bg-primary-800/50 ripple disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center gap-2",
            option.className,
          )}
        >
          <i className={`far fa-${option.icon}`} />
          {option.label}
        </button>
      ))}
    </div>
  );
}
