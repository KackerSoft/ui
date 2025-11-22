import { useEffect } from "react";
import { SafeAreaController } from "@aashu-dubey/capacitor-statusbar-safe-area";
import { createStore, useAtom } from "jotai";
import { themeAtom } from "./store";
import { Provider as JotaiProvider } from "jotai";
import { StatusBar, Style } from "@capacitor/status-bar";
import { NavigationBar } from "@hugotomazi/capacitor-navigation-bar";
import { Capacitor } from "@capacitor/core";

export interface Theme {
  name: string;
  type: "light" | "dark";
  properties: {
    primary: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
      950: string;
    };
    secondary: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
      950: string;
    };
    accent: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
      950: string;
    };
  };
}

export interface ThemeConfig {
  themes: Theme[];
  defaultLightTheme: string;
  defaultDarkTheme: string;
}

const kuiStore = createStore();

export default function Provider(props: {
  children?: React.ReactNode;
  theme?: ThemeConfig;
}) {
  const [currentTheme, setCurrentTheme] = useAtom(themeAtom);

  const applyTheme = (themeName: string) => {
    const theme = props.theme?.themes.find((t) => t.name === themeName);
    if (theme) {
      Object.entries(theme.properties).forEach(([key, value]) => {
        Object.entries(value).forEach(([shade, color]) => {
          document.documentElement.style.setProperty(
            `--kui-color-${key}-${shade}`,
            color,
          );
        });
      });
      if (Capacitor.isNativePlatform() && Capacitor.getPlatform() !== "ios") {
        StatusBar.setStyle({
          style: theme.type === "dark" ? Style.Dark : Style.Light,
        });
        NavigationBar.setColor({
          darkButtons: theme.type !== "dark",
          color: "#000000",
        });
      }
    }
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      if (currentTheme === "system") {
        const newTheme = e.matches
          ? props.theme?.defaultDarkTheme || "dark"
          : props.theme?.defaultLightTheme || "light";
        applyTheme(newTheme);
      }
    };

    if (currentTheme !== "system") {
      applyTheme(currentTheme);
    } else {
      const newTheme = mediaQuery.matches
        ? props.theme?.defaultDarkTheme || "dark"
        : props.theme?.defaultLightTheme || "light";
      applyTheme(newTheme);
    }

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [currentTheme, props.theme]);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      SafeAreaController.injectCSSVariables();
      // (window?.screen?.orientation as any)?.lock?.("portrait");
      StatusBar.setOverlaysWebView({ overlay: true });
      if (Capacitor.isNativePlatform() && Capacitor.getPlatform() !== "ios") {
        NavigationBar.setTransparency({ isTransparent: true });
      }
    }
  }, []);

  return (
    <JotaiProvider store={kuiStore}>
      <div className="h-screen text-secondary-900">
        <div id="__kui-portal-root" />
        {props.children}
      </div>
    </JotaiProvider>
  );
}
