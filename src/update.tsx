import { useAtom } from "jotai";
import { autoUpdateAtom, currentBundleAtom } from "./store";
import { useEffect, useState } from "react";
import { App, AppInfo } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { CapacitorUpdater } from "@capgo/capacitor-updater";

export enum AutoUpdatePreference {
  PRODUCTION = "PRODUCTION",
  BETA = "BETA",
  DEVELOPMENT = "DEVELOPMENT",
  DISABLE = "DISABLE",
}

export type UpdateBundle = {
  version: number;
  lastCompatibleVersion: number;
  bundleUrl: string;
};

export interface UpdateProviderProps {
  children: React.ReactNode;
  checkUpdate: (
    preference: AutoUpdatePreference,
  ) => Promise<UpdateBundle | null>;
  playStoreUrl: string;
  appStoreUrl: string;
}

export function useAutoUpdate() {
  const [autoUpdatePreference, setAutoUpdatePreference] =
    useAtom(autoUpdateAtom);
  const [currentBundle] = useAtom(currentBundleAtom);

  return {
    autoUpdatePreference,
    setAutoUpdatePreference,
    currentVersion: currentBundle?.version,
  } as const;
}

export function useDeviceInfo() {
  const [deviceInfo, setDeviceInfo] = useState<AppInfo | null>(null);

  useEffect(() => {
    const getDeviceInfo = async () => {
      const info = await App.getInfo();
      setDeviceInfo(info);
    };
    getDeviceInfo();
  }, []);

  return deviceInfo;
}

export default function UpdateProvider(props: UpdateProviderProps) {
  const { autoUpdatePreference } = useAutoUpdate();
  const { children, checkUpdate, playStoreUrl, appStoreUrl } = props;
  const [update, setUpdate] = useState<UpdateBundle | null>(null);
  const [currentBundle, setCurrentBundle] = useAtom(currentBundleAtom);
  const deviceInfo = useDeviceInfo();
  const platform = Capacitor.getPlatform();

  const currentVersion =
    currentBundle?.version || parseInt(deviceInfo?.build || "0");

  useEffect(() => {
    if (platform === "web") return;
    checkUpdate(autoUpdatePreference).then(setUpdate);
  }, [autoUpdatePreference]);

  const handleUpdate = async (update: UpdateBundle) => {
    try {
      const version = await CapacitorUpdater.download({
        url: update.bundleUrl,
        version: update.version.toString(),
      });
      await CapacitorUpdater.set(version);
      setCurrentBundle(update);
    } catch (error) {
      console.error("Error setting update:", error);
    }
  };

  useEffect(() => {
    if (
      update &&
      update.version > currentVersion &&
      update.lastCompatibleVersion <= currentVersion &&
      autoUpdatePreference !== AutoUpdatePreference.DISABLE
    ) {
      handleUpdate(update);
    }
  }, [update]);

  useEffect(() => {
    if (platform === "web") return;
    CapacitorUpdater.notifyAppReady();
  }, []);

  if (!update || platform === "web" || update.version <= currentVersion)
    return children;

  // TODO : Make this component be usable under context. Let the client handle the display of the update available message.
  return (
    <div className="fixed inset-0 bg-primary-950 text-secondary-950 flex items-center justify-center flex-col text-center p-6 gap-4">
      An update is available. Please download the latest version from the{" "}
      {platform === "ios" ? "App Store" : "Google Play Store"}
      <a
        className="bg-accent-500 text-primary-950 px-4 py-2 rounded-xl font-bold"
        href={platform === "ios" ? appStoreUrl : playStoreUrl}
      >
        Download
      </a>
      <div className="text-xs opacity-40 mt-2 px-4 absolute bottom-2 inset-x-0 text-center pb-[var(--safe-area-inset-bottom,1rem)]">
        cb{currentVersion || deviceInfo?.build || "unknown"}-bb
        {deviceInfo?.build || "unknown"}-ab{update.version}
      </div>
    </div>
  );
}
