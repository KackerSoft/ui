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
  lastMandatoryVersion: number;
  bundleUrl: string;
};

export interface UpdateContentProps {
  update: UpdateBundle;
  currentVersion: number;
}

export interface UpdateProviderProps {
  children: React.ReactNode;
  checkUpdate: (
    preference: AutoUpdatePreference,
  ) => Promise<UpdateBundle | null>;
  mandatoryUpdateAvailableComponent: (
    props: UpdateContentProps,
  ) => React.ReactNode;
  updatingComponent?: (props: UpdateContentProps) => React.ReactNode;
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
  const {
    children,
    checkUpdate,
    mandatoryUpdateAvailableComponent,
    updatingComponent,
  } = props;
  const [update, setUpdate] = useState<UpdateBundle | null>(null);
  const [currentBundle, setCurrentBundle] = useAtom(currentBundleAtom);
  const deviceInfo = useDeviceInfo();
  const platform = Capacitor.getPlatform();

  const currentVersion =
    currentBundle?.version || parseInt(deviceInfo?.build || "0");

  // Check if base build is greater than current bundle version
  // This can happen if the app auto-updates from the play store
  useEffect(() => {
    if (platform === "web") return;
    const baseBuild = parseInt(deviceInfo?.build || "0");
    if (currentBundle && baseBuild > currentBundle.version) {
      // Reset current bundle as the base build is now newer
      setCurrentBundle(null);
    }
  }, [deviceInfo, currentBundle, platform]);

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

  const canAutoUpdate =
    update &&
    update.version > currentVersion &&
    update.lastCompatibleVersion <= currentVersion &&
    update.lastMandatoryVersion <= currentVersion &&
    autoUpdatePreference !== AutoUpdatePreference.DISABLE;

  const mandatoryUpdateRequired =
    update && update.lastMandatoryVersion > currentVersion;

  useEffect(() => {
    if (canAutoUpdate) {
      handleUpdate(update);
    }
  }, [update]);

  useEffect(() => {
    if (platform === "web") return;
    CapacitorUpdater.notifyAppReady();
  }, []);

  if (canAutoUpdate)
    return updatingComponent ? (
      <>
        {updatingComponent({
          update,
          currentVersion,
        })}
      </>
    ) : null;

  if (mandatoryUpdateRequired) {
    return mandatoryUpdateAvailableComponent({
      update,
      currentVersion,
    });
  }
  return children;
}
