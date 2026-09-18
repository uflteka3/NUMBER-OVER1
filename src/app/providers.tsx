"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { ToastProvider } from "@/components/ui/toast";

/**
 * Providers globaux côté client.
 * - MotionConfig reducedMotion="user" : respecte prefers-reduced-motion
 *   pour toutes les animations framer-motion.
 * - ToastProvider : notifications globales.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>{children}</ToastProvider>
    </MotionConfig>
  );
}
