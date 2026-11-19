"use client";

import { IconContext } from "@phosphor-icons/react";
import type { ReactNode } from "react";

export const NoorProviders = ({ children }: { children: ReactNode }) => (
  <IconContext.Provider value={{ weight: "duotone", color: "currentColor" }}>
    {children}
  </IconContext.Provider>
);
