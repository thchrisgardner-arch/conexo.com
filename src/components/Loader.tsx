"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { markReady } from "@/lib/ready";
import { Isotipo } from "./ui/Logo";
import s from "./Loader.module.css";

const SEEN_KEY = "conexo:intro";

/**
 * Intro de ~1.3s: el isotipo oficial se descubre mientras corre 01 → 02 → 03,
 * después el telón sube. Se omite con reduced motion o si ya se vio en la sesión.
 */
export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      let seen = false;
      try {
        seen = sessionStorage.getItem(SEEN_KEY) === "1";
      } catch {}

      const finish = () => {
        try {
          sessionStorage.setItem(SEEN_KEY, "1");
        } catch {}
        document.documentElement.classList.remove("is-loading");
        setDone(true);
        markReady();
      };

      if (seen || prefersReducedMotion()) {
        finish();
        return;
      }

      const counter = root.current!.querySelector<HTMLElement>("[data-count]")!;
      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, onComplete: finish });

      // El isotipo oficial se descubre con un barrido (sin deformarlo) mientras corre 01 → 03
      tl.fromTo("[data-iso]", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power3.inOut" })
        .call(() => (counter.textContent = "02"), [], 0.35)
        .call(() => (counter.textContent = "03"), [], 0.7)
        .to("[data-stage]", { opacity: 0, duration: 0.35, ease: "power2.in" }, 1.0)
        .to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 0.7, ease: "expo.inOut" }, 1.05);
    },
    { scope: root }
  );

  if (done) return null;

  return (
    <div ref={root} className={s.loader} data-loader aria-hidden="true">
      <div className={s.stage} data-stage>
        <span data-iso className={s.mark}>
          <Isotipo tone="verde" width={96} />
        </span>
        <p className={`mono ${s.count}`}>
          <span data-count>01</span> / 03
        </p>
      </div>
    </div>
  );
}
