import React, { createContext, useContext } from "react";
import { cn } from "./helpers";

export interface FallBackProps {
  loading: boolean;
  error: boolean;
  children: React.ReactNode;
}

interface FallbackContextType {
  loading: boolean;
  error: boolean;
}

const FallbackContext = createContext<FallbackContextType | undefined>(
  undefined,
);

const useFallbackContext = () => {
  const context = useContext(FallbackContext);
  if (!context) {
    throw new Error(
      "Fallback components must be used within a Fallback provider",
    );
  }
  return context;
};

export default function Fallback(props: FallBackProps) {
  return (
    <FallbackContext.Provider
      value={{ loading: props.loading, error: props.error }}
    >
      {props.children}
    </FallbackContext.Provider>
  );
}

export function FallbackSkeleton(props: { children: React.ReactNode }) {
  const { loading } = useFallbackContext();

  if (!loading) {
    return null;
  }

  return <>{props.children}</>;
}

export function FallbackBone(props: {
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn("bg-primary-800 rounded-lg animate-pulse", props.className)}
      style={{
        width: props.width || "100%",
        height: props.height || "20px",
        ...props.style,
      }}
    />
  );
}

export function FallbackError(props: { children: React.ReactNode }) {
  const { error } = useFallbackContext();

  if (!error) {
    return null;
  }

  return <>{props.children}</>;
}

export function FallbackContent(props: { children: React.ReactNode }) {
  const { loading, error } = useFallbackContext();

  if (loading || error) {
    return null;
  }

  return <>{props.children}</>;
}
