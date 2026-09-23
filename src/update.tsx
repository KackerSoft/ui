import { useAtom } from "jotai";
import { autoUpdateAtom, currentBundleAtom } from "./store";
import { useEffect, useRef, useState } from "react";
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
  const deviceInfo = useDeviceInfo();
  const platform = Capacitor.getPlatform();
  const updateStarted = useRef(false);

  const currentVersion =
    currentBundle?.version || parseInt(deviceInfo?.build || "0");

  // The stored bundle record can go stale against what the native shell is
  // actually running: the store can push a new native build (which makes the
  // updater drop downloaded bundles), or an OTA bundle can be rolled back for
  // failing to signal app readiness. Ask the updater what is really active and
  // discard the record when it disagrees, so the native build is treated as
  // current again. Skipped once an update is in flight, since the record is
  // written ahead of the reload that activates it.
  useEffect(() => {
    if (platform === "web" || !currentBundle || updateStarted.current) return;
    let cancelled = false;
    CapacitorUpdater.current()
      .then(({ bundle }) => {
        if (cancelled) return;
        if (parseInt(bundle.version) !== currentBundle.version) {
          setCurrentBundle(null);
        }
      })
      .catch(() => {
        // Leave the record alone if the active bundle can't be determined.
      });
    return () => {
      cancelled = true;
    };
  }, [currentBundle, platform, setCurrentBundle]);

  useEffect(() => {
    if (platform === "web") return;
    checkUpdate(autoUpdatePreference).then(setUpdate);
  }, [autoUpdatePreference]);

  const handleUpdate = async (update: UpdateBundle) => {
    const previousBundle = currentBundle;
    try {
      const bundle = await CapacitorUpdater.download({
        url: update.bundleUrl,
        version: update.version.toString(),
      });
      // `set()` reloads the webview before it resolves, so its promise never
      // settles in this JS context — the bundle has to be recorded first or the
      // app reboots believing it is still on the old version and updates again.
      setCurrentBundle(update);
      await CapacitorUpdater.set(bundle);
    } catch (error) {
      setCurrentBundle(previousBundle);
      updateStarted.current = false;
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

  // Depends on `canAutoUpdate` rather than `update` alone because the device
  // info and the stale-bundle reconciliation above both resolve asynchronously,
  // so the decision can flip after `update` has already arrived.
  useEffect(() => {
    if (!update || !canAutoUpdate || updateStarted.current) return;
    updateStarted.current = true;
    handleUpdate(update);
  }, [canAutoUpdate, update]);

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
