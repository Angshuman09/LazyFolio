"use client";

import { useLayoutEffect } from "react";

export type RegisterTabSubmit = (submitFn: (() => void) | null) => void;

export function useRegisterTabSubmit(
  onSubmitReady: RegisterTabSubmit,
  submitFn: () => void,
) {
  useLayoutEffect(() => {
    onSubmitReady(submitFn);
    return () => onSubmitReady(null);
  }, [onSubmitReady, submitFn]);
}

