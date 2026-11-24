"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { projects, site, TOTAL_PROJECTS, WORK_IMAGE_BASE } from "@/content/conexo";
import Button from "../ui/Button";
import s from "./Work.module.css";

// Sólo tonos de marca con texto negro legible encima (el celeste no da contraste con negro)
const ACCENTS = ["var(--green)", "var(--babyblue)"];

export default function Work() {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState<number | null>(null);
  const movers = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null);

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
        gsap.from("[data-row]", {
          clipPath: "inset(0 0 100% 0)",
          y: 40,
          stagger: 0.06,
          duration: 1.1,
          scrollTrigger: { trigger: "[data-list]", start: "top 80%" },
        });
        gsap.from("[data-count]", {
          textContent: 0,
          snap: { textContent: 1 },
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: "[data-count]", start: "top 90%" },
        });
      });

      mm.add(`${MQ.fine} and ${MQ.desktop}`, () => {
        movers.current = {
          x: gsap.quickTo(preview.current, "x", { duration: 0.7, ease: "power3" }),
          y: gsap.quickTo(preview.current, "y", { duration: 0.7, ease: "power3" }),
        };
        return () => (movers.current = null);
      });
    },
    { scope: root }
  );

  const onMove = (e: React.PointerEvent) => {
    if (!movers.current || !root.current) return;
    const box = root.current.getBoundingClientRect();
    movers.current.x(e.clientX - box.left);
    movers.current.y(e.clientY - box.top);
  };

  return (
    <section ref={root} id="proyectos" className={s.work} aria-labelledby="work-title" onPointerMove={onMove}>
      <div className="container">
        <header className={s.head}>
          <h2 id="work-title" className={`display ${s.title}`} data-title>
            <span className="line-mask">
              <span>Proyectos que</span>
            </span>
            <span className="line-mask">
              <span>ya están</span>
            </span>
            <span className="line-mask">
              <span>conectados.</span>
            </span>
          </h2>
          <div className={s.count}>
            <strong>
              <span data-count>{TOTAL_PROJECTS}</span>
            </strong>
            <span className="mono">proyectos en el portafolio</span>
          </div>
        </header>

        <ol className={`${s.list} ${current !== null ? s.hovering : ""}`} data-list onMouseLeave={() => setCurrent(null)}>
          {projects.map((p, i) => (
            <li key={p.name} data-row className={`${s.row} ${current === i ? s.active : ""}`}>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className={s.link}
                data-cursor="view"
                data-cursor-label="Visitar"
                style={{ ["--accent" as string]: ACCENTS[i % ACCENTS.length] }}
                onMouseEnter={() => setCurrent(i)}
                onFocus={() => setCurrent(i)}
                onBlur={() => setCurrent(null)}
              >
                <span className={s.name}>{p.name}</span>
                <span className={`mono ${s.category}`}>{p.category}</span>
                <span className={s.more}>
                  <span>
                    <span className={s.desc}>{p.description}</span>
                  </span>
                </span>
                <span className={s.arrow} aria-hidden="true">
                  ↗
                </span>
                <span className="sr-only"> (abre el sitio en una pestaña nueva)</span>
                {/* Imagen inline en mobile / tablet */}
                <img
                  className={s.thumb}
                  src={`${WORK_IMAGE_BASE}/${p.image}`}
                  alt={`Sitio web de ${p.name}`}
                  loading="lazy"
                  decoding="async"
                  width={1600}
                  height={1000}
                />
              </a>
            </li>
          ))}
        </ol>

        <div className={s.foot}>
          <p className={s.footText}>Estos son algunos. Hay más conectados.</p>
          <Button href={site.allProjectsUrl} variant="ink" size="lg">
            {`Ver los ${TOTAL_PROJECTS} proyectos`}
          </Button>
        </div>
      </div>

      {/* Vista previa flotante (desktop) */}
      <div ref={preview} className={`${s.preview} ${current !== null ? s.previewOn : ""}`} aria-hidden="true">
        {projects.map((p, i) => (
          <img
            key={p.name}
            src={`${WORK_IMAGE_BASE}/${p.image}`}
            alt=""
            loading="lazy"
            decoding="async"
            className={current === i ? s.imgOn : ""}
          />
        ))}
      </div>
    </section>
  );
}
