"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";
import { process } from "@/content/conexo";
import Button from "../ui/Button";
import s from "./Process.module.css";

/** Microanimación abstracta por etapa (se activa cuando la etapa está al frente). */
function Glyph({ i }: { i: number }) {
  if (i === 0)
    return (
      <svg viewBox="0 0 80 80" className={`${s.glyph} ${s.g0}`} aria-hidden="true">
        <circle cx="40" cy="40" r="8" />
        <circle cx="40" cy="40" r="8" className={s.wave} />
        <circle cx="40" cy="40" r="8" className={`${s.wave} ${s.wave2}`} />
      </svg>
    );
  if (i === 1)
    return (
      <svg viewBox="0 0 80 80" className={`${s.glyph} ${s.g1}`} aria-hidden="true">
        <rect x="14" y="16" width="52" height="10" rx="2" />
        <rect x="14" y="35" width="36" height="10" rx="2" />
        <rect x="14" y="54" width="44" height="10" rx="2" />
      </svg>
    );
  if (i === 2)
    return (
      <svg viewBox="0 0 80 80" className={`${s.glyph} ${s.g2}`} aria-hidden="true">
        {Array.from({ length: 9 }, (_, k) => (
          <rect key={k} x={12 + (k % 3) * 20} y={12 + Math.floor(k / 3) * 20} width="16" height="16" rx="2" style={{ animationDelay: `${k * 0.12}s` }} />
        ))}
      </svg>
    );
  return (
    <svg viewBox="0 0 80 80" className={`${s.glyph} ${s.g3}`} aria-hidden="true">
      <line x1="40" y1="70" x2="40" y2="14" />
      <circle cx="40" cy="62" r="8" />
    </svg>
  );
}

export default function Process() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - el.clientWidth;

        const scroll = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        gsap.fromTo("[data-wire-fill]", { scaleX: 0 }, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: 0.8 },
        });

        gsap.utils.toArray<HTMLElement>("[data-step]").forEach((step) => {
          ScrollTrigger.create({
            trigger: step,
            containerAnimation: scroll,
            start: "left 70%",
            end: "right 30%",
            toggleClass: { targets: step, className: s.active },
          });
        });
      });

      // Mobile / tablet: línea vertical, cada etapa se activa al pasar por el centro
      mm.add("(max-width: 1023px), (prefers-reduced-motion: reduce)", () => {
        gsap.utils.toArray<HTMLElement>("[data-step]").forEach((step) => {
          ScrollTrigger.create({
            trigger: step,
            start: "top 65%",
            end: "bottom 35%",
            toggleClass: { targets: step, className: s.active },
          });
        });
        gsap.fromTo("[data-wire-fill]", { scaleY: 0 }, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: track.current, start: "top 60%", end: "bottom 60%", scrub: true },
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="proceso" className={s.process} aria-labelledby="process-title">
      <div className={s.frame}>
        <header className={`container ${s.head}`}>
          <p className={`mono ${s.eyebrow}`}>
            <span>(06)</span> Cómo trabajamos
          </p>
          <h2 id="process-title" className={`display ${s.title}`}>
            Un proceso claro,
            <br />
            de principio a <span className={s.hl}>acompañamiento.</span>
          </h2>
        </header>

        <div className={s.viewport}>
          <span className={s.wire} aria-hidden="true">
            <span data-wire-fill />
          </span>
          <ol ref={track} className={s.track}>
            {process.map((p, i) => (
              <li key={p.n} data-step className={s.step}>
                <span className={s.node} aria-hidden="true" />
                <div className={s.stepTop}>
                  <span className={s.num} aria-hidden="true">
                    {p.n}
                  </span>
                  <Glyph i={i} />
                </div>
                <h3 className={s.stepTitle}>
                  <span className="sr-only">Paso {p.n}: </span>
                  {p.title}
                  {p.titleExtra && <span className={s.extra}> {p.titleExtra}</span>}
                </h3>
                <p className={s.desc}>{p.description}</p>
              </li>
            ))}
            <li className={s.end}>
              <p className="display">¿Empezamos por el briefing?</p>
              <Button href="#contacto" size="lg">
                Hablemos
              </Button>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
