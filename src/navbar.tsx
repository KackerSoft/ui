import Link from "@/link";
import { cn } from "./helpers";
import { usePath } from "./router/router";

export interface NavBarProps {
  links: { name: string; href: string; icon: React.ReactNode }[];
  className?: string;
}

export default function NavBar(props: NavBarProps): React.JSX.Element {
  const { links, className } = props;
  const path = usePath();

  return (
    <div
      className={cn(
        "fixed z-50 inset-x-6 flex items-center bottom-[calc(var(--safe-area-inset-bottom,1rem))] rounded-full border border-primary-100/15 bg-primary-950/60 backdrop-blur-2xl overflow-hidden shadow-lg opacity-100 transition-all",
        className,
      )}
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "w-20 justify-center text-primary-50/60 text-center flex flex-1 items-center text-xl p-5 transition-all relative",
            typeof link.icon !== "string" && "py-0 grayscale",
          )}
          activeClassName={cn("text-accent-500 grayscale-0")}
        >
          <div
            className={cn(
              "absolute -inset-4 pointer-events-none opacity-20 -translate-y-10 transition-all duration-500",
              path === link.href && "translate-y-0",
            )}
            style={{
              background:
                "radial-gradient(50% 50% at 50% 10%, var(--color-accent-400), rgba(255, 255, 255, 0) 70%)",
            }}
          />

          {typeof link.icon === "string" ? (
            <div className="relative flex items-center justify-center leading-none">
              <i
                className={cn(
                  "fas absolute transition duration-500 opacity-0 scale-50",
                  "fa-" + link.icon,
                  path === link.href && "opacity-100 scale-100",
                )}
              />
              <i
                className={cn(
                  "far duration-500",
                  "fa-" + link.icon,
                  path === link.href && "opacity-0 scale-50",
                )}
              />
            </div>
          ) : (
            link.icon
          )}
        </Link>
      ))}
    </div>
  );
}
