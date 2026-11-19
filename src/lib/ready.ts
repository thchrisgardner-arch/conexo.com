"use client";

/** Señal global "la intro terminó": el hero espera esto para animar su entrada. */
const EVENT = "conexo:ready";

declare global {
  interface Window {
    __conexoReady?: boolean;
  }
}

export function markReady() {
  if (window.__conexoReady) return;
  window.__conexoReady = true;
  window.dispatchEvent(new Event(EVENT));
}

export function onReady(cb: () => void) {
  if (window.__conexoReady) {
    cb();
    return () => {};
  }
  window.addEventListener(EVENT, cb, { once: true });
  return () => window.removeEventListener(EVENT, cb);
}
