"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Scroll suave sincronizado con ScrollTrigger. Se desactiva con reduced motion. */
export default function SmoothScroll() {
  useEffect(() => {
    // Anclas: usar Lenis si existe, si no el scroll nativo.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href")!;
      const target = id === "#top" ? document.body : document.querySelector<HTMLElement>(id);
      if (!target) return;
      e.preventDefault();
      if (window.__lenis) window.__lenis.scrollTo(target, { offset: 0, duration: 1.4, force: true });
      else target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
      history.replaceState(null, "", id === "#top" ? location.pathname : id);
      // Mover el foco para teclado / lectores de pantalla
      if (target !== document.body) {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    };
    document.addEventListener("click", onClick);

    if (prefersReducedMotion()) {
      return () => document.removeEventListener("click", onClick);
    }

    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, autoRaf: false });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}
