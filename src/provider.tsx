import "@/index.css";

import { createContext, useContext, useEffect, useState } from "react";
import { SafeAreaController } from "@aashu-dubey/capacitor-statusbar-safe-area";
import { createStore, useAtom } from "jotai";
import { themeAtom } from "./store";
import { Provider as JotaiProvider } from "jotai";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Capacitor } from "@capacitor/core";
import { NavigationBar } from "@capgo/capacitor-navigation-bar";

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

const ThemeContext = createContext<ThemeConfig | undefined>(undefined);

export function useTheme(onChange?: (theme: Theme) => void): {
  currentTheme: string;
  setCurrentTheme: (theme: string) => void;
  resolvedTheme: string;
  systemTheme: Theme | undefined;
  activeTheme: Theme | undefined;
} {
  const [currentTheme, setCurrentTheme] = useAtom(themeAtom);
  const themeConfig = useContext(ThemeContext);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setDark(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const resolvedTheme =
    currentTheme === "system"
      ? dark
        ? themeConfig?.defaultDarkTheme || "dark"
        : themeConfig?.defaultLightTheme || "light"
      : currentTheme;

  const activeTheme = themeConfig?.themes?.find(
    (t) => t.name === resolvedTheme,
  );

  const systemThemeName = dark
    ? themeConfig?.defaultDarkTheme || "dark"
    : themeConfig?.defaultLightTheme || "light";

  const systemTheme = themeConfig?.themes?.find(
    (t) => t.name === systemThemeName,
  );

  useEffect(() => {
    if (activeTheme) {
      onChange?.(activeTheme);
    }
  }, [activeTheme]);

  return {
    currentTheme,
    setCurrentTheme,
    resolvedTheme,
    systemTheme,
    activeTheme,
  };
}

function ThemeUpdater() {
  useTheme((theme) => {
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
      NavigationBar.setNavigationBarColor({
        darkButtons: theme.type !== "dark",
        color: "TRANSPARENT",
      });
    }
  });
  return null;
}

export default function Provider(props: {
  children?: React.ReactNode;
  theme?: ThemeConfig;
}) {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      SafeAreaController.injectCSSVariables();
      // (window?.screen?.orientation as any)?.lock?.("portrait");
      StatusBar.setOverlaysWebView({ overlay: true });
    }
  }, []);

  return (
    <JotaiProvider store={kuiStore}>
      <ThemeContext.Provider value={props.theme}>
        <ThemeUpdater />
        <div className="h-screen text-primary-50">
          <div id="__kui-portal-root" />
          {props.children}
        </div>
      </ThemeContext.Provider>
    </JotaiProvider>
  );
}
