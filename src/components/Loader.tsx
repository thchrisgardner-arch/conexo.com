"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { markReady } from "@/lib/ready";
import s from "./Loader.module.css";

const SEEN_KEY = "conexo:intro";

/**
 * Intro de ~1.3s: tres nodos se conectan mientras corre 01 → 02 → 03,
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

      tl.from("[data-node]", { scale: 0, transformOrigin: "50% 50%", stagger: 0.12, duration: 0.5 })
        .fromTo(
          "[data-edge]",
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, stagger: 0.12, duration: 0.45, ease: "power2.inOut" },
          0.15
        )
        .call(() => (counter.textContent = "02"), [], 0.35)
        .call(() => (counter.textContent = "03"), [], 0.7)
        .from("[data-word] span", { yPercent: 110, stagger: 0.03, duration: 0.6 }, 0.1)
        .to("[data-stage]", { scale: 0.92, opacity: 0, duration: 0.4, ease: "power2.in" }, 1.0)
        .to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 0.7, ease: "expo.inOut" }, 1.05);
    },
    { scope: root }
  );

  if (done) return null;

  return (
    <div ref={root} className={s.loader} data-loader aria-hidden="true">
      <div className={s.stage} data-stage>
        <svg className={s.mark} viewBox="0 0 120 104" fill="none">
          <path data-edge pathLength={1} d="M60 14 L106 90" />
          <path data-edge pathLength={1} d="M106 90 L14 90" />
          <path data-edge pathLength={1} d="M14 90 L60 14" />
          <circle data-node cx="60" cy="14" r="10" fill="var(--blue)" />
          <circle data-node cx="106" cy="90" r="10" fill="var(--green)" />
          <circle data-node cx="14" cy="90" r="10" fill="var(--yellow)" />
        </svg>
        <p className={s.word} data-word>
          {"CONEXO".split("").map((c, i) => (
            <span key={i}>{c}</span>
          ))}
        </p>
        <p className={`mono ${s.count}`}>
          <span data-count>01</span> / 03
        </p>
      </div>
    </div>
  );
}
