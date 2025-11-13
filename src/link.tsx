import { cn } from "./helpers";
import { usePath } from "./router/router";

export default function Link(
  props: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    activeClassName?: string;
  },
) {
  const { activeClassName, className, ...rest } = props;
  const path = usePath();
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (props.href && !props.href.startsWith("http")) {
      e.preventDefault();
      window.history.pushState({}, "", props.href);
      const navEvent = new PopStateEvent("popstate", {
        state: { navigationType: "push" },
      });
      window.dispatchEvent(navEvent);
    }
  };

  return (
    <a
      {...rest}
      onClick={handleClick}
      className={cn(className, path === props.href && activeClassName)}
    >
      {props.children}
    </a>
  );
}
