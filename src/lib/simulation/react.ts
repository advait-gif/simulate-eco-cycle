import { useEffect, useSyncExternalStore } from "react";
import { getState, subscribe, tick } from "./engine";
import type { SimState } from "./types";

export function useSim(): SimState {
  return useSyncExternalStore(subscribe, getState, getState);
}

/** Drives the simulated clock. Mounted once in the root layout. */
export function useSimulationLoop(intervalMs = 400) {
  useEffect(() => {
    const id = setInterval(() => tick(intervalMs), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
}
