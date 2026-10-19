"use client";

import React, { createContext, useContext } from "react";
import { PortfolioSection } from "../types";

export interface PortfolioSectionContextValue {
  currentSection: PortfolioSection;
  onSectionChange?: (section: PortfolioSection) => void;
  basePath: string;
  isInteractive: boolean;
  availableSections?: PortfolioSection[];
}

const PortfolioSectionContext = createContext<PortfolioSectionContextValue | null>(null);

export function PortfolioSectionProvider({
  currentSection,
  onSectionChange,
  basePath = "",
  isInteractive = false,
  availableSections,
  children,
}: {
  currentSection: PortfolioSection;
  onSectionChange?: (section: PortfolioSection) => void;
  basePath?: string;
  isInteractive?: boolean;
  availableSections?: PortfolioSection[];
  children: React.ReactNode;
}) {
  return (
    <PortfolioSectionContext.Provider
      value={{ currentSection, onSectionChange, basePath, isInteractive, availableSections }}
    >
      {children}
    </PortfolioSectionContext.Provider>
  );
}

export function usePortfolioSection() {
  return useContext(PortfolioSectionContext);
}
