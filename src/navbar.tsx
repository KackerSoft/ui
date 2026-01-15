import Link from "@/link";
import { cn } from "./helpers";
import { usePath } from "./router/router";

export interface NavBarProps {
  links: { name: string; href: string; icon: React.ReactNode }[];
  className?: string;
}

export default function NavBar(props: NavBarProps) {
  const { links, className } = props;
  const path = usePath();

  return (
    <div
      className={cn(
        "fixed z-50 inset-x-6 flex items-center bottom-[calc(var(--safe-area-inset-bottom,1rem))] rounded-full border border-secondary-900/15 bg-primary-950/50 backdrop-blur-2xl overflow-hidden shadow-lg opacity-100 transition-all",
        className,
      )}
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "w-full justify-center text-secondary-950/60 text-center flex flex-1 items-center text-xl p-5 transition-all relative",
            typeof link.icon !== "string" && "py-0",
          )}
          activeClassName="text-accent-500"
        >
          <div
            className={cn(
              "absolute -inset-4 pointer-events-none opacity-20 -translate-y-10 transition-all",
              path === link.href && "translate-y-0",
            )}
            style={{
              background:
                "radial-gradient(50% 50% at 50% 10%, var(--color-accent-400), rgba(255, 255, 255, 0) 70%)",
            }}
          />

          {typeof link.icon === "string" ? (
            <i
              className={cn(
                path === link.href ? "fas" : "far",
                "fa-" + link.icon,
              )}
            />
          ) : (
            link.icon
          )}
        </Link>
      ))}
    </div>
  );
}
