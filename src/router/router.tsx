import { useViewStack } from "@/context/viewstack";
import NavBar, { NavBarProps } from "@/navbar";
import { useEffect, useState } from "react";

export interface Routes {
  [key: string]: (params: { [key: string]: string }) => React.ReactNode;
}

interface RouterProps {
  routes: Routes;
  mainRoutes: string[];
  navBar: NavBarProps;
}

export function usePath() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const onLocationChange = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener("popstate", onLocationChange);
    return () => {
      window.removeEventListener("popstate", onLocationChange);
    };
  }, []);

  return path;
}

export default function Router(props: RouterProps) {
  const path = usePath();
  const [viewStack, setViewStack] = useViewStack();

  const { routes } = props;

  const routeKeys = Object.keys(routes);

  useEffect(() => {
    const getCurrentRoute = () => {
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

    const newRoute = getCurrentRoute();

    setViewStack((prevStack) => [
      ...prevStack,
      {
        path,
        component: newRoute || <div className="text-white">404 Not Found</div>,
        status: "active",
      },
    ]);
  }, [path]);

  return (
    <div className="h-screen relative overflow-hidden">
      {viewStack.at(-1)?.component}
      <NavBar {...props.navBar} />
    </div>
  );
}
