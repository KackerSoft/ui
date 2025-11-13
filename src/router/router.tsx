import { useViewStack, ViewStack } from "@/context/viewstack";
import { cn } from "@/helpers";
import NavBar, { NavBarProps } from "@/navbar";
import { popStateAtom, viewStackAtom } from "@/store";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { App as CapacitorApp } from "@capacitor/app";

export interface Routes {
  [key: string]: (params: { [key: string]: string }) => React.ReactNode;
}

interface RouterProps {
  routes: Routes;
  mainRoutes: string[];
  navBar: NavBarProps;
  defaultRoute?: string;
}

export function usePath() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const onLocationChange = (e: PopStateEvent) => {
      setPath(window.location.pathname);
    };

    window.addEventListener("popstate", onLocationChange);
    return () => {
      window.removeEventListener("popstate", onLocationChange);
    };
  }, []);

  return path;
}

export function useNavigationState() {
  const [viewStack] = useAtom(viewStackAtom);
  return viewStack[viewStack.length - 1]?.state;
}

export const navigate = (
  to: string,
  replace: boolean = false,
  state: any = null,
) => {
  if (replace) window.history.replaceState(state, "", to);
  else window.history.pushState(state, "", to);
  const popStateEvent = new PopStateEvent("popstate", {
    state: { navigationType: replace ? "replace" : "push", state },
  });
  window.dispatchEvent(popStateEvent);
};

export const goBack = () => {
  window.history.back();
  // const popStateEvent = new PopStateEvent("popstate", {
  //   state: { navigationType: "back" },
  // });
  // window.dispatchEvent(popStateEvent);
};

export default function Router(props: RouterProps) {
  const [viewStack, setViewStack] = useViewStack();

  const path = usePath();

  const { routes } = props;

  const routeKeys = Object.keys(routes);

  const getCurrentRoute = (path: string) => {
    // handle routes. variables in routes are denoted by :variableName
    for (let routeKey of routeKeys) {
      const routeParts = routeKey.split("/").filter(Boolean);
      const pathParts = path.split("/").filter(Boolean);

      if (routeParts.length !== pathParts.length) {
        continue;
      }

      const params: { [key: string]: string } = {};
      let isMatch = true;

      for (let i = 0; i < routeParts.length; i++) {
        if (routeParts[i].startsWith(":")) {
          const paramName = routeParts[i].substring(1);
          params[paramName] = decodeURIComponent(pathParts[i]);
        } else if (routeParts[i] !== pathParts[i]) {
          isMatch = false;
          break;
        }
      }

      if (isMatch) {
        return routes[routeKey](params);
      }
    }
  };

  useEffect(() => {
    const onPopState = (e: PopStateEvent) => {
      const path = window.location.pathname;
      // check if it was a forward or backward navigation
      setViewStack((prevStack) => {
        if (e.state && e.state.navigationType === "push") {
          return [
            ...prevStack,
            {
              path,
              component: getCurrentRoute(path) || (
                <div className="text-white">404 Not Found</div>
              ),
              status: "active",
              state: e.state.state,
            },
          ];
        } else if (e.state && e.state.navigationType === "replace") {
          return [
            ...prevStack.slice(0, -1),
            {
              path,
              component: getCurrentRoute(path) || (
                <div className="text-white">404 Not Found</div>
              ),
              status: "active",
              state: e.state.state,
            },
          ];
        } else {
          // back navigation
          if (prevStack.length > 1) {
            return prevStack.slice(0, -1);
          } else {
            return prevStack;
          }
        }
      });
    };

    if (viewStack.length === 0) {
      // initialize view stack
      const initialPath = window.location.pathname;

      setViewStack([
        // make sure that the first route is a main route
        ...(!props.mainRoutes.includes(initialPath)
          ? [
              {
                path: props.mainRoutes[0],
                component: getCurrentRoute(props.mainRoutes[0]) || (
                  <div className="text-white">404 Not Found</div>
                ),
                status: "background",
                state: null,
              } as ViewStack,
            ]
          : []),
        {
          path: initialPath,
          component: getCurrentRoute(initialPath) || (
            <div className="text-white">404 Not Found</div>
          ),
          status: "active",
          state: null,
        },
      ]);
    }

    const backListener = CapacitorApp.addListener("backButton", goBack);

    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
      backListener?.then((handle) => handle.remove());
    };
  }, []);

  useEffect(() => {
    if (path === "/" && props.defaultRoute) {
      navigate(props.defaultRoute, true);
    }
  }, [path]);

  const showNavBar = props.mainRoutes.includes(path);

  return (
    <div className="h-screen relative overflow-hidden">
      {viewStack.filter((v) => !!v.path).at(-1)?.component}
      <NavBar
        {...props.navBar}
        className={cn(
          props.navBar.className,
          !showNavBar && "opacity-0 -bottom-full",
        )}
      />
    </div>
  );
}
