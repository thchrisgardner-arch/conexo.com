"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";
import { marquee } from "@/content/conexo";
import s from "./Marquee.module.css";

/** Cinta de servicios: avanza sola y acelera / cambia de sentido con el scroll. */
export default function Marquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const loop = gsap.to("[data-track]", { xPercent: -50, duration: 38, ease: "none", repeat: -1 });
        let dir = 1;
        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate(self) {
            const v = self.getVelocity();
            if (Math.abs(v) > 10) dir = v > 0 ? 1 : -1;
            const boost = gsap.utils.clamp(1, 5, Math.abs(v) / 300);
            gsap.to(loop, { timeScale: dir * boost, duration: 0.2, overwrite: true });
            gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.2 });
          },
        });
      });
    },
    { scope: root }
  );

  const items = [...marquee, ...marquee];

  return (
    <div ref={root} className={s.band}>
      <ul className={s.track} data-track>
        {items.map((item, i) => (
          <li key={i} aria-hidden={i >= marquee.length}>
            <span>{item}</span>
            <svg viewBox="0 0 24 22" aria-hidden="true">
              <path d="M12 3 L21 18.5 L3 18.5 Z" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="12" cy="3" r="3" />
              <circle cx="21" cy="18.5" r="3" />
              <circle cx="3" cy="18.5" r="3" />
            </svg>
          </li>
        ))}
      </ul>
    </div>
  );
}
