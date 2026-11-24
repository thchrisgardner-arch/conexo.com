"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  gsap.defaults({ ease: "expo.out", duration: 1 });
}

/** Media queries compartidas con CSS (ver breakpoints en README). */
export const MQ = {
  desktop: "(min-width: 1024px)",
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  // any-*: portátiles Windows con pantalla táctil reportan pointer: coarse aunque tengan mouse
  fine: "(any-hover: hover) and (any-pointer: fine)",
};

export const EASE = {
  out: "expo.out",
  inOut: "power3.inOut",
  soft: "power2.out",
};

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia(MQ.reduce).matches;

export { gsap, ScrollTrigger, SplitText, useGSAP };
