import Link from "@/link";
import { cn } from "./helpers";
import { usePath } from "./router/router";
import { useEffect, useLayoutEffect, useRef } from "react";

export interface NavBarProps {
  links: { name: string; href: string; icon: React.ReactNode }[];
  className?: string;
}

let rerenders = 0;

export default function NavBar(props: NavBarProps) {
  const { links, className } = props;
  const path = usePath();

  const puck = useRef<HTMLDivElement>(null);
  const navBar = useRef<HTMLDivElement>(null);

  rerenders++;
  console.log(rerenders);

  useEffect(() => {
    // check for path change, move puck to active link

    if (!puck.current || !navBar.current) return;
    const activeIndex = links.findIndex((link) => link.href === path);
    if (activeIndex === -1) return;
    if (puck.current) {
      const navBarRect = navBar.current.getBoundingClientRect();
      const linkWidth = (navBarRect.width - 8) / links.length;
      const newLeft = 4 + activeIndex * linkWidth;
      puck.current.style.transform = `translateX(${newLeft}px)`;
    }
  }, [path]);

  return (
    <div
      ref={navBar}
      className={cn(
        "fixed z-50 inset-x-6 flex items-center bottom-[calc(var(--safe-area-inset-bottom,1rem))] rounded-full border border-secondary-900/10 bg-primary-950/50 backdrop-blur-2xl overflow-hidden shadow-lg opacity-100 transition-all",
        className,
      )}
    >
      {/* Allow the puck to be draggable horizontally */}
      <div
        ref={puck}
        onTouchStart={(e) => {
          const startY = e.touches[0].clientY;
          const startX = e.touches[0].clientX;
          console.log("touch start");

          const puck = e.currentTarget;
          const puckRect = puck.getBoundingClientRect();

          // set transition to none to avoid jank
          puck.style.transition = "none";

          const handleTouchMove = (moveEvent: TouchEvent) => {
            const currentY = moveEvent.touches[0].clientY;
            const currentX = moveEvent.touches[0].clientX;
            const deltaY = Math.max(0, currentY - startY);
            const deltaX = currentX - startX;
            const newLeft = puckRect.left + currentX;

            console.log({ deltaY, deltaX });

            puck.style.transform = `translateX(${newLeft}px)`;

            const handleTouchEnd = (endEvent: TouchEvent) => {
              const endY = endEvent.changedTouches[0].clientY;
              const deltaY = endY - startY;

              // Reset styles
              puck.style.top = ``;
              puck.style.transform = ``;
              puck.style.transition = ``;

              window.removeEventListener("touchmove", handleTouchMove);
              window.removeEventListener("touchend", handleTouchEnd);
            };

            window.addEventListener("touchmove", handleTouchMove);
            window.addEventListener("touchend", handleTouchEnd);
          };
        }}
        className="bg-accent-500/5 rounded-full absolute top-1 bottom-1 left-0 border border-secondary-950/5 border-t-accent-500/10 z-10 delay-75 ease-in-out transition-all"
        style={{
          width: `calc((100% / ${links.length}) - 0.25rem)`,
        }}
      />
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className=" w-full justify-center text-secondary-950/50 text-center flex-1 items-center text-xl p-4 transition-all relative"
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
