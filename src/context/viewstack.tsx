import { viewStackAtom } from "@/store";
import { useAtom } from "jotai";
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface ViewStack {
  path?: string;
  component?: ReactNode;
  state?: any;
  status: "initiated" | "active" | "background";
}

export function useViewStack() {
  const vs = useAtom(viewStackAtom);
  return vs;
}
