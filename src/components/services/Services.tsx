"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { services } from "@/content/conexo";
import Connector from "../ui/Connector";
import s from "./Services.module.css";

type Edge = { a: string; b: string };
type Pt = { x: number; y: number };

const COLS = 3;

export default function Services() {
  const root = useRef<HTMLElement>(null);
  const board = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [points, setPoints] = useState<Record<string, Pt>>({});
  const [size, setSize] = useState({ w: 0, h: 0 });

  const edges = useMemo<Edge[]>(() => {
    const seen = new Set<string>();
    const out: Edge[] = [];
    services.forEach((sv) =>
      sv.links.forEach((l) => {
        const key = [sv.id, l].sort().join("|");
        if (!seen.has(key)) {
          seen.add(key);
          out.push({ a: sv.id, b: l });
        }
      })
    );
    return out;
  }, []);

  const activeService = services.find((sv) => sv.id === active);
  const activeIndex = services.findIndex((sv) => sv.id === active);

  // Medir centros de los nodos (durante la transición del grid, cada frame)
  const measure = useCallback(() => {
    const el = board.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const next: Record<string, Pt> = {};
    el.querySelectorAll<HTMLElement>("[data-node]").forEach((n) => {
      const r = n.getBoundingClientRect();
      next[n.dataset.node!] = { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
    });
    setPoints(next);
    setSize({ w: box.width, h: box.height });
  }, []);

  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const tick = () => {
      measure();
      if (performance.now() - t0 < 900) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, measure]);

  useEffect(() => {
    const ro = new ResizeObserver(() => measure());
    if (board.current) ro.observe(board.current);
    return () => ro.disconnect();
  }, [measure]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from("[data-title] > span > span", {
          yPercent: 110,
          stagger: 0.08,
          duration: 1.2,
          scrollTrigger: { trigger: "[data-title]", start: "top 85%" },
        });
        gsap.from("[data-module]", {
          opacity: 0,
          y: 60,
          stagger: { each: 0.07, grid: [2, 3], from: "start" },
          duration: 1.1,
          scrollTrigger: { trigger: board.current, start: "top 85%" },
        });
      });
    },
    { scope: root }
  );

  // Columnas / filas que crecen hacia el módulo activo
  const col = activeIndex >= 0 ? activeIndex % COLS : -1;
  const row = activeIndex >= 0 ? Math.floor(activeIndex / COLS) : -1;
  const gridStyle = {
    gridTemplateColumns: Array.from({ length: COLS }, (_, i) => (i === col ? "1.7fr" : "1fr")).join(" "),
    gridTemplateRows: [0, 1].map((i) => (i === row ? "1.35fr" : "1fr")).join(" "),
  };

  const isLinked = (id: string) => !!activeService && activeService.links.includes(id);

  return (
    <section ref={root} id="servicios" className={s.services} aria-labelledby="services-title">
      <div className="container">
        <header className={s.head}>
          <p className={`mono ${s.eyebrow}`}>
            <span>(02)</span> Lo que hacemos
          </p>
          <h2 id="services-title" className={`display ${s.title}`} data-title>
            <span className="line-mask">
              <span>Todo</span>
            </span>
            <span className="line-mask">
              <span>
                <Connector /> conecta.
              </span>
            </span>
          </h2>
          <p className={s.intro}>
            Seis servicios que trabajan como un solo sistema.
            <span className={s.hint}> Pasa el cursor por cada módulo y mira con qué se conecta.</span>
          </p>
        </header>

        <div
          ref={board}
          className={`${s.board} ${active ? s.hasActive : ""}`}
          style={gridStyle}
          onMouseLeave={() => setActive(null)}
        >
          <svg className={s.wires} width={size.w} height={size.h} aria-hidden="true">
            {edges.map(({ a, b }) => {
              const pa = points[a];
              const pb = points[b];
              if (!pa || !pb) return null;
              const on = active === a || active === b;
              return (
                <line
                  key={a + b}
                  data-wire
                  pathLength={1}
                  x1={pa.x}
                  y1={pa.y}
                  x2={pb.x}
                  y2={pb.y}
                  className={on ? s.wireOn : s.wire}
                  style={on ? { stroke: `var(--${activeService!.accent})` } : undefined}
                />
              );
            })}
          </svg>

          {services.map((sv, i) => {
            const on = active === sv.id;
            return (
              <article
                key={sv.id}
                data-module
                tabIndex={0}
                aria-labelledby={`sv-${sv.id}`}
                className={`${s.module} ${on ? s.on : ""} ${isLinked(sv.id) ? s.linked : ""}`}
                style={{ ["--accent" as string]: `var(--${sv.accent})` }}
                onMouseEnter={() => setActive(sv.id)}
                onFocus={() => setActive(sv.id)}
                onBlur={() => setActive(null)}
                onClick={() => setActive(on ? null : sv.id)}
              >
                <div className={s.moduleTop}>
                  <span className="mono">S/{String(i + 1).padStart(2, "0")}</span>
                  <span className={`mono ${s.links}`}>
                    {sv.links.length} conexiones
                  </span>
                </div>
                <h3 id={`sv-${sv.id}`} className={s.moduleTitle}>
                  {sv.title}
                </h3>
                <div className={s.reveal}>
                  <div>
                    <p className={s.desc}>{sv.description}</p>
                    <ul className={s.tags} aria-label={`Tecnologías de ${sv.title}`}>
                      {sv.tags.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <span className={s.node} data-node={sv.id} aria-hidden="true" />
              </article>
            );
          })}
        </div>

        <p className={`mono ${s.legend}`} aria-live="polite">
          {activeService
            ? `${activeService.title} → ${activeService.links
                .map((l) => services.find((x) => x.id === l)!.title)
                .join(" · ")}`
            : "Cada servicio se conecta con los demás"}
        </p>
      </div>
    </section>
  );
}
