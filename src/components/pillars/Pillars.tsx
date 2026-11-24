"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { pillars } from "@/content/conexo";
import s from "./Pillars.module.css";

const THEME = [
  // Celeste, Verde Lima y Baby Blue (Brand Book) con el texto de mejor contraste en cada uno
  { bg: "#0446f2", fg: "#f5f9f4", line: "#f5f9f4" },
  { bg: "#c8f502", fg: "#070b0e", line: "#070b0e" },
  { bg: "#82ccf9", fg: "#070b0e", line: "#070b0e" },
];

const C = 250; // centro del sistema
const R = 168; // radio del triángulo

/**
 * Scroll storytelling: un mismo sistema de tres nodos rota para poner
 * cada pilar al frente; color, título y motivo cambian con él.
 * Desktop + motion: sección fija (pin). Mobile / reduced motion: tres bloques apilados.
 */
export default function Pillars() {
  const root = useRef<HTMLElement>(null);
  const nodes = useRef<(SVGGElement | null)[]>([]);
  const edges = useRef<SVGPolygonElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const proxy = { a: 0 };
        const place = () => {
          const pts: string[] = [];
          nodes.current.forEach((g, i) => {
            if (!g) return;
            const ang = ((-90 + 120 * i - proxy.a) * Math.PI) / 180;
            const x = C + R * Math.cos(ang);
            const y = C + R * Math.sin(ang);
            pts.push(`${x},${y}`);
            // nodo más cerca de arriba = más grande
            const top = (Math.sin(ang) + 1) / 2; // 0 arriba → 1 abajo
            const scale = 1.55 - top * 0.75;
            g.setAttribute("transform", `translate(${x} ${y}) scale(${scale})`);
          });
          edges.current?.setAttribute("points", pts.join(" "));
        };
        place();

        const panels = gsap.utils.toArray<HTMLElement>("[data-panel]");
        const motifs = gsap.utils.toArray<SVGGElement>("[data-motif]");
        gsap.set(panels.slice(1), { autoAlpha: 0 });
        gsap.set(motifs.slice(1), { autoAlpha: 0, scale: 0.6, svgOrigin: `${C} ${C}` });
        gsap.set(root.current, { "--bg": THEME[0].bg, "--fg": THEME[0].fg, "--line": THEME[0].line });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=240%",
            pin: true,
            scrub: 0.8,
            snap: { snapTo: [0, 0.5, 1], duration: { min: 0.3, max: 0.8 }, ease: "power2.inOut" },
          },
        });

        [1, 2].forEach((step) => {
          const at = step - 1;
          const prev = panels[step - 1];
          const next = panels[step];
          tl.to(proxy, { a: 120 * step, duration: 1, onUpdate: place }, at)
            .to(root.current, { "--bg": THEME[step].bg, "--fg": THEME[step].fg, "--line": THEME[step].line, duration: 0.6 }, at + 0.2)
            .to(prev.querySelectorAll("[data-ln]"), { yPercent: -110, duration: 0.45, stagger: 0.05 }, at)
            .to(prev, { autoAlpha: 0, duration: 0.2 }, at + 0.4)
            .set(next, { autoAlpha: 1 }, at + 0.45)
            .from(next.querySelectorAll("[data-ln]"), { yPercent: 110, duration: 0.5, stagger: 0.05, immediateRender: false }, at + 0.45)
            .to(motifs[step - 1], { autoAlpha: 0, scale: 0.6, duration: 0.4 }, at + 0.1)
            .to(motifs[step], { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(1.6)" }, at + 0.5)
            .to("[data-progress]", { scaleX: (step + 1) / 3, duration: 1, ease: "none" }, at);
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="pilares" className={s.pillars} aria-labelledby="pillars-title">
      <div className={s.frame}>
        <header className={`container ${s.head}`}>
          <h2 id="pillars-title" className="sr-only">
            Tres pilares. Un solo equipo detrás de tu marca
          </h2>
          <span className={s.progress} aria-hidden="true">
            <span data-progress />
          </span>
        </header>

        <div className={`container ${s.stage}`}>
          <div className={s.panels}>
            {pillars.map((p, i) => (
              <article
                key={p.n}
                data-panel
                className={s.panel}
                style={{ ["--pbg" as string]: THEME[i].bg, ["--pfg" as string]: THEME[i].fg }}
              >
                <p className={s.number} aria-hidden="true">
                  <span className="line-mask">
                    <span data-ln>{p.n}</span>
                  </span>
                </p>
                <h3 className={`display ${s.panelTitle}`}>
                  <span className="sr-only">{p.n}. </span>
                  {p.title.map((t) => (
                    <span className="line-mask" key={t}>
                      <span data-ln>{t}</span>
                    </span>
                  ))}
                </h3>
                <div className="line-mask">
                  <p data-ln className={s.desc}>
                    {p.description}
                  </p>
                </div>
                <div className="line-mask">
                  <ul data-ln className={s.keywords}>
                    {p.keywords.map((k) => (
                      <li key={k}>{k}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          <svg className={s.system} viewBox="0 0 500 500" aria-hidden="true">
            <circle cx={C} cy={C} r={R + 40} className={s.orbit} />
            <polygon ref={edges} className={s.edges} points="" />

            {/* Motivos por pilar */}
            <g data-motif className={s.motif}>
              <rect x="180" y="200" width="140" height="100" rx="8" />
              <line x1="180" y1="218" x2="320" y2="218" />
              <circle cx="192" cy="209" r="3" className={s.fill} />
              <circle cx="202" cy="209" r="3" className={s.fill} />
              <rect x="192" y="230" width="70" height="10" rx="2" className={s.fill} />
              <rect x="192" y="248" width="116" height="40" rx="4" className={s.blink} />
            </g>
            <g data-motif className={s.motif}>
              <path id="flow" d="M185 270 C 215 200, 285 300, 315 230" />
              <circle cx="185" cy="270" r="9" className={s.fill} />
              <circle cx="250" cy="250" r="9" />
              <circle cx="315" cy="230" r="9" className={s.fill} />
              <circle r="5" className={s.fill}>
                <animateMotion dur="2.2s" repeatCount="indefinite" path="M185 270 C 215 200, 285 300, 315 230" />
              </circle>
            </g>
            <g data-motif className={s.motif}>
              <circle cx={C} cy={C} r="22" className={s.ring} />
              <circle cx={C} cy={C} r="22" className={`${s.ring} ${s.ring2}`} />
              <circle cx={C} cy={C} r="16" className={s.fill} />
              <text x={C} y={C + 62} textAnchor="middle" className={s.motifText}>
                24/7
              </text>
            </g>

            {pillars.map((p, i) => (
              <g
                key={p.n}
                ref={(el) => {
                  nodes.current[i] = el;
                }}
                className={s.node}
                transform={`translate(${C + R * Math.cos(((-90 + 120 * i) * Math.PI) / 180)} ${
                  C + R * Math.sin(((-90 + 120 * i) * Math.PI) / 180)
                })`}
              >
                <circle r="30" />
                <text y="5" textAnchor="middle">
                  {p.n}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}
