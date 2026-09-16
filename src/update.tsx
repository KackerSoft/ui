import { useAtom } from "jotai";
import {
  autoUpdateAtom,
  currentBundleAtom,
  currentBundleBaseBuildAtom,
} from "./store";
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

export function useAutoUpdate(): {
  readonly autoUpdatePreference: AutoUpdatePreference;
  readonly setAutoUpdatePreference: (update: AutoUpdatePreference) => void;
  readonly currentVersion: number | undefined;
} {
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
      if (Capacitor.getPlatform() === "web") return;
      const info = await App.getInfo();
      setDeviceInfo(info);
    };
    getDeviceInfo();
  }, []);

  return deviceInfo;
}

export default function UpdateProvider(
  props: UpdateProviderProps,
): React.ReactNode {
  const { autoUpdatePreference } = useAutoUpdate();
  const {
    children,
    checkUpdate,
    mandatoryUpdateAvailableComponent,
    updatingComponent,
  } = props;
  const [update, setUpdate] = useState<UpdateBundle | null>(null);
  const [currentBundle, setCurrentBundle] = useAtom(currentBundleAtom);
  const [currentBundleBaseBuild, setCurrentBundleBaseBuild] = useAtom(
    currentBundleBaseBuildAtom,
  );
  const deviceInfo = useDeviceInfo();
  const platform = Capacitor.getPlatform();

  const currentVersion =
    currentBundle?.version || parseInt(deviceInfo?.build || "0");

  // Check if the native base build has changed since the current OTA bundle
  // was downloaded. This can happen if the app auto-updates from the app/play
  // store, either to a newer build than the bundle (e.g. the bundle is stale)
  // or to a build that still has a lower version number than the bundle
  // (e.g. the bundle was downloaded on top of an older base build, and the
  // store then pushed an intermediate native update). In either case the
  // downloaded bundle no longer matches the native shell it was set on top
  // of, so it must be discarded and the native base build treated as current.
  useEffect(() => {
    if (platform === "web" || !deviceInfo) return;
    const baseBuild = parseInt(deviceInfo?.build || "0");
    if (
      currentBundle &&
      (currentBundleBaseBuild === null || baseBuild !== currentBundleBaseBuild)
    ) {
      // Reset current bundle as the native base build has changed
      setCurrentBundle(null);
      setCurrentBundleBaseBuild(null);
    }
  }, [
    deviceInfo,
    currentBundle,
    currentBundleBaseBuild,
    platform,
    setCurrentBundle,
    setCurrentBundleBaseBuild,
  ]);

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
      setCurrentBundleBaseBuild(parseInt(deviceInfo?.build || "0"));
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
