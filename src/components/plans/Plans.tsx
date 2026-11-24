"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { plans } from "@/content/conexo";
import Button from "../ui/Button";
import s from "./Plans.module.css";

export default function Plans() {
  const root = useRef<HTMLElement>(null);

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
        gsap.from("[data-plan]", {
          y: 80,
          opacity: 0,
          rotate: (i) => (i - 1) * 2,
          stagger: 0.1,
          duration: 1.2,
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: "[data-plans]", start: "top 80%" },
        });
      });
    },
    { scope: root }
  );

  // Inclinación y "nodo" que sigue al cursor dentro de la tarjeta
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch" || window.matchMedia(MQ.reduce).matches) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    el.style.setProperty("--rx", `${(0.5 - y) * 5}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 6}deg`);
  };
  const onLeave = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  };

  return (
    <section ref={root} id="planes" className={s.plans} aria-labelledby="plans-title">
      <div className="container">
        <header className={s.head}>
          <h2 id="plans-title" className={`display ${s.title}`} data-title>
            <span className="line-mask">
              <span>Un plan para</span>
            </span>
            <span className="line-mask">
              <span>cada etapa.</span>
            </span>
          </h2>
          <p className={s.note}>
            Cada proyecto es distinto, así que la inversión se cotiza a la medida. Esto es lo que incluye cada nivel de
            acompañamiento.
          </p>
        </header>

        <div className={s.grid} data-plans>
          {plans.map((p) => (
            <article
              key={p.id}
              data-plan
              className={`${s.card} ${p.featured ? s.featured : ""}`}
              onPointerMove={onMove}
              onPointerLeave={onLeave}
              aria-labelledby={`plan-${p.id}`}
            >
              <span className={s.glow} aria-hidden="true" />
              <div className={s.cardTop}>
                <span className={`mono ${p.featured ? s.badge : ""}`}>{p.eyebrow}</span>
              </div>
              <h3 id={`plan-${p.id}`} className={s.name}>
                {p.name}
              </h3>
              <p className={s.desc}>{p.description}</p>
              <ul className={s.features}>
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <Button href="#contacto" variant={p.featured ? "ink" : "outline"} className={s.cta}>
                Cotizar plan
              </Button>
            </article>
          ))}
        </div>

        <a href="#contacto" className={s.custom}>
          <span className="mono">¿Tu operación no encaja en un plan?</span>
          <span className={s.customText}>
            Armamos una cotización personalizada <span aria-hidden="true">→</span>
          </span>
        </a>
      </div>
    </section>
  );
}
