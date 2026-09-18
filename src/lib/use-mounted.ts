"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * `true` après hydratation, `false` en SSR et pendant l'hydratation —
 * pattern officiel (useSyncExternalStore) pour les rendus qui dépendent
 * du navigateur (fuseau horaire, Date.now…) sans mismatch.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
