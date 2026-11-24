"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { site } from "@/content/conexo";
import s from "./Contact.module.css";

const WORD = "¿CONECTAMOS?";

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const magnet = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        // Las letras llegan dispersas y se "conectan" en su lugar
        const chars = gsap.utils.toArray<HTMLElement>("[data-char]");
        gsap.fromTo(
          chars,
          {
            x: () => gsap.utils.random(-260, 260),
            y: () => gsap.utils.random(-180, 180),
            rotate: () => gsap.utils.random(-50, 50),
            opacity: 0,
          },
          {
            x: 0,
            y: 0,
            rotate: 0,
            opacity: 1,
            ease: "power3.out",
            stagger: { each: 0.03, from: "random" },
            scrollTrigger: { trigger: "[data-word]", start: "top 95%", end: "center 55%", scrub: 1 },
          }
        );
        gsap.from("[data-fade]", {
          y: 40,
          opacity: 0,
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-fade]", start: "top 90%" },
        });
      });

      // Botón magnético
      mm.add(`${MQ.fine} and ${MQ.motion}`, () => {
        const el = magnet.current!;
        const label = el.querySelector("span")!;
        const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
        const lx = gsap.quickTo(label, "x", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
        const ly = gsap.quickTo(label, "y", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
        const zone = el.parentElement!;
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          xTo(dx * 0.35);
          yTo(dy * 0.35);
          lx(dx * 0.15);
          ly(dy * 0.15);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
          lx(0);
          ly(0);
        };
        zone.addEventListener("pointermove", move);
        zone.addEventListener("pointerleave", leave);
        return () => {
          zone.removeEventListener("pointermove", move);
          zone.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="contacto" className={s.contact} aria-labelledby="contact-title">
      <div className="container">
        <h2 id="contact-title" className={`display ${s.word}`} data-word aria-label="¿Conectamos?">
          <span className={s.row} aria-hidden="true">
            {WORD.split("").map((c, i) => (
              <span key={i} data-char className={c === "?" || c === "¿" ? s.q : ""}>
                {c}
              </span>
            ))}
          </span>
        </h2>

        <div className={s.grid}>
          <div className={s.copy} data-fade>
            <p className={s.lead}>Conectemos tu marca con lo digital.</p>
            <p className={s.sub}>Cuéntanos qué necesitas y te respondemos con una propuesta clara, sin enredos.</p>
          </div>

          <ul className={s.channels} data-fade>
            <li>
              <a href={`mailto:${site.email}`} className={s.channel}>
                <span className="mono">Email</span>
                <span className={s.value}>{site.email}</span>
                <span className={s.arrow} aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
            <li>
              <a href={site.phoneHref} className={s.channel}>
                <span className="mono">Teléfono</span>
                <span className={s.value}>{site.phone}</span>
                <span className={s.arrow} aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          </ul>

          <div className={s.magnetZone}>
            <a
              ref={magnet}
              href={`mailto:${site.email}?subject=${encodeURIComponent("Hablemos — Conexo")}`}
              className={s.magnet}
            >
              <span>
                Hablemos
                <i aria-hidden="true">→</i>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
