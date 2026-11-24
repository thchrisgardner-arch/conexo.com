"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, MQ } from "@/lib/gsap";
import { differentiators, manifesto } from "@/content/conexo";
import s from "./Differentiators.module.css";

const THEMES = ["paper", "ink", "babyblue", "blue"] as const;

/** Visual abstracto de cada diferencial. */
function Visual({ i }: { i: number }) {
  switch (i) {
    case 0: // de enredo a línea recta
      return (
        <svg viewBox="0 0 400 300" className={s.visual} aria-hidden="true">
          <path
            data-tangle
            pathLength={1}
            d="M20 150 C 60 40, 110 260, 150 120 S 230 20, 210 170 S 120 250, 260 200 S 330 60, 300 140 S 360 230, 380 150"
          />
          <path data-straight pathLength={1} d="M20 150 L380 150" />
          <circle cx="20" cy="150" r="10" />
          <circle cx="380" cy="150" r="10" />
        </svg>
      );
    case 1: // muchos proveedores → un solo nodo
      return (
        <svg viewBox="0 0 400 300" className={s.visual} aria-hidden="true">
          {[
            [60, 50],
            [340, 60],
            [70, 250],
            [330, 240],
          ].map(([x, y], k) => (
            <g key={k}>
              <line data-spoke x1={x} y1={y} x2="200" y2="150" />
              <circle data-sat cx={x} cy={y} r="14" />
            </g>
          ))}
          <circle data-core cx="200" cy="150" r="34" />
        </svg>
      );
    case 2: // acompañamiento: un nodo que orbita al otro
      return (
        <svg viewBox="0 0 400 300" className={s.visual} aria-hidden="true">
          <circle cx="200" cy="150" r="100" className={s.dashed} />
          <circle cx="200" cy="150" r="38" />
          <g className={s.orbit}>
            <circle cx="300" cy="150" r="16" />
          </g>
        </svg>
      );
    default: // resultados que suben
      return (
        <svg viewBox="0 0 400 300" className={s.visual} aria-hidden="true">
          {[0, 1, 2, 3, 4].map((k) => (
            <rect key={k} data-bar x={30 + k * 74} y={270 - (k + 1) * 46} width="52" height={(k + 1) * 46} rx="4" />
          ))}
          <polyline data-trend pathLength={1} points="56,200 130,170 204,120 278,90 352,30" />
        </svg>
      );
  }
}

export default function Differentiators() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // Manifiesto palabra por palabra
        const split = SplitText.create("[data-manifesto]", { type: "words" });
        gsap.fromTo(
          split.words,
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: "[data-manifesto]", start: "top 80%", end: "bottom 50%", scrub: true },
          }
        );

        const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
        cards.forEach((card, i) => {
          // La tarjeta anterior se hunde cuando llega la siguiente
          if (i < cards.length - 1) {
            gsap.to(card.querySelector("[data-inner]"), {
              scale: 0.9,
              opacity: 0.35,
              borderRadius: 40,
              ease: "none",
              scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top top", scrub: true },
            });
          }

          gsap.from(card.querySelectorAll("[data-ln]"), {
            yPercent: 110,
            stagger: 0.08,
            duration: 1.2,
            scrollTrigger: { trigger: card, start: "top 60%" },
          });

          const vis = gsap.timeline({
            scrollTrigger: { trigger: card, start: "top 70%", end: "top top", scrub: 0.6 },
            defaults: { ease: "none" },
          });
          if (i === 0) {
            vis.fromTo(card.querySelector("[data-tangle]"), { strokeDashoffset: 0 }, { strokeDashoffset: 1 })
              .fromTo(card.querySelector("[data-straight]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0 }, 0.3);
          } else if (i === 1) {
            card.querySelectorAll<SVGCircleElement>("[data-sat]").forEach((c) => {
              const cx = Number(c.getAttribute("cx"));
              const cy = Number(c.getAttribute("cy"));
              vis.to(c, { x: (200 - cx) * 0.62, y: (150 - cy) * 0.62 }, 0);
            });
            vis.fromTo(card.querySelector("[data-core]"), { scale: 0.4, svgOrigin: "200 150" }, { scale: 1.25, svgOrigin: "200 150" }, 0);
          } else if (i === 3) {
            vis.from(card.querySelectorAll("[data-bar]"), { scaleY: 0, transformOrigin: "50% 100%", stagger: 0.1 })
              .fromTo(card.querySelector("[data-trend]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0 }, 0.2);
          }
        });

        return () => split.revert();
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="diferenciales" className={s.diff} aria-labelledby="diff-title">
      <div className={`container ${s.intro}`}>
        <h2 id="diff-title" className={`mono ${s.eyebrow}`}>
          <span>(05)</span> Por qué Conexo
        </h2>
        <p className={s.manifesto} data-manifesto>
          {manifesto}
        </p>
      </div>

      <div className={s.stack}>
        {differentiators.map((d, i) => (
          <article key={d.n} data-card className={`${s.card} ${s[THEMES[i]]}`} aria-labelledby={`diff-${d.n}`}>
            <div className={s.inner} data-inner>
              <div className={s.top}>
                <span className="mono">
                  {d.n} / 0{differentiators.length}
                </span>
                <span className="mono">Por qué Conexo</span>
              </div>

              <h3 id={`diff-${d.n}`} className={`display ${s.title}`}>
                {d.title.map((t) => (
                  <span className="line-mask" key={t}>
                    <span data-ln>{t}</span>
                  </span>
                ))}
              </h3>

              <div className={s.bottom}>
                <p className={s.desc}>{d.description}</p>
                <Visual i={i} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
