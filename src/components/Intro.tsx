"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, MQ } from "@/lib/gsap";
import s from "./Intro.module.css";

const EQUATION = [
  { label: "Web", color: "var(--blue)", fg: "var(--paper)" },
  { label: "Automatización", color: "var(--green)", fg: "var(--ink)" },
  { label: "Soporte", color: "var(--babyblue)", fg: "var(--ink)" },
];

export default function Intro() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const split = SplitText.create("[data-statement]", { type: "words", wordsClass: s.word });
        gsap.fromTo(
          split.words,
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: "[data-statement]", start: "top 85%", end: "bottom 45%", scrub: true },
          }
        );

        // Ecuación: las piezas se acercan y la línea las une
        const eq = gsap.timeline({
          scrollTrigger: { trigger: "[data-eq]", start: "top 85%", toggleActions: "play none none reverse" },
          defaults: { ease: "expo.out", duration: 1 },
        });
        // Sólo opacidad: las píldoras tienen transición CSS de transform (hover) y moverlas en Y las dejaba desfasadas
        eq.from("[data-eq-item]", { opacity: 0, stagger: 0.08, duration: 0.8 })
          .from("[data-eq-wire]", { scaleX: 0, transformOrigin: "0 50%", duration: 1.2, ease: "power3.inOut" }, 0.2)
          .from("[data-eq-result]", { scale: 0.6, opacity: 0, ease: "back.out(1.7)" }, 0.6);

        gsap.from("[data-copy]", {
          y: 30,
          opacity: 0,
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-copy]", start: "top 88%" },
        });

        return () => split.revert();
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className={s.intro} aria-labelledby="intro-title">
      <div className="container">

        <h2 id="intro-title" className={`display ${s.statement}`} data-statement>
          No necesitas más herramientas.{" "}
          <em>
            Necesitas que todas <span className={s.hl}>conecten.</span>
          </em>
        </h2>

        <div className={s.grid}>
          <div className={s.equation} data-eq>
            <span className={s.wire} data-eq-wire aria-hidden="true" />
            {EQUATION.map((item, i) => (
              <span key={item.label} className={s.eqItem} data-eq-item style={{ ["--c" as string]: item.color, ["--cfg" as string]: item.fg }}>
                <span className={s.eqNode} aria-hidden="true" />
                {item.label}
                {i < EQUATION.length - 1 && (
                  <span className={s.plus} aria-hidden="true">
                    +
                  </span>
                )}
              </span>
            ))}
            <span className={s.eqResult} data-eq-result>
              = Conexo
            </span>
          </div>

          <div className={s.copy}>
            <p className={s.lead} data-copy>
              Conexo reúne desarrollo web, automatización y soporte tecnológico en un solo equipo, para que tu negocio
              crezca <strong>sin fricciones</strong>.
            </p>
            <p className={s.sub} data-copy>
              El mismo ecosistema que representa nuestro isotipo: tres pilares trabajando siempre conectados.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
