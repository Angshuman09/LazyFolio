'use client'

import { ReactNode } from "react";

export const Divider = () => <div className="w-full h-px bg-zinc-800/80 my-10" />;
  
export const SectionHeading = ({ children }: { children: ReactNode }) => (
  <h2 className="text-sm font-semibold text-white mb-6 tracking-tight">
    {children}
  </h2>
);